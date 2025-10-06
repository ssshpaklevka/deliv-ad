import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { MultiSelect } from "../../../../components/ui/multiselect";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useGetProducts } from "../../products/hook/use-products";
import { DeliveryType } from "../enum/assembly-status.enum";
import { useCreateOrder } from "../hooks/use-orders";
import { useGetAllStores } from "../hooks/use-stores";
import { CreateOrder } from "../types/orders-dto";

// Схема валидации
const createOrderSchema = z.object({
  orderNumber: z.string().min(1, "Номер заказа обязателен"),
  delivery_type: z.nativeEnum(DeliveryType),
  comment: z.string().optional(),
  paid: z.boolean(),
  productIds: z.array(z.string()).min(1, "Выберите хотя бы один продукт"),
  first_name: z.string().min(1, "Имя обязательно"),
  last_name: z.string().min(1, "Фамилия обязательна"),
  phone: z.string().min(1, "Телефон обязателен"),
  address: z.string().optional(),
  apartment: z.string().optional(),
  entrance: z.string().optional(),
  floor: z.string().optional(),
  intercom: z.string().optional(),
  storeId: z.number().min(1, "Выберите магазин"),
});

type CreateOrderFormData = z.infer<typeof createOrderSchema>;

interface Props {
  shopId: number;
  isOpen: boolean;
  onClose: () => void;
}

const CreateOrderDialog = ({ shopId, isOpen, onClose }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      paid: true,
      productIds: [],
    },
  });

  const watchedProductIds = watch("productIds");
  const watchedStoreId = watch("storeId");
  const watchedDeliveryType = watch("delivery_type");

  const {
    data: storesData,
    isLoading: storesLoading,
    error: storesError,
  } = useGetAllStores();

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProducts();

  const createOrder = useCreateOrder();

  // Устанавливаем выбранный магазин по умолчанию
  useEffect(() => {
    if (storesData?.length && !watchedStoreId) {
      setValue("storeId", shopId);
    }
  }, [storesData, watchedStoreId, setValue, shopId]);

  const handleShopChange = (shopId: string) => {
    setValue("storeId", parseInt(shopId));
  };

  const handleProductChange = (productIds: string[]) => {
    setValue("productIds", productIds);
  };

  const handleDeliveryTypeChange = (type: string) => {
    setValue("delivery_type", type as DeliveryType);
  };

  const handlePaidChange = (paid: boolean) => {
    setValue("paid", paid);
  };

  const onSubmit = async (data: CreateOrderFormData) => {
    console.log(data);
    try {
      const orderData: CreateOrder = {
        ...data,
        productIds: data.productIds.map((id) => parseInt(id)),
        storeId: data.storeId,
        apartment: data.apartment ? parseInt(data.apartment) : undefined,
        entrance: data.entrance ? parseInt(data.entrance) : undefined,
        floor: data.floor ? parseInt(data.floor) : undefined,
      };
      console.log("Конечная дата", orderData);
      await createOrder.mutateAsync(orderData);

      // Очищаем форму и закрываем диалог
      reset();
      onClose();
    } catch (error) {
      console.error("Ошибка создания заказа:", error);
    }
  };

  const deliveryTypeOptions = [
    { value: DeliveryType.FAST, label: "Быстрая" },
    { value: DeliveryType.STANDARD, label: "Стандартная" },
    { value: DeliveryType.SELFPICKUP, label: "Самовывоз" },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-5 max-w-3xl!">
          <DialogHeader>
            <DialogTitle>
              <p>Создание нового заказа</p>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <p>Номер заказа</p>
                    <Input
                      placeholder="Номер заказа"
                      {...register("orderNumber")}
                    />
                    {errors.orderNumber && (
                      <p className="text-sm text-red-500">
                        {errors.orderNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <p>Тип доставки</p>
                    <Select
                      value={watchedDeliveryType}
                      onValueChange={handleDeliveryTypeChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите тип доставки" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {deliveryTypeOptions.map((option) => (
                            <SelectItem value={option.value} key={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.delivery_type && (
                      <p className="text-sm text-red-500">
                        {errors.delivery_type.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <p>Комментарий к заказу</p>
                    <Input placeholder="Комментарий" {...register("comment")} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <p>Имя заказчика</p>
                    <Input
                      placeholder="Имя заказчика"
                      {...register("first_name")}
                    />
                    {errors.first_name && (
                      <p className="text-sm text-red-500">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <p>Фамилия заказчика</p>
                    <Input
                      placeholder="Фамилия заказчика"
                      {...register("last_name")}
                    />
                    {errors.last_name && (
                      <p className="text-sm text-red-500">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <p>Телефон заказчика</p>
                    <Input
                      placeholder="Телефон заказчика"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <p>Адрес доставки</p>
                    <Input
                      placeholder="Адрес доставки"
                      {...register("address")}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <p>Квартира</p>
                    <Input placeholder="Квартира" {...register("apartment")} />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <p>Подъезд</p>
                    <Input placeholder="Подъезд" {...register("entrance")} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <p>Этаж</p>
                    <Input placeholder="Этаж" {...register("floor")} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <p>Домофон</p>
                    <Input placeholder="Домофон" {...register("intercom")} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <p>Заказ оплачен</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant={watch("paid") === true ? "default" : "outline"}
                        onClick={() => handlePaidChange(true)}
                        className={
                          watch("paid") === true
                            ? "bg-green-600 hover:bg-green-700 flex-1"
                            : ""
                        }
                      >
                        Да
                      </Button>
                      <Button
                        type="button"
                        variant={
                          watch("paid") === false ? "default" : "outline"
                        }
                        onClick={() => handlePaidChange(false)}
                        className={
                          watch("paid") === false
                            ? "bg-red-600 hover:bg-red-700"
                            : ""
                        }
                      >
                        Нет
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p>Магазин</p>
                    <Select
                      value={watchedStoreId?.toString()}
                      onValueChange={handleShopChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите магазин" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {storesData?.map((store) => (
                            <SelectItem
                              value={store.id.toString()}
                              key={store.id}
                            >
                              {store.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.storeId && (
                      <p className="text-sm text-red-500">
                        {errors.storeId.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <p>Продукты</p>
                    <MultiSelect
                      value={watchedProductIds}
                      onValueChange={handleProductChange}
                      options={
                        productsData?.map((product) => ({
                          label: product.name,
                          value: product.id.toString(),
                        })) || []
                      }
                      placeholder="Выберите продукты"
                    />
                    {errors.productIds && (
                      <p className="text-sm text-red-500">
                        {errors.productIds.message}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Создание..." : "Создать заказ"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateOrderDialog;
