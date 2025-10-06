"use client";
import React from "react";
import { useAuth } from "../context/auth-context";
import AuthForm from "../ui/auth-form";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <h2 className="text-2xl font-bold text-center">Вход в систему</h2>
          <AuthForm />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
