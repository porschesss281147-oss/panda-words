// context/LeaderboardContext.js
'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  db, 
  collection, 
  query, 
  orderBy, 
  getDocs,
  where,
  limit,
  doc,
  getDoc,
  startAfter
} from '@/lib/firebase';
import { useUser } from './UserContext';

const LeaderboardContext = createContext();

export function LeaderboardProvider({ children }) {
  const { user } = useUser();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const [gameFilter, setGameFilter] = useState('all');
  const [userRank, setUserRank] = useState(null);
  const [totalPlayers, setTotalPlayers] = useState(0);

  // โหลดจำนวนผู้เล่นทั้งหมด
  useEffect(() => {
    const loadTotalPlayers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        setTotalPlayers(snapshot.size);
        console.log('📊 Total players in database:', snapshot.size);
      } catch (error) {
        console.error('❌ Error loading total players:', error);
      }
    };
    loadTotalPlayers();
  }, []);

  // โหลด Leaderboard เริ่มต้น
  useEffect(() => {
    console.log('📊 LeaderboardProvider mounted with timeRange:', timeRange, 'gameFilter:', gameFilter);
    loadLeaderboard();
  }, [timeRange, gameFilter]);

  // โหลดอันดับผู้ใช้ปัจจุบัน
  useEffect(() => {
    if (user) {
      loadUserRank();
    }
  }, [user, leaderboard]);

  // สร้าง query ตามเงื่อนไข
  const buildQuery = useCallback((useLimit = true, startAfterDoc = null) => {
    console.log('🔨 Building query with:', { timeRange, gameFilter, useLimit, startAfterDoc });
    
    const usersRef = collection(db, 'users');
    let constraints = [];

    // กรองตามเวลา (ถ้ามี)
    if (timeRange !== 'all') {
      const date = new Date();
      switch (timeRange) {
        case 'daily':
          date.setDate(date.getDate() - 1);
          break;
        case 'weekly':
          date.setDate(date.getDate() - 7);
          break;
        case 'monthly':
          date.setMonth(date.getMonth() - 1);
          break;
      }
      console.log('⏰ Time filter:', timeRange, 'from:', date.toISOString());
      constraints.push(where('lastActive', '>=', date.toISOString()));
    }

    // กรองตามเกม (ถ้ามี)
    if (gameFilter !== 'all') {
      console.log('🎮 Game filter:', gameFilter);
      constraints.push(where(`${gameFilter}Played`, '>', 0));
    }

    // เรียงตามคะแนนรวม
    constraints.push(orderBy('totalScore', 'desc'));

    // จำกัดจำนวน (ถ้าใช้)
    if (useLimit) {
      constraints.push(limit(20));
    }

    // เริ่มจาก document ถัดไป (สำหรับ load more)
    if (startAfterDoc) {
      console.log('📄 Starting after document:', startAfterDoc.id);
      constraints.push(startAfter(startAfterDoc));
    }

    const finalQuery = query(usersRef, ...constraints);
    console.log('✅ Query built successfully');
    return finalQuery;
  }, [timeRange, gameFilter]);

  // โหลด Leaderboard
  const loadLeaderboard = useCallback(async (loadMore = false) => {
    try {
      console.log('🔄 Loading leaderboard...', loadMore ? '(load more)' : '(initial)');
      setError(null);
      
      if (!loadMore) {
        setLoading(true);
        setLeaderboard([]);
      }

      const q = buildQuery(true, loadMore ? lastVisible : null);
      console.log('🔍 Executing query...');
      
      const querySnapshot = await getDocs(q);
      console.log('📥 Documents found:', querySnapshot.size);
      
      if (querySnapshot.empty) {
        console.log('⚠️ No users found in leaderboard');
        if (!loadMore) {
          setLeaderboard([]);
        }
        setHasMore(false);
        return;
      }
      
      const users = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        console.log('👤 User data:', {
          id: doc.id,
          name: userData.name || 'No name',
          icon: userData.icon || '😊',
          totalScore: userData.totalScore || 0,
          gamesPlayed: userData.gamesPlayed || 0,
          challengesCompleted: userData.challengesCompleted || 0,
          hasTotalScore: 'totalScore' in userData
        });
        
        users.push({
          id: doc.id,
          name: userData.name || 'ผู้ใช้',
          icon: userData.icon || '😊',
          totalScore: userData.totalScore || 0,
          gamesPlayed: userData.gamesPlayed || 0,
          challengesCompleted: userData.challengesCompleted || 0,
          lastActive: userData.lastActive || userData.lastLogin || userData.createdAt,
          ...userData
        });
      });

      console.log('✅ Processed users:', users.length);
      
      if (loadMore) {
        setLeaderboard(prev => [...prev, ...users]);
        console.log('📊 Updated leaderboard (appended):', leaderboard.length + users.length);
      } else {
        setLeaderboard(users);
        console.log('📊 Updated leaderboard (new):', users.length);
      }

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastDoc);
      setHasMore(querySnapshot.docs.length === 20);
      console.log('📄 Last document:', lastDoc?.id, 'Has more:', querySnapshot.docs.length === 20);

    } catch (error) {
      console.error('❌ Leaderboard error:', error);
      setError(error.message || 'ไม่สามารถโหลดอันดับผู้เล่นได้');
    } finally {
      setLoading(false);
    }
  }, [buildQuery, lastVisible]);

  // โหลดเพิ่มเติม
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      console.log('📥 Loading more...');
      loadLeaderboard(true);
    } else {
      console.log('⛔ Cannot load more:', { hasMore, loading });
    }
  }, [hasMore, loading, loadLeaderboard]);

  // โหลดอันดับผู้ใช้ปัจจุบัน
  const loadUserRank = useCallback(async () => {
    if (!user) {
      console.log('👤 No user logged in');
      return;
    }

    try {
      console.log('🔍 Loading rank for user:', user.id, user.name);
      
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef, 
        where('totalScore', '>', user.totalScore || 0)
      );
      
      const querySnapshot = await getDocs(q);
      const rank = querySnapshot.size + 1;
      
      console.log('🏆 User rank:', {
        rank,
        totalPlayers,
        score: user.totalScore || 0,
        playersAhead: querySnapshot.size
      });
      
      setUserRank({
        rank,
        total: totalPlayers,
        score: user.totalScore || 0
      });
    } catch (error) {
      console.error('❌ Error loading user rank:', error);
    }
  }, [user, totalPlayers]);

  // ค้นหาผู้ใช้
  const searchUsers = useCallback(async (searchTerm) => {
    if (!searchTerm) return [];

    try {
      console.log('🔍 Searching users with term:', searchTerm);
      
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff'),
        orderBy('name'),
        limit(10)
      );
      
      const querySnapshot = await getDocs(q);
      console.log('📥 Search results:', querySnapshot.size);
      
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return users;
    } catch (error) {
      console.error('❌ Error searching users:', error);
      return [];
    }
  }, []);

  // ดูโปรไฟล์ผู้ใช้
  const getUserProfile = useCallback(async (userId) => {
    try {
      console.log('👤 Loading profile for user:', userId);
      
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = { id: userDoc.id, ...userDoc.data() };
        console.log('✅ User profile found:', userData.name);
        
        // โหลดประวัติการเล่นล่าสุด
        const gamesRef = collection(db, 'games');
        const gamesQuery = query(
          gamesRef,
          where('userId', '==', userId),
          orderBy('timestamp', 'desc'),
          limit(5)
        );
        const gamesSnapshot = await getDocs(gamesQuery);
        
        const recentGames = [];
        gamesSnapshot.forEach((doc) => {
          recentGames.push({ id: doc.id, ...doc.data() });
        });
        console.log('📊 Recent games:', recentGames.length);

        // คำนวณสถิติแยกตามเกม
        const statsQuery = query(gamesRef, where('userId', '==', userId));
        const statsSnapshot = await getDocs(statsQuery);
        
        const gameStats = {
          sentence: { played: 0, totalScore: 0, bestScore: 0 },
          matching: { played: 0, totalScore: 0, bestScore: 0 },
          listening: { played: 0, totalScore: 0, bestScore: 0 },
          spelling: { played: 0, totalScore: 0, bestScore: 0 }
        };

        statsSnapshot.forEach((doc) => {
          const game = doc.data();
          if (gameStats[game.gameId]) {
            gameStats[game.gameId].played++;
            gameStats[game.gameId].totalScore += game.score || 0;
            gameStats[game.gameId].bestScore = Math.max(
              gameStats[game.gameId].bestScore, 
              game.score || 0
            );
          }
        });
        
        console.log('📊 Game stats:', gameStats);

        return {
          profile: userData,
          recentGames,
          gameStats
        };
      }
      
      console.log('⚠️ User not found');
      return null;
      
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      return null;
    }
  }, []);

  // เปลี่ยนช่วงเวลา
  const changeTimeRange = useCallback((range) => {
    console.log('⏰ Changing time range to:', range);
    setTimeRange(range);
    setLastVisible(null);
    setHasMore(true);
  }, []);

  // เปลี่ยนเกมที่กรอง
  const changeGameFilter = useCallback((game) => {
    console.log('🎮 Changing game filter to:', game);
    setGameFilter(game);
    setLastVisible(null);
    setHasMore(true);
  }, []);

  // รีเฟรช Leaderboard
  const refreshLeaderboard = useCallback(() => {
    console.log('🔄 Refreshing leaderboard...');
    setLastVisible(null);
    setHasMore(true);
    loadLeaderboard();
    if (user) {
      loadUserRank();
    }
  }, [user, loadLeaderboard, loadUserRank]);

  // ดึงสถิติรวม
  const getGlobalStats = useCallback(async () => {
    try {
      console.log('📊 Loading global stats...');
      
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      let totalPlayers = 0;
      let totalGames = 0;
      let totalScore = 0;
      let topScore = 0;
      let topPlayer = null;

      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        totalPlayers++;
        totalGames += userData.gamesPlayed || 0;
        totalScore += userData.totalScore || 0;
        
        if ((userData.totalScore || 0) > topScore) {
          topScore = userData.totalScore || 0;
          topPlayer = {
            id: doc.id,
            name: userData.name,
            icon: userData.icon,
            score: topScore
          };
        }
      });

      const stats = {
        totalPlayers,
        totalGames,
        totalScore,
        topScore,
        topPlayer,
        averageScore: totalPlayers > 0 ? Math.round(totalScore / totalPlayers) : 0
      };
      
      console.log('📊 Global stats:', stats);
      return stats;
      
    } catch (error) {
      console.error('❌ Error getting global stats:', error);
      return null;
    }
  }, []);

  // Helper function สำหรับหาอันดับผู้ใช้
  const getUserRank = useCallback((userId) => {
    if (!userId) return null;
    
    const index = leaderboard.findIndex(u => u.id === userId);
    if (index === -1) {
      console.log('👤 User not found in current leaderboard:', userId);
      return null;
    }
    
    const rank = index + 1;
    console.log('🏆 User rank:', { userId, rank, total: leaderboard.length });
    
    return rank;  // ✅ รีเทิร์นแค่ตัวเลข
  }, [leaderboard]);

  // ค่า value ที่จะส่งให้ Provider
  const value = {
    // State
    leaderboard,
    loading,
    error,
    hasMore,
    timeRange,
    gameFilter,
    userRank,
    totalPlayers,
    
    // Core functions
    loadLeaderboard,
    loadMore,
    refreshLeaderboard,
    
    // Search & Profile
    searchUsers,
    getUserProfile,
    
    // Filter functions
    changeTimeRange,
    changeGameFilter,
    
    // Stats
    getGlobalStats,
    
    // Helper
    getUserRank
  };

  console.log('📊 LeaderboardProvider state:', {
    leaderboardCount: leaderboard.length,
    loading,
    error,
    hasMore,
    timeRange,
    gameFilter,
    userRank,
    totalPlayers
  });

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
}

// Export useLeaderboard hook
export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
};

// Export custom hooks
export const useTopPlayers = (limit = 10) => {
  const { leaderboard } = useLeaderboard();
  return leaderboard.slice(0, limit);
};

export const useUserRanking = () => {
  const { userRank } = useLeaderboard();
  return userRank;
};

export const useGlobalStats = () => {
  const { getGlobalStats } = useLeaderboard();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const data = await getGlobalStats();
      setStats(data);
      setLoading(false);
    };
    loadStats();
  }, [getGlobalStats]);
  
  return { stats, loading };
};

export const useUserSearch = () => {
  const { searchUsers } = useLeaderboard();
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const search = async (term) => {
    if (!term) {
      setResults([]);
      return;
    }

    setSearching(true);
    const users = await searchUsers(term);
    setResults(users);
    setSearching(false);
  };

  return { search, results, searching };
};

// Export Provider เป็น default export
export default LeaderboardProvider;
