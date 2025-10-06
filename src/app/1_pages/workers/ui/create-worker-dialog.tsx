import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { USER_ROLE } from "../../auth/types/role.enum";
import { useCreateWorker } from "../hooks/use-workers";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateWorkerDialog = ({ open, onClose }: Props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<USER_ROLE>(USER_ROLE.WORKER);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const createWorker = useCreateWorker();

  const handleRoleChange = (value: USER_ROLE) => {
    setRole(value);
  };

  const formatPhoneNumber = (value: string): string => {
    // Удаляем все символы кроме цифр
    const digits = value.replace(/\D/g, "");

    // Если начинается с 8, заменяем на 7
    if (digits.startsWith("8")) {
      return "+7" + digits.slice(1);
    }

    // Если начинается с 7, добавляем +
    if (digits.startsWith("7")) {
      return "+" + digits;
    }

    // Если начинается с 9, добавляем +7
    if (digits.startsWith("9")) {
      return "+7" + digits;
    }

    // Если есть цифры, добавляем +7
    if (digits.length > 0) {
      return "+7" + digits;
    }

    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    // Ограничиваем длину до +7 + 10 цифр
    if (formatted.length <= 12) {
      setPhoneNumber(formatted);
    }
  };

  const handleCreateWorker = () => {
    createWorker.mutate({ firstName, lastName, phone: phoneNumber, role });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить сотрудника</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p>Имя сотрудника</p>
            <Input
              type="text"
              required
              placeholder="Имя сотрудника"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p>Фамилия сотрудника</p>
            <Input
              type="text"
              required
              placeholder="Фамилия сотрудника"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p>Телефон сотрудника</p>
            <Input
              type="tel"
              placeholder="+79001234567"
              value={phoneNumber}
              onChange={handlePhoneChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <p>Роль сотрудника</p>
            <Select value={role} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Роль сотрудника" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">Суперадмин</SelectItem>
                <SelectItem value="admin">Админ</SelectItem>
                <SelectItem value="worker">Сотрудник</SelectItem>
                <SelectItem value="courier">Курьер</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreateWorker}>Создать сотрудника</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
