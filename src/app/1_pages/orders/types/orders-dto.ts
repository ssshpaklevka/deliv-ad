import {
  AssemblyStatus,
  DeliveryStatus,
  DeliveryType,
} from "../enum/assembly-status.enum";

export interface CreateOrder {
  orderNumber: string;
  delivery_type: DeliveryType;
  comment?: string;
  paid: boolean;
  productIds: number[];
  first_name: string;
  last_name: string;
  phone: string;
  address?: string;
  apartment?: number;
  entrance?: number;
  floor?: number;
  intercom?: string;
  storeId: number;
}

export interface UpdateOrder {
  order_number?: string;
  store_id?: number;
  delivery_type?: DeliveryType;
  assembly_deadline?: string;
  assembly_status?: AssemblyStatus;
  assembly_worker_id?: number;
  assembly_started_at?: Date;
  assembly_completed_at?: string;
  delivery_deadline?: string;
  delivery_status?: DeliveryStatus;
  delivery_worker_id?: number;
  delivery_started_at?: Date;
  delivery_completed_at?: Date;
  pickup_deadline?: Date;
  pickup_status?: DeliveryStatus;
  pickup_completed_at?: Date;
  comment?: string;
  paid?: boolean;
  product_ids?: number[];
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  apartment?: number;
  entrance?: number;
  floor?: number;
  intercom?: string;
}

export interface ReduceCount {
  id: number;
  count: number;
}
