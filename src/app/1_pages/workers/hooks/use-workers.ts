import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { workersApi } from "../api/workers-api";
import { CreateWorkerDto } from "../types/worker";

export const useGetWorkers = () => {
  return useQuery({
    queryKey: ["workers"],
    queryFn: () => workersApi.getWorkers(),
  });
};

export const useBlockedWorker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => workersApi.blockedWorker(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: ["workers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["workers", id],
      });

      toast.success("Работник заблокирован");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Ошибка обновления статуса";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};

export const useUnblockedWorker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => workersApi.unblockedWorker(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: ["workers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["workers", id],
      });

      toast.success("Работник разблокирован");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Ошибка обновления статуса";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};

export const useDeleteWorker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => workersApi.deletedWorker(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: ["workers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["workers", id],
      });

      toast.success("Работник удален");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Ошибка обновления статуса";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};

export const useCreateWorker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (worker: CreateWorkerDto) => workersApi.createWorker(worker),
    onSuccess: (data, worker) => {
      queryClient.invalidateQueries({
        queryKey: ["workers"],
      });

      toast.success("Работник создан");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Ошибка создания работника";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};
