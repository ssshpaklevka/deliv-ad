import { USER_ROLE } from "../../auth/types/role.enum";

export interface Shifts {
  id: number;
  worker_id: number;
  started_at: string;
  ended_at: string;
  status: boolean;
  created_at: string;
  current_store_id: number;
  firstname: string;
  lastname: string;
  phone: string;
  role: USER_ROLE;
  name: string;
}
