import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { classNames } from '../../utils/helpers.js';

const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
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
        <select
          ref={ref}
          className={classNames(
            'w-full bg-dark-lighter border rounded-lg px-4 py-2.5 text-white appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
            'transition-all duration-200',
            error ? 'border-red-500' : 'border-dark-lighter hover:border-text-muted',
            className
          )}
          {...props}
        >
          <option value="" disabled className="bg-dark-lighter text-text-muted">
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-dark-lighter text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;