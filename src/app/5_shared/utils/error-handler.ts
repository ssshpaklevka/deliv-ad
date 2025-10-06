import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    if (Array.isArray(error.response.data.message)) {
      return error.response.data.message.join(", ");
    }
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return "Произошла неизвестная ошибка";
};

export const useErrorHandler = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const showError = (error: any, title: string = "Ошибка") => {
    const message = getErrorMessage(error);
    toast.error(title, {
      description: message,
    });
  };

  const showSuccess = (message: string, title: string = "Успешно") => {
    toast.success(title, {
      description: message,
    });
  };

  const showWarning = (message: string, title: string = "Внимание") => {
    toast.warning(title, {
      description: message,
    });
  };

  const showInfo = (message: string, title: string = "Информация") => {
    toast.info(title, {
      description: message,
    });
  };

  return { showError, showSuccess, showWarning, showInfo };
};
