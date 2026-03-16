import { classNames } from '../../utils/helpers.js';

const Switch = ({ checked, onChange, label, description, disabled = false }) => {
  return (
    <label className={classNames(
      'flex items-center justify-between gap-4 cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      <div>
        {label && <p className="text-white font-medium">{label}</p>}
        {description && <p className="text-text-muted text-sm">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={classNames(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-dark-lighter'
        )}
      >
        <span
          className={classNames(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </label>
  );
};

export default Switch;