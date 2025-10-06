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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useGetWorkers } from "../../workers/hooks/use-workers";
import { DeliveryStatus } from "../enum/assembly-status.enum";
import { useDeliveryOrder, useUpdateOrder } from "../hooks/use-orders";
import { UpdateOrder } from "../types/orders-dto";

interface Props {
  orderId: number;
  shopId: number;
  isOpen: boolean;
  onClose: () => void;
}

const EditDeliveryDialog = ({ orderId, shopId, isOpen, onClose }: Props) => {
  const [formData, setFormData] = useState<UpdateOrder>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const {
    data: deliveryData,
    isLoading: deliveryLoading,
    error: deliveryError,
  } = useDeliveryOrder(orderId);

  const {
    data: workersData,
    isLoading: workersLoading,
    error: workersError,
  } = useGetWorkers();

  const updateOrderMutation = useUpdateOrder();

  // Заполняем форму данными заказа при загрузке
  useEffect(() => {
    if (deliveryData && deliveryData.length > 0) {
      const order = deliveryData[0];

      // Конвертируем дату в формат для datetime-local
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        delivery_deadline: formatDateForInput(order.delivery_deadline),
        delivery_status: order.delivery_status as DeliveryStatus,
        assembly_worker_id: order.assembly_worker_id || undefined,
        paid: order.paid,
        comment: order.comment || "",
        address: order.address,
        apartment: order.apartment ? parseInt(order.apartment) : undefined,
        entrance: order.entrance ? parseInt(order.entrance) : undefined,
        floor: order.floor ? parseInt(order.floor) : undefined,
        intercom: order.intercom || "",
      });
    }
  }, [deliveryData]);

  // Проверяем валидность формы
  useEffect(() => {
    const isValid = !!(formData.delivery_deadline && formData.address?.trim());
    setIsFormValid(isValid);
  }, [formData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: keyof UpdateOrder, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (isFormValid) {
      updateOrderMutation.mutate(
        { order: formData, id: orderId },
        {
          onSuccess: () => {
            onClose();
            setFormData({});
          },
        }
      );
    }
  };

  if (deliveryLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div>Загрузка...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (deliveryError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div>Ошибка получения данных: {deliveryError.message}</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!deliveryData || deliveryData.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div>Заказ не найден</div>
        </DialogContent>
      </Dialog>
    );
  }

  const order = deliveryData[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-5 max-w-2xl">
        <DialogHeader>
          <DialogTitle>Редактировать заказ {order.order_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Информация о доставке */}
          <Card>
            <CardHeader>
              <CardTitle>Информация о доставке</CardTitle>
              <CardDescription>Редактируйте параметры доставки</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delivery_deadline">Дедлайн доставки *</Label>
                <Input
                  id="delivery_deadline"
                  type="datetime-local"
                  value={formData.delivery_deadline || ""}
                  onChange={(e) =>
                    handleInputChange("delivery_deadline", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery_status">Статус доставки</Label>
                <Select
                  value={formData.delivery_status || ""}
                  onValueChange={(value) =>
                    handleInputChange(
                      "delivery_status",
                      value as DeliveryStatus
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Статус доставки" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DeliveryStatus.PENDING}>
                      Ожидает курьера
                    </SelectItem>
                    <SelectItem value={DeliveryStatus.IN_PROGRESS}>
                      Доставляется
                    </SelectItem>
                    <SelectItem value={DeliveryStatus.EXPECTATION}>
                      Курьер на месте
                    </SelectItem>
                    <SelectItem value={DeliveryStatus.COMPLETED}>
                      Доставлен
                    </SelectItem>
                    <SelectItem value={DeliveryStatus.CANCELLED}>
                      Отменен
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assembly_worker_id">Работник сборки</Label>
                <Select
                  value={formData.assembly_worker_id?.toString() || ""}
                  onValueChange={(value) =>
                    handleInputChange("assembly_worker_id", parseInt(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Работник сборки" />
                  </SelectTrigger>
                  <SelectContent>
                    {workersData?.map((worker) => (
                      <SelectItem key={worker.id} value={worker.id.toString()}>
                        {worker.firstName} {worker.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="paid"
                  checked={formData.paid || false}
                  onChange={(e) => handleInputChange("paid", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="paid">Заказ оплачен</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Комментарий</Label>
                <Textarea
                  id="comment"
                  value={formData.comment || ""}
                  onChange={(e) => handleInputChange("comment", e.target.value)}
                  placeholder="Комментарий к заказу"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Адрес доставки */}
          <Card>
            <CardHeader>
              <CardTitle>Адрес доставки</CardTitle>
              <CardDescription>Редактируйте адрес доставки</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Адрес *</Label>
                <Input
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Улица, дом"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apartment">Квартира</Label>
                  <Input
                    type="number"
                    id="apartment"
                    value={formData.apartment || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "apartment",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    placeholder="Номер квартиры"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entrance">Подъезд</Label>
                  <Input
                    type="number"
                    id="entrance"
                    value={formData.entrance || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "entrance",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    placeholder="Номер подъезда"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor">Этаж</Label>
                  <Input
                    type="number"
                    id="floor"
                    value={formData.floor || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "floor",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    placeholder="Номер этажа"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intercom">Домофон</Label>
                  <Input
                    id="intercom"
                    value={formData.intercom || ""}
                    onChange={(e) =>
                      handleInputChange("intercom", e.target.value)
                    }
                    placeholder="Код домофона"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Кнопки действий */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || updateOrderMutation.isPending}
            >
              {updateOrderMutation.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDeliveryDialog;
