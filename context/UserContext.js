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

  const forceRefreshUser = async () => {
    if (!user) return;
    setLoading(true);
    await loadUserFromFirebase(user.id);
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
        
        // ✅ ด่านที่ปลดล็อกแล้ว
        unlockedLevels: {
          sentence: 1,
          matching: 1,
          listening: 1,
          spelling: 1
        },
        
        // ✅ คะแนนรวมจริง (ผลรวมทั้งหมด - ใช้อันดับ)
        totalScore: 0,
        
        // ✅ คะแนนล่าสุดของแต่ละเกม
        latestScores: {
          sentence: 0,
          matching: 0,
          listening: 0,
          spelling: 0
        },
        
        // ✅ สถิติการเล่น
        gamesPlayed: 0,
        challengesCompleted: 0,
        perfectGames: 0,
        totalPlayTime: 0,
        achievements: [],
        gameResults: [],
        
        // ✅ สถิติแยกตามเกม (เก็บคะแนนรวมของแต่ละเกม)
        gameStats: {
          sentence: { 
            played: 0, 
            totalScore: 0,  // คะแนนรวมของเกมนี้
            bestScore: 0, 
            totalCorrect: 0, 
            totalQuestions: 0 
          },
          matching: { 
            played: 0, 
            totalScore: 0, 
            bestScore: 0, 
            totalCorrect: 0, 
            totalQuestions: 0 
          },
          listening: { 
            played: 0, 
            totalScore: 0, 
            bestScore: 0, 
            totalCorrect: 0, 
            totalQuestions: 0 
          },
          spelling: { 
            played: 0, 
            totalScore: 0, 
            bestScore: 0, 
            totalCorrect: 0, 
            totalQuestions: 0 
          }
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

  // ✅ เพิ่มผลการเล่นเกม (ใช้คะแนนรวมจริง)
  const addGameResult = async (result) => {
    if (!user) return null;
    
    try {
      setError(null);
      
      // คำนวณคะแนนเป็นเปอร์เซ็นต์ (0-100)
      const scorePercentage = result.score; // ที่ส่งมาคือเปอร์เซ็นต์อยู่แล้ว
      
      // เตรียมข้อมูลผลการเล่น
      const gameResult = {
        userId: user.id,
        userName: user.name,
        userIcon: user.icon,
        ...result,
        score: scorePercentage, // เก็บเปอร์เซ็นต์
        totalScoreRaw: result.score, // เก็บคะแนนดิบด้วย
        date: new Date().toISOString(),
        timestamp: new Date().toISOString()
      };
      
      // บันทึกลง Firestore (collection games)
      const gamesRef = collection(db, 'games');
      const docRef = await addDoc(gamesRef, gameResult);
      
      // อัพเดทประวัติการเล่น (เก็บแค่ 50 รายการ)
      const gameResults = [gameResult, ...(user.gameResults || [])].slice(0, 50);
      
      // ✅ คำนวณคะแนนรวมใหม่ (บวกเพิ่ม)
      const newTotalScore = (user.totalScore || 0) + scorePercentage;
      
      // ✅ อัพเดทสถิติเกม (เก็บคะแนนรวมของแต่ละเกม)
      const currentStats = user.gameStats?.[result.gameId] || {
        played: 0,
        totalScore: 0,
        bestScore: 0,
        totalCorrect: 0,
        totalQuestions: 0
      };
      
      const newStats = {
        played: currentStats.played + 1,
        totalScore: currentStats.totalScore + scorePercentage, // รวมคะแนนของเกมนี้
        bestScore: Math.max(currentStats.bestScore, scorePercentage),
        totalCorrect: currentStats.totalCorrect + (result.correctAnswers || 0),
        totalQuestions: currentStats.totalQuestions + (result.words || 0)
      };
      
      // ✅ อัพเดทคะแนนล่าสุดของเกม
      const latestScores = {
        ...(user.latestScores || {}),
        [result.gameId]: scorePercentage
      };
      
      // เตรียมข้อมูลสำหรับอัพเดท
      const updates = {
        gameResults,
        gameStats: {
          ...user.gameStats,
          [result.gameId]: newStats
        },
        latestScores,
        totalScore: newTotalScore, // ✅ คะแนนรวม (เพิ่มขึ้นเรื่อยๆ)
        gamesPlayed: (user.gamesPlayed || 0) + 1
      };
      
      // ถ้าได้คะแนนเต็ม 100
      if (scorePercentage === 100) {
        updates.perfectGames = (user.perfectGames || 0) + 1;
      }
      
      // บันทึกการอัพเดท
      await updateUserData(updates);
      
      console.log('✅ Game result saved:', {
        gameId: result.gameId,
        score: scorePercentage,
        previousTotal: user.totalScore,
        newTotal: newTotalScore,
        gameStats: newStats
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
        sentence: { played: 0, totalScore: 0, bestScore: 0, averageScore: 0 },
        matching: { played: 0, totalScore: 0, bestScore: 0, averageScore: 0 },
        listening: { played: 0, totalScore: 0, bestScore: 0, averageScore: 0 },
        spelling: { played: 0, totalScore: 0, bestScore: 0, averageScore: 0 }
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

  // ดึงคะแนนรวมจริงของแต่ละเกม
  const getGameTotalScore = (gameId) => {
    return user?.gameStats?.[gameId]?.totalScore || 0;
  };

  // ดึงคะแนนล่าสุดของเกม
  const getLatestScore = (gameId) => {
    return user?.latestScores?.[gameId] || 0;
  };

  // ดึงคะแนนรวมทั้งหมด
  const getTotalScore = () => {
    return user?.totalScore || 0;
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
      forceRefreshUser,
      
      // Game functions
      addGameResult,
      addPlayTime,
      getGameHistory,
      getGameStats,
      getLatestScore,
      getGameTotalScore,
      getTotalScore,
      
      // Achievement functions
      addAchievement,
      
      // Settings
      updateSettings,
      
      // Utility
      
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

// ✅ Custom hook สำหรับดึงคะแนนรวมจริง
export const useTotalScore = () => {
  const { user } = useUser();
  return user?.totalScore || 0;
};

// ✅ Custom hook สำหรับดึงคะแนนรวมของแต่ละเกม
export const useGameTotalScore = (gameId) => {
  const { user } = useUser();
  return user?.gameStats?.[gameId]?.totalScore || 0;
};

// ✅ Custom hook สำหรับดึงคะแนนล่าสุด
export const useLatestScore = (gameId) => {
  const { user } = useUser();
  return user?.latestScores?.[gameId] || 0;
};

// Custom hook สำหรับเช็คสิทธิ์การปลดล็อกด่าน
export const useUnlockedLevel = (gameId) => {
  const { user } = useUser();
  return user?.unlockedLevels?.[gameId] || 1;
};

// ✅ Custom hook สำหรับเช็คสถิติรวม
export const useUserStats = () => {
  const { user } = useUser();
  
  // คำนวณสถิติจาก user โดยตรง
  return {
    totalScore: user?.totalScore || 0, // คะแนนรวมจริง
    gamesPlayed: user?.gamesPlayed || 0,
    challengesCompleted: user?.challengesCompleted || 0,
    perfectGames: user?.perfectGames || 0,
    totalPlayTime: user?.totalPlayTime || 0,
    achievements: user?.achievements?.length || 0,
    latestScores: user?.latestScores || {},
    gameStats: user?.gameStats || {}
  };
};
