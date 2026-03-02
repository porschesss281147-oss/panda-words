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

// Authentication functions
const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const logoutUser = () => {
  return signOut(auth);
};

const updateUserProfile = (user, profileData) => {
  return updateProfile(user, profileData);
};

// Firestore functions
const createUserDocument = async (userId, userData) => {
  const userRef = doc(db, 'users', userId);
  return setDoc(userRef, {
    ...userData,
    createdAt: new Date().toISOString(),
    gamesPlayed: 0,
    totalScore: 0,
    challengesCompleted: 0,
    unlockedLevels: {
      memory: 1,
      matching: 1,
      spelling: 1,
      listening: 1
    }
  });
};

const getUserDocument = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
};

const updateUserDocument = async (userId, data) => {
  const userRef = doc(db, 'users', userId);
  return updateDoc(userRef, data);
};

const addGameResult = async (userId, gameData) => {
  const gamesRef = collection(db, 'games');
  return addDoc(gamesRef, {
    userId,
    ...gameData,
    timestamp: new Date().toISOString()
  });
};

const getUserGames = async (userId) => {
  const gamesRef = collection(db, 'games');
  const q = query(gamesRef, where('userId', '==', userId), orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Challenge functions
const createChallengeDocument = async (userId, challengeData) => {
  const challengeRef = doc(db, 'challenges', userId);
  return setDoc(challengeRef, {
    ...challengeData,
    completedAt: new Date().toISOString()
  }, { merge: true });
};

const getChallengeDocument = async (userId) => {
  const challengeRef = doc(db, 'challenges', userId);
  const challengeSnap = await getDoc(challengeRef);
  return challengeSnap.exists() ? { id: challengeSnap.id, ...challengeSnap.data() } : null;
};

// Leaderboard functions
const getLeaderboard = async (limitCount = 10) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('totalScore', 'desc'), limit(limitCount));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getUserRank = async (userId) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('totalScore', 'desc'));
  const querySnapshot = await getDocs(q);
  const users = querySnapshot.docs.map(doc => doc.id);
  const rank = users.indexOf(userId) + 1;
  return rank > 0 ? rank : null;
};

// Export everything
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
  
  // Game functions
  addGameResult,
  getUserGames,
  
  // Challenge functions
  createChallengeDocument,
  getChallengeDocument,
  
  // Leaderboard functions
  getLeaderboard,
  getUserRank
};