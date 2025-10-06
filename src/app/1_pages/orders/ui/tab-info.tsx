import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { useAssemblyOrders, useDeliveryOrders } from "../hooks/use-orders";
import AssemblyDetailsDialog from "./assembly-details-dialog";
import CreateOrderDialog from "./create-order-dialog";
import DeliveryDetailsDialog from "./delivery-details-dialog";
import EditAssemblyDialog from "./edit-assembly-dialog";
import EditDeliveryDialog from "./edit-delivery-dialog";
import TableAssembly from "./table-assembly";
import TableDelivery from "./table-delivery";

interface Props {
  shopId: number;
}

const TableInfo = ({ shopId }: Props) => {
  // Для просмотра подробной информации
  const [selectedOrderIdAssemb, setSelectedOrderIdAssemb] = useState(0);
  const [selectedOrderIdDeliv, setSelectedOrderIdDeliv] = useState(0);
  const [dialogOpenAssemb, setDialogOpenAssemb] = useState(false);
  const [dialogOpenDeliv, setDialogOpenDeliv] = useState(false);
  const [dialogCreateOrd, setDialogCreateOrd] = useState(false);
  const [dialogEditOrd, setDialogEditOrd] = useState(false);
  const [dialogEditOrdDel, setDialogEditOrdDel] = useState(false);

  const {
    data: assemblyData,
    isLoading: assemblyLoading,
    error: assemblyError,
  } = useAssemblyOrders(shopId);

  const {
    data: deliveryData,
    isLoading: deliveryLoading,
    error: deliveryError,
  } = useDeliveryOrders(shopId);

  const handleViewDetailsAssemb = (id: number) => {
    setSelectedOrderIdAssemb(id);
    setDialogOpenAssemb(true);
  };

  const handleViewDetailsDeliv = (id: number) => {
    setSelectedOrderIdDeliv(id);
    setDialogOpenDeliv(true);
  };

  const handleCreateOrder = () => {
    setDialogCreateOrd(true);
  };

  const handleEditOrder = (id: number) => {
    setSelectedOrderIdAssemb(id);
    setDialogEditOrd(true);
  };

  const handleEditOrderDel = (id: number) => {
    setSelectedOrderIdDeliv(id);
    setDialogEditOrdDel(true);
  };

  return (
    <>
      <Tabs defaultValue="assembly">
        <div className="flex flex-row justify-between">
          <TabsList>
            <TabsTrigger value="assembly" className="hover:cursor-pointer">
              Сборка ({assemblyData?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="delivery" className="hover:cursor-pointer">
              Доставка ({deliveryData?.length || 0})
            </TabsTrigger>
          </TabsList>
          <Button onClick={handleCreateOrder} size={"sm"}>
            Создать заказ
          </Button>
        </div>
        <TabsContent value="assembly">
          <Card>
            <CardHeader>
              <CardTitle>Сборка</CardTitle>
              <CardDescription>Просмотр и управление сборками</CardDescription>
            </CardHeader>
            <CardContent>
              {assemblyData?.length === 0 ? (
                <div>Заказы отсутствуют. Попробуйте выбрать другой магазин</div>
              ) : (
                <TableAssembly
                  data={assemblyData}
                  loading={assemblyLoading}
                  error={assemblyError}
                  onViewDetails={handleViewDetailsAssemb}
                  onEditOrder={handleEditOrder}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Доставка</CardTitle>
              <CardDescription>
                Просмотр и управление доставками
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deliveryData?.length === 0 ? (
                <div>Заказы отсутствуют. Попробуйте выбрать другой магазин</div>
              ) : (
                <TableDelivery
                  data={deliveryData}
                  error={deliveryError}
                  loading={deliveryLoading}
                  onViewDetails={handleViewDetailsDeliv}
                  onEditOrder={handleEditOrderDel}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AssemblyDetailsDialog
        orderId={selectedOrderIdAssemb}
        shopId={shopId}
        isOpen={dialogOpenAssemb}
        onClose={() => setDialogOpenAssemb(false)}
      />

      <DeliveryDetailsDialog
        orderId={selectedOrderIdDeliv}
        shopId={shopId}
        isOpen={dialogOpenDeliv}
        onClose={() => setDialogOpenDeliv(false)}
      />

      <CreateOrderDialog
        shopId={shopId}
        isOpen={dialogCreateOrd}
        onClose={() => setDialogCreateOrd(false)}
      />

      <EditAssemblyDialog
        orderId={selectedOrderIdAssemb}
        shopId={shopId}
        isOpen={dialogEditOrd}
        onClose={() => setDialogEditOrd(false)}
      />

      <EditDeliveryDialog
        orderId={selectedOrderIdDeliv}
        shopId={shopId}
        isOpen={dialogEditOrdDel}
        onClose={() => setDialogEditOrdDel(false)}
      />
    </>
  );
};
export default TableInfo;
