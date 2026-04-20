import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getPerformance, trace } from 'firebase/performance';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const messaging = getMessaging(app);

// ── FCM Helpers ────────────────────────────────────────────────
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      return token;
    }
  } catch (error) {
    console.error('FCM permission error:', error);
  }
};

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

// Real-time attendance listener
export const listenToAttendance = (eventId, callback) => {
  const attendanceRef = collection(db, 'events', eventId, 'attendance');
  return onSnapshot(attendanceRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

// Save attendance to Firestore
export const markAttendanceFirestore = async (eventId, userId, studentData) => {
  const ref = doc(db, 'events', eventId, 'attendance', userId);
  await setDoc(ref, {
    ...studentData,
    markedAt: new Date().toISOString(),
    status: 'present'
  });
};

// Real-time attendance counter
export const listenToLiveAttendance = (eventId, callback) => {
  const q = query(
    collection(db, 'events', eventId, 'attendance'),
    orderBy('markedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    callback({
      count: snapshot.size,
      latest: snapshot.docs.slice(0, 5).map(d => d.data())
    });
  });
};

// Save food batch notification to Firestore
export const saveFoodBatchToFirestore = async (eventId, batchData) => {
  const ref = doc(db, 'events', eventId, 'foodBatches', `batch_${batchData.number}`);
  await setDoc(ref, {
    ...batchData,
    createdAt: serverTimestamp()
  });
};

// Real-time food batch listener for students
export const listenToFoodBatch = (eventId, callback) => {
  return onSnapshot(
    collection(db, 'events', eventId, 'foodBatches'),
    (snapshot) => callback(snapshot.docs.map(d => d.data()))
  );
};

// ── Performance Monitoring ──────────────────────────────────────
export const perf = getPerformance(app);

// Track QR scan performance
export const trackQRScan = async (fn) => {
  const t = trace(perf, 'qr_scan_time');
  t.start();
  const result = await fn();
  t.stop();
  return result;
};

// ── Remote Config ───────────────────────────────────────────────
export const remoteConfig = getRemoteConfig(app);
remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

remoteConfig.defaultConfig = {
  food_batch_size: 10,
  registration_open: true,
  max_seat_capacity: 500,
  credit_attend_bonus: 10,
  credit_noshow_penalty: 10
};

export const getRemoteValue = async (key) => {
  try {
    await fetchAndActivate(remoteConfig);
    return getValue(remoteConfig, key).asString();
  } catch (e) {
    return remoteConfig.defaultConfig[key];
  }
};

export default app;
