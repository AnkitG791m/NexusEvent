import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHpBM7wnmEEJwto3W_L7ozKV8kt1ALP2A",
  authDomain: "nexus-event-system.firebaseapp.com",
  projectId: "nexus-event-system",
  storageBucket: "nexus-event-system.firebasestorage.app",
  messagingSenderId: "161971451597",
  appId: "1:161971451597:web:2093263fd9e77319d4db84"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// ── Auth Helpers ────────────────────────────────────────────────

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const logOut = async () => {
  await signOut(auth);
};

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// ── Firestore Helpers ───────────────────────────────────────────

export const saveEntry = async (userId, eventId = 'default', seat = '') => {
  try {
    await addDoc(collection(db, 'entries'), {
      userId, eventId, seat,
      timestamp: serverTimestamp(),
      status: 'checked_in'
    });
  } catch (err) {
    console.error('[Firestore] saveEntry error:', err.message);
  }
};

export const saveFood = async (userId, eventId = 'default') => {
  try {
    await addDoc(collection(db, 'food_collections'), {
      userId, eventId,
      timestamp: serverTimestamp(),
      status: 'collected'
    });
  } catch (err) {
    console.error('[Firestore] saveFood error:', err.message);
  }
};

export const getEntries = async (eventId = 'default') => {
  try {
    const q = query(
      collection(db, 'entries'),
      where('eventId', '==', eventId),
      orderBy('timestamp', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('[Firestore] getEntries error:', err.message);
    return [];
  }
};

export default app;
