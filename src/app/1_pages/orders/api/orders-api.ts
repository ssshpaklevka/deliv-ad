import apiClient from "../../auth/api/api-client";
import { CreateOrder, ReduceCount, UpdateOrder } from "../types/orders-dto";
import {
  AssemblyOrder,
  AssemblyOrders,
  AssemblyStart,
  AssemblyStop,
  CreateOrderRo,
  DeliveryOrder,
  DeliveryOrders,
} from "../types/orders-ro";

export const ordersApi = {
  // getByShop: async (id: number): Promise<OrdersResponse> => {
  //   const response = await apiClient.get(`/orders/${id}`);
  //   return response.data;
  // },
  getAssemblyOrders: async (id: number): Promise<AssemblyOrders[]> => {
    const response = await apiClient.get(`/orders/assembly/${id}`);
    return response.data;
  },

  getAssemblyOrder: async (id: number): Promise<AssemblyOrder[]> => {
    const response = await apiClient.get(`/orders/assembly/order/${id}`);
    return response.data;
  },

  startAssemblyOrder: async (
    idOrder: number,
    storeId: number
  ): Promise<AssemblyStart> => {
    const response = await apiClient.post(`orders/assembly`, {
      idOrder,
      storeId,
    });
    return response.data;
  },

  stopAssemblyOrder: async (id: number): Promise<AssemblyStop> => {
    const response = await apiClient.post(`orders/stop-assembly/${id}`);
    return response.data;
  },

  getDeliveryOrders: async (id: number): Promise<DeliveryOrders[]> => {
    const response = await apiClient.get(`/orders/delivery/${id}`);
    return response.data;
  },

  getDeliveryOrder: async (id: number): Promise<DeliveryOrder[]> => {
    const response = await apiClient.get(`/orders/delivery/order/${id}`);
    return response.data;
  },

  startDeliveryOrder: async (
    idOrders: number[],
    storeId: number
  ): Promise<AssemblyStart> => {
    const response = await apiClient.post(`/orders/delivery`, {
      idOrders: idOrders,
      storeId,
    });
    return response.data;
  },

  expectionDeliveryOrder: async (orderId: number) => {
    const response = await apiClient.post(`/orders/expect-delivery/${orderId}`);
    return response.data;
  },

  stopDeliveryOrder: async (orderId: number) => {
    const response = await apiClient.post(`/orders/stop-delivery/${orderId}`);
    return response.data;
  },

  createOrder: async (order: CreateOrder): Promise<CreateOrderRo[]> => {
    const response = await apiClient.post(`/orders/create`, order);
    return response.data;
  },

  updateOrder: async (
    order: UpdateOrder,
    id: number
  ): Promise<CreateOrderRo[]> => {
    const response = await apiClient.patch(`/orders/${id}`, order);
    return response.data;
  },

  deleteProduct: async (id: number, idProducts: number[]) => {
    const response = await apiClient.delete(`/orders/products/${id}/delete`, {
      data: {
        product_ids: idProducts,
      },
    });
    return response.data;
  },

  reduceCount: async (id: number, idProducts: ReduceCount[]) => {
    const response = await apiClient.patch(`/orders/products/${id}/reduce`, {
      products: idProducts,
    });
    return response.data;
  },

  createProduct: async (id: number, idProducts: number[]) => {
    const response = await apiClient.post(`/orders/products/${id}`, {
      product_ids: idProducts,
    });
    return response.data;
  },
};
