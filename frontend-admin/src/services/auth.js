import api from './api';

const ACCESS_TOKEN_KEY = 'agriprice_access_token';
const USER_KEY = 'agriprice_admin_user';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function loginAdmin(email, password, rememberMe = false) {
  const response = await api.post('/auth/login', { email, password, rememberMe }, { withCredentials: true });
  const payload = response.data?.data ?? response.data;
  const user = payload?.user;
  const accessToken = payload?.accessToken;
  if (!user || user.role !== 'ADMIN' || user.status !== 'ACTIVE' || !accessToken) {
    throw new Error('This account does not have access to the Admin portal.');
  }
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function logoutAdmin() {
  try { await api.post('/auth/logout', {}, { withCredentials: true }); } catch {}
  clearAuth();
}
