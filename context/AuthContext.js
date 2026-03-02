'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  db,
  doc,
  getDoc,
  setDoc
} from '@/lib/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // ดึงข้อมูลเพิ่มเติมจาก Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          // สร้างข้อมูลเริ่มต้นสำหรับผู้ใช้ใหม่
          const newUserData = {
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            icon: '😊',
            createdAt: new Date().toISOString(),
            unlockedLevels: {
              memory: 1,
              matching: 1,
              spelling: 1,
              listening: 1
            },
            totalScore: 0,
            gamesPlayed: 0
          };
          
          await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
          setUserData(newUserData);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const updateUserData = async (newData) => {
    if (!user) return;
    
    const updatedData = { ...userData, ...newData };
    await setDoc(doc(db, 'users', user.uid), updatedData);
    setUserData(updatedData);
  };

  const unlockLevel = async (gameId, level) => {
    if (!user || !userData) return;
    
    const currentUnlocked = userData.unlockedLevels[gameId] || 1;
    if (level > currentUnlocked) {
      const updatedLevels = {
        ...userData.unlockedLevels,
        [gameId]: level
      };
      await updateUserData({ unlockedLevels: updatedLevels });
    }
  };

  const addGameResult = async (result) => {
    if (!user) return;
    
    // บันทึกผลการเล่น
    const gameResult = {
      userId: user.uid,
      gameId: result.gameId,
      level: result.level,
      score: result.score,
      moves: result.moves,
      learnedWords: result.learnedWords,
      timestamp: new Date().toISOString()
    };
    
    // อัพเดทสถิติผู้ใช้
    await updateUserData({
      totalScore: (userData?.totalScore || 0) + result.score,
      gamesPlayed: (userData?.gamesPlayed || 0) + 1
    });
    
    return gameResult;
  };

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      signOut,
      updateUserData,
      unlockLevel,
      addGameResult
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);