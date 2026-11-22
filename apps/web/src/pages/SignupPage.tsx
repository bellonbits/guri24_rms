import React from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthExperience } from '../components/AuthExperience';

export const SignupPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/onboarding';

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <AuthExperience
      initialMode="signup"
      onSuccess={(session) => {
        login(session);
        navigate(redirectTarget, { replace: true });
      }}
    />
  );
};
