"use client";
import { formatDate } from "@/app/5_shared/function/format-date";
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
} from "@/components/ui/alert-dialog";
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
import { USER_ROLE } from "../../auth/types/role.enum";
import { useCloseShift } from "../hooks/use-shifts";
import { Shifts } from "../types/shifts";

interface Props {
  data: Shifts[] | undefined;
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

const TableShifts = ({ data, loading, error }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const closeShift = useCloseShift();

  const handleCloseShift = (shift: Shifts) => {
    if (shift.status) {
      closeShift.mutate({ shiftId: shift.id });
    }
    return toast.error("Невозможно завершить завершенную смену");
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

  const filteredShifts = data.filter((shift) => {
    const matchesSearch =
      shift.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      shift.lastname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || shift.role === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="flex flex-row justify-between gap-4">
        <Input
          placeholder="Поиск смены по фамилии сотрудника или названию магазина"
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
            <TableHead>Время начала</TableHead>
            <TableHead>Время завершения</TableHead>
            <TableHead>Статус смены</TableHead>
            <TableHead>Название магазина</TableHead>
            <TableHead>Имя</TableHead>
            <TableHead>Фамилия</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead>Завершение</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredShifts.map((shift) => (
            <TableRow key={shift.id}>
              <TableCell>{formatDate(shift.started_at)}</TableCell>
              <TableCell>
                {shift.ended_at === null
                  ? "Смена не завершена"
                  : formatDate(shift.ended_at)}
              </TableCell>
              <TableCell>
                {shift.status === true ? "Активна" : "Закрыта"}
              </TableCell>
              <TableCell>{shift.name}</TableCell>
              <TableCell>{shift.firstname}</TableCell>
              <TableCell>{shift.lastname}</TableCell>
              <TableCell>{shift.phone}</TableCell>
              <TableCell>{workersRole(shift.role)}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className={cn(
                        shift.status ? "bg-red-500 hover:bg-red-600" : "",
                      )}
                      variant="outline"
                      size="sm"
                      disabled={!shift.status || closeShift.isPending}
                    >
                      {closeShift.isPending
                        ? "Завершение..."
                        : shift.status
                          ? "Завершить смену"
                          : "Смена завершена"}
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Завершить смену?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Вы уверены, что хотите завершить эту смену? Это действие
                        нельзя будет отменить.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleCloseShift(shift)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Завершить
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
export default TableShifts;
