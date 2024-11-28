import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie } from "../../utils/cookie";

const checkAuthStatus = () => {
  const userToken = getCookie("userToken");
  return !!userToken;
};

interface AuthState {
  email: string;
  password: string;
  isSubmitting: boolean;
  error: string | null;
  user: {
    email: string;
    name: string;
    lastName: string;
    role: string;
    userId: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  email: "",
  password: "",
  isSubmitting: false,
  error: null,
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: checkAuthStatus(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearForm: (state) => {
      state.email = "";
      state.password = "";
      state.isSubmitting = false;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: {
          email: string;
          name: string;
          lastName: string;
          role: string;
          userId: string;
        };
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      // console.log("Login success action payload:", action.payload);
      state.user = {
        email: action.payload.user.email,
        name: action.payload.user.name,
        lastName: action.payload.user.lastName,
        role: action.payload.user.role,
        userId: action.payload.user.userId,
      };
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;

    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setEmail,
  setPassword,
  setSubmitting,
  setError,
  clearError,
  clearForm,
  loginSuccess,
  loginFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
