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
  limit,
  increment
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
        // ถ้าไม่พบผู้ใช้ใน Firebase ให้ลบ localStorage
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
      
      // ตรวจสอบชื่อซ้ำ (optional)
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
          memory: 1,
          matching: 1,
          spelling: 1,
          listening: 1
        },
        totalScore: 0,
        gamesPlayed: 0,
        challengesCompleted: 0,
        perfectGames: 0,
        totalPlayTime: 0,
        achievements: [],
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

  // เพิ่มผลการเล่นเกม
  const addGameResult = async (result) => {
    if (!user) return null;
    
    try {
      setError(null);
      
      // บันทึกผลการเล่นลงใน collection games
      const gamesRef = collection(db, 'games');
      const gameResult = {
        userId: user.id,
        userName: user.name,
        userIcon: user.icon,
        ...result,
        timestamp: new Date().toISOString()
      };
      
      const docRef = await addDoc(gamesRef, gameResult);
      
      // คำนวณสถิติใหม่
      const updates = {
        gamesPlayed: (user.gamesPlayed || 0) + 1,
        totalScore: (user.totalScore || 0) + (result.score || 0)
      };
      
      // ถ้าได้คะแนนเต็ม
      if (result.score === 100) {
        updates.perfectGames = (user.perfectGames || 0) + 1;
      }
      
      await updateUserData(updates);
      
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
  const getGameHistory = async (limit = 10) => {
    if (!user) return [];
    
    try {
      const gamesRef = collection(db, 'games');
      const q = query(
        gamesRef, 
        where('userId', '==', user.id),
        orderBy('timestamp', 'desc'),
        limit(limit)
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
        memory: { played: 0, totalScore: 0, bestScore: 0 },
        matching: { played: 0, totalScore: 0, bestScore: 0 },
        spelling: { played: 0, totalScore: 0, bestScore: 0 },
        listening: { played: 0, totalScore: 0, bestScore: 0 }
      };
      
      querySnapshot.forEach(doc => {
        const game = doc.data();
        if (stats[game.gameId]) {
          stats[game.gameId].played++;
          stats[game.gameId].totalScore += game.score || 0;
          stats[game.gameId].bestScore = Math.max(stats[game.gameId].bestScore, game.score || 0);
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
        memory: 1,
        matching: 1,
        spelling: 1,
        listening: 1
      },
      totalScore: 0,
      gamesPlayed: 0,
      challengesCompleted: 0,
      perfectGames: 0,
      totalPlayTime: 0,
      achievements: []
    };
    
    await updateUserData(resetData);
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

// Custom hook สำหรับเช็คสิทธิ์การปลดล็อกด่าน
export const useUnlockedLevel = (gameId) => {
  const { user } = useUser();
  return user?.unlockedLevels?.[gameId] || 1;
};

// Custom hook สำหรับเช็คสถิติรวม
export const useUserStats = () => {
  const { user } = useUser();
  
  return {
    totalScore: user?.totalScore || 0,
    gamesPlayed: user?.gamesPlayed || 0,
    challengesCompleted: user?.challengesCompleted || 0,
    perfectGames: user?.perfectGames || 0,
    totalPlayTime: user?.totalPlayTime || 0,
    achievements: user?.achievements?.length || 0
  };
};