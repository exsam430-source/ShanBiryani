import { motion } from 'framer-motion';
import { ShoppingBag, Star, Flame, Clock, Plus, Eye } from 'lucide-react';
import { useCart } from '../../hooks/useCart.js';
import { useToast } from '../../hooks/useToast.js';
import { formatPrice } from '../../utils/formatters.js';
import { getImageUrl, classNames } from '../../utils/helpers.js';
import Button from '../common/Button.jsx';

const MenuCard = ({ item, onViewDetails, index = 0 }) => {
  const { addItem } = useCart();
  const { showSuccess } = useToast();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(item);
    showSuccess(`${item.name} added to cart!`);
  };

  const discountedPrice = item.discount > 0 
    ? item.price - (item.price * item.discount / 100)
    : item.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-dark-card rounded-2xl overflow-hidden border border-dark-lighter hover:border-primary/30 transition-all duration-300 card-hover"
    >
      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={getImageUrl(item.image)}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/20 to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {!item.isAvailable && (
            <span className="px-2 py-1 bg-red-500/90 text-white text-xs font-medium rounded-full">
              Out of Stock
            </span>
          )}
          {item.isSpicy && item.isAvailable && (
            <span className="px-2 py-1 bg-orange-500/90 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3" />
              Spicy
            </span>
          )}
          {item.discount > 0 && item.isAvailable && (
            <span className="px-2 py-1 bg-green-500/90 text-white text-xs font-medium rounded-full">
              {item.discount}% OFF
            </span>
          )}
          {item.isVegetarian && (
            <span className="px-2 py-1 bg-green-600/90 text-white text-xs font-medium rounded-full">
              Veg
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <button
            onClick={() => onViewDetails?.(item)}
            className="w-10 h-10 bg-white/90 hover:bg-white text-dark rounded-full flex items-center justify-center shadow-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {item.isAvailable && (
            <button
              onClick={handleAddToCart}
              className="w-10 h-10 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Featured Badge */}
        {item.featured && (
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-gradient-to-r from-accent to-secondary text-dark text-xs font-bold rounded-full">
              ★ FEATURED
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="text-xs text-primary font-medium uppercase tracking-wider">
          {item.category?.name || 'Special'}
        </span>

        {/* Name */}
        <h3 className="text-lg font-semibold text-white mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-text-secondary text-sm line-clamp-2 mb-3">
          {item.description || 'Delicious dish prepared with authentic recipes.'}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span>4.9</span>
          </div>
          {item.preparationTime && (
            <div className="flex items-center gap-1 text-text-muted">
              <Clock className="w-4 h-4" />
              <span>{item.preparationTime} min</span>
            </div>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            {item.discount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">
                  {formatPrice(discountedPrice)}
                </span>
                <span className="text-sm text-text-muted line-through">
                  {formatPrice(item.price)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-primary">
                {formatPrice(item.price)}
              </span>
            )}
          </div>
          
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            leftIcon={<ShoppingBag className="w-4 h-4" />}
          >
            {item.isAvailable ? 'Add' : 'Sold Out'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;