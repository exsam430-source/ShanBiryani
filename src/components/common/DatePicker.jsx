import { forwardRef } from 'react';
import { Calendar } from 'lucide-react';
import { classNames } from '../../utils/helpers.js';

const DatePicker = forwardRef(({
  label,
  error,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={classNames('space-y-1', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          ref={ref}
          type="date"
          className={classNames(
            'w-full bg-dark-lighter border rounded-lg pl-10 pr-4 py-2.5 text-white',
            'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
            'transition-all duration-200',
            '[color-scheme:dark]',
            error ? 'border-red-500' : 'border-dark-lighter hover:border-text-muted',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;