import StatusBadge from "@/app/3_features/orders/ui/status-badge";
import { formatDate } from "@/app/5_shared/function/format-date";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { CONFIRM_DIALOGS } from "../config/confirm-dialog";
import { DeliveryType } from "../enum/assembly-status.enum";
import { useConfirmDialog } from "../hooks/use-confirm-dialog";
import {
  useDeliveryOrder,
  useExpectionDelivery,
  useStartDelivery,
  useStopDelivery,
} from "../hooks/use-orders";
import ConfirmDialog from "./confirm-dialog";

interface Props {
  orderId: number;
  shopId: number;
  isOpen: boolean;
  onClose: () => void;
}

const DeliveryDetailsDialog = ({ orderId, shopId, isOpen, onClose }: Props) => {
  const {
    data: deliveryData,
    isLoading: deliveryLoading,
    error: deliveryError,
  } = useDeliveryOrder(orderId);

  const startDeliveryMutation = useStartDelivery();
  const expectionDeliveryMutation = useExpectionDelivery();
  const stopDeliveryMutation = useStopDelivery();

  const startDeliveryDialog = useConfirmDialog({
    ...CONFIRM_DIALOGS.START_DELIVERY,
    description: `${CONFIRM_DIALOGS.START_DELIVERY.description} Заказ: ${deliveryData?.[0]?.order_number}`,
    onConfirm: async () => {
      // ИСПРАВЛЕНИЕ: передаем объект с правильными ключами
      await startDeliveryMutation.mutateAsync({
        idOrders: [orderId], // массив с orderId
        storeId: shopId, // storeId
      });
      onClose();
    },
  });

  const expectionDeliveryDialog = useConfirmDialog({
    ...CONFIRM_DIALOGS.EXPECTION_DELIVERY,
    description: `${CONFIRM_DIALOGS.EXPECTION_DELIVERY.description} Заказ: ${deliveryData?.[0]?.order_number}`,
    onConfirm: async () => {
      // Просто передаем orderId
      await expectionDeliveryMutation.mutateAsync(orderId);
    },
  });

  const stopDeliveryDialog = useConfirmDialog({
    ...CONFIRM_DIALOGS.STOP_DELIVERY,
    description: `${CONFIRM_DIALOGS.STOP_DELIVERY.description} Заказ: ${deliveryData?.[0]?.order_number}`,
    onConfirm: async () => {
      // Просто передаем orderId
      await stopDeliveryMutation.mutateAsync(orderId);
      onClose();
    },
  });

  if (deliveryLoading) {
    return <div>Загрузка..</div>;
  }

  if (deliveryError) {
    return <div>Ошибка получения данных: {deliveryError.message}</div>;
  }

  if (!deliveryData || deliveryData.length === 0) {
    return <></>;
  }

  const order = deliveryData[0];

  const deliveryType = (deliveryType: string) => {
    if (deliveryType === DeliveryType.FAST) return "Быстрая";
    if (deliveryType === DeliveryType.STANDARD) return "Обычная";
    if (deliveryType === DeliveryType.SELFPICKUP) return "Самовывоз";
    return deliveryType;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-5 max-w-3xl!">
          <DialogHeader>
            <DialogTitle>
              <div className="flex flex-row gap-6 items-center pb-6">
                <p>АААА {order.order_number}</p>
                <p
                  className={cn(
                    order.paid === true ? "bg-green-400" : "bg-red-400",
                    "rounded-2xl px-2 font-normal text-sm"
                  )}
                >
                  {order.paid === true ? "Оплачен" : "Ждет оплаты"}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Card className="px-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-row items-center gap-2">
                <p className="font-semibold">Статус доставки: </p>
                <StatusBadge status={order.delivery_status} type="delivery" />
              </div>
              <div className="flex flex-row items-center gap-2">
                <p className="font-semibold">Тип доставки: </p>
                <p
                  className={cn(
                    order.delivery_type === DeliveryType.FAST
                      ? "text-green-400"
                      : "text-black",
                    "flex flex-row items-center gap-1"
                  )}
                >
                  {deliveryType(order.delivery_type)}
                  {order.delivery_type === DeliveryType.FAST ? (
                    <Zap className="w-3 h-3 text-green-400" />
                  ) : (
                    <></>
                  )}
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <p className="font-semibold">Опаздывает: </p>
                <p
                  className={cn(
                    order.is_overdue === true
                      ? "text-red-400"
                      : "text-green-400"
                  )}
                >
                  {order.is_overdue === true ? "Да" : "Нет"}
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <p className="font-semibold">Дедлайн: </p>
                <p>
                  {order.delivery_deadline === null
                    ? "Дедлайн не назначен"
                    : formatDate(order.delivery_deadline)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="px-2 py-4">
            <CardHeader className="px-0">
              <CardTitle className="font-bold">Заказчик</CardTitle>
              <CardDescription className="px-0">
                Информация о заказчике
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-row gap-2">
                  <p className="font-semibold">Имя заказчика: </p>
                  {order.firstname_customer || "Нет"}
                </div>
                <div className="flex flex-row gap-2">
                  <p className="font-semibold">Фамилия заказчика: </p>
                  {order.lastname_customer || "Нет"}
                </div>
                <div className="flex flex-row gap-2">
                  <p className="font-semibold">Телефон: </p>
                  {order.phone_customer || "Нет"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="px-2 py-4">
            <CardHeader className="px-0">
              <CardTitle className="font-bold">Адрес доставки</CardTitle>
              <CardDescription className="px-0">
                Информация о адресе доставки
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-row gap-2">
                  <p className="font-semibold">Широта: </p>
                  {order.latitude || "Нет"}
                </div>
                <div className="flex flex-row gap-2">
                  <p className="font-semibold">Долгота: </p>
                  {order.longitude || "Нет"}
                </div>
                <div className="flex flex-row gap-2">
                  <p className="font-semibold">Адрес: </p>
                  {order.address || "Нет"}
                </div>
                <div className="flex flex-row gap-2">
                  <p className="font-semibold">Подезд: </p>
                  {order.entrance || "Нет"}
                </div>
                <div className="flex flex-row gap-2">
                  <p className="font-semibold">Домофон: </p>
                  {order.intercom || "Нет"}
                </div>
                <div className="flex flex-row gap-2">
                  <p className="font-semibold">Этаж: </p>
                  {order.floor || "Нет"}
                </div>
                <div className="flex flex-row gap-2">
                  <p className="font-semibold">Квартира: </p>
                  {order.apartment || "Нет"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="px-2 py-4">
            <CardHeader className="px-0">
              <CardTitle className="font-bold">Сборщик</CardTitle>
              <CardDescription className="px-0">
                Информация о сборщике
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {order.assembly_worker_id === 0 || null ? (
                <div>
                  <p>Курьер еще не назначен</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-row gap-2">
                    <p className="font-semibold">Имя сборщика: </p>
                    {order.firstname_assemb || "Нет"}
                  </div>
                  <div className="flex flex-row gap-2">
                    <p className="font-semibold">Фамилия сборщика: </p>
                    {order.lastname_assemb || "Нет"}
                  </div>
                  <div className="flex flex-row gap-2">
                    <p className="font-semibold">Телефон: </p>
                    {order.phone_assemb || "Нет"}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="px-2 py-4">
            <CardHeader className="px-0">
              <CardTitle className="font-bold">Заказ</CardTitle>
              <CardDescription className="px-0">
                Информация о заказе
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex flex-row gap-2">
                  <p className="font-semibold">Общий вес: </p>
                  {`${order.total_weight} кг.` || "Нет"}
                </div>
                <div className="flex flex-row gap-2">
                  <p className="font-semibold">Цена: </p>
                  {`${order.total_price}₽` || "Нет"}
                </div>
                <div className="flex flex-row gap-2">
                  <p className="font-semibold">Количество продуктов: </p>
                  {`${order.products_count} шт.` || "Нет"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="px-2 py-4">
            <CardHeader className="px-0">
              <CardTitle className="font-bold">Продукты</CardTitle>
              <CardDescription className="px-0">
                Информация о продукте
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {order.products_details.map((product) => (
                <div key={product.id} className="flex flex-col ">
                  <div className="border-1 rounded-2xl p-2 flex flex-col mb-4">
                    <div className="flex flex-row gap-2">
                      <p className="font-semibold">Название: </p>
                      {product.name}
                    </div>
                    <div className="flex flex-row gap-2">
                      <p className="font-semibold">Цена одного продукта: </p>
                      {product.price}₽
                    </div>
                    <div className="flex flex-row gap-2">
                      <p className="font-semibold">Вес одного продукта: </p>
                      {product.weight} кг.
                    </div>
                    <div className="flex flex-row gap-2">
                      <p className="font-semibold">Количество: </p>
                      {product.count} шт.
                    </div>
                    <div className="flex flex-row gap-2">
                      <p className="font-semibold">Артикул: </p>
                      {product.article}
                    </div>
                    <div className="flex flex-row gap-2">
                      <p className="font-semibold">Баркод: </p>
                      {product.barcode}
                    </div>
                    <div className="flex flex-row gap-2">
                      <p className="font-semibold">Полная цена: </p>
                      {product.total_price}₽
                    </div>
                    <div className="flex flex-row gap-2">
                      <p className="font-semibold">Общий вес: </p>
                      {product.total_weight} кг.
                    </div>
                    {/* <div className="flex flex-row gap-2">
                    {product.images.map((img) => (
                      <Image key={img} src={img} alt='' width={200} height={200}/>
                    ))}
                  </div> */}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Комментарий</CardTitle>
              <CardDescription>Комментарий к заказу</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row gap-2">
                <p className="font-semibold">Комментарий к заказу: </p>
                {order.comment}
              </div>
            </CardContent>
          </Card>

          <Card className="px-2 py-4">
            <CardHeader className="px-0">
              <CardTitle className="font-bold">Управление</CardTitle>
              <CardDescription className="px-0">
                Управление заказом
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 flex flex-row gap-4">
              <Button
                onClick={startDeliveryDialog.openDialog}
                disabled={
                  startDeliveryMutation.isPending ||
                  order.delivery_status === "completed" ||
                  order.delivery_status === "in_progress" ||
                  order.delivery_status === "expectation"
                }
                className={cn(
                  order.delivery_status === "pending"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400"
                )}
              >
                {order.delivery_status === "pending"
                  ? "Начать доставку"
                  : "Доставка начата"}
              </Button>

              <Button
                onClick={expectionDeliveryDialog.openDialog}
                disabled={
                  expectionDeliveryMutation.isPending ||
                  order.delivery_status === "completed" ||
                  order.delivery_status === "pending" ||
                  order.delivery_status === "expectation"
                }
                className={cn(
                  order.delivery_status === "in_progress"
                    ? "bg-yellow-400 hover:bg-yellow-500"
                    : "bg-gray-400"
                )}
              >
                {order.delivery_status === "in_progress"
                  ? "Я на месте"
                  : "Курьер на месте"}
              </Button>

              <Button
                onClick={stopDeliveryDialog.openDialog}
                disabled={
                  stopDeliveryMutation.isPending ||
                  order.delivery_status === "completed" ||
                  order.delivery_status === "pending" ||
                  order.delivery_status === "in_progress"
                }
                className={cn(
                  order.delivery_status === "expectation"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400"
                )}
              >
                {order.delivery_status === "expectation"
                  ? "Завершить доставку"
                  : "Доставка завершена"}
              </Button>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={startDeliveryDialog.isOpen}
        onClose={startDeliveryDialog.closeDialog}
        onConfirm={startDeliveryDialog.handleConfirm}
        isLoading={
          startDeliveryDialog.isLoading || startDeliveryMutation.isPending
        }
        {...startDeliveryDialog.dialogProps}
      />

      <ConfirmDialog
        isOpen={expectionDeliveryDialog.isOpen}
        onClose={expectionDeliveryDialog.closeDialog}
        onConfirm={expectionDeliveryDialog.handleConfirm}
        isLoading={
          expectionDeliveryDialog.isLoading ||
          expectionDeliveryMutation.isPending
        }
        {...expectionDeliveryDialog.dialogProps}
      />
      <ConfirmDialog
        isOpen={stopDeliveryDialog.isOpen}
        onClose={stopDeliveryDialog.closeDialog}
        onConfirm={stopDeliveryDialog.handleConfirm}
        isLoading={
          stopDeliveryDialog.isLoading || stopDeliveryMutation.isPending
        }
        {...stopDeliveryDialog.dialogProps}
      />
    </>
  );
};
export default DeliveryDetailsDialog;
