/* eslint-disable @typescript-eslint/no-unused-vars */
import { Middleware } from "@reduxjs/toolkit";
import { getCookie } from "../utils/cookie";

export const authMiddleware: Middleware = (store) => (next) => (action) => {
  const token = getCookie("userToken");
  if (token) {
    action.payload = { ...action.payload, token };
  }
  return next(action);
};
