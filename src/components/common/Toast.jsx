import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { classNames } from '../../utils/helpers.js';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

const colors = {
  success: 'bg-green-500/20 border-green-500/30 text-green-500',
  error: 'bg-red-500/20 border-red-500/30 text-red-500',
  warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500',
  info: 'bg-blue-500/20 border-blue-500/30 text-blue-500'
};

const Toast = ({ 
  id,
  type = 'info', 
  message, 
  title,
  duration = 4000, 
  onClose 
}) => {
  const Icon = icons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={classNames(
        'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm shadow-lg max-w-sm',
        colors[type]
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-white">{title}</p>
        )}
        <p className={classNames(
          'text-sm',
          title ? 'text-text-secondary' : 'text-white'
        )}>
          {message}
        </p>
      </div>
      <button
        onClick={() => onClose?.(id)}
        className="p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-[500] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;