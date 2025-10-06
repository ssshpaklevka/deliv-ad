"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Apple, Calendar, LogOut, ShoppingCart, Users } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../1_pages/auth/context/auth-context";

type ActiveSection = "dashboard" | "orders" | "workers" | "shifts" | "products";

interface AdminSidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export function AdminSidebar({
  activeSection,
  onSectionChange,
}: AdminSidebarProps) {
  const menuItems = [
    // {
    //   id: "dashboard" as const,
    //   label: "Дашборд",
    //   icon: LayoutDashboard,
    // },
    {
      id: "orders" as const,
      label: "Заказы",
      icon: ShoppingCart,
    },
    {
      id: "workers" as const,
      label: "Сотрудники",
      icon: Users,
    },
    {
      id: "shifts" as const,
      label: "Смены",
      icon: Calendar,
    },
    {
      id: "products" as const,
      label: "Продукты",
      icon: Apple,
    },
  ];

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Ошибка при выходе", error);
    }
  };
  return (
    <div className="w-64 border-r bg-card flex flex-col items-center">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Админ панель</h2>
      </div>
      <nav className="space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                activeSection === item.id && "bg-secondary"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      <Button className="mt-10" onClick={handleLogout}>
        <LogOut />
        Выйти из аккаунта
      </Button>
    </div>
  );
}
