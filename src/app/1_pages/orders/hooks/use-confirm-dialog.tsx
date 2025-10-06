// hooks/useConfirmDialog.ts
import { useState } from "react";

// Экспортируем интерфейс для использования в других местах
export interface UseConfirmDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "success" | "warning";
  onConfirm: () => Promise<void> | void;
}

export const useConfirmDialog = ({
  title,
  description,
  confirmText,
  cancelText,
  variant,
  onConfirm,
}: UseConfirmDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      closeDialog();
    } catch (error) {
      console.error("Ошибка при выполнении действия:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    isLoading,
    openDialog,
    closeDialog,
    handleConfirm,
    dialogProps: {
      title,
      description,
      confirmText,
      cancelText,
      variant,
    },
  };
};
