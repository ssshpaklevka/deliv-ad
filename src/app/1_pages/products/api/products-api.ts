import apiClient from "../../auth/api/api-client";
import { Products } from "../type/products";

export const productsApi = {
  getProducts: async (): Promise<Products[]> => {
    const response = await apiClient.get(`/product`);
    return response.data;
  },

  deletedProduct: async (id: number): Promise<Products[]> => {
    const response = await apiClient.delete(`/product/${id}`);
    return response.data;
  },
};
