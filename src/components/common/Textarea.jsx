import { forwardRef } from 'react';
import { classNames } from '../../utils/helpers.js';

const Textarea = forwardRef(({
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
      <textarea
        ref={ref}
        className={classNames(
          'w-full bg-dark-lighter border rounded-lg px-4 py-2.5 text-white placeholder-text-muted',
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
          'transition-all duration-200 resize-none',
          error ? 'border-red-500' : 'border-dark-lighter hover:border-text-muted',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;