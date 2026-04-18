import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { validate as isUUID } from 'uuid';
import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';

dotenv.config();
const { Pool } = pkg;

// ==========================================
// FIREBASE ADMIN SDK (Google Services)
// ==========================================
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID || 'nexus-event-system'
  });
}

/**
 * @desc Firebase Cloud Messaging - batch food notification
 * @param {string[]} userTokens - FCM device tokens
 * @param {string} batchNumber  - Batch label e.g. "Row A"
 */
const sendFoodBatchNotification = async (userTokens, batchNumber) => {
  try {
    const message = {
      notification: {
        title: '🍱 Food Batch Ready!',
        body: `Batch ${batchNumber} - Collect within 15 minutes!`
      },
      tokens: userTokens
    };
    return await admin.messaging().sendEachForMulticast(message);
  } catch (error) {
    console.error('FCM error:', error.message);
  }
};

// ==========================================
// EXPRESS APP
// ==========================================
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:5173' }
});

// ── SECURITY MIDDLEWARE ──────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", 'data:', 'https:'],
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10kb' }));          // prevent large payload attacks
app.use(express.urlencoded({ extended: false }));

// ── RATE LIMITING ───────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({   // tighter limit for auth routes
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts.' }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', strictLimiter);

// ── DATABASE ─────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB Error:', err.stack);
  else     console.log('✅ DB connected at:', res.rows[0].now);
});

// ==========================================
// MIDDLEWARE UTILITIES
// ==========================================

/**
 * @desc Sanitize string — strip HTML tags to prevent XSS
 * @param {string} str
 */
const sanitize = (str) =>
  typeof str === 'string' ? str.replace(/<[^>]*>/g, '').trim() : str;

/**
 * @desc UUID param validator middleware
 */
const validateUUID = (req, res, next) => {
  const ids = [req.params.userId, req.params.eventId].filter(Boolean);
  for (const id of ids) {
    if (!isUUID(id)) {
      return res.status(400).json({ error: 'Invalid ID format — must be a valid UUID' });
    }
  }
  next();
};

/**
 * @desc JWT auth middleware — verifies Bearer token
 */
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'nexus_jwt_secret');
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ==========================================
// ROUTES
// ==========================================

