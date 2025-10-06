import { useMemo } from "react";
import { Workers } from "../types/worker";

export const useRoleCount = (workers: Workers[] | undefined) => {
  return useMemo(() => {
    if (!workers?.length) {
      return {
        superadmin: 0,
        admin: 0,
        worker: 0,
        courier: 0,
        total: 0,
      };
    }

    const stats = workers.reduce(
      (acc, workers) => {
        acc.total++;

        switch (workers.role) {
          case "superadmin":
            acc.superadmin++;
            break;
          case "admin":
            acc.admin++;
            break;
          case "worker":
            acc.worker++;
            break;
          case "courier":
            acc.courier++;
            break;
          default:
            break;
        }

        return acc;
      },
      {
        superadmin: 0,
        admin: 0,
        worker: 0,
        courier: 0,
        total: 0,
      },
    );

    return stats;
  }, [workers]);
};
