// src/components/LoginForm.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../features/auth/authService";
import {
  setEmail,
  setPassword,
  setSubmitting,
  setError,
  clearError,
  loginSuccess,
  loginFailure,
} from "../../../features/auth/authSlice";
import { RootState } from "../../../store/store";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { setCookie } from "../../../utils/cookie";
import { Eye, EyeSlash } from "react-bootstrap-icons";

interface ApiError {
  response?: {
    data?: {
      errorData?: {
        errorMessage?: string;
      };
    };
  };
}

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { email, password, isSubmitting, error } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(clearError());

    if (!validateEmail(email)) {
      dispatch(setError("Please enter a valid email address."));
      return;
    }

    if (!validatePassword(password)) {
      dispatch(
        setError(
          "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."
        )
      );
      return;
    }

    dispatch(setSubmitting(true));

    try {
      const response = await login({ email, password });
      if (response.data.data.userToken) {
        dispatch(
          loginSuccess({
            user: {
              email: response.data.data.email,
              name: response.data.data.name,
              lastName: response.data.data.lastName,
              role: response.data.data.role,
              userId: response.data.data.userId,
            },
            accessToken: response.data.data.userToken,
            refreshToken: response.data.data.refreshToken,
          })
        );

        setCookie("userToken", response.data.data.userToken, 7);
        setCookie("refreshToken", response.data.data.refreshToken, 7);

        Swal.fire({
          title: "Success!",
          text: "Login successful.",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          navigate("/");
        });
      } else {
        dispatch(loginFailure("Login failed. Please try again."));
        Swal.fire({
          title: "Error!",
          text: response.data.message || "Login failed.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      }
    } catch (err) {
      dispatch(setError("Login failed. Please try again."));
      console.error("Login error:", err);
      const error = err as ApiError;

      if (
        error.response?.data?.errorData?.errorMessage === "notEqualPassword"
      ) {
        Swal.fire({
          title: "Error!",
          text: "Incorrect Password.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      } else if (
        error.response?.data?.errorData?.errorMessage === "userNotExist"
      ) {
        Swal.fire({
          title: "Error!",
          text: "User does not exist.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Unknown Error.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      }

      dispatch(setError("Login failed. Please try again."));
      console.error("Login error:", err);
    } finally {
      dispatch(setSubmitting(false));
    }
  };
  
  const showEmailError = !validateEmail(email) && email.length > 0;
  const showPasswordError = !validatePassword(password) && password.length > 0;

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`form-control ${showEmailError ? "is-invalid" : ""}`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => dispatch(setEmail(e.target.value))}
            />
            {showEmailError && (
              <div className="invalid-feedback">
                Please enter a valid email address.
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`form-control ${
                  showPasswordError ? "is-invalid" : ""
                }`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => dispatch(setPassword(e.target.value))}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </button>
            </div>
            {showPasswordError && (
              <p className="invalid-feedback">
                Password must be at least 8 characters long, include an
                uppercase letter, a number, and a special character.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="alert alert-danger mt-3 p-2">{error}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
