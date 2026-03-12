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
  increment,
  deleteDoc
} from '@/lib/firebase';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
  useEffect(() => {
    const savedUserId = localStorage.getItem('pandaWordsUserId');
    const savedUserData = localStorage.getItem('pandaWordsUserData');
    
    if (savedUserId) {
      // ถ้ามี userId ให้โหลดจาก Firebase
      loadUserFromFirebase(savedUserId);
    } else if (savedUserData) {
      // ถ้ามี userData (fallback) ให้ใช้ข้อมูลนั้น
      try {
        const parsedUser = JSON.parse(savedUserData);
        setUser(parsedUser);
        setLoading(false);
      } catch (e) {
        console.error('Error parsing saved user data:', e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // โหลดข้อมูลผู้ใช้จาก Firebase
  const loadUserFromFirebase = async (userId) => {
    try {
      setError(null);
      console.log('📥 Loading user from Firebase:', userId);
      
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = { id: userId, ...userDoc.data() };
        setUser(userData);
        
        // บันทึกข้อมูลลง localStorage เป็น backup
        localStorage.setItem('pandaWordsUserData', JSON.stringify(userData));
        console.log('✅ User loaded:', userData.name);
      } else {
        console.log('❌ User not found in Firebase');
        localStorage.removeItem('pandaWordsUserId');
        localStorage.removeItem('pandaWordsUserData');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  // สร้าง ID จากชื่อ
  const generateUserId = (name, icon) => {
    // ลบช่องว่าง, ตัวอักษรพิเศษ, ทำให้เป็น lowercase
    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const iconCode = icon.codePointAt(0).toString(16);
    return `${cleanName}-${iconCode}`;
  };

  // สร้างหรือค้นหาผู้ใช้
  const createUser = async (name, icon) => {
    try {
      setError(null);
      setLoading(true);
      
      // สร้าง ID จากชื่อและไอคอน
      const userId = generateUserId(name, icon);
      console.log('🔍 Checking for user:', userId);
      
      // ตรวจสอบว่ามีผู้ใช้นี้ใน Firebase หรือไม่
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // ✅ พบผู้ใช้เดิม - ดึงข้อมูลมาใช้
        const existingUser = { id: userId, ...userDoc.data() };
        
        // อัปเดต lastLogin
        await updateDoc(userRef, {
          lastLogin: new Date().toISOString()
        });
        
        // บันทึก session
        localStorage.setItem('pandaWordsUserId', userId);
        localStorage.setItem('pandaWordsUserData', JSON.stringify(existingUser));
        
        setUser(existingUser);
        console.log('✅ พบผู้ใช้เดิม:', existingUser.name);
        
        return { success: true, user: existingUser };
        
      } else {
        // ❌ ไม่พบผู้ใช้ - สร้างผู้ใช้ใหม่
        console.log('🆕 Creating new user:', name);
        
        const newUser = {
          name: name.trim(),
          icon: icon,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          unlockedLevels: {
            sentence: 1,
            matching: 1,
            listening: 1,
            spelling: 1
          },
          stats: {
            totalScore: 0,
            gamesPlayed: 0,
            perfectGames: 0,
            totalPlayTime: 0,
            averageAccuracy: 0
          },
          achievements: [],
          settings: {
            sound: true,
            music: true,
            volume: 0.7,
            language: 'th'
          },
          gameHistory: []
        };

        // บันทึกลง Firestore
        await setDoc(userRef, newUser);
        
        // บันทึก session
        localStorage.setItem('pandaWordsUserId', userId);
        localStorage.setItem('pandaWordsUserData', JSON.stringify({ id: userId, ...newUser }));
        
        const createdUser = { id: userId, ...newUser };
        setUser(createdUser);
        
        console.log('✅ สร้างผู้ใช้ใหม่:', createdUser.name);
        return { success: true, user: createdUser };
      }
      
    } catch (error) {
      console.error('Error creating/finding user:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ออกจากระบบ
  const logout = useCallback(async () => {
    try {
      if (user) {
        // อัปเดต lastLogout ใน Firebase
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          lastLogout: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating logout time:', error);
    } finally {
      // ลบข้อมูลจาก localStorage
      localStorage.removeItem('pandaWordsUserId');
      localStorage.removeItem('pandaWordsUserData');
      setUser(null);
      setError(null);
      console.log('👋 Logged out');
    }
  }, [user]);

  // อัพเดทข้อมูลผู้ใช้
  const updateUserData = async (newData) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    try {
      setError(null);
      const userRef = doc(db, 'users', user.id);
      
      const updatedData = { 
        ...newData,
        lastUpdated: new Date().toISOString() 
      };
      
      await updateDoc(userRef, updatedData);
      
      // อัพเดท state
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      
      // อัพเดท localStorage
      localStorage.setItem('pandaWordsUserData', JSON.stringify(updatedUser));
      
      console.log('✅ User updated:', updatedUser.name);
      return { success: true, user: updatedUser };
      
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // ปลดล็อกด่าน
  const unlockLevel = async (gameId, level) => {
    if (!user) return false;
    
    const currentLevel = user.unlockedLevels?.[gameId] || 1;
    if (level > currentLevel) {
      const updatedLevels = {
        ...user.unlockedLevels,
        [gameId]: level
      };
      const result = await updateUserData({ unlockedLevels: updatedLevels });
      if (result.success) {
        console.log(`🔓 Unlocked ${gameId} level ${level}`);
      }
      return result.success;
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
      
      // ดึงประวัติเกมปัจจุบัน
      const currentHistory = user.gameHistory || [];
      const newHistory = [gameResult, ...currentHistory].slice(0, 50); // เก็บแค่ 50 รายการล่าสุด
      
      // คำนวณสถิติใหม่
      const gamesPlayed = (user.stats?.gamesPlayed || 0) + 1;
      const totalScore = (user.stats?.totalScore || 0) + (result.score || 0);
      const perfectGames = (user.stats?.perfectGames || 0) + (result.score === 100 ? 1 : 0);
      const averageAccuracy = Math.round(totalScore / gamesPlayed);
      
      const updates = {
        gameHistory: newHistory,
        totalScore: newTotalScore,
        stats: {
          ...user.stats,
          gamesPlayed,
          totalScore,
          perfectGames,
          averageAccuracy
        }
      };
      
      await updateUserData(updates);
      
      console.log(`📊 Game result saved: ${result.gameId} score ${result.score}`);
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
    
    const totalPlayTime = (user.stats?.totalPlayTime || 0) + minutes;
    await updateUserData({
      stats: { ...user.stats, totalPlayTime }
    });
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
      console.log('🏆 Achievement unlocked:', achievement.name);
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

  // รีเซ็ตความคืบหน้า
  const resetProgress = async () => {
    if (!user) return;
    
    const resetData = {
      unlockedLevels: {
        sentence: 1,
        matching: 1,
        listening: 1,
        spelling: 1
      },
      stats: {
        totalScore: 0,
        gamesPlayed: 0,
        perfectGames: 0,
        totalPlayTime: 0,
        averageAccuracy: 0
      },
      achievements: [],
      gameHistory: []
    };
    
    await updateUserData(resetData);
    console.log('🔄 Progress reset');
  };

  // ลบบัญชีผู้ใช้
  const deleteAccount = async () => {
    if (!user) return false;
    
    try {
      // ลบข้อมูลผู้ใช้
      await deleteDoc(doc(db, 'users', user.id));
      
      // ลบประวัติการเล่นทั้งหมด (optional)
      const gamesRef = collection(db, 'games');
      const q = query(gamesRef, where('userId', '==', user.id));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // ลบ session
      localStorage.removeItem('pandaWordsUserId');
      localStorage.removeItem('pandaWordsUserData');
      setUser(null);
      
      console.log('🗑️ Account deleted');
      return true;
      
    } catch (error) {
      console.error('Error deleting account:', error);
      setError(error.message);
      return false;
    }
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
      deleteAccount,
      
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
    totalScore: user?.stats?.totalScore || 0,
    gamesPlayed: user?.stats?.gamesPlayed || 0,
    perfectGames: user?.stats?.perfectGames || 0,
    totalPlayTime: user?.stats?.totalPlayTime || 0,
    averageAccuracy: user?.stats?.averageAccuracy || 0,
    achievements: user?.achievements?.length || 0
  };
};

// Custom hook สำหรับเช็คระดับด่าน
export const useLevel = (gameId) => {
  const { user } = useUser();
  return user?.unlockedLevels?.[gameId] || 1;
};

// Custom hook สำหรับเช็คการตั้งค่า
export const useSetting = (key) => {
  const { user } = useUser();
  return user?.settings?.[key];
};
