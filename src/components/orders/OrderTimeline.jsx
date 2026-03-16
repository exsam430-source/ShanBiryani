import { CheckCircle, Clock } from 'lucide-react';
import { formatSmartDate } from '../../utils/formatters.js';
import { classNames } from '../../utils/helpers.js';

const OrderTimeline = ({ statusHistory = [] }) => {
  if (!statusHistory || statusHistory.length === 0) {
    return (
      <p className="text-text-muted text-center py-4">No status history available</p>
    );
  }

  const sortedHistory = [...statusHistory].reverse();

  return (
    <div className="relative">
      {sortedHistory.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === sortedHistory.length - 1;

        return (
          <div key={index} className="relative pl-8 pb-6 last:pb-0">
            {/* Line */}
            {!isLast && (
              <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-dark-lighter" />
            )}

            {/* Dot */}
            <div className={classNames(
              'absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center',
              isFirst ? 'bg-primary' : 'bg-dark-lighter'
            )}>
              {isFirst ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : (
                <Clock className="w-3 h-3 text-text-muted" />
              )}
            </div>

            {/* Content */}
            <div>
              <p className={classNames(
                'font-medium capitalize',
                isFirst ? 'text-white' : 'text-text-secondary'
              )}>
                {item.status.replace('-', ' ')}
              </p>
              <p className="text-text-muted text-sm mt-0.5">
                {formatSmartDate(item.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;