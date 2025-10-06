import { useMemo } from "react";
import { DeliveryOrders } from "../types/orders-ro";

export const useDeliveryCount = (orders: DeliveryOrders[] | undefined) => {
  return useMemo(() => {
    if (!orders?.length) {
      return {
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
        expectation: 0,
        total: 0,
      };
    }

    const stats = orders.reduce(
      (acc, order) => {
        acc.total++;

        switch (order.delivery_status) {
          case "pending":
            acc.pending++;
            break;
          case "in_progress":
            acc.inProgress++;
            break;
          case "expectation":
            acc.expectation++;
            break;
          case "completed":
            acc.completed++;
            break;
          case "cancelled":
            acc.cancelled++;
            break;
          default:
            break;
        }

        return acc;
      },
      {
        pending: 0,
        inProgress: 0,
        expectation: 0,
        completed: 0,
        cancelled: 0,
        total: 0,
      },
    );

    return stats;
  }, [orders]);
};
