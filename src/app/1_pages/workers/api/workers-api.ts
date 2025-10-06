import apiClient from "../../auth/api/api-client";
import { CreateWorkerDto, WorkerBlocked, Workers } from "../types/worker";

export const workersApi = {
  getWorkers: async (): Promise<Workers[]> => {
    const response = await apiClient.get(`/user/all`);
    return response.data;
  },

  blockedWorker: async (id: number): Promise<WorkerBlocked[]> => {
    const response = await apiClient.delete(`/user/block/${id}`);
    return response.data;
  },

  unblockedWorker: async (id: number): Promise<WorkerBlocked[]> => {
    const response = await apiClient.post(`user/unblock/${id}`);
    return response.data;
  },

  deletedWorker: async (id: number): Promise<Workers[]> => {
    const response = await apiClient.delete(`/user/${id}`);
    return response.data;
  },

  createWorker: async (worker: CreateWorkerDto): Promise<Workers[]> => {
    const response = await apiClient.post(`/user`, worker);
    return response.data;
  },
};
