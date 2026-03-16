import { classNames } from '../../utils/helpers.js';

const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  return (
    <div
      className={classNames(
        'rounded-full border-primary border-t-transparent animate-spin',
        sizes[size],
        className
      )}
    />
  );
};

export const PageLoader = () => {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        <Loader size="xl" />
        <p className="mt-4 text-text-secondary">Loading...</p>
      </div>
    </div>
  );
};

export const SectionLoader = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader size="lg" />
    </div>
  );
};

export default Loader;