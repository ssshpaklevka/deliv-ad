import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ordersApi } from "../api/orders-api";
import { CreateOrder, ReduceCount, UpdateOrder } from "../types/orders-dto";

export const useAssemblyOrders = (id: number) => {
  return useQuery({
    queryKey: ["orders", "assembly", id],
    queryFn: () => ordersApi.getAssemblyOrders(id),
    enabled: !!id,
  });
};

export const useAssemblyOrder = (id: number) => {
  return useQuery({
    queryKey: ["order", "assembly", id],
    queryFn: () => ordersApi.getAssemblyOrder(id),
    enabled: !!id,
  });
};

export const useStopAssembly = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ordersApi.stopAssemblyOrder(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", "assembly"],
      });

      queryClient.invalidateQueries({
        queryKey: ["order", "assembly", variables],
      });

      toast.success("Сборка завершена");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Ошибка завершения сборки:", error);

      const message =
        error?.response?.data?.message || "Ошибка завершения сборки";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};

export const useStartAssembly = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idOrder, storeId }: { idOrder: number; storeId: number }) =>
      ordersApi.startAssemblyOrder(idOrder, storeId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", "assembly"],
      });

      queryClient.invalidateQueries({
        queryKey: ["order", "assembly", variables.idOrder],
      });

      toast.success("Сборка начата");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Ошибка начала сборки:", error);

      const message = error?.response?.data?.message || "Ошибка начала сборки";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};

export const useDeliveryOrders = (id: number) => {
  return useQuery({
    queryKey: ["orders", "delivery", id],
    queryFn: () => ordersApi.getDeliveryOrders(id),
    enabled: !!id,
  });
};

export const useDeliveryOrder = (id: number) => {
  return useQuery({
    queryKey: ["order", "delivery", id],
    queryFn: () => ordersApi.getDeliveryOrder(id),
    enabled: !!id,
  });
};

export const useStartDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      idOrders,
      storeId,
    }: {
      idOrders: number[];
      storeId: number;
    }) => ordersApi.startDeliveryOrder(idOrders, storeId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", "delivery"],
      });

      variables.idOrders.forEach((orderId) => {
        queryClient.invalidateQueries({
          queryKey: ["order", "delivery", orderId],
        });
      });

      toast.success("Доставка начата");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Ошибка начала доставки";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};

export const useExpectionDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => ordersApi.expectionDeliveryOrder(orderId),
    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", "delivery"],
      });

      queryClient.invalidateQueries({
        queryKey: ["order", "delivery", orderId],
      });

      toast.success("Курьер на месте");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Ошибка обновления статуса";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};

export const useStopDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => ordersApi.stopDeliveryOrder(orderId),
    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", "delivery"],
      });

      queryClient.invalidateQueries({
        queryKey: ["order", "delivery", orderId],
      });

      toast.success("Доставка завершена");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Ошибка завершения доставки";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: CreateOrder) => ordersApi.createOrder(order),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", variables],
      });

      toast.success("Новый заказ создан");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Ошибка создания заказа:", error);

      const message =
        error?.response?.data?.message || "Ошибка создания заказа";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ order, id }: { order: UpdateOrder; id: number }) =>
      ordersApi.updateOrder(order, id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["order", "assembly", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["order", "delivery", variables.id],
      });

      toast.success("Заказ обновлен");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Ошибка обновления заказа:", error);

      const message =
        error?.response?.data?.message || "Ошибка обновления заказа";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, idProducts }: { id: number; idProducts: number[] }) =>
      ordersApi.deleteProduct(id, idProducts),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["order", "assembly", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["order", "delivery", variables.id],
      });

      toast.success("Продукты удалены");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Ошибка удаления продуктов";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};

export const useReduceCount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      idProducts,
    }: {
      id: number;
      idProducts: ReduceCount[];
    }) => ordersApi.reduceCount(id, idProducts),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["order", "assembly", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["order", "delivery", variables.id],
      });

      toast.success("Количество продуктов уменьшено");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Ошибка уменьшения количества продуктов";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, idProducts }: { id: number; idProducts: number[] }) =>
      ordersApi.createProduct(id, idProducts),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["order", "assembly", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["order", "delivery", variables.id],
      });

      toast.success("Продукты добавлены");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Ошибка добавления продуктов";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};
