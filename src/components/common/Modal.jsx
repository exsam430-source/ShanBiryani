// frontend/src/components/common/Modal.jsx
import { Fragment, useEffect } from 'react';
import { X } from 'lucide-react';
import { classNames } from '../../utils/helpers.js';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl',
    full: 'max-w-[95vw]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={classNames(
          'relative w-full bg-dark-card rounded-xl shadow-2xl border border-dark-lighter',
          'max-h-[90vh] flex flex-col',
          sizeClasses[size] || sizeClasses.md
        )}
      >
        {/* Header - Fixed */}
        {title && (
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-dark-lighter">
            <h2 className="text-lg font-semibold text-white">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 text-text-secondary hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        
        {/* Body - This receives children which should handle their own scrolling */}
        <div className="flex-1 p-4 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;