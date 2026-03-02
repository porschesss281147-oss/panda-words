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
  getDoc
} from '@/lib/firebase';
import { startAfter } from 'firebase/firestore';  // import startAfter โดยตรง
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

  // โหลด Leaderboard เริ่มต้น
  useEffect(() => {
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
    const usersRef = collection(db, 'users');
    let constraints = [];

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
      constraints.push(where('lastActive', '>=', date.toISOString()));
    }

    if (gameFilter !== 'all') {
      constraints.push(where(`${gameFilter}Played`, '>', 0));
    }

    constraints.push(orderBy('totalScore', 'desc'));

    if (useLimit) {
      constraints.push(limit(20));
    }

    if (startAfterDoc) {
      constraints.push(startAfter(startAfterDoc));  // ใช้ startAfter ที่ import มา
    }

    return query(usersRef, ...constraints);
  }, [timeRange, gameFilter]);

  // โหลด Leaderboard
  const loadLeaderboard = useCallback(async (loadMore = false) => {
    try {
      setError(null);
      if (!loadMore) {
        setLoading(true);
      }

      const q = buildQuery(true, loadMore ? lastVisible : null);
      const querySnapshot = await getDocs(q);
      
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data(),
          rank: leaderboard.length + users.length + 1
        });
      });

      if (loadMore) {
        setLeaderboard(prev => [...prev, ...users]);
      } else {
        setLeaderboard(users);
      }

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastDoc);
      setHasMore(querySnapshot.docs.length === 20);

    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setError('ไม่สามารถโหลดอันดับผู้เล่นได้');
    } finally {
      setLoading(false);
    }
  }, [buildQuery, lastVisible, leaderboard.length]);

  // โหลดเพิ่มเติม
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadLeaderboard(true);
    }
  }, [hasMore, loading, loadLeaderboard]);

  // โหลดอันดับผู้ใช้ปัจจุบัน
  const loadUserRank = useCallback(async () => {
    if (!user) return;

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('totalScore', '>', user.totalScore || 0));
      const querySnapshot = await getDocs(q);
      
      const rank = querySnapshot.size + 1;
      setUserRank({
        rank,
        totalPlayers: rank + querySnapshot.size,
        score: user.totalScore || 0
      });
    } catch (error) {
      console.error('Error loading user rank:', error);
    }
  }, [user]);

  // ค้นหาผู้ใช้
  const searchUsers = useCallback(async (searchTerm) => {
    if (!searchTerm) return [];

    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff'),
        orderBy('name'),
        limit(10)
      );
      
      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }, []);

  // ดูโปรไฟล์ผู้ใช้
  const getUserProfile = useCallback(async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
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

        const statsQuery = query(gamesRef, where('userId', '==', userId));
        const statsSnapshot = await getDocs(statsQuery);
        const gameStats = {
          memory: { played: 0, totalScore: 0, bestScore: 0 },
          matching: { played: 0, totalScore: 0, bestScore: 0 },
          spelling: { played: 0, totalScore: 0, bestScore: 0 },
          listening: { played: 0, totalScore: 0, bestScore: 0 }
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

        return {
          profile: { id: userId, ...userDoc.data() },
          recentGames,
          gameStats
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }, []);

  // เปลี่ยนช่วงเวลา
  const changeTimeRange = useCallback((range) => {
    setTimeRange(range);
    setLastVisible(null);
    setHasMore(true);
  }, []);

  // เปลี่ยนเกมที่กรอง
  const changeGameFilter = useCallback((game) => {
    setGameFilter(game);
    setLastVisible(null);
    setHasMore(true);
  }, []);

  // รีเฟรช Leaderboard
  const refreshLeaderboard = useCallback(() => {
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
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      let totalPlayers = 0;
      let totalGames = 0;
      let totalScore = 0;
      let topScore = 0;

      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        totalPlayers++;
        totalGames += userData.gamesPlayed || 0;
        totalScore += userData.totalScore || 0;
        topScore = Math.max(topScore, userData.totalScore || 0);
      });

      return {
        totalPlayers,
        totalGames,
        totalScore,
        topScore,
        averageScore: totalPlayers > 0 ? Math.round(totalScore / totalPlayers) : 0
      };
    } catch (error) {
      console.error('Error getting global stats:', error);
      return null;
    }
  }, []);

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
    getUserRank: (userId) => {
      const index = leaderboard.findIndex(u => u.id === userId);
      return index === -1 ? null : {
        rank: index + 1,
        total: leaderboard.length,
        user: leaderboard[index]
      };
    }
  };

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
  
  useEffect(() => {
    const loadStats = async () => {
      const data = await getGlobalStats();
      setStats(data);
    };
    loadStats();
  }, []);
  
  return stats;
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

// Export Provider เป็น default export ด้วย
export default LeaderboardProvider;