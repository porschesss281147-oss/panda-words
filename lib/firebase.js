'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  // Auth
  auth,
  onAuthStateChanged,
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  
  // Firestore
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  increment,
  arrayUnion,
  arrayRemove,
  
  // User functions
  createUserDocument,
  getUserDocument,
  updateUserDocument,
  
  // Game functions
  addGameResult,
  getUserGames,
  
  // Challenge functions
  createChallengeDocument,
  getChallengeDocument,
  
  // Leaderboard functions
  getLeaderboard,
  getUserRank
} from '@/lib/firebase';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ติดตามสถานะ Auth จาก Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // มี Firebase Auth user
        try {
          // ดึงข้อมูลเพิ่มเติมจาก Firestore
          const userDoc = await getUserDocument(firebaseUser.uid);
          
          if (userDoc) {
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDoc
            });
            
            // บันทึก session ใน localStorage
            localStorage.setItem('pandaWordsUserId', firebaseUser.uid);
            localStorage.setItem('pandaWordsUserData', JSON.stringify({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDoc
            }));
          } else {
            // ยังไม่มี document ใน Firestore
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'ผู้ใช้',
              icon: '🐼'
            });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setError(error.message);
        }
      } else {
        // ไม่ได้ล็อกอิน
        setUser(null);
        localStorage.removeItem('pandaWordsUserId');
        localStorage.removeItem('pandaWordsUserData');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // สร้างผู้ใช้ใหม่ (Register)
  const createUser = async (email, password, name, icon) => {
    try {
      setError(null);
      setLoading(true);
      
      // สร้าง Firebase Auth user
      const userCredential = await registerUser(email, password);
      const firebaseUser = userCredential.user;
      
      // อัปเดตโปรไฟล์ (ชื่อ)
      await updateUserProfile(firebaseUser, {
        displayName: name
      });
      
      // สร้าง document ใน Firestore
      const userData = {
        name: name,
        icon: icon,
        email: email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        stats: {
          totalScore: 0,
          gamesPlayed: 0,
          perfectGames: 0,
          totalPlayTime: 0,
          averageAccuracy: 0
        },
        unlockedLevels: {
          sentence: 1,
          matching: 1,
          listening: 1,
          spelling: 1,
          falling: 1,
          memory: 1,
          puzzle: 1,
          challenge: 1
        },
        achievements: [],
        settings: {
          sound: true,
          music: true,
          volume: 0.7,
          language: 'th',
          theme: 'light'
        },
        gameHistory: []
      };
      
      await createUserDocument(firebaseUser.uid, userData);
      
      return { 
        success: true, 
        user: { id: firebaseUser.uid, ...userData } 
      };
      
    } catch (error) {
      console.error('Error creating user:', error);
      
      // แปลง error message เป็นภาษาไทย
      let errorMessage = 'เกิดข้อผิดพลาด';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'อีเมลนี้ถูกใช้งานแล้ว';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'รูปแบบอีเมลไม่ถูกต้อง';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // เข้าสู่ระบบ (Login)
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const userCredential = await loginUser(email, password);
      const firebaseUser = userCredential.user;
      
      // อัปเดต lastLogin ใน Firestore
      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, {
        lastLogin: new Date().toISOString()
      });
      
      return { success: true };
      
    } catch (error) {
      console.error('Error logging in:', error);
      
      let errorMessage = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'ไม่พบผู้ใช้นี้';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'รหัสผ่านไม่ถูกต้อง';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'ลองใหม่อีกครั้งในภายหลัง';
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // เข้าสู่ระบบด้วยชื่อ (แบบไม่ใช้ email) สำหรับเกม
  const loginWithName = async (name, icon) => {
    try {
      setError(null);
      setLoading(true);
      
      // ค้นหาผู้ใช้จากชื่อและไอคอน
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef, 
        where('name', '==', name),
        where('icon', '==', icon)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // พบผู้ใช้เดิม
        const userDoc = querySnapshot.docs[0];
        const userData = { id: userDoc.id, ...userDoc.data() };
        
        // อัปเดต lastLogin
        await updateDoc(doc(db, 'users', userDoc.id), {
          lastLogin: new Date().toISOString()
        });
        
        // เก็บข้อมูลใน state
        setUser(userData);
        
        // เก็บใน localStorage
        localStorage.setItem('pandaWordsUserId', userDoc.id);
        localStorage.setItem('pandaWordsUserData', JSON.stringify(userData));
        
        return { success: true, user: userData };
      } else {
        // ไม่พบผู้ใช้ - สร้างใหม่
        const userId = `${name}-${Date.now()}`;
        
        const newUser = {
          name: name,
          icon: icon,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          stats: {
            totalScore: 0,
            gamesPlayed: 0,
            perfectGames: 0,
            totalPlayTime: 0,
            averageAccuracy: 0
          },
          unlockedLevels: {
            sentence: 1,
            matching: 1,
            listening: 1,
            spelling: 1,
            falling: 1,
            memory: 1,
            puzzle: 1,
            challenge: 1
          },
          achievements: [],
          settings: {
            sound: true,
            music: true,
            volume: 0.7,
            language: 'th',
            theme: 'light'
          },
          gameHistory: []
        };
        
        await setDoc(doc(db, 'users', userId), newUser);
        
        const createdUser = { id: userId, ...newUser };
        setUser(createdUser);
        
        localStorage.setItem('pandaWordsUserId', userId);
        localStorage.setItem('pandaWordsUserData', JSON.stringify(createdUser));
        
        return { success: true, user: createdUser };
      }
      
    } catch (error) {
      console.error('Error in loginWithName:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ออกจากระบบ
  const logout = useCallback(async () => {
    try {
      await logoutUser();
      // state จะถูกล้างโดยอัตโนมัติจาก onAuthStateChanged
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, []);

  // อัปเดตข้อมูลผู้ใช้
  const updateUserData = async (newData) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        ...newData,
        lastUpdated: new Date().toISOString()
      });
      
      // อัปเดต state
      setUser(prev => ({ ...prev, ...newData }));
      
      // อัปเดต localStorage
      localStorage.setItem('pandaWordsUserData', JSON.stringify({
        ...user,
        ...newData
      }));
      
      return { success: true };
      
    } catch (error) {
      console.error('Error updating user:', error);
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
      return result.success;
    }
    return false;
  };

  // เพิ่มผลการเล่นเกม
  const addGameResult = async (result) => {
    if (!user) return null;
    
    try {
      // บันทึกผลการเล่น
      const gameResult = {
        userId: user.id,
        userName: user.name,
        userIcon: user.icon,
        ...result,
        timestamp: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'games'), gameResult);
      
      // อัปเดตสถิติผู้ใช้
      const gamesPlayed = (user.stats?.gamesPlayed || 0) + 1;
      const totalScore = (user.stats?.totalScore || 0) + (result.score || 0);
      const perfectGames = (user.stats?.perfectGames || 0) + (result.score === 100 ? 1 : 0);
      const averageAccuracy = Math.round(totalScore / gamesPlayed);
      
      // เก็บประวัติการเล่น (เฉพาะ 50 รายการล่าสุด)
      const gameHistory = [gameResult, ...(user.gameHistory || [])].slice(0, 50);
      
      await updateUserData({
        stats: {
          gamesPlayed,
          totalScore,
          perfectGames,
          averageAccuracy,
          totalPlayTime: user.stats?.totalPlayTime || 0
        },
        gameHistory
      });
      
      // ตรวจสอบ Achievement
      await checkAchievements();
      
      return gameResult;
      
    } catch (error) {
      console.error('Error adding game result:', error);
      return null;
    }
  };

  // ตรวจสอบและปลดล็อก Achievement
  const checkAchievements = async () => {
    if (!user) return;
    
    const achievements = [];
    const currentAchievements = user.achievements || [];
    
    // Achievement: เล่นครบ 10 เกม
    if (user.stats?.gamesPlayed >= 10 && !currentAchievements.some(a => a.id === 'games_10')) {
      achievements.push({
        id: 'games_10',
        name: 'นักเล่นตัวยง',
        description: 'เล่นเกมครบ 10 ครั้ง',
        icon: '🎮',
        earnedAt: new Date().toISOString()
      });
    }
    
    // Achievement: ได้คะแนนรวม 1000
    if (user.stats?.totalScore >= 1000 && !currentAchievements.some(a => a.id === 'score_1000')) {
      achievements.push({
        id: 'score_1000',
        name: 'เซียนภาษา',
        description: 'สะสมคะแนนครบ 1000',
        icon: '🏆',
        earnedAt: new Date().toISOString()
      });
    }
    
    // Achievement: ได้คะแนนเต็ม 5 ครั้ง
    if (user.stats?.perfectGames >= 5 && !currentAchievements.some(a => a.id === 'perfect_5')) {
      achievements.push({
        id: 'perfect_5',
        name: 'ไร้ที่ติ',
        description: 'ได้คะแนนเต็ม 5 ครั้ง',
        icon: '💯',
        earnedAt: new Date().toISOString()
      });
    }
    
    if (achievements.length > 0) {
      await updateUserData({
        achievements: [...currentAchievements, ...achievements]
      });
    }
  };

  // อัปเดตการตั้งค่า
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
        spelling: { played: 0, totalScore: 0, bestScore: 0, averageScore: 0 },
        falling: { played: 0, totalScore: 0, bestScore: 0, averageScore: 0 },
        memory: { played: 0, totalScore: 0, bestScore: 0, averageScore: 0 },
        puzzle: { played: 0, totalScore: 0, bestScore: 0, averageScore: 0 },
        challenge: { played: 0, totalScore: 0, bestScore: 0, averageScore: 0 }
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

  // ดึงอันดับผู้ใช้
  const getUserRank = async () => {
    if (!user) return null;
    return await getUserRank(user.id);
  };

  // ดึง leaderboard
  const getLeaderboardData = async (limitCount = 10) => {
    return await getLeaderboard(limitCount);
  };

  // รีเซ็ตความคืบหน้า
  const resetProgress = async () => {
    if (!user) return;
    
    const resetData = {
      stats: {
        totalScore: 0,
        gamesPlayed: 0,
        perfectGames: 0,
        totalPlayTime: 0,
        averageAccuracy: 0
      },
      unlockedLevels: {
        sentence: 1,
        matching: 1,
        listening: 1,
        spelling: 1,
        falling: 1,
        memory: 1,
        puzzle: 1,
        challenge: 1
      },
      achievements: [],
      gameHistory: []
    };
    
    await updateUserData(resetData);
  };

  return (
    <UserContext.Provider value={{
      // State
      user,
      firebaseUser,
      loading,
      error,
      
      // Auth functions
      createUser,
      login,
      loginWithName,
      logout,
      
      // User data functions
      updateUserData,
      unlockLevel,
      
      // Game functions
      addGameResult,
      getGameHistory,
      getGameStats,
      
      // Achievement functions
      checkAchievements,
      
      // Leaderboard functions
      getUserRank,
      getLeaderboardData,
      
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

// Custom hook สำหรับเช็ค achievement
export const useAchievement = (achievementId) => {
  const { user } = useUser();
  return user?.achievements?.some(a => a.id === achievementId) || false;
};
