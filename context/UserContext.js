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
      loadUserFromFirebase(savedUserId);
    } else if (savedUserData) {
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
    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const iconCode = icon.codePointAt(0).toString(16);
    return `${cleanName}-${iconCode}`;
  };

  // สร้างหรือค้นหาผู้ใช้
  const createUser = async (name, icon) => {
    try {
      setError(null);
      setLoading(true);
      
      const userId = generateUserId(name, icon);
      console.log('🔍 Checking for user:', userId);
      
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const existingUser = { id: userId, ...userDoc.data() };
        
        await updateDoc(userRef, {
          lastLogin: new Date().toISOString()
        });
        
        localStorage.setItem('pandaWordsUserId', userId);
        localStorage.setItem('pandaWordsUserData', JSON.stringify(existingUser));
        
        setUser(existingUser);
        console.log('✅ พบผู้ใช้เดิม:', existingUser.name);
        
        return { success: true, user: existingUser };
        
      } else {
        console.log('🆕 Creating new user:', name);
        
        const newUser = {
          name: name.trim(),
          icon: icon,
          totalScore: 0,           // ✅ คะแนนรวมที่ระดับบนสุด
          gamesPlayed: 0,           // ✅ จำนวนเกมที่เล่นที่ระดับบนสุด
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          unlockedLevels: {
            sentence: 1,
            matching: 1,
            listening: 1,
            spelling: 1
          },
          stats: {                  // ✅ สถิติละเอียด (ไม่มี totalScore และ gamesPlayed ซ้ำ)
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

        await setDoc(userRef, newUser);
        
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
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          lastLogout: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating logout time:', error);
    } finally {
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
      
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
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

  // ✅ เพิ่มผลการเล่นเกม (แก้ไขให้ถูกต้อง)
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
      const newHistory = [gameResult, ...currentHistory].slice(0, 50);
      
     const scorePoints = (result.correct || 0) * 10;
      
      // คำนวณสถิติใน stats
      const newPerfectGames = (user.stats?.perfectGames || 0) + (result.score === 100 ? 1 : 0);
      const newAverageAccuracy = Math.round(newTotalScore / (newGamesPlayed * 10));
      
      const updates = {
        gameHistory: newHistory,
        totalScore: newTotalScore,                   
        gamesPlayed: newGamesPlayed,                  
        stats: {
          perfectGames: newPerfectGames,
          totalPlayTime: user.stats?.totalPlayTime || 0,
          averageAccuracy: newAverageAccuracy
        }
      };
      
      await updateUserData(updates);
      
      console.log(`📊 Game result saved: ${result.gameId} score ${result.score}`);
      console.log(`📊 New total: ${newTotalScore} points, ${newGamesPlayed} games`);
      
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
      totalScore: 0,
      gamesPlayed: 0,
      unlockedLevels: {
        sentence: 1,
        matching: 1,
        listening: 1,
        spelling: 1
      },
      stats: {
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
      await deleteDoc(doc(db, 'users', user.id));
      
      const gamesRef = collection(db, 'games');
      const q = query(gamesRef, where('userId', '==', user.id));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
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
      user,
      loading,
      error,
      createUser,
      logout,
      deleteAccount,
      updateUserData,
      unlockLevel,
      addGameResult,
      addPlayTime,
      getGameHistory,
      getGameStats,
      addAchievement,
      updateSettings,
      resetProgress,
      isLoaded: !loading,
      isAuthenticated: !!user
    }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hooks
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const useUserData = () => {
  const { user, loading } = useUser();
  return { user, loading };
};

export const useUnlockedLevel = (gameId) => {
  const { user } = useUser();
  return user?.unlockedLevels?.[gameId] || 1;
};

// ✅ Custom hook สำหรับสถิติที่ถูกต้อง
export const useUserStats = () => {
  const { user } = useUser();
  
  return {
    totalScore: user?.totalScore || 0,           // ✅ ดึงจากระดับบนสุด
    gamesPlayed: user?.gamesPlayed || 0,         // ✅ ดึงจากระดับบนสุด
    perfectGames: user?.stats?.perfectGames || 0,
    totalPlayTime: user?.stats?.totalPlayTime || 0,
    averageAccuracy: user?.stats?.averageAccuracy || 0,
    achievements: user?.achievements?.length || 0
  };
};

export const useLevel = (gameId) => {
  const { user } = useUser();
  return user?.unlockedLevels?.[gameId] || 1;
};

export const useSetting = (key) => {
  const { user } = useUser();
  return user?.settings?.[key];
};
