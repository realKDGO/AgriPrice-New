import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  timeout: 15000,
});

let accessToken = sessionStorage.getItem("agriprice_admin_access_token");

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export function clearAccessToken() {
  accessToken = null;
  sessionStorage.removeItem("agriprice_admin_access_token");
}

export async function login(email, password, rememberMe = false) {
  const response = await api.post("/auth/login", {
    email,
    password,
    rememberMe,
  });
  const data = response.data.data;

  if (data.user?.role !== "ADMIN") {
    await logout().catch(() => {});
    const error = new Error("This account does not belong to the Admin portal.");
    error.response = {
      status: 403,
      data: {
        message:
          "This account belongs to a different AgriPrice portal. Use the correct portal to sign in.",
      },
    };
    throw error;
  }

  accessToken = data.accessToken;
  sessionStorage.setItem("agriprice_admin_access_token", accessToken);
  return data.user;
}

export async function restore() {
  const response = await api.post("/auth/refresh", {});
  const data = response.data.data;

  if (data.user?.role !== "ADMIN") {
    await logout().catch(() => {});
    clearAccessToken();
    return null;
  }

  accessToken = data.accessToken;
  sessionStorage.setItem("agriprice_admin_access_token", accessToken);
  return data.user;
}

export async function logout() {
  try {
    await api.post("/auth/logout", {});
  } finally {
    clearAccessToken();
  }
}
