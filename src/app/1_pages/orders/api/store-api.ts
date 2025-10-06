import apiClient from "../../auth/api/api-client";
import { Stores } from "../types/stores";

export const storesApi = {
  getAllStores: async (): Promise<Stores[]> => {
    const response = await apiClient.get(`/store`);
    return response.data;
  },
};
