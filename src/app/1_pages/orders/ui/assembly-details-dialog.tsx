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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { useState } from "react";
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
import { CONFIRM_DIALOGS } from "../config/confirm-dialog";
import { DeliveryType } from "../enum/assembly-status.enum";
import { useConfirmDialog } from "../hooks/use-confirm-dialog";
import {
  useAssemblyOrder,
  useCreateProduct,
  useDeleteProduct,
  useReduceCount,
  useStartAssembly,
  useStopAssembly,
} from "../hooks/use-orders";
import AddProductsDialog from "./add-products-dialog";
import ConfirmDialog from "./confirm-dialog";

interface Props {
  orderId: number;
  shopId: number;
  isOpen: boolean;
  onClose: () => void;
}

const AssemblyDetailsDialog = ({ orderId, shopId, isOpen, onClose }: Props) => {
  const [isAddProductsDialogOpen, setIsAddProductsDialogOpen] = useState(false);
  const [isReduceCountDialogOpen, setIsReduceCountDialogOpen] = useState(false);
  const {
    data: assemblyData,
    isLoading: assemblyLoading,
    error: assemblyError,
  } = useAssemblyOrder(orderId);

  const stopAssemblyMutation = useStopAssembly();
  const startAssemblyMutation = useStartAssembly();
  const deleteProductMutation = useDeleteProduct();
  const reduceCountMutation = useReduceCount();
  const createProductMutation = useCreateProduct();

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate({
      id: orderId,
      idProducts: [id],
    });
  };

  const handleReduceCount = (id: number, count: number) => {
    reduceCountMutation.mutate({
      id: orderId,
      idProducts: [{ id, count }],
    });
  };

  const handleAddProducts = (productIds: number[]) => {
    createProductMutation.mutate({
      id: orderId,
      idProducts: productIds,
    });
  };
  const stopAssemblyDialog = useConfirmDialog({
    ...CONFIRM_DIALOGS.STOP_ASSEMBLY, // Берем базовую конфигурацию
    description: `${CONFIRM_DIALOGS.STOP_ASSEMBLY.description} Заказ: ${assemblyData?.[0]?.order_number}`, // Добавляем номер заказа
    onConfirm: async () => {
      await stopAssemblyMutation.mutateAsync(orderId); // Выполняем API запрос
      onClose(); // Закрываем основной диалог после успеха
    },
  });

  const startAssemblyDialog = useConfirmDialog({
    ...CONFIRM_DIALOGS.START_ASSEMBLY, // Берем базовую конфигурацию
    description: `${CONFIRM_DIALOGS.START_ASSEMBLY.description} Заказ: ${assemblyData?.[0]?.order_number}`, // Добавляем номер заказа
    onConfirm: async () => {
      await startAssemblyMutation.mutateAsync({
        idOrder: orderId,
        storeId: shopId,
      });
      onClose();
    },
  });

  if (assemblyLoading) {
    return <div>Загрузка..</div>;
  }

  if (assemblyError) {
    return <div>Ошибка получения данных: {assemblyError.message}</div>;
  }

  if (!assemblyData || assemblyData.length === 0) {
    return <></>;
  }

  const order = assemblyData[0];

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
                <p>Заказ {order.order_number}</p>
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
                <p className="font-semibold">Статус сборки: </p>
                <StatusBadge status={order.assembly_status} type="assembly" />
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
                  {order.assembly_deadline === null
                    ? "Дедлайн не назначен"
                    : formatDate(order.assembly_deadline)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="px-2 py-4">
            <CardHeader className="px-0">
              <CardTitle>Заказчик</CardTitle>
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
              <CardTitle>Курьер</CardTitle>
              <CardDescription className="px-0">
                Информация о курьере
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {order.delivery_worker_id === 0 || null ? (
                <div>
                  <p>Курьер еще не назначен</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-row gap-2">
                    <p className="font-semibold">Имя курьера: </p>
                    {order.firstname_deliv || "Нет"}
                  </div>
                  <div className="flex flex-row gap-2">
                    <p className="font-semibold">Фамилия курьера: </p>
                    {order.lastname_deliv || "Нет"}
                  </div>
                  <div className="flex flex-row gap-2">
                    <p className="font-semibold">Телефон: </p>
                    {order.phone_deliv || "Нет"}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="px-2 py-4">
            <CardHeader className="px-0">
              <CardTitle>Заказ</CardTitle>
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
              <CardTitle>Продукты</CardTitle>
              <CardDescription className="px-0">
                Информация о продукте
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {order.products_details.map((product) => (
                <div key={product.id} className="flex flex-col ">
                  <div className="border-1 rounded-2xl p-2 flex flex-col mb-4 w-full">
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
                    <div className="flex justify-end gap-2">
                      <Button
                        className="mt-4 w-[35%] bg-red-600 hover:bg-red-700"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Удалить продукт полностью
                      </Button>

                      <Dialog
                        open={isReduceCountDialogOpen}
                        onOpenChange={setIsReduceCountDialogOpen}
                      >
                        <DialogTrigger asChild className="w-[35%]">
                          <Button
                            className="mt-4 bg-red-600 hover:bg-red-700"
                            size="sm"
                          >
                            Удалить одну единицу продукта
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex flex-col gap-2">
                              <span>Удалить одну единицу продукта</span>
                              <span className="font-semibold">
                                &quot;
                                {product.name}
                                &quot; ?
                              </span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col gap-4">
                            {product.count === 1 ? (
                              <p>
                                Вы полностью удалите продукт{" "}
                                <span className="text-lg font-semibold">
                                  {product.name}
                                </span>{" "}
                                из заказа
                              </p>
                            ) : (
                              <p>
                                Вы удалите одну штуку{" "}
                                <span className="text-lg font-semibold">
                                  {product.name}
                                </span>
                              </p>
                            )}
                            <div className="flex flex-col gap-2">
                              <p>
                                Сейчас:{" "}
                                <span className="text-md font-semibold">
                                  {product.count} шт.
                                </span>
                              </p>
                              <p>
                                После удаления будет:{" "}
                                <span className="text-md font-semibold">
                                  {product.count - 1} шт.
                                </span>
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            {product.count === 1 ? (
                              <AlertDialog>
                                <AlertDialogTrigger>
                                  <Button
                                    className="bg-red-600 hover:bg-red-700"
                                    size={"sm"}
                                  >
                                    Удалить
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Вы точно уверены?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Полное удаление продукта{" "}
                                      <span className="font-semibold text-md">
                                        {product.name}
                                      </span>{" "}
                                      невозможно будет отменить
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Отмена
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleReduceCount(product.id, 1)
                                      }
                                    >
                                      Продолжить
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <Button
                                className="bg-red-600 hover:bg-red-700"
                                size={"sm"}
                                onClick={() => handleReduceCount(product.id, 1)}
                              >
                                Отмена
                              </Button>
                            )}

                            <Button
                              size={"sm"}
                              onClick={() => setIsReduceCountDialogOpen(false)}
                            >
                              Отмена
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                size={"sm"}
                onClick={() => setIsAddProductsDialogOpen(true)}
              >
                Добавить продукт
              </Button>
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
            <CardHeader>
              <CardTitle>Управление</CardTitle>
              <CardDescription className="px-0">
                Управление заказом
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 flex flex-row gap-4">
              <Button
                onClick={stopAssemblyDialog.openDialog}
                disabled={
                  stopAssemblyMutation.isPending ||
                  order.assembly_status === "completed" ||
                  order.assembly_status === "pending"
                }
                className={cn(
                  order.assembly_status === "in_progress" ? "bg-red-600" : ""
                )}
              >
                {order.assembly_status === "in_progress"
                  ? "Завершить сборку"
                  : "Сборка завершена"}
              </Button>

              <Button
                onClick={startAssemblyDialog.openDialog}
                disabled={
                  startAssemblyMutation.isPending ||
                  order.assembly_status === "completed" ||
                  order.assembly_status === "in_progress"
                }
                className={cn(
                  order.assembly_status === "pending" ? "bg-green-600" : ""
                )}
              >
                {order.assembly_status === "pending"
                  ? "Начать сборку"
                  : "Сборка начата"}
              </Button>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={stopAssemblyDialog.isOpen}
        onClose={stopAssemblyDialog.closeDialog}
        onConfirm={stopAssemblyDialog.handleConfirm}
        isLoading={
          stopAssemblyDialog.isLoading || stopAssemblyMutation.isPending
        }
        {...stopAssemblyDialog.dialogProps}
      />
      <ConfirmDialog
        isOpen={startAssemblyDialog.isOpen}
        onClose={startAssemblyDialog.closeDialog}
        onConfirm={startAssemblyDialog.handleConfirm}
        isLoading={
          startAssemblyDialog.isLoading || startAssemblyMutation.isPending
        }
        {...startAssemblyDialog.dialogProps}
      />

      <AddProductsDialog
        orderId={orderId}
        isOpen={isAddProductsDialogOpen}
        onClose={() => setIsAddProductsDialogOpen(false)}
        onAddProducts={handleAddProducts}
        isLoading={createProductMutation.isPending}
      />
    </>
  );
};
export default AssemblyDetailsDialog;
