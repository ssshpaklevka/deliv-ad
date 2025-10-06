"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Users,
  Play,
  Square,
  Eye,
  UserCheck,
  PanelsTopLeft,
  Check,
  X,
} from "lucide-react";
import { useGetShifts } from "../hooks/use-shifts";
import CardInfo from "@/components/ui/card-info";
import TableShifts from "./table-shifts";

type ShiftStatus = "active" | "closed" | "scheduled";

interface Shift {
  id: string;
  employeeName: string;
  position: string;
  startTime: string;
  endTime?: string;
  status: ShiftStatus;
  duration?: string;
  date: string;
}

const mockShifts: Shift[] = [
  {
    id: "S001",
    employeeName: "Иван Петров",
    position: "Повар",
    startTime: "08:00",
    endTime: undefined,
    status: "active",
    date: "2024-01-15",
  },
  {
    id: "S002",
    employeeName: "Мария Сидорова",
    position: "Официант",
    startTime: "09:00",
    endTime: undefined,
    status: "active",
    date: "2024-01-15",
  },
  {
    id: "S003",
    employeeName: "Алексей Козлов",
    position: "Бариста",
    startTime: "07:00",
    endTime: "15:00",
    status: "closed",
    duration: "8ч 0м",
    date: "2024-01-15",
  },
  {
    id: "S004",
    employeeName: "Елена Волкова",
    position: "Менеджер",
    startTime: "10:00",
    endTime: "18:00",
    status: "closed",
    duration: "8ч 0м",
    date: "2024-01-14",
  },
  {
    id: "S005",
    employeeName: "Дмитрий Новиков",
    position: "Курьер",
    startTime: "14:00",
    endTime: undefined,
    status: "scheduled",
    date: "2024-01-15",
  },
];

const Shifts = () => {
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadge = (status: ShiftStatus) => {
    const statusConfig = {
      active: { label: "Активная", variant: "default" as const, icon: Play },
      closed: { label: "Закрыта", variant: "outline" as const, icon: Square },
      scheduled: {
        label: "Запланирована",
        variant: "secondary" as const,
        icon: Calendar,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const closeShift = (shiftId: string) => {
    const now = new Date();
    const endTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    setShifts(
      shifts.map((shift) => {
        if (shift.id === shiftId && shift.status === "active") {
          const start = new Date(`2024-01-01 ${shift.startTime}`);
          const end = new Date(`2024-01-01 ${endTime}`);
          const durationMs = end.getTime() - start.getTime();
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor(
            (durationMs % (1000 * 60 * 60)) / (1000 * 60),
          );

          return {
            ...shift,
            status: "closed" as const,
            endTime,
            duration: `${hours}ч ${minutes}м`,
          };
        }
        return shift;
      }),
    );
  };

  const startShift = (shiftId: string) => {
    const now = new Date();
    const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    setShifts(
      shifts.map((shift) =>
        shift.id === shiftId && shift.status === "scheduled"
          ? { ...shift, status: "active" as const, startTime }
          : shift,
      ),
    );
  };

  // const filteredShifts = shifts.filter((shift) => {
  //   const matchesStatus =
  //     statusFilter === "all" || shift.status === statusFilter;
  //   const matchesSearch =
  //     shift.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     shift.position.toLowerCase().includes(searchQuery.toLowerCase());
  //   return matchesStatus && matchesSearch;
  // });

  const getShiftCounts = () => {
    return {
      active: shifts.filter((s) => s.status === "active").length,
      closed: shifts.filter((s) => s.status === "closed").length,
      scheduled: shifts.filter((s) => s.status === "scheduled").length,
    };
  };

  const shiftCounts = getShiftCounts();

  const {
    data: shiftsData,
    isLoading: shiftsLoading,
    error: shiftsError,
  } = useGetShifts();

  const activeShifts =
    shiftsData?.filter((shift) => shift.status === true).length || 0;
  const closeShifts =
    shiftsData?.filter((shift) => shift.status === false).length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Управление сменами
        </h1>
        <p className="text-muted-foreground">
          Отслеживание активных и закрытых смен
        </p>
      </div>

      {/* Статистика смен */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CardInfo
          count={activeShifts}
          title="Активные смены"
          icons={<Check className="w-4 h-4 text-green-600" />}
        />
        <CardInfo
          count={closeShifts}
          title="Завершенные смены"
          icons={<X className="w-4 h-4 text-red-600" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Смены сотрудников</CardTitle>
          <CardDescription>Управление рабочими сменами</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Таблица смен */}
          <div>
            <TableShifts
              data={shiftsData}
              error={shiftsError}
              loading={shiftsLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Shifts;
