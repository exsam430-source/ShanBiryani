import { classNames } from '../../utils/helpers.js';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = true,
  ...props
}) => {
  return (
    <div
      className={classNames(
        'bg-dark-card rounded-xl border border-dark-lighter',
        padding && 'p-4 md:p-6',
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={classNames('mb-4', className)}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={classNames('text-lg font-semibold text-white', className)}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '' }) => {
  return (
    <p className={classNames('text-sm text-text-secondary mt-1', className)}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={classNames('mt-4 pt-4 border-t border-dark-lighter', className)}>
      {children}
    </div>
  );
};

export default Card;