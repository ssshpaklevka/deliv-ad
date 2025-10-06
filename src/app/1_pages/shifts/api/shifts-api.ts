import apiClient from "../../auth/api/api-client";
import { Shifts } from "../types/shifts";

export const shiftsApi = {
  getShifts: async (): Promise<Shifts[]> => {
    const response = await apiClient.get(`/shift`);
    return response.data;
  },
  closeShift: async (shiftId: number): Promise<Shifts[]> => {
    const response = await apiClient.post(`/shift/admin-close`, {
      shiftId,
    });
    return response.data;
  },
};