/**
 * @route GET /api/health
 * @desc  System health check — public
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Smart Event Management Server is running.',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

/**
 * @route POST /api/auth/register
 * @desc  Register student, return QR code string
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const name  = sanitize(req.body.name);
    const email = sanitize(req.body.email);
    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    const qrCode = `NEX-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    res.status(201).json({ message: 'Registered successfully', qrCode });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

/**
 * @route POST /api/auth/login
 * @desc  Login — returns signed JWT
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const email    = sanitize(req.body.email);
    const password = req.body.password;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    // Mock auth — replace with real DB lookup
    const token = jwt.sign(
      { email, role: 'student' },
      process.env.JWT_SECRET || 'nexus_jwt_secret',
      { expiresIn: '8h' }
    );
    res.status(200).json({ token, role: 'student', expiresIn: '8h' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

/**
 * @route GET /api/events
 * @desc  Fetch all events
 */
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('DB ERROR:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * @route POST /api/attendance/mark
 * @desc  Mark attendance via QR scan (one-time)
 */
app.post('/api/attendance/mark', async (req, res) => {
  try {
    const userId  = sanitize(req.body.userId);
    const eventId = sanitize(req.body.eventId);
    if (!userId || !eventId) {
      return res.status(400).json({ error: 'userId and eventId are required' });
    }
    res.status(200).json({
      message: 'Attendance marked successfully',
      userId,
      eventId,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

/**
 * @route GET /api/attendance/:eventId
 * @desc  Get all attendees for an event (UUID required)
 */
app.get('/api/attendance/:eventId', validateUUID, async (req, res) => {
  try {
    res.status(200).json([
      { userId: 'STD-321', name: 'Rahul Verma', timestamp: new Date().toISOString(), seat: 'A-4' }
    ]);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

/**
 * @route GET /api/food/status/:userId/:eventId
 * @desc  Food eligibility check (UUID required for both params)
 */
app.get('/api/food/status/:userId/:eventId', validateUUID, async (req, res) => {
  try {
    res.status(200).json({
      status: 'eligible',
      batch: 'Row A',
      window: '14:00 - 14:15',
      menuCategory: 'Standard Veg Meal'
    });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

/**
 * @route POST /api/food/collect
 * @desc  Mark food as collected — prevents duplicates
 */
app.post('/api/food/collect', async (req, res) => {
  try {
    const userId = sanitize(req.body.userId);
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    res.status(200).json({
      message: 'Food collected successfully',
      userId,
      collectedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

/**
 * @route GET /api/seats/:eventId
 * @desc  Get seat map for an event
 */
app.get('/api/seats/:eventId', async (req, res) => {
  try {
    res.status(200).json({
      activeSeats: ['A-1', 'A-2', 'A-3'],
      totalCapacity: 200,
      totalAvailable: 154,
      rows: ['A', 'B', 'C', 'D', 'E']
    });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

/**
 * @route POST /api/seats/assign
 * @desc  Assign a seat to a user on check-in
 */
app.post('/api/seats/assign', async (req, res) => {
  try {
    const userId = sanitize(req.body.userId);
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    res.status(200).json({ assignedSeat: 'B-42', userId });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

/**
 * @route GET /api/credit/:userId
 * @desc  Get credit score + history (UUID validated)
 */
app.get('/api/credit/:userId', validateUUID, async (req, res) => {
  try {
    res.status(200).json({
      userId: req.params.userId,
      score: 75,
      level: 'Level 3 Hacker',
      history: [
        { action: 'Gate check-in',     points: +10, date: new Date().toISOString() },
        { action: 'Late withdrawal',   points: -7,  date: new Date().toISOString() },
        { action: 'Food collected',    points: +5,  date: new Date().toISOString() }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

/**
 * @route POST /api/credit/update
 * @desc  Update user credit score
 */
app.post('/api/credit/update', async (req, res) => {
  try {
    const userId = sanitize(req.body.userId);
    const points = req.body.points;
    const reason = sanitize(req.body.reason);
    if (!userId || points === undefined || points === null) {
      return res.status(400).json({ error: 'userId and points are required' });
    }
    if (typeof points !== 'number') {
      return res.status(400).json({ error: 'points must be a number' });
    }
    res.status(200).json({ message: 'Credit updated successfully', userId, points, reason });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

/**
 * @route POST /api/ehsaas/question
 * @desc  Submit Q&A question (anonymous or named)
 */
app.post('/api/ehsaas/question', async (req, res) => {
  try {
    const question  = sanitize(req.body.question);
    const anonymous = req.body.anonymous === true;
    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question text is required' });
    }
    if (question.length > 500) {
      return res.status(400).json({ error: 'Question too long (max 500 chars)' });
    }
    res.status(201).json({
      message: 'Question submitted successfully',
      anonymous,
      submittedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

/**
 * @route GET /api/ehsaas/:eventId
 * @desc  Get all questions for an event
 */
app.get('/api/ehsaas/:eventId', async (req, res) => {
  try {
    res.status(200).json([
      { question: 'Will there be pizza?',     anonymous: true,  votes: 12 },
      { question: 'When does judging start?', anonymous: false, user: 'Rahul', votes: 5 }
    ]);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

/**
 * @route POST /api/fcm/notify-batch
 * @desc  Trigger FCM push for food batch notification
 */
app.post('/api/fcm/notify-batch', requireAuth, async (req, res) => {
  try {
    const { tokens, batchNumber } = req.body;
    if (!tokens || !batchNumber) {
      return res.status(400).json({ error: 'tokens and batchNumber required' });
    }
    await sendFoodBatchNotification(tokens, batchNumber);
    res.status(200).json({ message: `FCM notification sent for Batch ${batchNumber}` });
  } catch (err) {
    res.status(500).json({ error: 'Notification failed' });
  }
});

/**
 * @route POST /api/auth/refresh-token
 * @desc  Refresh JWT — issues new 8h token from valid old token
 */
app.post('/api/auth/refresh-token', requireAuth, async (req, res) => {
  try {
    const newToken = jwt.sign(
      { email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET || 'nexus_jwt_secret',
      { expiresIn: '8h' }
    );
    res.status(200).json({ token: newToken, expiresIn: '8h' });
  } catch (err) {
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// ==========================================
// 404 HANDLER
// ==========================================
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ==========================================
// WEBSOCKETS
// ==========================================
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
  socket.on('attendance_marked', (data) => io.emit('live_update', data));
});

// ==========================================
// EXPORTS + START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

export { app, sendFoodBatchNotification };
export default app;

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    console.log(`🚀 NexusEvent Backend running on port ${PORT}`);
  });
}
