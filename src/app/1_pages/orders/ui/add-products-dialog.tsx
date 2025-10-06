import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MultiSelect } from "@/components/ui/multiselect";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetProducts } from "../../products/hook/use-products";

interface Props {
  orderId: number;
  isOpen: boolean;
  onClose: () => void;
  onAddProducts: (productIds: number[]) => void;
  isLoading?: boolean;
}

const AddProductsDialog = ({
  orderId,
  isOpen,
  onClose,
  onAddProducts,
  isLoading = false,
}: Props) => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProducts();

  const handleAddProducts = () => {
    if (selectedProductIds.length === 0) {
      toast.error("Выберите хотя бы один продукт");
      return;
    }

    const productIds = selectedProductIds.map((id) => parseInt(id));
    onAddProducts(productIds);
    setSelectedProductIds([]);
    onClose();
  };

  const handleClose = () => {
    setSelectedProductIds([]);
    onClose();
  };

  const productOptions =
    productsData?.map((product) => ({
      label: `${product.name} - ${product.price} ₽ (${product.weight} кг)`,
      value: product.id.toString(),
    })) || [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="h-[60vh] max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить продукты в заказ</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full gap-4">
          <div className="flex-shrink-0 space-y-2">
            <label className="text-sm font-medium">Выберите продукты:</label>
            <MultiSelect
              options={productOptions}
              value={selectedProductIds}
              onValueChange={setSelectedProductIds}
              placeholder="Выберите продукты..."
              isLoading={productsLoading}
              maxCount={1}
            />
          </div>

          {productsError && (
            <div className="flex-shrink-0 text-red-500 text-sm">
              Ошибка загрузки продуктов: {productsError.message}
            </div>
          )}

          <div className="flex-1 min-h-0">
            <p className="text-sm font-medium mb-2">Выбранные продукты:</p>
            <div className="border rounded-md p-3 h-84 overflow-y-auto bg-gray-50">
              {selectedProductIds.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  Продукты не выбраны
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedProductIds.map((id) => {
                    const product = productsData?.find(
                      (product) => product.id === parseInt(id)
                    );
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between p-2 bg-white rounded border"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product?.name}</p>
                          <p className="text-xs text-gray-500">
                            {product?.price} ₽ • {product?.weight} кг •{" "}
                            {product?.barcode} бк
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedProductIds(
                              selectedProductIds.filter(
                                (selectedId) => selectedId !== id
                              )
                            )
                          }
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 flex space-x-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Отмена
            </Button>
            <Button
              onClick={handleAddProducts}
              disabled={
                isLoading || productsLoading || selectedProductIds.length === 0
              }
              className="flex-1"
            >
              {isLoading ? "Добавление..." : "Добавить"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductsDialog;
