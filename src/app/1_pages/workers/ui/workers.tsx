"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CardInfo from "@/components/ui/card-info";
import {
  ShieldUser,
  Truck,
  User,
  UserCheck,
  UserLock,
  UserRoundX,
  Users,
  UserStar,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { useRoleCount } from "../hooks/use-role-count";
import { useGetWorkers } from "../hooks/use-workers";
import { CreateWorkerDialog } from "./create-worker-dialog";
import TableWorkers from "./table-workers";

export function Workers() {
  const [selectedWorkerId, setSelectedWorkerId] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: workersData,
    isLoading: workersLoading,
    error: workersError,
  } = useGetWorkers();

  const blockedCount =
    workersData?.filter((worker) => worker.isBlocked).length || 0;
  const deletedCount =
    workersData?.filter((worker) => worker.isDeleted).length || 0;
  const activeCount =
    workersData?.filter((worker) => !worker.isBlocked && !worker.isDeleted)
      .length || 0;
  const totalCount = workersData?.length || 0;

  const statsRole = useRoleCount(workersData);

  const handleViewDetailsWorker = (id: number) => {
    setSelectedWorkerId(id);
    setDialogOpen(true);
  };

  const handleCreateWorker = () => {
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Управление сотрудниками
        </h1>
        <p className="text-muted-foreground">
          Отслеживание и управление сотрудниками
        </p>
      </div>

      {/* Статистика заказов */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CardInfo
          count={totalCount}
          icons={<Users className="w-4 h-4 text-blue-600" />}
          title="Все пользователи"
        />
        <CardInfo
          count={activeCount}
          icons={<UserCheck className="w-4 h-4 text-green-600" />}
          title="Активные пользователи"
        />
        <CardInfo
          count={blockedCount}
          icons={<UserLock className="w-4 h-4 text-yellow-600" />}
          title="Заблокированные пользователи"
        />
        <CardInfo
          count={deletedCount}
          icons={<UserRoundX className="w-4 h-4 text-red-600" />}
          title="Удаленные пользователи"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CardInfo
          count={statsRole.superadmin}
          icons={<ShieldUser className="w-4 h-4" />}
          title="Суперадмины"
        />
        <CardInfo
          count={statsRole.admin}
          icons={<UserStar className="w-4 h-4" />}
          title="Админы"
        />
        <CardInfo
          count={statsRole.worker}
          icons={<User className="w-4 h-4" />}
          title="Сотрудники магазина"
        />
        <CardInfo
          count={statsRole.courier}
          icons={<Truck className="w-4 h-4" />}
          title="Курьеры"
        />
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={handleCreateWorker}>
          Добавить сотрудника
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Работники</CardTitle>
          <CardDescription>
            Управление всеми работниками в системе
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <TableWorkers
              onViewDetails={handleViewDetailsWorker}
              data={workersData}
              error={workersError}
              loading={workersLoading}
            />
          </div>
        </CardContent>
      </Card>

      <CreateWorkerDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
export default Workers;
