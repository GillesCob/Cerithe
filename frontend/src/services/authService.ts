import apiClient from "../lib/axios";

export const register = async (email: string, password: string) => {
  const response = await apiClient.post("/api/auth/register", { email, password });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/api/auth/login", { email, password });
  return response.data;
};

export const me = async () => {
  const response = await apiClient.get("/api/auth/me", {});
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await apiClient.post("/api/auth/refresh");
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post("/api/auth/logout");
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await apiClient.post("/api/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await apiClient.post("/api/auth/reset-password", { token, newPassword });
  return response.data;
};
