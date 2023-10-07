// src/api/auth.js
import axios from "axios";

const token = localStorage.getItem('token')

const BaseURL = "http://localhost:8080/api/v1"

export const axiosInstance = axios.create({
  baseURL: BaseURL,
  timeout: 30000,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
    authorization: `Bearer ${token}`,
  },
});

export const imageInstance = axios.create({
  baseURL: BaseURL,
  timeout: 30000,
  headers: {
    common: {
      "Content-Type": "multipart/form-data",
    },
    authorization: `Bearer ${token}`,
  },
});