// src/api/auth.js
import axios from "axios";

const token = localStorage.getItem("accessToken");

const BaseURL = process.env.REACT_APP_API_URL;

export const axiosInstance = axios.create({
  baseURL: BaseURL,
  timeout: 30000,
  withCredentials: false,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
    authorization: token ? `Bearer ${JSON.parse(token)}` : "",
  },
});

export const imageInstance = axios.create({
  baseURL: BaseURL,
  timeout: 30000,
  withCredentials: false,
  headers: {
    common: {
      "Content-Type": "multipart/form-data",
    },
    authorization: token ? `Bearer ${JSON.parse(token)}` : "",
  },
});