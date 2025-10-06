// config/confirmDialogs.ts
export const CONFIRM_DIALOGS = {
  // Диалог завершения сборки
  STOP_ASSEMBLY: {
    title: "Завершить сборку?",
    description:
      "Вы уверены, что хотите завершить сборку этого заказа? Это действие нельзя будет отменить.",
    confirmText: "Завершить сборку",
    variant: "success" as const, // as const нужен для правильной типизации
  },

  // Диалог начала сборки
  START_ASSEMBLY: {
    title: "Начать сборку?",
    description: "Вы уверены, что хотите начать сборку этого заказа?",
    confirmText: "Начать сборку",
    variant: "default" as const,
  },

  // Диалог начала доставки
  START_DELIVERY: {
    title: "Начать доставку?",
    description: "Вы уверены, что хотите начать доставку этого заказа?",
    confirmText: "Начать доставку",
    variant: "default" as const,
  },

  EXPECTION_DELIVERY: {
    title: "Курьер на месте?",
    description: "Подтвердите, что курьер прибыл к заказчику.",
    confirmText: "Я на месте",
    variant: "warning" as const,
  },

  STOP_DELIVERY: {
    title: "Завершить доставку?",
    description:
      "Вы уверены, что хотите завершить доставку этого заказа? Заказ будет отмечен как доставленный.",
    confirmText: "Завершить доставку",
    variant: "success" as const,
  },

  // Диалог отмены заказа
  CANCEL_ORDER: {
    title: "Отменить заказ?",
    description:
      "Вы уверены, что хотите отменить этот заказ? Это действие нельзя будет отменить.",
    confirmText: "Отменить заказ",
    variant: "destructive" as const,
  },
};
