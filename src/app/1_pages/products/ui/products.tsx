"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetProducts } from "../hook/use-products";

export function Products() {
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Управление продуктами
        </h1>
        <p className="text-muted-foreground">
          Отслеживание и управление продуктами
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Продукты</CardTitle>
          <CardDescription>
            Управление всеми продуктами в системе
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {productsLoading ? (
            <div className="col-span-full flex justify-center items-center py-8">
              <p className="">Загрузка...</p>
            </div>
          ) : productsError ? (
            <div className="col-span-full flex justify-center items-center py-8">
              <p className="">Произошла ошибка при загрузке данных</p>
            </div>
          ) : productsData?.length ? (
            productsData.map((product) => (
              <div
                key={product.id}
                className="flex flex-row items-center gap-4"
              >
                <div className="">
                  <Card
                    style={{
                      backgroundImage: product.images[0]
                        ? `url(${product.images[0]})`
                        : "url(/products/cover.png)",
                    }}
                    className="size-[100px] md:size-[140px] aspect-square bg-accent bg-no-repeat bg-center bg-cover"
                  />
                </div>
                <div className="">
                  <p className="text-xl">{product.name}</p>
                  <div className="flex flex-row gap-6 mt-4">
                    <p className="text-xl">{product.price} ₽</p>
                    <p className="text-xl">{product.weight} кг.</p>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Артикул: {product.article}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Баркод: {product.barcode}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center py-8">
              <p className="">Товары не найдены</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
export default Products;
