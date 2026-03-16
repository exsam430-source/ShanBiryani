import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { classNames } from '../../utils/helpers.js';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
  const tabsRef = useRef(null);
  const activeTabRef = useRef(null);

  // Scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      const container = tabsRef.current;
      const activeTab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      
      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeCategory]);

  return (
    <div className="relative">
      {/* Gradient Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none" />

      {/* Tabs Container */}
      <div
        ref={tabsRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-4 -mx-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* All Category */}
        <button
          ref={activeCategory === 'all' ? activeTabRef : null}
          onClick={() => onCategoryChange('all')}
          className={classNames(
            'relative px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300',
            activeCategory === 'all'
              ? 'text-white'
              : 'text-text-secondary hover:text-white bg-dark-card hover:bg-dark-lighter'
          )}
        >
          {activeCategory === 'all' && (
            <motion.div
              layoutId="activeCategory"
              className="absolute inset-0 bg-primary rounded-full"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">All Items</span>
        </button>

        {/* Category Tabs */}
        {categories.map((category) => (
          <button
            key={category._id}
            ref={activeCategory === category._id ? activeTabRef : null}
            onClick={() => onCategoryChange(category._id)}
            className={classNames(
              'relative px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300',
              activeCategory === category._id
                ? 'text-white'
                : 'text-text-secondary hover:text-white bg-dark-card hover:bg-dark-lighter'
            )}
          >
            {activeCategory === category._id && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {category.name}
              {category.itemCount > 0 && (
                <span className={classNames(
                  'text-xs px-1.5 py-0.5 rounded-full',
                  activeCategory === category._id
                    ? 'bg-white/20'
                    : 'bg-dark-lighter'
                )}>
                  {category.itemCount}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;