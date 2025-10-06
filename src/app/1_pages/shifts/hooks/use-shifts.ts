import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shiftsApi } from "../api/shifts-api";
import { toast } from "sonner";

export const useGetShifts = () => {
  return useQuery({
    queryKey: ["shifts"],
    queryFn: () => shiftsApi.getShifts(),
  });
};

export const useCloseShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shiftId }: { shiftId: number }) =>
      shiftsApi.closeShift(shiftId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shifts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["shifts", variables.shiftId],
      });

      toast.success("Смена завершена");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Ошибка завершения смены:", error);

      const message = error?.response?.data?.message || "Ошибка закрытия смены";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });
};
