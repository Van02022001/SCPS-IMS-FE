// src/api/auth.js
import axios from "axios";

// const token = localStorage.getItem('token')

const BaseURL = "http://localhost:8080/api/v1"
const BaseURLWeb = "https://phu-tung-bom-be-tong-sg.azurewebsites.net/api/v1"

export const axiosInstance = axios.create({
  baseURL: BaseURL,
  timeout: 30000,
  headers: {
    common: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`,
    },
  },
});

export const imageInstance = axios.create({
  baseURL: BaseURL,
  timeout: 30000,
  headers: {
    common: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${localStorage.getItem('token')}`,
    },
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xử lý lỗi 401, ví dụ chuyển hướng đến trang đăng nhập
      window.location.href = '/login';
    } else {
      console.error('Response interceptor error:', error);
    }
    return Promise.reject(error);
  }
);

imageInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xử lý lỗi 401, ví dụ chuyển hướng đến trang đăng nhập
      window.location.href = '/login';
    } else {
      console.error('Response interceptor error:', error);
    }
    return Promise.reject(error);
  }
);
// export const axiosInstance = axios.create({
//   baseURL: BaseURL,
//   timeout: 30000,
//   headers: {
//     common: {
//       "Content-Type": "application/json",
//     },
//     authorization: `Bearer ${token}`,
//   },
// });