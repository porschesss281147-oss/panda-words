'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  db, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from '@/lib/firebase';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      loadUserFromFirebase(savedUserId);
    } else {
      setLoading(false);
    }
  }, []);

  // โหลดข้อมูลผู้ใช้จาก Firebase
  const loadUserFromFirebase = async (userId) => {
    try {
      setError(null);
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUser({ id: userId, ...userDoc.data() });
      } else {
        localStorage.removeItem('userId');
        setError('ไม่พบข้อมูลผู้ใช้');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  // สร้างผู้ใช้ใหม่
  const createUser = async (name, icon) => {
    try {
      setError(null);
      
      // ตรวจสอบชื่อซ้ำ
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('name', '==', name));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return { 
          success: false, 
          error: 'ชื่อนี้มีผู้ใช้แล้ว กรุณาใช้ชื่ออื่น' 
        };
      }

      // สร้าง ID จากชื่อ + timestamp
      const userId = `${name}-${Date.now()}`;
      
      const newUser = {
        name,
        icon,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        unlockedLevels: {
          spelling: 1,
          wordmatch: 1,
          sentence: 1,
          tonegame: 1
        },
        // ✅ คะแนนเฉลี่ย (ใช้จัดอันดับ)
        totalScore: 0,
        // ✅ คะแนนล่าสุดของแต่ละเกม
        latestScores: {
          spelling: 0,
          wordmatch: 0,
          sentence: 0,
          tonegame: 0
        },
        gamesPlayed: 0,
        challengesCompleted: 0,
        perfectGames: 0,
        totalPlayTime: 0,
        achievements: [],
        gameResults: [], // เก็บประวัติการเล่นล่าสุด
        gameStats: {
          spelling: { played: 0, totalScore: 0, bestScore: 0, totalCorrect: 0, totalQuestions: 0 },
          wordmatch: { played: 0, totalScore: 0, bestScore: 0, totalCorrect: 0, totalQuestions: 0 },
          sentence: { played: 0, totalScore: 0, bestScore: 0, totalCorrect: 0, totalQuestions: 0 },
          tonegame: { played: 0, totalScore: 0, bestScore: 0, totalCorrect: 0, totalQuestions: 0 }
        },
        settings: {
          sound: true,
          music: true,
          language: 'th'
        }
      };

      // บันทึกลง Firestore
      await setDoc(doc(db, 'users', userId), newUser);
      
      // บันทึก ID ลง localStorage
      localStorage.setItem('userId', userId);
      
      setUser({ id: userId, ...newUser });
      return { success: true, user: { id: userId, ...newUser } };
      
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: error.message };
    }
  };

  // ออกจากระบบ
  const logout = useCallback(() => {
    localStorage.removeItem('userId');
    setUser(null);
    setError(null);
  }, []);

  // อัพเดทข้อมูลผู้ใช้
  const updateUserData = async (newData) => {
    if (!user) return false;
    
    try {
      setError(null);
      const userRef = doc(db, 'users', user.id);
      const updatedData = { 
        ...newData,
        lastUpdated: new Date().toISOString() 
      };
      
      await updateDoc(userRef, updatedData);
      setUser(prev => ({ ...prev, ...updatedData }));
      return true;
      
    } catch (error) {
      console.error('Error updating user:', error);
      setError('เกิดข้อผิดพลาดในการอัพเดทข้อมูล');
      return false;
    }
  };

  // ปลดล็อกด่าน
  const unlockLevel = async (gameId, level) => {
    if (!user) return false;
    
    const currentUnlocked = user.unlockedLevels?.[gameId] || 1;
    if (level > currentUnlocked) {
      const updatedLevels = {
        ...user.unlockedLevels,
        [gameId]: level
      };
      return await updateUserData({ unlockedLevels: updatedLevels });
    }
    return false;
  };

  // ✅ เพิ่มผลการเล่นเกม (แก้ไขแล้ว)
  const addGameResult = async (result) => {
    if (!user) return null;
    
    try {
      setError(null);
      
      // เตรียมข้อมูลผลการเล่น
      const gameResult = {
        userId: user.id,
        userName: user.name,
        userIcon: user.icon,
        ...result,
        date: new Date().toISOString(),
        timestamp: new Date().toISOString()
      };
      
      // บันทึกลง Firestore
      const gamesRef = collection(db, 'games');
      const docRef = await addDoc(gamesRef, gameResult);
      
      // อัพเดท localStorage
      const gameResults = [gameResult, ...(user.gameResults || [])].slice(0, 50); // เก็บแค่ 50 รายการล่าสุด
      
      // ✅ คำนวณคะแนนเฉลี่ยใหม่
      const totalGames = (user.gameResults?.length || 0) + 1;
      const totalScoreSum = ((user.totalScore || 0) * (user.gameResults?.length || 0)) + result.score;
      const newAverageScore = Math.round(totalScoreSum / totalGames);
      
      // ✅ อัพเดทสถิติเกม
      const currentStats = user.gameStats?.[result.gameId] || {
        played: 0,
        totalScore: 0,
        bestScore: 0,
        totalCorrect: 0,
        totalQuestions: 0
      };
      
      const newStats = {
        played: currentStats.played + 1,
        totalScore: currentStats.totalScore + result.score,
        bestScore: Math.max(currentStats.bestScore, result.score),
        totalCorrect: currentStats.totalCorrect + (result.correctAnswers || 0),
        totalQuestions: currentStats.totalQuestions + (result.words || 0)
      };
      
      // ✅ อัพเดทคะแนนล่าสุด
      const latestScores = {
        ...(user.latestScores || {}),
        [result.gameId]: result.score
      };
      
      // เตรียมข้อมูลสำหรับอัพเดท
      const updates = {
        gameResults,
        gameStats: {
          ...user.gameStats,
          [result.gameId]: newStats
        },
        latestScores,
        totalScore: newAverageScore, // ค่าเฉลี่ย (ใช้จัดอันดับ)
        gamesPlayed: (user.gamesPlayed || 0) + 1
      };
      
      // ถ้าได้คะแนนเต็ม 100
      if (result.score === 100) {
        updates.perfectGames = (user.perfectGames || 0) + 1;
      }
      
      // บันทึกการอัพเดท
      await updateUserData(updates);
      
      console.log('✅ Game result saved:', {
        gameId: result.gameId,
        score: result.score,
        latestScore: result.score,
        averageScore: newAverageScore
      });
      
      return { id: docRef.id, ...gameResult };
      
    } catch (error) {
      console.error('Error adding game result:', error);
      setError('เกิดข้อผิดพลาดในการบันทึกผลการเล่น');
      return null;
    }
  };

  // เพิ่มเวลาเล่น
  const addPlayTime = async (minutes) => {
    if (!user) return;
    
    const totalPlayTime = (user.totalPlayTime || 0) + minutes;
    await updateUserData({ totalPlayTime });
  };

  // เพิ่ม Achievement
  const addAchievement = async (achievement) => {
    if (!user) return;
    
    const achievements = user.achievements || [];
    if (!achievements.some(a => a.id === achievement.id)) {
      const newAchievements = [...achievements, {
        ...achievement,
        earnedAt: new Date().toISOString()
      }];
      await updateUserData({ achievements: newAchievements });
    }
  };

  // อัพเดทการตั้งค่า
  const updateSettings = async (newSettings) => {
    if (!user) return;
    
    const settings = { ...user.settings, ...newSettings };
    await updateUserData({ settings });
  };

  // ดึงประวัติการเล่น
  const getGameHistory = async (limitCount = 10) => {
    if (!user) return [];
    
    try {
      const gamesRef = collection(db, 'games');
      const q = query(
        gamesRef, 
        where('userId', '==', user.id),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
    } catch (error) {
      console.error('Error getting game history:', error);
      return [];
    }
  };

  // ดึงสถิติแยกตามเกม
  const getGameStats = async () => {
    if (!user) return {};
    
    try {
      const gamesRef = collection(db, 'games');
      const q = query(gamesRef, where('userId', '==', user.id));
      const querySnapshot = await getDocs(q);
      
      const stats = {
        spelling: { played: 0, totalScore: 0, bestScore: 0, averageScore: 0 },
        wordmatch: { played: 0, totalScore: 0, bestScore: 0, averageScore: 0 },
        sentence: { played: 0, totalScore: 0, bestScore: 0, averageScore: 0 },
        tonegame: { played: 0, totalScore: 0, bestScore: 0, averageScore: 0 }
      };
      
      querySnapshot.forEach(doc => {
        const game = doc.data();
        if (stats[game.gameId]) {
          stats[game.gameId].played++;
          stats[game.gameId].totalScore += game.score || 0;
          stats[game.gameId].bestScore = Math.max(stats[game.gameId].bestScore, game.score || 0);
        }
      });
      
      // คำนวณค่าเฉลี่ย
      Object.keys(stats).forEach(key => {
        if (stats[key].played > 0) {
          stats[key].averageScore = Math.round(stats[key].totalScore / stats[key].played);
        }
      });
      
      return stats;
      
    } catch (error) {
      console.error('Error getting game stats:', error);
      return {};
    }
  };

  // รีเซ็ตความคืบหน้า
  const resetProgress = async () => {
    if (!user) return;
    
    const resetData = {
      unlockedLevels: {
        spelling: 1,
        wordmatch: 1,
        sentence: 1,
        tonegame: 1
      },
      latestScores: {
        spelling: 0,
        wordmatch: 0,
        sentence: 0,
        tonegame: 0
      },
      totalScore: 0,
      gamesPlayed: 0,
      challengesCompleted: 0,
      perfectGames: 0,
      totalPlayTime: 0,
      achievements: [],
      gameResults: [],
      gameStats: {
        spelling: { played: 0, totalScore: 0, bestScore: 0, totalCorrect: 0, totalQuestions: 0 },
        wordmatch: { played: 0, totalScore: 0, bestScore: 0, totalCorrect: 0, totalQuestions: 0 },
        sentence: { played: 0, totalScore: 0, bestScore: 0, totalCorrect: 0, totalQuestions: 0 },
        tonegame: { played: 0, totalScore: 0, bestScore: 0, totalCorrect: 0, totalQuestions: 0 }
      }
    };
    
    await updateUserData(resetData);
  };

  // ดึงคะแนนล่าสุดของเกม
  const getLatestScore = (gameId) => {
    return user?.latestScores?.[gameId] || 0;
  };

  // ดึงคะแนนเฉลี่ยของเกม
  const getAverageScore = (gameId) => {
    const stats = user?.gameStats?.[gameId];
    if (!stats || stats.played === 0) return 0;
    return Math.round(stats.totalScore / stats.played);
  };

  return (
    <UserContext.Provider value={{
      // State
      user,
      loading,
      error,
      
      // Auth functions
      createUser,
      logout,
      
      // User data functions
      updateUserData,
      unlockLevel,
      
      // Game functions
      addGameResult,
      addPlayTime,
      getGameHistory,
      getGameStats,
      getLatestScore,
      getAverageScore,
      
      // Achievement functions
      addAchievement,
      
      // Settings
      updateSettings,
      
      // Utility
      resetProgress,
      
      // Helper
      isLoaded: !loading,
      isAuthenticated: !!user
    }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook สำหรับใช้ UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Custom hook สำหรับดึงข้อมูลผู้ใช้แบบมีเงื่อนไข
export const useUserData = () => {
  const { user, loading } = useUser();
  return { user, loading };
};

// ✅ Custom hook สำหรับดึงคะแนนล่าสุด
export const useLatestScore = (gameId) => {
  const { user } = useUser();
  return user?.latestScores?.[gameId] || 0;
};

// ✅ Custom hook สำหรับดึงคะแนนเฉลี่ย
export const useAverageScore = (gameId) => {
  const { user } = useUser();
  const stats = user?.gameStats?.[gameId];
  if (!stats || stats.played === 0) return 0;
  return Math.round(stats.totalScore / stats.played);
};

// Custom hook สำหรับเช็คสิทธิ์การปลดล็อกด่าน
export const useUnlockedLevel = (gameId) => {
  const { user } = useUser();
  return user?.unlockedLevels?.[gameId] || 1;
};

// ✅ Custom hook สำหรับเช็คสถิติรวม (แก้ไขแล้ว)
export const useUserStats = () => {
  const { user } = useUser();
  
  // คำนวณคะแนนรวมล่าสุด
  const totalLatestScore = Object.values(user?.latestScores || {}).reduce((a, b) => a + b, 0);
  
  return {
    totalScore: user?.totalScore || 0, // ค่าเฉลี่ย (ใช้จัดอันดับ)
    totalLatestScore, // คะแนนรวมล่าสุด (ใช้แสดง)
    gamesPlayed: user?.gamesPlayed || 0,
    challengesCompleted: user?.challengesCompleted || 0,
    perfectGames: user?.perfectGames || 0,
    totalPlayTime: user?.totalPlayTime || 0,
    achievements: user?.achievements?.length || 0,
    latestScores: user?.latestScores || {}
  };
};
