/**
 * NexusEvent API client
 * Centralised fetch wrapper for all backend API calls.
 * Automatically attaches JWT token from localStorage.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'https://nexus-backend-497443612455.asia-south1.run.app';

/**
 * Generic authenticated fetch helper
 * @param {string} path   - API path e.g. '/api/health'
 * @param {object} options - Additional fetch options
 */
const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('nexus_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
};

// ── Auth ────────────────────────────────────────────────────────
export const apiLogin    = (email, password)   => apiFetch('/api/auth/login',    { method: 'POST', body: JSON.stringify({ email, password }) });
export const apiRegister = (name, email)       => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email }) });

// ── Events ──────────────────────────────────────────────────────
export const getEvents   = ()                  => apiFetch('/api/events');

// ── Attendance ──────────────────────────────────────────────────
export const markAttendance = (userId, eventId) =>
  apiFetch('/api/attendance/mark', { method: 'POST', body: JSON.stringify({ userId, eventId }) });

// ── Food ────────────────────────────────────────────────────────
export const collectFood = (userId)            => apiFetch('/api/food/collect', { method: 'POST', body: JSON.stringify({ userId }) });

// ── Seats ───────────────────────────────────────────────────────
export const assignSeat  = (userId)            => apiFetch('/api/seats/assign', { method: 'POST', body: JSON.stringify({ userId }) });

// ── Credit ──────────────────────────────────────────────────────
export const updateCredit = (userId, points, reason) =>
  apiFetch('/api/credit/update', { method: 'POST', body: JSON.stringify({ userId, points, reason }) });

// ── EHSAAS ──────────────────────────────────────────────────────
export const submitQuestion = (question, anonymous = false) =>
  apiFetch('/api/ehsaas/question', { method: 'POST', body: JSON.stringify({ question, anonymous }) });

export const getQuestions = (eventId) => apiFetch(`/api/ehsaas/${eventId}`);

// ── Health ──────────────────────────────────────────────────────
export const healthCheck = () => apiFetch('/api/health');

export default apiFetch;
