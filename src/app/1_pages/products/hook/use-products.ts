import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productsApi } from "../api/products-api";

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.getProducts(),
  });
};

export const useDeleteWorker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.deletedProduct(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products", id],
      });

      toast.success("Продукт удален");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Ошибка удаления продукта";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};
