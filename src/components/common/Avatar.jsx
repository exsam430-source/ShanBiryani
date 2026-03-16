import { classNames, getInitials } from '../../utils/helpers.js';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl'
};

const Avatar = ({ 
  src, 
  name, 
  size = 'md', 
  className = '' 
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={classNames(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={classNames(
        'rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold',
        sizes[size],
        className
      )}
    >
      {getInitials(name || '?')}
    </div>
  );
};

export default Avatar;