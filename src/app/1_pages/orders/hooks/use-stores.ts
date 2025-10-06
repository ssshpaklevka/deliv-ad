import { useQuery } from "@tanstack/react-query";
import { storesApi } from "../api/store-api";

export const useGetAllStores = () => {
  return useQuery({
    queryKey: ["stores"],
    queryFn: () => storesApi.getAllStores(),
  });
};
