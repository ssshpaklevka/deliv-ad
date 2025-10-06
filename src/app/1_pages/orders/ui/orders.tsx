"use client";
import { Clock, CheckCircle, XCircle, Package, Info } from "lucide-react";
import CardInfo from "../../../../components/ui/card-info";
import TableInfo from "./tab-info";
import { useAssemblyOrders, useDeliveryOrders } from "../hooks/use-orders";
import { useAssemblyCount } from "../hooks/use-assembly-count";
import { useDeliveryCount } from "../hooks/use-delivery-count";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllStores } from "../hooks/use-stores";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Orders = () => {
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);

  //TODO добавить обработку на loading и error
  const {
    data: assemblyData,
    isLoading: assemblyLoading,
    error: assemblyError,
  } = useAssemblyOrders(selectedShopId || 0);

  const {
    data: deliveryData,
    isLoading: deliveryLoading,
    error: deliveryError,
  } = useDeliveryOrders(selectedShopId || 0);

  const {
    data: storesData,
    isLoading: storesLoading,
    error: storesError,
  } = useGetAllStores();

  const statsAssembly = useAssemblyCount(assemblyData);
  const statusDelivery = useDeliveryCount(deliveryData);

  useEffect(() => {
    if (storesData?.length && !selectedShopId) {
      setSelectedShopId(storesData[0].id);
    }
  }, [storesData, selectedShopId]);

  const handleShopChange = (shopId: string) => {
    setSelectedShopId(Number(shopId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Управление заказами
        </h1>
        <div className="flex flex-row items-center gap-10">
          <div className="flex flex-row items-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-5 h-5" />
              </TooltipTrigger>
              <TooltipContent>
                Выберите магазин из списка справа для просмотра заказов
              </TooltipContent>
            </Tooltip>
            <p className="text-muted-foreground">
              Отслеживание и управление заказами
            </p>
          </div>
          <Select
            value={selectedShopId?.toString()}
            onValueChange={handleShopChange}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="Выберите магазин"></SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[50vh]">
              <SelectGroup>
                {storesData?.map((store) => (
                  <SelectItem value={store.id.toString()} key={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <CardInfo
            title="Сборка (ожидает)"
            count={statsAssembly.pending}
            icons={<Clock className="w-4 h-4 text-yellow-600" />}
          />
          <CardInfo
            title="Сборка (в работе)"
            count={statsAssembly.inProgress}
            icons={<Package className="w-4 h-4 text-blue-600" />}
          />
          <CardInfo
            title="Сборка (завершены)"
            count={statsAssembly.completed}
            icons={<CheckCircle className="w-4 h-4 text-green-600" />}
          />
          <CardInfo
            title="Сборка (отменены)"
            count={statsAssembly.cancelled}
            icons={<XCircle className="w-4 h-4 text-red-600" />}
          />
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <CardInfo
            title="Доставка (ожидает)"
            count={statusDelivery.pending}
            icons={<Clock className="w-4 h-4 text-yellow-600" />}
          />
          <CardInfo
            title="Доставка (в работе)"
            count={statusDelivery.inProgress}
            icons={<Package className="w-4 h-4 text-blue-600" />}
          />
          <CardInfo
            title="Доставка (Ожидают заказчика)"
            count={statusDelivery.expectation}
            icons={<CheckCircle className="w-4 h-4 text-green-600" />}
          />
          <CardInfo
            title="Доставка (завершены)"
            count={statusDelivery.completed}
            icons={<CheckCircle className="w-4 h-4 text-green-600" />}
          />
          <CardInfo
            title="Доставка (отменены)"
            count={statusDelivery.cancelled}
            icons={<XCircle className="w-4 h-4 text-red-600" />}
          />
        </div>
      </div>
      <TableInfo shopId={selectedShopId || 0} />
    </div>
  );
};
export default Orders;
