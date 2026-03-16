import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Filter } from 'lucide-react';
import { menuService } from '../../services/menuService.js';
import { categoryService } from '../../services/categoryService.js';
import MenuCard from '../../components/menu/MenuCard.jsx';
import CategoryTabs from '../../components/menu/CategoryTabs.jsx';
import { SectionLoader } from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Button from '../../components/common/Button.jsx';
import { classNames, debounce } from '../../utils/helpers.js';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    vegetarian: false,
    spicy: false,
    featured: false
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories({ active: true });
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch menu items
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const params = { available: true };
        if (activeCategory !== 'all') {
          params.category = activeCategory;
        }
        const response = await menuService.getMenuItems(params);
        setItems(response.data || []);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [activeCategory]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!item.name.toLowerCase().includes(query) && 
            !item.description?.toLowerCase().includes(query)) {
          return false;
        }
      }
      // Vegetarian filter
      if (filters.vegetarian && !item.isVegetarian) return false;
      // Spicy filter
      if (filters.spicy && !item.isSpicy) return false;
      // Featured filter
      if (filters.featured && !item.featured) return false;
      
      return true;
    });
  }, [items, searchQuery, filters]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const handleSearch = debounce((value) => {
    setSearchQuery(value);
  }, 300);

  const clearFilters = () => {
    setFilters({
      vegetarian: false,
      spicy: false,
      featured: false
    });
    setSearchQuery('');
  };

  const hasActiveFilters = filters.vegetarian || filters.spicy || filters.featured || searchQuery;

  return (
    <div className="min-h-screen bg-dark py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-4"
          >
            Our <span className="text-gradient">Menu</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary max-w-2xl mx-auto"
          >
            Explore our wide selection of authentic Pakistani dishes, 
            crafted with love and traditional recipes.
          </motion.p>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search dishes..."
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-dark-card border border-dark-lighter rounded-xl pl-12 pr-4 py-3 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          {/* Filter Button */}
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          >
            Filters
            {hasActiveFilters && (
              <span className="ml-2 w-5 h-5 bg-white text-primary text-xs font-bold rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-dark-card rounded-xl p-4 mb-6 border border-dark-lighter"
          >
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-text-secondary text-sm">Filter by:</span>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.vegetarian}
                  onChange={(e) => setFilters({ ...filters, vegetarian: e.target.checked })}
                  className="w-4 h-4 rounded border-dark-lighter bg-dark-lighter text-primary focus:ring-primary"
                />
                <span className="text-sm text-white">Vegetarian</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.spicy}
                  onChange={(e) => setFilters({ ...filters, spicy: e.target.checked })}
                  className="w-4 h-4 rounded border-dark-lighter bg-dark-lighter text-primary focus:ring-primary"
                />
                <span className="text-sm text-white">Spicy</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-dark-lighter bg-dark-lighter text-primary focus:ring-primary"
                />
                <span className="text-sm text-white">Featured</span>
              </label>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-400 transition-colors ml-auto"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Category Tabs */}
        <div className="mb-8">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Results Count */}
        {!isLoading && (
          <p className="text-text-secondary text-sm mb-6">
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            {hasActiveFilters && ' (filtered)'}
          </p>
        )}

        {/* Menu Grid */}
        {isLoading ? (
          <SectionLoader />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={Filter}
            title="No items found"
            description={hasActiveFilters 
              ? "Try adjusting your filters or search query" 
              : "No items available in this category"
            }
            action={hasActiveFilters ? clearFilters : undefined}
            actionLabel="Clear Filters"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <MenuCard key={item._id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;