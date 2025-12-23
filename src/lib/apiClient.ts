import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5068/api", // backend base URL
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;