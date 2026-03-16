import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { classNames } from '../../../utils/helpers.js';
import { formatPrice, formatCompactNumber } from '../../../utils/formatters.js';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'increase',
  prefix = '',
  suffix = '',
  isCurrency = false,
  color = 'primary',
  index = 0
}) => {
  const colors = {
    primary: 'from-primary/20 to-primary/5 border-primary/30',
    secondary: 'from-secondary/20 to-secondary/5 border-secondary/30',
    green: 'from-green-500/20 to-green-500/5 border-green-500/30',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
    orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/30'
  };

  const iconColors = {
    primary: 'bg-primary/20 text-primary',
    secondary: 'bg-secondary/20 text-secondary',
    green: 'bg-green-500/20 text-green-500',
    blue: 'bg-blue-500/20 text-blue-500',
    purple: 'bg-purple-500/20 text-purple-500',
    orange: 'bg-orange-500/20 text-orange-500'
  };

  const displayValue = isCurrency 
    ? formatPrice(value, false) 
    : formatCompactNumber(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={classNames(
        'bg-gradient-to-br rounded-xl border p-6',
        colors[color]
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={classNames(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          iconColors[color]
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        {change !== undefined && (
          <div className={classNames(
            'flex items-center gap-1 text-sm font-medium',
            changeType === 'increase' ? 'text-green-500' : 'text-red-500'
          )}>
            {changeType === 'increase' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {change}%
          </div>
        )}
      </div>

      <div>
        <h3 className="text-text-secondary text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl md:text-3xl font-bold text-white">
          {prefix}{displayValue}{suffix}
        </p>
      </div>
    </motion.div>
  );
};

export default StatsCard;