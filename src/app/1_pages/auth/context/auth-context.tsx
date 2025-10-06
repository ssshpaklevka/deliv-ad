"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthState, User } from "../types/auth";
import { authApi } from "../api/auth-api";

interface AuthContextType extends AuthState {
  login: (phone: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPhone: (phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Проверка токена при загрузке приложения
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const savedUser = localStorage.getItem("user");

      if (token) {
        try {
          const userData = JSON.parse(savedUser ? savedUser : "undefined user");
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing saved user data:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const sendPhone = async (phone: string) => {
    await authApi.sendPhone(phone);
  };

  const login = async (phone: string, code: string) => {
    try {
      const response = await authApi.verifySms(phone, code);

      // Сервер возвращает токены напрямую, а не в объекте tokens
      if (!response.accessToken || !response.refreshToken || !response.user) {
        console.error("Неверная структура ответа:", response);
        throw new Error("Неверная структура ответа от сервера");
      }

      // сохраняем токены
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      //сохраняем пользоваеля
      localStorage.setItem("user", JSON.stringify(response.user));

      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        sendPhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
