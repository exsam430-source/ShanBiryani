// frontend/src/hooks/useToast.js
import { toast } from 'react-hot-toast';
// OR if using a different toast library, adjust accordingly

export const useToast = () => {
  const showSuccess = (message) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
    });
  };

  const showError = (message) => {
    toast.error(message || 'Something went wrong', {
      duration: 4000,
      position: 'top-right',
    });
  };

  const showInfo = (message) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
    });
  };

  const showWarning = (message) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: '⚠️',
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
};