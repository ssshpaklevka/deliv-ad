import { USER_ROLE } from "../../auth/types/role.enum";

export interface Workers {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  role: USER_ROLE;
  isDeleted: boolean;
  isBlocked: boolean;
}

export interface CreateWorkerDto {
  firstName: string;
  lastName: string;
  phone: string;
  role: USER_ROLE;
}

export interface WorkerBlocked {
  message: string;
}

export interface WorkerDeleted {
  message: string;
}
