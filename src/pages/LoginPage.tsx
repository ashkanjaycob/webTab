import React from 'react';
import AuthWrapper from '../components/layout/auth/AuthWrapper';
import LoginForm from '../components/layout/auth/LoginForm';

const LoginPage: React.FC = () => (
  <AuthWrapper>
    <LoginForm />
  </AuthWrapper>
);

export default LoginPage;
