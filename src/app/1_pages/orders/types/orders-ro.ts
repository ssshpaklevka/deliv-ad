import {
  AssemblyStatus,
  DeliveryStatus,
  DeliveryType,
} from "../enum/assembly-status.enum";

export interface ListOrdersRo {
  id: number;
  order_number: string;
  delivery_type: DeliveryType;
  total_weight: number;
  count_products: number;
  is_overdue: boolean;
  time_difference_minutes: number;
}

export interface AssemblyOrders {
  id: number;
  order_number: string;
  is_overdue: boolean;
  assembly_status: AssemblyStatus;
  assembly_deadline: string;
  count_products: number;
  total_weight: string;
  delivery_type: DeliveryType;
  time_difference_minutes: number;
  created_at: string;
}

export interface AssemblyOrder extends ListOrdersRo {
  total_price: number;
  assembly_deadline: string;
  assembly_status: AssemblyStatus;
  assembly_worker_id: number;
  delivery_worker_id: number;
  product_ids: number[];
  paid: boolean;
  comment: string | null;
  firstname_customer: string;
  lastname_customer: string;
  phone_customer: string;
  firstname_deliv: string;
  lastname_deliv: string;
  phone_deliv: string;
  products_count: number;
  products_details: ProductRo[];
  created_at: string;
}

export interface AssemblyStart {
  message: string;
  orderId: number;
  workerId: number;
}

export interface AssemblyStop {
  message: string;
  orderId: number;
  workerId: number;
}

export interface DeliveryOrders {
  id: number;
  order_number: string;
  is_overdue: boolean;
  delivery_deadline: string;
  delivery_status: DeliveryStatus;
  count_products: number;
  total_weight: string;
  delivery_type: DeliveryType;
  time_difference_minutes: number;
  created_at: string;
}

export interface DeliveryOrder extends ListOrdersRo {
  total_price: number;
  delivery_deadline: string;
  created_at: string;
  delivery_status: string;
  assembly_worker_id: number | null;
  assembly_status: AssemblyStatus;
  assembly_completed_at: string | null;
  product_ids: number[];
  paid: boolean;
  comment: string | null;
  firstname_customer: string;
  lastname_customer: string;
  phone_customer: string;
  firstname_assemb: string;
  lastname_assemb: string;
  phone_assemb: string;
  products_count: number;
  address: string;
  latitude: number;
  longitude: number;
  apartment: string;
  entrance: string;
  floor: string;
  intercom: string;
  products_details: ProductRo[];
}

export interface OrderDetails extends AssemblyOrders {
  customerName: string;
  customerPhone: string;
  address: string;
  products: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  // другие детальные поля
}

export interface OrdersResponse {
  orders: AssemblyOrders[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductRo {
  id: number;
  name: string;
  count: number;
  price: number;
  weight: number;
  article: string;
  images: string[];
  barcode: string;
  total_price: number;
  total_weight: number;
}

export interface CreateOrderRo {
  id: number;
  orderNumber: string;
  delivery_type: DeliveryType;
  assembly_deadline: string;
  assembly_status: AssemblyStatus;
  total_weight: number;
  count_products: number;
  is_overdue: boolean;
  time_difference_minutes: string;
  created_at: string;
}
