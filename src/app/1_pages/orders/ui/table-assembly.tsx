"use client";
import StatusBadge from "@/app/3_features/orders/ui/status-badge";
import { formatDate } from "@/app/5_shared/function/format-date";
import { formatMinutes } from "@/app/5_shared/function/format-minutes";
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
import { Eye, Pencil, Zap } from "lucide-react";
import { useState } from "react";
import { DeliveryType } from "../enum/assembly-status.enum";
import { AssemblyOrders } from "../types/orders-ro";

interface Props {
  data: AssemblyOrders[] | undefined;
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  onViewDetails: (idOrders: number) => void;
  onEditOrder: (idOrders: number) => void;
}

const TableAssembly = ({
  data,
  loading,
  error,
  onViewDetails,
  onEditOrder,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleViewDetails = (id: number) => {
    onViewDetails(id);
  };

  const handleEditOrder = (id: number) => {
    onEditOrder(id);
  };

  if (loading) {
    return <div>Загрузка</div>;
  }

  if (error) {
    return <div>Ошибка при получении данных: {error.message}</div>;
  }

  if (!data || data?.length === 0) {
    return <></>;
  }

  const deliveryType = (deliveryType: string) => {
    if (deliveryType === DeliveryType.FAST) return "Быстрая";
    if (deliveryType === DeliveryType.STANDARD) return "Обычная";
    if (deliveryType === DeliveryType.SELFPICKUP) return "Самовывоз";
    return deliveryType;
  };

  const filteredOrders = data.filter((order) => {
    const matchesSearch = order.order_number
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.assembly_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="flex flex-row justify-between gap-4">
        <Input
          placeholder="Поиск сборки по номеру заказа"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="pending">Ожидают</SelectItem>
            <SelectItem value="processing">В работе</SelectItem>
            <SelectItem value="completed">Выполненные</SelectItem>
            <SelectItem value="cancelled">Отмененные</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Номер заказа</TableHead>
            <TableHead>Опаздывает</TableHead>
            <TableHead>Статус сборки</TableHead>
            <TableHead>Время создания</TableHead>
            <TableHead>Количество продуктов</TableHead>
            <TableHead>Вес заказа</TableHead>
            <TableHead>Тип доставки</TableHead>
            <TableHead>Время до дедлайна</TableHead>
            <TableHead>О заказе</TableHead>
            <TableHead>Редактировать</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                {order.order_number}
              </TableCell>
              <TableCell
                className={cn(
                  order.is_overdue === true ? "text-red-600" : "text-green-600",
                  "font-medium"
                )}
              >
                {order.is_overdue === true ? "Да" : "Нет"}
              </TableCell>
              <TableCell>
                <StatusBadge
                  type="assembly"
                  status={order.assembly_status}
                />{" "}
              </TableCell>
              <TableCell>{formatDate(order.created_at)}</TableCell>
              <TableCell>{order.count_products} шт.</TableCell>
              <TableCell>{order.total_weight} кг.</TableCell>
              <TableCell
                className={cn(
                  order.delivery_type === DeliveryType.FAST
                    ? "text-green-600"
                    : "text-black",
                  "font-semibold flex flex-row gap-2 items-center"
                )}
              >
                {deliveryType(order.delivery_type)}
                {order.delivery_type === DeliveryType.FAST ? (
                  <Zap className="w-3 h-3 text-green-400" />
                ) : (
                  <></>
                )}
              </TableCell>
              <TableCell>
                {formatMinutes(order.time_difference_minutes)}
              </TableCell>
              <TableCell>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(order.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditOrder(order.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
export default TableAssembly;
