import { Package } from 'lucide-react';
import Button from './Button.jsx';

const EmptyState = ({
  icon: Icon = Package,
  title = 'No data found',
  description = 'There is nothing to display here yet.',
  action,
  actionLabel = 'Take Action'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-dark-lighter flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-text-secondary mb-4 max-w-md">{description}</p>
      {action && (
        <Button onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;