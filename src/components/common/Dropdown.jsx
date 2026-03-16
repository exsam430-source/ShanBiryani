import { useState, useRef, useEffect, Children, cloneElement, isValidElement } from 'react';
import { classNames } from '../../utils/helpers.js';

const Dropdown = ({ trigger, children, align = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const enhancedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    if (child.props?.onClick) {
      return cloneElement(child, {
        onClick: (...args) => {
          child.props.onClick?.(...args);
          setIsOpen(false);
        }
      });
    }

    return child;
  });

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={classNames(
            'absolute top-full mt-2 min-w-[12rem] rounded-lg border border-dark-lighter bg-dark-card shadow-xl z-[100] py-1',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {enhancedChildren}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ icon: Icon, children, onClick, danger = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      'w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors',
      danger
        ? 'text-red-500 hover:bg-red-500/10'
        : 'text-text-secondary hover:bg-dark-lighter hover:text-white'
    )}
  >
    {Icon && <Icon className="w-4 h-4" />}
    <span>{children}</span>
  </button>
);

export const DropdownDivider = () => (
  <div className="my-1 h-px bg-dark-lighter" />
);

export default Dropdown;