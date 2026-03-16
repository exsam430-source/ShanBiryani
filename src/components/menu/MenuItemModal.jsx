import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  ShoppingBag, 
  Star, 
  Clock, 
  Flame, 
  Leaf,
  Plus,
  Minus
} from 'lucide-react';
import { useCart } from '../../hooks/useCart.js';
import { useToast } from '../../hooks/useToast.js';
import { formatPrice } from '../../utils/formatters.js';
import { getImageUrl, classNames } from '../../utils/helpers.js';
import { SPICY_LEVELS } from '../../utils/constants.js';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';

const MenuItemModal = ({ item, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { showSuccess } = useToast();

  if (!item) return null;

  const discountedPrice = item.discount > 0 
    ? item.price - (item.price * item.discount / 100)
    : item.price;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
    showSuccess(`${quantity}x ${item.name} added to cart!`);
    setQuantity(1);
    onClose();
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const spicyLevel = SPICY_LEVELS.find(s => s.value === item.spicyLevel);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="md:w-1/2 relative">
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="w-full h-64 md:h-full object-cover rounded-xl"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {item.discount > 0 && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                {item.discount}% OFF
              </span>
            )}
            {item.featured && (
              <span className="px-2 py-1 bg-gradient-to-r from-accent to-secondary text-dark text-xs font-bold rounded-full">
                ★ FEATURED
              </span>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-dark/80 hover:bg-dark text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="md:w-1/2 flex flex-col">
          {/* Category */}
          <span className="text-sm text-primary font-medium uppercase tracking-wider">
            {item.category?.name || 'Special'}
          </span>

          {/* Name */}
          <h2 className="text-2xl font-bold text-white mt-1 mb-2">{item.name}</h2>

          {/* Rating & Time */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-white font-medium">4.9</span>
              <span className="text-text-muted text-sm">(120 reviews)</span>
            </div>
            {item.preparationTime && (
              <div className="flex items-center gap-1 text-text-muted">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{item.preparationTime} min</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.isVegetarian && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">
                <Leaf className="w-3 h-3" />
                Vegetarian
              </span>
            )}
            {item.isSpicy && spicyLevel && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-500 text-xs rounded-full">
                <Flame className="w-3 h-3" />
                {spicyLevel.label} {spicyLevel.emoji}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-text-secondary mb-6 flex-1">
            {item.description || 'Delicious dish prepared with authentic recipes and the finest ingredients.'}
          </p>

          {/* Price */}
          <div className="mb-6">
            {item.discount > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(discountedPrice)}
                </span>
                <span className="text-lg text-text-muted line-through">
                  {formatPrice(item.price)}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-primary">
                {formatPrice(item.price)}
              </span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-2 bg-dark-lighter rounded-lg p-1">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-white font-medium text-lg">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              size="lg"
              className="flex-1"
              leftIcon={<ShoppingBag className="w-5 h-5" />}
            >
              {item.isAvailable 
                ? `Add to Cart • ${formatPrice(discountedPrice * quantity)}`
                : 'Out of Stock'
              }
            </Button>
          </div>

          {/* Availability Warning */}
          {!item.isAvailable && (
            <p className="text-red-500 text-sm mt-3 text-center">
              This item is currently unavailable
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MenuItemModal;