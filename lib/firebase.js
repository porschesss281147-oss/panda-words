// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA79vLXSKYt8z_IeqB1yodK2aE7XFsf68G8",
  authDomain: "gamechinese-a2bbf.firebaseapp.com",
  projectId: "gamechinese-a2bbf",
  storageBucket: "gamechinese-a2bbf.firebasestorage.app",
  messagingSenderId: "420586375989",
  appId: "1:420586375989:web:7c8f8d922daee060b165a7c",
  measurementId: "G-R5FMML73X8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==================== AUTHENTICATION FUNCTIONS ====================

/**
 * ลงทะเบียนผู้ใช้ใหม่
 */
const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * เข้าสู่ระบบ
 */
const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * ออกจากระบบ
 */
const logoutUser = () => {
  return signOut(auth);
};

/**
 * อัพเดทโปรไฟล์ผู้ใช้
 */
const updateUserProfile = (user, profileData) => {
  return updateProfile(user, profileData);
};

// ==================== USER DOCUMENT FUNCTIONS ====================

/**
 * สร้างเอกสารผู้ใช้ใน Firestore (เมื่อสมัครสมาชิก)
 */
const createUserDocument = async (userId, userData) => {
  const userRef = doc(db, 'users', userId);
  return setDoc(userRef, {
    // ข้อมูลพื้นฐาน
    name: userData.name || '',
    email: userData.email || '',
    icon: userData.icon || '🐼',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    
    // สถิติการเล่น
    gamesPlayed: 0,
    totalScore: 0, // คะแนนเฉลี่ย (ใช้จัดอันดับ)
    challengesCompleted: 0,
    perfectGames: 0,
    totalPlayTime: 0,
    
    // ✅ คะแนนล่าสุดของแต่ละเกม
    latestScores: {
      sentence: 0,
      matching: 0,
      listening: 0,
      spelling: 0
    },
    
    // ✅ ด่านที่ปลดล็อกแล้ว
    unlockedLevels: {
      sentence: 1,
      matching: 1,
      listening: 1,
      spelling: 1
    },
    
    // ✅ ประวัติการเล่นล่าสุด (เก็บแค่ 50 รายการ)
    gameResults: [],
    
    // ✅ สถิติแยกตามเกม
    gameStats: {
      sentence: { 
        played: 0, 
        totalScore: 0, 
        bestScore: 0, 
        totalCorrect: 0, 
        totalQuestions: 0,
        averageScore: 0 
      },
      matching: { 
        played: 0, 
        totalScore: 0, 
        bestScore: 0, 
        totalCorrect: 0, 
        totalQuestions: 0,
        averageScore: 0 
      },
      listening: { 
        played: 0, 
        totalScore: 0, 
        bestScore: 0, 
        totalCorrect: 0, 
        totalQuestions: 0,
        averageScore: 0 
      },
      spelling: { 
        played: 0, 
        totalScore: 0, 
        bestScore: 0, 
        totalCorrect: 0, 
        totalQuestions: 0,
        averageScore: 0 
      }
    },
    
    // ความสำเร็จ
    achievements: [],
    
    // การตั้งค่า
    settings: {
      sound: true,
      music: true,
      language: 'th'
    }
  });
};

/**
 * ดึงข้อมูลผู้ใช้จาก Firestore
 */
const getUserDocument = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
};

/**
 * อัพเดทข้อมูลผู้ใช้
 */
const updateUserDocument = async (userId, data) => {
  const userRef = doc(db, 'users', userId);
  return updateDoc(userRef, {
    ...data,
    lastUpdated: new Date().toISOString()
  });
};

/**
 * ลบบัญชีผู้ใช้ (กรณีต้องการ)
 */
const deleteUserDocument = async (userId) => {
  const userRef = doc(db, 'users', userId);
  return deleteDoc(userRef);
};

// ==================== GAME RESULTS FUNCTIONS ====================

/**
 * บันทึกผลการเล่นเกม
 */
const addGameResult = async (userId, gameData) => {
  const gamesRef = collection(db, 'games');
  return addDoc(gamesRef, {
    userId,
    ...gameData,
    timestamp: new Date().toISOString(),
    date: new Date().toISOString()
  });
};

/**
 * ดึงประวัติการเล่นเกมทั้งหมดของผู้ใช้
 */
