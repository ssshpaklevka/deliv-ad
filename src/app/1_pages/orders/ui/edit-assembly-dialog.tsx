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
import { AssemblyStatus, DeliveryType } from "../enum/assembly-status.enum";
import { useAssemblyOrder, useUpdateOrder } from "../hooks/use-orders";
import { UpdateOrder } from "../types/orders-dto";

interface Props {
  orderId: number;
  shopId: number;
  isOpen: boolean;
  onClose: () => void;
}

const EditAssemblyDialog = ({ orderId, shopId, isOpen, onClose }: Props) => {
  const [formData, setFormData] = useState<UpdateOrder>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const {
    data: assemblyData,
    isLoading: assemblyLoading,
    error: assemblyError,
  } = useAssemblyOrder(orderId);

  const {
    data: workersData,
    isLoading: workersLoading,
    error: workersError,
  } = useGetWorkers();

  const updateOrderMutation = useUpdateOrder();

  // Заполняем форму данными заказа при загрузке
  useEffect(() => {
    if (assemblyData && assemblyData.length > 0) {
      const order = assemblyData[0];
      setFormData({
        order_number: order.order_number,
        delivery_type: order.delivery_type,
        comment: order.comment || "",
        paid: order.paid,
        first_name: order.firstname_customer,
        last_name: order.lastname_customer,
        phone: order.phone_customer,
        assembly_deadline: order.assembly_deadline,
        assembly_status: order.assembly_status,
        assembly_worker_id: order.assembly_worker_id,
        delivery_worker_id: order.delivery_worker_id,
      });
    }
  }, [assemblyData]);

  // Проверяем валидность формы
  useEffect(() => {
    const isValid = !!(
      formData.first_name?.trim() &&
      formData.last_name?.trim() &&
      formData.phone?.trim()
    );
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

  if (assemblyLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div>Загрузка...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (assemblyError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div>Ошибка получения данных: {assemblyError.message}</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!assemblyData || assemblyData.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div>Заказ не найден</div>
        </DialogContent>
      </Dialog>
    );
  }

  const order = assemblyData[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger></DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-5 max-w-2xl">
        <DialogHeader>
          <DialogTitle>Редактировать заказ {order.order_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Информация о заказчике</CardTitle>
              <CardDescription>Редактируйте данные заказчика</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Имя *</Label>
                  <Input
                    id="firstName"
                    value={formData.first_name || ""}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                    placeholder="Имя заказчика"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия *</Label>
                  <Input
                    id="lastName"
                    value={formData.last_name || ""}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                    placeholder="Фамилия заказчика"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+79001234567"
                />
              </div>
            </CardContent>
          </Card>

          {/* Информация о заказе */}
          <Card>
            <CardHeader>
              <CardTitle>Информация о заказе</CardTitle>
              <CardDescription>Редактируйте параметры заказа</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Номер заказа</Label>
                  <Input
                    id="orderNumber"
                    value={formData.order_number || ""}
                    onChange={(e) =>
                      handleInputChange("order_number", e.target.value)
                    }
                    placeholder="Номер заказа"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryType">Тип доставки</Label>
                  <Select
                    value={formData.delivery_type || ""}
                    onValueChange={(value) =>
                      handleInputChange("delivery_type", value as DeliveryType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип доставки" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DeliveryType.FAST}>Быстрая</SelectItem>
                      <SelectItem value={DeliveryType.STANDARD}>
                        Обычная
                      </SelectItem>
                      <SelectItem value={DeliveryType.SELFPICKUP}>
                        Самовывоз
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="paid">Заказ оплачен</Label>
                <div className="flex flex-row gap-2">
                  <Button
                    variant={formData.paid === true ? "default" : "outline"}
                    onClick={() => handleInputChange("paid", true)}
                  >
                    Да
                  </Button>
                  <Button
                    variant={formData.paid === false ? "default" : "outline"}
                    onClick={() => handleInputChange("paid", false)}
                  >
                    Нет
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assembly_deadline">Дедлайн сборки</Label>
                <Input
                  id="assembly_deadline"
                  value={formData.assembly_deadline || ""}
                  onChange={(e) =>
                    handleInputChange("assembly_deadline", e.target.value)
                  }
                  placeholder="Дедлайн сборки"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assembly_status">Статус сборки</Label>
                <Select
                  value={formData.assembly_status || ""}
                  onValueChange={(value) =>
                    handleInputChange(
                      "assembly_status",
                      value as AssemblyStatus
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Статус сборки" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AssemblyStatus.PENDING}>
                      Ожидает
                    </SelectItem>
                    <SelectItem value={AssemblyStatus.IN_PROGRESS}>
                      Собирается
                    </SelectItem>
                    <SelectItem value={AssemblyStatus.COMPLETED}>
                      Выполнен
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assembly_completed_at">Окончание сборки</Label>
                <Input
                  id="assembly_completed_at"
                  value={formData.assembly_completed_at || ""}
                  onChange={(e) =>
                    handleInputChange("assembly_completed_at", e.target.value)
                  }
                  placeholder="Окончание сборки"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assembly_worker_id">Работник сборки</Label>
                <Select
                  value={formData.assembly_worker_id?.toString()}
                  onValueChange={(value) =>
                    handleInputChange("assembly_worker_id", value as string)
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
              <div className="space-y-2">
                <Label htmlFor="delivery_worker_id">Работник доставки</Label>
                <Select
                  value={formData.delivery_worker_id?.toString()}
                  onValueChange={(value) =>
                    handleInputChange("delivery_worker_id", value as string)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Работник доставки" />
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
            </CardContent>
          </Card>

          <div className="space-x-2">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || updateOrderMutation.isPending}
            >
              {updateOrderMutation.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAssemblyDialog;
