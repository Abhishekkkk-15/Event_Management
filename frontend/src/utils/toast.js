import { toast } from "react-toastify";

// Utility to show success toast
export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-center", // 🔹 Show from top-right
    autoClose: 2000,
  });
};

// Utility to show error toast
export const showError = (message) => {
  toast.error(message, {
    position: "top-center", // 🔹 Show from top-right
    autoClose: 2000,
  });
};

// Utility to show info toast
export const showInfo = (message) => {
  toast.info(message, {
    position: "top-center", // 🔹 Show from top-right
    autoClose: 2000,
  });
};

// Utility to show warning toast
export const showWarning = (message) => {
  toast.warning(message, {
    position: "top-center", // 🔹 Show from top-right
    autoClose: 3000,
  });
};
