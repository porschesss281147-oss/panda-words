// lib/firebase.js
import { initializeApp, getApps } from 'firebase/app';
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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA79vLXSKYt8z_IeqB1yodK2aE7XFsf68G8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gamechinese-a2bbf.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gamechinese-a2bbf",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gamechinese-a2bbf.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "420586375989",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:420586375989:web:7c8f8d922daee060b165a7c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-R5FMML73X8"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
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
  return setDoc(userRef, userData);
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
