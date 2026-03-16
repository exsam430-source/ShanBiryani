import { classNames } from '../../utils/helpers.js';

const variants = {
  default: 'bg-dark-lighter text-text-secondary',
  primary: 'bg-primary/20 text-primary border border-primary/30',
  secondary: 'bg-secondary/20 text-secondary border border-secondary/30',
  success: 'bg-green-500/20 text-green-500 border border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-500 border border-red-500/30',
  info: 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm'
};

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  return (
    <span
      className={classNames(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;