import axios from "axios";

// Vite exposes env variables via import.meta.env — only variables prefixed with VITE_ are accessible in the browser
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/*
 * Without config:
 * axios.post('http://localhost:4000/auth/login', { email, password }, { withCredentials: true, ... })
 */

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post("/auth/register", { name, email, password }),

  logout: () => api.post("/auth/logout"),

  me: () => api.get("/auth/me"),
};
