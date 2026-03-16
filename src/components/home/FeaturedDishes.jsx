import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Star, Flame } from 'lucide-react';
import { menuService } from '../../services/menuService.js';
import { useCart } from '../../hooks/useCart.js';
import { useToast } from '../../hooks/useToast.js';
import { formatPrice } from '../../utils/formatters.js';
import { getImageUrl } from '../../utils/helpers.js';
import Button from '../common/Button.jsx';
import { SectionLoader } from '../common/Loader.jsx';

const FeaturedDishes = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { showSuccess } = useToast();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await menuService.getFeaturedItems();
        setItems(response.data || []);
      } catch (error) {
        console.error('Error fetching featured items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleAddToCart = (item) => {
    addItem(item);
    showSuccess(`${item.name} added to cart!`);
  };

  if (isLoading) {
    return <SectionLoader />;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-dark">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-primary/20 text-primary text-sm font-medium rounded-full mb-4"
          >
            Our Specialties
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-4"
          >
            Featured <span className="text-gradient">Dishes</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary max-w-2xl mx-auto"
          >
            Discover our most loved dishes, carefully crafted with authentic recipes 
            passed down through generations.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.slice(0, 8).map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-dark-card rounded-2xl overflow-hidden border border-dark-lighter card-hover"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {item.isSpicy && (
                    <span className="px-2 py-1 bg-red-500/90 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      Spicy
                    </span>
                  )}
                  {item.discount > 0 && (
                    <span className="px-2 py-1 bg-green-500/90 text-white text-xs font-medium rounded-full">
                      {item.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Quick Add Button */}
                <button
                  onClick={() => handleAddToCart(item)}
                  className="absolute top-3 right-3 w-10 h-10 bg-white/90 hover:bg-primary text-dark hover:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Category */}
                <span className="text-xs text-primary font-medium uppercase tracking-wider">
                  {item.category?.name || 'Special'}
                </span>

                {/* Name */}
                <h3 className="text-lg font-semibold text-white mt-1 mb-2 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                  <span className="text-xs text-text-muted ml-1">(4.9)</span>
                </div>

                {/* Price & Add to Cart */}
                <div className="flex items-center justify-between">
                  <div>
                    {item.discount > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(item.price - (item.price * item.discount / 100))}
                        </span>
                        <span className="text-sm text-text-muted line-through">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(item)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/menu">
            <Button variant="outline" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              View Full Menu
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedDishes;