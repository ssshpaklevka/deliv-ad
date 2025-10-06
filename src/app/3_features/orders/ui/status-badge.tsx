import {
  AssemblyStatus,
  DeliveryStatus,
} from "@/app/1_pages/orders/enum/assembly-status.enum";
import { Clock, Package, CheckCircle, XCircle, Handshake } from "lucide-react";

interface StatusConfig {
  label: string;
  icon: React.ReactNode;
  bgColor: string;
}

interface Props {
  status: string;
  type: "assembly" | "delivery";
}

const StatusBadge = ({ status, type }: Props) => {
  const getStatusConfig = (): StatusConfig => {
    if (type === "assembly") {
      switch (status) {
        case AssemblyStatus.PENDING:
          return {
            label: "Ожидает",
            icon: <Clock className="w-3 h-3" />,
            bgColor: "bg-yellow-400",
          };
        case AssemblyStatus.IN_PROGRESS:
          return {
            label: "В работе",
            icon: <Package className="w-3 h-3" />,
            bgColor: "bg-blue-400",
          };
        case AssemblyStatus.COMPLETED:
          return {
            label: "Выполнен",
            icon: <CheckCircle className="w-3 h-3" />,
            bgColor: "bg-green-400",
          };
        case AssemblyStatus.CANCELLED:
          return {
            label: "Отменен",
            icon: <XCircle className="w-3 h-3" />,
            bgColor: "bg-red-400",
          };
        default:
          return {
            label: status,
            icon: null,
            bgColor: "bg-gray-400",
          };
      }
    } else {
      // delivery
      switch (status) {
        case DeliveryStatus.PENDING:
          return {
            label: "Ожидает",
            icon: <Clock className="w-3 h-3" />,
            bgColor: "bg-yellow-400",
          };
        case DeliveryStatus.IN_PROGRESS:
          return {
            label: "В работе",
            icon: <Package className="w-3 h-3" />,
            bgColor: "bg-blue-400",
          };
        case DeliveryStatus.EXPECTATION:
          return {
            label: "Ожидает заказчика",
            icon: <Handshake className="w-3 h-3" />,
            bgColor: "bg-purple-400",
          };
        case DeliveryStatus.COMPLETED:
          return {
            label: "Выполнен",
            icon: <CheckCircle className="w-3 h-3" />,
            bgColor: "bg-green-400",
          };
        case DeliveryStatus.CANCELLED:
          return {
            label: "Отменен",
            icon: <XCircle className="w-3 h-3" />,
            bgColor: "bg-red-400",
          };
        default:
          return {
            label: status,
            icon: null,
            bgColor: "bg-gray-400",
          };
      }
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`w-fit px-2 flex flex-row gap-2 items-center ${config.bgColor} rounded-xl`}
    >
      {config.icon}
      <p className="text-sm">{config.label}</p>
    </div>
  );
};

export default StatusBadge;
