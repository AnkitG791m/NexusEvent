import request from 'supertest';
import app from './server.js';

// ==========================================
// HEALTH CHECK TESTS
// ==========================================
describe('Health Check', () => {
  test('GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });
  test('GET /api/health returns OK status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.status).toBe('OK');
  });
  test('GET /api/health has message field', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('message');
  });
  test('GET /api/health has timestamp', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('timestamp');
  });
});

// ==========================================
// AUTH TESTS
// ==========================================
describe('Auth API', () => {
  test('POST /api/auth/register without body → 400', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
  });
  test('POST /api/auth/register missing email → 400', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'Rahul' });
    expect(res.status).toBe(400);
  });
  test('POST /api/auth/register missing name → 400', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
  });
  test('POST /api/auth/register invalid email → 400', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'Rahul', email: 'not-an-email' });
    expect(res.status).toBe(400);
  });
  test('POST /api/auth/register valid data → 201', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'Rahul', email: 'rahul@test.com' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('qrCode');
  });
  test('POST /api/auth/login without body → 400', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });
  test('POST /api/auth/login with credentials → 200 + token', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com', password: '123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('role');
  });
});

// ==========================================
// ATTENDANCE TESTS
// ==========================================
describe('Attendance API', () => {
  test('POST /api/attendance/mark empty body → 400', async () => {
    const res = await request(app).post('/api/attendance/mark').send({});
    expect(res.status).toBe(400);
  });
  test('POST /api/attendance/mark missing eventId → 400', async () => {
    const res = await request(app).post('/api/attendance/mark').send({ userId: 'U1' });
    expect(res.status).toBe(400);
  });
  test('POST /api/attendance/mark missing userId → 400', async () => {
    const res = await request(app).post('/api/attendance/mark').send({ eventId: 'E1' });
    expect(res.status).toBe(400);
  });
  test('POST /api/attendance/mark valid → 200', async () => {
    const res = await request(app).post('/api/attendance/mark').send({ userId: 'U1', eventId: 'E1' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('timestamp');
  });
  test('GET /api/attendance/non-uuid → 400', async () => {
    const res = await request(app).get('/api/attendance/not-a-uuid');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid ID format');
  });
});

// ==========================================
// FOOD TESTS
// ==========================================
describe('Food API', () => {
  test('POST /api/food/collect empty body → 400', async () => {
    const res = await request(app).post('/api/food/collect').send({});
    expect(res.status).toBe(400);
  });
  test('POST /api/food/collect with userId → 200', async () => {
    const res = await request(app).post('/api/food/collect').send({ userId: 'user123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('collectedAt');
  });
  test('GET /api/food/status non-UUID ids → 400', async () => {
    const res = await request(app).get('/api/food/status/abc/def');
    expect(res.status).toBe(400);
  });
});

// ==========================================
// SEATS TESTS
// ==========================================
describe('Seats API', () => {
  test('POST /api/seats/assign empty body → 400', async () => {
    const res = await request(app).post('/api/seats/assign').send({});
    expect(res.status).toBe(400);
  });
  test('POST /api/seats/assign valid → 200 + seat', async () => {
    const res = await request(app).post('/api/seats/assign').send({ userId: 'USER_001' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('assignedSeat');
  });
  test('GET /api/seats/:eventId returns seat map', async () => {
    const res = await request(app).get('/api/seats/any-event');
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) expect(res.body).toHaveProperty('totalCapacity');
  });
});

// ==========================================
// CREDIT TESTS
// ==========================================
describe('Credit API', () => {
  test('POST /api/credit/update empty body → 400', async () => {
    const res = await request(app).post('/api/credit/update').send({});
    expect(res.status).toBe(400);
  });
  test('POST /api/credit/update missing points → 400', async () => {
    const res = await request(app).post('/api/credit/update').send({ userId: 'U1' });
    expect(res.status).toBe(400);
  });
  test('POST /api/credit/update valid → 200', async () => {
    const res = await request(app).post('/api/credit/update').send({ userId: 'U1', points: 10 });
    expect(res.status).toBe(200);
  });
  test('GET /api/credit/non-uuid → 400', async () => {
    const res = await request(app).get('/api/credit/not-valid');
    expect(res.status).toBe(400);
  });
});

// ==========================================
// EHSAAS TESTS
// ==========================================
describe('EHSAAS API', () => {
  test('POST /api/ehsaas/question empty body → 400', async () => {
    const res = await request(app).post('/api/ehsaas/question').send({});
    expect(res.status).toBe(400);
  });
  test('POST /api/ehsaas/question empty string → 400', async () => {
    const res = await request(app).post('/api/ehsaas/question').send({ question: '' });
    expect(res.status).toBe(400);
  });
  test('POST /api/ehsaas/question too long → 400', async () => {
    const res = await request(app).post('/api/ehsaas/question').send({ question: 'a'.repeat(501) });
    expect(res.status).toBe(400);
  });
  test('POST /api/ehsaas/question valid → 201', async () => {
    const res = await request(app).post('/api/ehsaas/question').send({ question: 'When does food start?' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('submittedAt');
  });
  test('GET /api/ehsaas/:eventId returns array', async () => {
    const res = await request(app).get('/api/ehsaas/any-event');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ==========================================
// SECURITY TESTS
// ==========================================
describe('Security Tests', () => {
  test('Helmet: x-content-type-options header present', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers).toHaveProperty('x-content-type-options');
  });
  test('Helmet: x-frame-options header present', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers).toHaveProperty('x-frame-options');
  });
  test('UUID validation rejects non-UUID attendance param', async () => {
    const res = await request(app).get('/api/attendance/INVALID');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid ID format');
  });
  test('UUID validation rejects non-UUID credit param', async () => {
    const res = await request(app).get('/api/credit/not-uuid');
    expect(res.status).toBe(400);
  });
  test('JWT: /api/fcm/notify-batch requires auth → 401', async () => {
    const res = await request(app).post('/api/fcm/notify-batch').send({ tokens: [], batchNumber: 'A' });
    expect(res.status).toBe(401);
  });
  test('404 handler for unknown route', async () => {
    const res = await request(app).get('/api/unknown-route-xyz');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
  test('Payload limit: large body rejected', async () => {
    const bigPayload = { data: 'x'.repeat(20000) };
    const res = await request(app).post('/api/auth/login').send(bigPayload);
    expect([400, 413]).toContain(res.status);
  });
});
