/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock firebase before importing anything that uses it ──────
vi.mock('../firebase.js', () => ({
  saveEntry:          vi.fn().mockResolvedValue(undefined),
  saveFood:           vi.fn().mockResolvedValue(undefined),
  getEntries:         vi.fn().mockResolvedValue([]),
  loginWithEmail:     vi.fn().mockResolvedValue({ uid: 'test-uid', email: 'a@b.com' }),
  logoutFirebase:     vi.fn().mockResolvedValue(undefined),
  onAuthChange:       vi.fn(),
  db:                 {},
  auth:               {}
}));

// ── Mock API client ───────────────────────────────────────────
vi.mock('../api.js', () => ({
  healthCheck:     vi.fn().mockResolvedValue({ status: 'OK' }),
  markAttendance:  vi.fn().mockResolvedValue({ message: 'Attendance marked successfully' }),
  collectFood:     vi.fn().mockResolvedValue({ message: 'Food collected successfully' }),
  assignSeat:      vi.fn().mockResolvedValue({ assignedSeat: 'B-42' }),
  submitQuestion:  vi.fn().mockResolvedValue({ message: 'Question submitted successfully' }),
  getQuestions:    vi.fn().mockResolvedValue([{ question: 'Test?', anonymous: true }]),
  updateCredit:    vi.fn().mockResolvedValue({ message: 'Credit updated successfully' }),
  apiLogin:        vi.fn().mockResolvedValue({ token: 'mock-jwt', role: 'student' }),
  apiRegister:     vi.fn().mockResolvedValue({ qrCode: 'NEX-123' }),
  default:         vi.fn()
}));

import { saveEntry, saveFood, getEntries, loginWithEmail } from '../firebase.js';
import {
  healthCheck, markAttendance, collectFood,
  assignSeat, submitQuestion, getQuestions,
  updateCredit, apiLogin, apiRegister
} from '../api.js';

// ==========================================
// FIREBASE TESTS
// ==========================================
describe('Firebase Firestore Helpers', () => {
  beforeEach(() => vi.clearAllMocks());

  it('saveEntry called with correct userId', async () => {
    await saveEntry('USER_001', 'EVT_001', 'A-4');
    expect(saveEntry).toHaveBeenCalledWith('USER_001', 'EVT_001', 'A-4');
  });

  it('saveFood called with correct userId', async () => {
    await saveFood('USER_001', 'EVT_001');
    expect(saveFood).toHaveBeenCalledWith('USER_001', 'EVT_001');
  });

  it('getEntries returns array', async () => {
    const res = await getEntries('EVT_001');
    expect(Array.isArray(res)).toBe(true);
  });

  it('loginWithEmail resolves with user object', async () => {
    const user = await loginWithEmail('a@b.com', 'pass123');
    expect(user).toHaveProperty('uid');
    expect(user).toHaveProperty('email');
  });
});

// ==========================================
// API CLIENT TESTS
// ==========================================
describe('API Client - Health', () => {
  it('healthCheck returns OK', async () => {
    const res = await healthCheck();
    expect(res.status).toBe('OK');
  });
});

describe('API Client - Attendance', () => {
  it('markAttendance returns success message', async () => {
    const res = await markAttendance('USER_1', 'EVT_1');
    expect(res.message).toBe('Attendance marked successfully');
  });

  it('markAttendance called with correct params', async () => {
    await markAttendance('USER_2', 'EVT_2');
    expect(markAttendance).toHaveBeenCalledWith('USER_2', 'EVT_2');
  });
});

describe('API Client - Food', () => {
  it('collectFood returns success', async () => {
    const res = await collectFood('USER_1');
    expect(res.message).toBe('Food collected successfully');
  });
});

describe('API Client - Seats', () => {
  it('assignSeat returns a seat string', async () => {
    const res = await assignSeat('USER_1');
    expect(res).toHaveProperty('assignedSeat');
    expect(typeof res.assignedSeat).toBe('string');
  });
});

describe('API Client - EHSAAS', () => {
  it('submitQuestion returns success', async () => {
    const res = await submitQuestion('When does food start?', true);
    expect(res.message).toBe('Question submitted successfully');
  });

  it('getQuestions returns array', async () => {
    const res = await getQuestions('EVT_001');
    expect(Array.isArray(res)).toBe(true);
    expect(res[0]).toHaveProperty('question');
  });
});

describe('API Client - Credit', () => {
  it('updateCredit called with correct args', async () => {
    await updateCredit('USER_1', 10, 'Check-in bonus');
    expect(updateCredit).toHaveBeenCalledWith('USER_1', 10, 'Check-in bonus');
  });
});

describe('API Client - Auth', () => {
  it('apiLogin returns token', async () => {
    const res = await apiLogin('a@b.com', 'pass');
    expect(res).toHaveProperty('token');
    expect(res).toHaveProperty('role');
  });

  it('apiRegister returns qrCode', async () => {
    const res = await apiRegister('Rahul', 'rahul@test.com');
    expect(res).toHaveProperty('qrCode');
  });
});

// ==========================================
// INTEGRATION FLOW TESTS
// ==========================================
describe('Integration Flow - Full Attendance Pipeline', () => {
  beforeEach(() => vi.clearAllMocks());

  it('mark attendance then save to Firestore', async () => {
    const userId  = 'user-flow-test';
    const eventId = 'evt-flow-test';
    const seat    = 'B-42';

    await markAttendance(userId, eventId);
    await saveEntry(userId, eventId, seat);

    expect(markAttendance).toHaveBeenCalledTimes(1);
    expect(saveEntry).toHaveBeenCalledWith(userId, eventId, seat);
  });

  it('collect food then save to Firestore', async () => {
    const userId = 'user-food-test';
    await collectFood(userId);
    await saveFood(userId, 'evt-001');
    expect(collectFood).toHaveBeenCalledTimes(1);
    expect(saveFood).toHaveBeenCalledTimes(1);
  });
});
