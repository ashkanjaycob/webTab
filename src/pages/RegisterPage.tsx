import React from "react";
import AuthWrapper from "../components/layout/auth/AuthWrapper";
import RegisterForm from "../components/layout/auth/RegisterForm";

const RegisterPage: React.FC = () => (
  <AuthWrapper>
    <RegisterForm />
  </AuthWrapper>
);

export default RegisterPage;
