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

    // Ensure headers exist
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = token ? `Bearer ${token}` : '';

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
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
        const response = await axios.post('/api/auth/refresh', { refreshToken });

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

    return Promise.reject(error);
  }
);

//export default axiosInstance;
export default apiClient;