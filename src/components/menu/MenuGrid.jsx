import { motion } from 'framer-motion';
import MenuCard from './MenuCard.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { UtensilsCrossed } from 'lucide-react';

const MenuGrid = ({ items, isLoading, onViewDetails }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-dark-card rounded-2xl overflow-hidden border border-dark-lighter">
            <div className="h-48 skeleton" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-20 skeleton rounded" />
              <div className="h-6 w-3/4 skeleton rounded" />
              <div className="h-4 w-full skeleton rounded" />
              <div className="h-4 w-2/3 skeleton rounded" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 w-20 skeleton rounded" />
                <div className="h-9 w-16 skeleton rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={UtensilsCrossed}
        title="No items found"
        description="We couldn't find any menu items matching your criteria."
      />
    );
  }

  return (
    <motion.div 
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {items.map((item, index) => (
        <MenuCard 
          key={item._id} 
          item={item} 
          index={index}
          onViewDetails={onViewDetails}
        />
      ))}
    </motion.div>
  );
};

export default MenuGrid;