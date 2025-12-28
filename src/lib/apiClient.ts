//http://localhost:5068/api

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { type ApiErrorResponse } from './ApiErrorResponse';

const baseURL = 'http://localhost:5068/api'; // Adjust for your API

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: ((token: string) => void)[] = [];

const processQueue = (token: string | null = null) => {
  failedQueue.forEach((cb) => cb(token!));
  failedQueue = [];
};

// Request interceptor: attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');

    const urlPath = config.url?.replace(config.baseURL ?? "", "").toLowerCase();

    // Endpoints to bypass
    const bypassEndpoints = [
      "/auth/login",
      "/users/register",
      "/auth/refresh",
      "/auth/confirm-email"
    ];

    if (token && urlPath && !bypassEndpoints.some((ep) => urlPath.includes(ep))) {
      // Ensure headers exist
      config.headers = config.headers ?? {};
      config.headers['Authorization'] = token ? `Bearer ${token}` : '';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {

    if (!error.response) {
      // Network error (CORS, server down, wrong URL)
      return Promise.reject(error);
    }

    const data = error.response?.data as ApiErrorResponse | undefined;
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry && data?.error === 'token_expired') {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          failedQueue.push((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await apiClient.post('/auth/refresh', { refreshToken });

        const newAccessToken = response.data.token;
        const newRefreshToken = response.data.refreshToken;

        localStorage.setItem('token', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        processQueue(newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (err) {
        processQueue(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    let message = "Unexpected error occurred";

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.error ?? message;
    }

    return Promise.reject({ ...error, userMessage: message });
  }
);

//export default axiosInstance;
export default apiClient;