import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  isOpen: boolean; // Открыт ли диалог
  onClose: () => void; // Функция закрытия
  onConfirm: () => void; // Функция подтверждения
  title: string; // Заголовок диалога
  description: string; // Описание действия
  confirmText?: string; // Текст кнопки подтверждения
  cancelText?: string; // Текст кнопки отмены
  isLoading?: boolean; // Состояние загрузки
  variant?: "default" | "destructive" | "success" | "warning"; // Цветовая схема
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  isLoading = false,
  variant = "default",
}: ConfirmDialogProps) => {
  // Функция для выбора стилей кнопки в зависимости от варианта
  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return "bg-red-600 hover:bg-red-700"; // Красный для удаления/отмены
      case "success":
        return "bg-red-600 hover:bg-red-700"; // Зеленый для завершения
      case "warning":
        return "bg-yellow-400 hover:bg-yellow-500"; // Желтый для предупреждений
      default:
        return "bg-green-600 hover:bg-green-700"; // Синий по умолчанию
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={getVariantStyles()}
          >
            {isLoading ? "Выполнение..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
