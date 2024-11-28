import axios from "axios";
import { store } from "../store/store";
import { getCookie } from "../utils/cookie";

const API = axios.create({
  baseURL: "/api", 
});

API.interceptors.request.use((config) => {
  const state = store.getState();
  const language = state.language.language || "en"; 
  config.headers["Accept-Language"] = language;

  const token = getCookie("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
