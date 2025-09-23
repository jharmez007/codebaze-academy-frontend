import { toast } from "sonner";

/**
 * Success toast
 */
export const successToast = (message: string) => {
  toast.success(message, { duration: 3000 });
};

/**
 * Error toast
 */
export const errorToast = (message: string) => {
  toast.error(message, { duration: 4000 });
};

/**
 * Info toast
 */
export const infoToast = (message: string) => {
  toast(message, { duration: 3000 });
};

/**
 * Warning toast
 */
export const warningToast = (message: string) => {
  toast.warning(message, { duration: 3500 });
};

/**
 * Promise-based toast (loading → success/error)
 */
export const promiseToast = <T>(
  action: Promise<T>,
  messages: { loading: string; success: string; error: string }
) => {
  return toast.promise(action, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
};
