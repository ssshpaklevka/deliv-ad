export const formatMinutes = (minutes: number | null) => {
  if (minutes === null || minutes === undefined || minutes === 0) {
    return "Дедлайн не назначен";
  }

  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${seconds} сек`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    if (remainingMinutes > 0) {
      return `${hours} ч ${remainingMinutes} мин`;
    } else {
      return `${hours} ч`;
    }
  } else {
    return `${minutes} мин`;
  }
};
