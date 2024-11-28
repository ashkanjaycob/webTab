// src/components/RegisterForm.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../features/auth/authService";
import {
  setEmail,
  setPassword,
  setSubmitting,
  setError,
  clearError,
} from "../../../features/auth/authSlice";
import { RootState } from "../../../store/store";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
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

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { email, password, isSubmitting, error } = useSelector(
    (state: RootState) => state.auth
  );

  const navigate = useNavigate();

  // Validation helpers
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous error messages
    dispatch(clearError());

    // Validate the email and password
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
      const response = await register({ email, password });
      console.log("Registered:", response.data);

      if (response.data.message === "operationSuccess") {
        Swal.fire({
          title: "Success!",
          text: "Registration successful.",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          title: "Error!",
          text:
            response.data.message || "Registration failed. Please try again.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      }
    } catch (err) {
      dispatch(setError("Registration failed. Please try again."));
      console.error("Registration error:", err);
      // Cast `err` to `ApiError` type
      const error = err as ApiError;

      if (error.response?.data?.errorData?.errorMessage === "duplicateUser") {
        Swal.fire({
          title: "Error!",
          text: "This User Already Exists!",
          icon: "error",
          confirmButtonText: "Try Again!",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Unknown Error!",
          icon: "error",
          confirmButtonText: "Retry",
        });
      }
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const showEmailError = !validateEmail(email) && email.length > 0;
  const showPasswordError = !validatePassword(password) && password.length > 0;

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Register</h2>
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
              <div className="invalid-feedback">
                Password must be at least 8 characters long, include an
                uppercase letter, a number, and a special character.
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default RegisterForm;
