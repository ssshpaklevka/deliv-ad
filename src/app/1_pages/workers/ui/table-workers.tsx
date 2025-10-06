"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../components/ui/alert-dialog";
import { USER_ROLE } from "../../auth/types/role.enum";
import {
  useBlockedWorker,
  useDeleteWorker,
  useUnblockedWorker,
} from "../hooks/use-workers";
import { Workers } from "../types/worker";

interface Props {
  data: Workers[] | undefined;
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  onViewDetails: (idOrders: number) => void;
}

const TableWorkers = ({ data, loading, error, onViewDetails }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const blockUser = useBlockedWorker();
  const unblockUser = useUnblockedWorker();
  const deleteUser = useDeleteWorker();

  const handleBlockToggle = (worker: Workers) => {
    if (worker.isBlocked) {
      // Разблокировать
      unblockUser.mutate(worker.id);
    } else {
      // Заблокировать
      blockUser.mutate(worker.id);
    }
  };

  const handleDeleteUser = (worker: Workers) => {
    if (worker) {
      deleteUser.mutate(worker.id);
    }
    return toast.error("Невозможно удалить сотрудника");
  };

  if (loading) {
    return <div>Загрузка</div>;
  }

  if (error) {
    return <div>Ошибка при получении данных: {error.message}</div>;
  }

  if (!data || data?.length === 0) {
    return <div>Данные отсутствуют</div>;
  }

  const workersRole = (workersRole: string) => {
    if (workersRole === USER_ROLE.SUPERADMIN) return "Суперадмин";
    if (workersRole === USER_ROLE.ADMIN) return "Админ";
    if (workersRole === USER_ROLE.WORKER) return "Сотрудник магазина";
    if (workersRole === USER_ROLE.COURIER) return "Курьер";
    return workersRole;
  };

  const filteredOrders = data.filter((worker) => {
    const matchesSearch =
      worker.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || worker.role === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="flex flex-row justify-between gap-4">
        <Input
          placeholder="Поиск сотрудника по имени или фамилии"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все сотрудники</SelectItem>
            <SelectItem value="superadmin">Суперадмины</SelectItem>
            <SelectItem value="admin">Админы</SelectItem>
            <SelectItem value="worker">Сотрудники</SelectItem>
            <SelectItem value="courier">Курьеры</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Имя</TableHead>
            <TableHead>Фамилия</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead>Заблокирован</TableHead>
            <TableHead>Удаленный аккаунт</TableHead>
            <TableHead>Блокировка</TableHead>
            <TableHead>Удаление</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((worker) => (
            <TableRow key={worker.id}>
              <TableCell>{worker.firstName}</TableCell>
              <TableCell>{worker.lastName}</TableCell>
              <TableCell>{worker.phone}</TableCell>
              <TableCell>{workersRole(worker.role)}</TableCell>
              <TableCell
                className={cn(
                  worker.isBlocked === true ? "text-red-600" : "text-green-600",
                  "font-medium",
                )}
              >
                {worker.isBlocked === true ? "Да" : "Нет"}
              </TableCell>
              <TableCell
                className={cn(
                  worker.isDeleted === true ? "text-red-600" : "text-green-600",
                  "font-medium",
                )}
              >
                {worker.isDeleted === true ? "Да" : "Нет"}
              </TableCell>
              <TableCell>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBlockToggle(worker)}
                  >
                    {blockUser.isPending || unblockUser.isPending
                      ? "Обработка..."
                      : worker.isBlocked
                        ? "Разблокировать"
                        : "Заблокировать"}
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className={cn(!worker.isDeleted ? "bg-red-500" : "")}
                      variant="outline"
                      size="sm"
                      // onClick={() => handleDeleteUser(worker)}
                      disabled={worker.isDeleted || deleteUser.isPending}
                    >
                      {deleteUser.isPending
                        ? "Удаление..."
                        : worker.isDeleted
                          ? "Удален"
                          : "Удалить"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Удалить сотрудника?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Вы уверены, что хотите удалить этого сотрудника? Это
                        действие нельзя будет отменить.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteUser(worker)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Удалить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
export default TableWorkers;
