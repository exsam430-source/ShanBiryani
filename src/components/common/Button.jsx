import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { classNames } from '../../utils/helpers.js';

const variants = {
  primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-primary/30',
  secondary: 'bg-secondary hover:bg-secondary-dark text-white shadow-lg hover:shadow-secondary/30',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-text-secondary hover:text-white hover:bg-dark-lighter',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/30',
  success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/30',
  gold: 'bg-gradient-to-r from-accent to-secondary text-dark font-semibold shadow-lg hover:shadow-accent/30'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={classNames(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-dark',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leftIcon ? (
        <span className="w-4 h-4">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && !isLoading && <span className="w-4 h-4">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;