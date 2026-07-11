// src/lib/api.ts
//
// Central fetch client for the Go Jamshedpur backend. Every integration
// phase below replaces a hardcoded array (data.ts), localStorage read/write,
// or Firebase/Firestore call with a function from this file.
//
//  - Access token is kept in memory only (never localStorage) to avoid XSS
//    token theft; the refresh token lives in an httpOnly cookie set by the
//    backend and is sent automatically via ⁠ credentials: 'include' ⁠.
//  - A 401 triggers exactly one silent refresh + retry.
//  - Responses are unwrapped from the backend's { success, message, data } envelope.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let accessToken: string | null = null;

function setAccessToken(token: string | null) {
  accessToken = token;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers, credentials: 'include' });

  if (res.status === 401 && retry && path !== '/auth/refresh') {
    try {
      await refreshToken();
      return request<T>(path, options, false);
    } catch {
      // fall through to normal error handling below
    }
  }

  const body: ApiEnvelope<T> = await res.json().catch(() => ({
    success: false,
    message: 'Unexpected server response.',
    data: null as unknown as T,
  }));

  if (!res.ok || !body.success) {
    throw new Error(body.message || 'Request failed.');
  }

  return body.data;
}

async function refreshToken(): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/refresh`, { method: 'POST', credentials: 'include' });
  const body: ApiEnvelope<{ accessToken: string }> = await res.json();
  if (!res.ok || !body.success) throw new Error(body.message);
  setAccessToken(body.data.accessToken);
}

// --- Categories -----------------------------------------------------------

function getCategories() {
  return request<any[]>('/categories');
}

function getQuickServices() {
  return request<{ name: string; icon: string }[]>('/categories/quick-services');
}

// --- Neighborhoods ----------------------------------------------------------

function getNeighborhoods(): Promise<string[]> {
  return request<{ id: string; name: string }[]>('/neighborhoods').then((rows) => rows.map((r) => r.name));
}

function getNeighborhoodZones() {
  return request<any[]>('/neighborhoods/zones');
}

// --- Providers --------------------------------------------------------------

function getProviders(params: { search?: string; neighborhood?: string; category?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.neighborhood) qs.set('neighborhood', params.neighborhood);
  if (params.category) qs.set('category', params.category);
  qs.set('limit', '50');
  return request<any[]>(`/providers?${qs.toString()}`);
}

function sendProviderOtp(phone: string) {
  return request<void>('/providers/register/send-otp', { method: 'POST', body: JSON.stringify({ phone }) });
}

function verifyProviderOtp(phone: string, code: string) {
  return request<void>('/providers/register/verify-otp', { method: 'POST', body: JSON.stringify({ phone, code }) });
}

function completeProviderRegistration(input: {
  name: string;
  phone: string;
  neighborhood: string;
  trade: string;
  experienceYears: number;
  certificationsAgreed: boolean;
}) {
  return request<{ id: string; status: string }>('/providers/register/complete', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// --- Reviews ------------------------------------------------------------------

function getReviews(params: { providerId?: string; highlighted?: boolean } = {}) {
  const qs = new URLSearchParams();
  if (params.providerId) qs.set('providerId', params.providerId);
  if (params.highlighted !== undefined) qs.set('highlighted', String(params.highlighted));
  return request<any[]>(`/reviews?${qs.toString()}`);
}

// --- Auth ---------------------------------------------------------------------

export interface AuthUser {
  name: string;
  email: string;
  phone: string;
  neighborhood: string;
}

function normalizeUser(u: { name: string; email: string; phone: string | null; neighborhood: string | null }): AuthUser {
  return { name: u.name, email: u.email, phone: u.phone ?? '', neighborhood: u.neighborhood ?? '' };
}

async function signup(input: { name: string; email: string; password: string; phone: string; neighborhood?: string }) {
  const data = await request<{ user: any; accessToken: string }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  setAccessToken(data.accessToken);
  return { user: normalizeUser(data.user) };
}

async function login(input: { email: string; password: string }) {
  const data = await request<{ user: any; accessToken: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  setAccessToken(data.accessToken);
  return { user: normalizeUser(data.user) };
}

async function logout() {
  try {
    await request('/auth/logout', { method: 'POST' });
  } finally {
    setAccessToken(null);
  }
}

/** Called once on app load: silently exchanges the httpOnly refresh cookie
 * (if any) for a fresh access token, then fetches the current user. Throws
 * if there is no valid session — callers should catch and stay signed out. */
async function restoreSession() {
  await refreshToken();
  const data = await request<{ user: any }>('/auth/me');
  return { user: normalizeUser(data.user) };
}

// --- Bookings -----------------------------------------------------------------

function createBooking(input: {
  serviceName: string;
  providerId?: string;
  neighborhood: string;
  address: string;
  date: string;
  timeSlot: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  notes?: string;
}) {
  return request<{ bookingId: string }>('/bookings', { method: 'POST', body: JSON.stringify(input) });
}

// --- Support Inquiries (FAQ contact form) --------------------------------------

function submitSupportInquiry(input: { name: string; contact: string; category: string; message: string }) {
  return request<{ id: string }>('/support-inquiries', { method: 'POST', body: JSON.stringify(input) });
}

export const api = {
  getCategories,
  getQuickServices,
  getNeighborhoods,
  getNeighborhoodZones,
  getProviders,
  sendProviderOtp,
  verifyProviderOtp,
  completeProviderRegistration,
  getReviews,
  signup,
  login,
  logout,
  restoreSession,
  createBooking,
  submitSupportInquiry,
};