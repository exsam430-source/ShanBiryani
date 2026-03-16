import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { classNames, debounce } from '../../utils/helpers.js';

const SearchBar = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onClear,
  className = '',
  debounceTime = 300
}) => {
  const [localValue, setLocalValue] = useState(value);

  const debouncedOnChange = useCallback(
    debounce((value) => {
      onChange?.(value);
    }, debounceTime),
    [onChange, debounceTime]
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
    onClear?.();
  };

  return (
    <div className={classNames('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-dark-lighter border border-dark-lighter rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;