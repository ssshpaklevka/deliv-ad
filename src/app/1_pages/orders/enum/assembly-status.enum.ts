export enum AssemblyStatus {
  PENDING = "pending", // Ждет сборщика
  IN_PROGRESS = "in_progress", // Собирается
  COMPLETED = "completed", // Собран
  CANCELLED = "cancelled", //Отменен
}

export enum DeliveryStatus {
  PENDING = "pending", // Ждет курьера
  IN_PROGRESS = "in_progress", // Доставляется
  EXPECTATION = "expectation", // Кнопка я на месте
  COMPLETED = "completed", // Доставлен
  CANCELLED = "cancelled", //Отменен
}

export enum DeliveryType {
  FAST = "fast", // Быстрая
  STANDARD = "standard", // Обыная доставка
  SELFPICKUP = "selfpickup", // Самовывзо
}
