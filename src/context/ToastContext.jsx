import { createContext, useCallback } from 'react';
import toast from 'react-hot-toast';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const showSuccess = useCallback((message) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message) => {
    toast.error(message);
  }, []);

  const showInfo = useCallback((message) => {
    toast(message, {
      icon: 'ℹ️'
    });
  }, []);

  const showWarning = useCallback((message) => {
    toast(message, {
      icon: '⚠️',
      style: {
        borderLeft: '4px solid #F59E0B'
      }
    });
  }, []);

  const showLoading = useCallback((message = 'Loading...') => {
    return toast.loading(message);
  }, []);

  const dismissToast = useCallback((toastId) => {
    toast.dismiss(toastId);
  }, []);

  const value = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismissToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};