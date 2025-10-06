"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  ShoppingCart,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { Orders } from "../1_pages/orders";
import Products from "../1_pages/products/ui/products";
import { Shifts } from "../1_pages/shifts";
import Employees from "../1_pages/workers/ui/workers";
import { AdminSidebar } from "./sidebar";

type ActiveSection = "dashboard" | "orders" | "workers" | "shifts" | "products";

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("orders");

  const renderContent = () => {
    switch (activeSection) {
      case "orders":
        return <Orders />;
      case "workers":
        return <Employees />;
      case "shifts":
        return <Shifts />;
      case "products":
        return <Products />;
      default:
        return <Orders />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
}

function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
        <p className="text-muted-foreground">
          Обзор текущего состояния системы
        </p>
      </div>

      {/* Статистические карточки */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего заказов</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% с прошлого месяца
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Активных заказов</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сотрудники</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">12 на смене</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные смены
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Из 12 запланированных
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Быстрые действия и статусы */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Последние заказы</CardTitle>
            <CardDescription>Недавно поступившие заказы</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "#1234", status: "new", time: "2 мин назад" },
              { id: "#1235", status: "processing", time: "5 мин назад" },
              { id: "#1236", status: "completed", time: "12 мин назад" },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{order.id}</div>
                  <Badge
                    variant={
                      order.status === "new"
                        ? "default"
                        : order.status === "processing"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {order.status === "new"
                      ? "Новый"
                      : order.status === "processing"
                        ? "В работе"
                        : "Завершен"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.time}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Статус сотрудников</CardTitle>
            <CardDescription>Текущее состояние команды</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-green-600" />
                <span>На смене</span>
              </div>
              <span className="font-medium">12</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span>Перерыв</span>
              </div>
              <span className="font-medium">3</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserX className="h-4 w-4 text-red-600" />
                <span>Не на смене</span>
              </div>
              <span className="font-medium">30</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
