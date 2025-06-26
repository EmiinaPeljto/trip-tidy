import toast from "react-hot-toast";

const baseStyle = {
  color: "#111827", // dark gray text
  padding: "14px 16px",
  borderRadius: "10px",
  fontSize: "14px",
  maxWidth: "300px",
  boxShadow: "0 3px 8px rgba(0, 0, 0, 0.08)",
  border: "1px solid transparent",
};

// Color palette
const colors = {
  success: "#DCFCE7", // light green
  error: "#FEE2E2", // light red
  info: "#F3F4F6", // light gray
  loading: "#E5E7EB", // gray-200
};

/**
 * Success toast with minimal styling
 * @param {string} message - The message to display
 * @param {object} options - Optional configuration overrides
 */
export const successToast = (message, options = {}) => {
  return toast.success(message, {
    duration: 2000,
    position: "top-right",
    style: {
      ...baseStyle,
      background: colors.success,
      borderColor: "#4ADE80",
    },
    iconTheme: {
      primary: "#16A34A",
      secondary: "#DCFCE7",
    },
    ...options,
  });
};

/**
 * Error toast with minimal styling
 * @param {string} message -
 * @param {object} options -
 */
export const errorToast = (message, options = {}) => {
  return toast.error(message, {
    duration: 3000,
    position: "top-right",
    style: {
      ...baseStyle,
      background: colors.error,
      borderColor: "#F87171", // red-400
    },
    iconTheme: {
      primary: "#DC2626", // red-600
      secondary: "#FEE2E2",
    },
    ...options,
  });
};

/**
 * Info toast with minimal styling
 * @param {string} message - The message to display
 * @param {object} options - Optional configuration overrides
 */
export const infoToast = (message, options = {}) => {
  return toast(message, {
    duration: 3000,
    position: "top-right",
    style: {
      ...baseStyle,
      background: colors.info,
      borderColor: "#D1D5DB", // gray-300
    },
    iconTheme: {
      primary: "#3B82F6", // blue-500
      secondary: "#F3F4F6",
    },
    ...options,
  });
};

/**
 * Loading toast with minimal styling
 * @param {string} message - The message to display
 * @param {object} options - Optional configuration overrides
 */
export const loadingToast = (message, options = {}) => {
  return toast.loading(message, {
    duration: Infinity,
    position: "top-right",
    style: {
      ...baseStyle,
      background: colors.loading,
      borderColor: "#9CA3AF", // gray-400
    },
    iconTheme: {
      primary: "#6B7280", // gray-600
      secondary: "#E5E7EB",
    },
    ...options,
  });
};

/**
 * Dismiss a specific toast
 * @param {string} toastId - ID of the toast to dismiss
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};
