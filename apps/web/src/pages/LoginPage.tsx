import React from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthExperience } from '../components/AuthExperience';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/app/dashboard';

  if (isAuthenticated) {
    return <Navigate to={redirectTarget} replace />;
  }

  return (
    <AuthExperience
      initialMode="signin"
      onSuccess={(session) => {
        login(session);
        navigate(redirectTarget, { replace: true });
      }}
    />
  );
};
