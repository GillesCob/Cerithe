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
