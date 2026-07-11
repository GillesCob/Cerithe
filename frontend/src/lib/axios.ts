import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { useTokenStore } from "../stores/authStore";
import { refreshAccessToken } from "../services/authService";

interface IRetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Configuration de l'instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Add a request interceptor
apiClient.interceptors.request.use(
  function (config) {
    const { accessToken } = useTokenStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// File d'attente des requêtes en échec pendant qu'un refresh est déjà en cours,
// pour éviter de déclencher plusieurs refresh en parallèle (cf. règle CLAUDE.md).
let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (accessToken: string) => void;
  reject: (error: unknown) => void;
}> = [];

// Add a response interceptor
apiClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    const originalRequest = error.config as IRetryableRequestConfig | undefined;

    const isUnauthorized = error.response?.status === 401;
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");
    if (!isUnauthorized || !originalRequest || originalRequest._retry || isRefreshCall) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({
          resolve: (accessToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    try {
      const { accessToken } = await refreshAccessToken();
      useTokenStore.getState().setAccessToken(accessToken);
      pendingRequests.forEach(({ resolve }) => resolve(accessToken));
      pendingRequests = [];
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      pendingRequests.forEach(({ reject }) => reject(refreshError));
      pendingRequests = [];
      useTokenStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
