import { LoginResponse } from "../types/auth";
import apiClient, { getDeviceId, getDeviceName } from "./api-client";

export const authApi = {
  // Отправка номера телефона
  sendPhone: async (phone: string) => {
    const response = await apiClient.post("/auth/send-sms", { phone });
    return response.data;
  },

  // Подтверждение SMS кода
  verifySms: async (phone: string, code: string): Promise<LoginResponse> => {
    const deviceId = getDeviceId();
    const deviceName = getDeviceName();
    const response = await apiClient.post("/auth/login", {
      phone,
      code,
      deviceId,
      deviceName,
    });
    return response.data;
  },

  // Обновление токена
  refreshToken: async (refreshToken: string) => {
    const deviceId = getDeviceId();
    const response = await apiClient.post("/auth/refresh", {
      refreshToken,
      deviceId,
    });
    return response.data;
  },

  //TODO поменять на delete
  // Выход
  logout: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await apiClient.delete("/auth/logout", { data: { refreshToken } });
    }
  },

  //   // Получение текущего пользователя
  //   getCurrentUser: async () => {
  //     const response = await apiClient.get('/auth/me');
  //     return response.data;
  //   },
};