const getUserGames = async (userId, limitCount = 50) => {
  const gamesRef = collection(db, 'games');
  const q = query(
    gamesRef, 
    where('userId', '==', userId), 
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * ดึงประวัติการเล่นเกมแยกตามประเภทเกม
 */
const getUserGamesByGameId = async (userId, gameId, limitCount = 20) => {
  const gamesRef = collection(db, 'games');
  const q = query(
    gamesRef, 
    where('userId', '==', userId),
    where('gameId', '==', gameId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ==================== GAME STATISTICS FUNCTIONS ====================

/**
 * คำนวณสถิติแยกตามเกม
 */
const getUserGameStats = async (userId) => {
  const gamesRef = collection(db, 'games');
  const q = query(gamesRef, where('userId', '==', userId));
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
};

/**
 * ดึงคะแนนล่าสุดของแต่ละเกม
 */
const getLatestScores = async (userId) => {
  const games = await getUserGames(userId, 100);
  const scores = {};
  
  games.forEach(game => {
    if (!scores[game.gameId]) {
      scores[game.gameId] = game.score;
    }
  });
  
  return scores;
};

// ==================== LEADERBOARD FUNCTIONS ====================

/**
 * ดึงอันดับผู้เล่นทั้งหมด (เรียงตามคะแนนเฉลี่ย)
 */
const getLeaderboard = async (limitCount = 10) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('totalScore', 'desc'), limit(limitCount));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ 
    id: doc.id, 
    name: doc.data().name,
    icon: doc.data().icon,
    totalScore: doc.data().totalScore,
    gamesPlayed: doc.data().gamesPlayed,
    challengesCompleted: doc.data().challengesCompleted
  }));
};

/**
 * หาอันดับของผู้ใช้
 */
const getUserRank = async (userId) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('totalScore', 'desc'));
  const querySnapshot = await getDocs(q);
  const users = querySnapshot.docs.map(doc => doc.id);
  const rank = users.indexOf(userId) + 1;
  return rank > 0 ? rank : null;
};

/**
 * ดึงผู้ใช้ที่มีคะแนนสูงสุด (Top N)
 */
const getTopPlayers = async (count = 3) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('totalScore', 'desc'), limit(count));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ 
    id: doc.id, 
    name: doc.data().name,
    icon: doc.data().icon,
    totalScore: doc.data().totalScore
  }));
};

// ==================== CHALLENGE FUNCTIONS ====================

/**
 * สร้างหรืออัพเดทความท้าทาย
 */
const createChallengeDocument = async (userId, challengeData) => {
  const challengeRef = doc(db, 'challenges', userId);
  return setDoc(challengeRef, {
    ...challengeData,
    completedAt: new Date().toISOString()
  }, { merge: true });
};

/**
 * ดึงข้อมูลความท้าทาย
 */
const getChallengeDocument = async (userId) => {
  const challengeRef = doc(db, 'challenges', userId);
  const challengeSnap = await getDoc(challengeRef);
  return challengeSnap.exists() ? { id: challengeSnap.id, ...challengeSnap.data() } : null;
};

// ==================== ACHIEVEMENT FUNCTIONS ====================

/**
 * เพิ่มความสำเร็จให้ผู้ใช้
 */
const addAchievement = async (userId, achievement) => {
  const userRef = doc(db, 'users', userId);
  return updateDoc(userRef, {
    achievements: arrayUnion({
      ...achievement,
      earnedAt: new Date().toISOString()
    })
  });
};

/**
 * ตรวจสอบว่ามีความสำเร็จนี้หรือยัง
 */
const hasAchievement = async (userId, achievementId) => {
  const user = await getUserDocument(userId);
  return user?.achievements?.some(a => a.id === achievementId) || false;
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * รีเซ็ตความคืบหน้าของผู้ใช้
 */
const resetUserProgress = async (userId) => {
  const userRef = doc(db, 'users', userId);
  return updateDoc(userRef, {
    unlockedLevels: {
      sentence: 1,
      matching: 1,
      listening: 1,
      spelling: 1
    },
    latestScores: {
      sentence: 0,
      matching: 0,
      listening: 0,
      spelling: 0
    },
    totalScore: 0,
    gamesPlayed: 0,
    challengesCompleted: 0,
    perfectGames: 0,
    achievements: [],
    gameResults: [],
    gameStats: {
      sentence: { played: 0, totalScore: 0, bestScore: 0, totalCorrect: 0, totalQuestions: 0, averageScore: 0 },
      matching: { played: 0, totalScore: 0, bestScore: 0, totalCorrect: 0, totalQuestions: 0, averageScore: 0 },
      listening: { played: 0, totalScore: 0, bestScore: 0, totalCorrect: 0, totalQuestions: 0, averageScore: 0 },
      spelling: { played: 0, totalScore: 0, bestScore: 0, totalCorrect: 0, totalQuestions: 0, averageScore: 0 }
    }
  });
};

// ==================== EXPORTS ====================

export { 
  // App
  app,
  
  // Auth
  auth,
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  
  // Firestore
  db,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  increment,
  arrayUnion,
  arrayRemove,
  
  // User functions
  createUserDocument,
  getUserDocument,
  updateUserDocument,
  deleteUserDocument,
  resetUserProgress,
  
  // Game functions
  addGameResult,
  getUserGames,
  getUserGamesByGameId,
  
  // Game statistics
  getUserGameStats,
  getLatestScores,
  
  // Leaderboard functions
  getLeaderboard,
  getUserRank,
  getTopPlayers,
  
  // Challenge functions
  createChallengeDocument,
  getChallengeDocument,
  
  // Achievement functions
  addAchievement,
  hasAchievement
};
