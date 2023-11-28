// src/api/auth.js
import axios from "axios";

// const token = localStorage.getItem('token')

const BaseURL = "http://localhost:8080/api/v1"


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

// export const imageInstance = axios.create({
//   baseURL: BaseURL,
//   timeout: 30000,
//   headers: {
//     common: {
//       "Content-Type": "multipart/form-data",
//     },
//     authorization: `Bearer ${token}`,
//   },
// });
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);