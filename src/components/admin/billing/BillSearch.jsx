// frontend/src/components/admin/billing/BillSearch.jsx
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { menuService } from '../../../services/menuService.js';
import { formatPrice } from '../../../utils/formatters.js';
import { getImageUrl, debounce } from '../../../utils/helpers.js';

const BillSearch = ({ onAddItem }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const searchItems = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await menuService.searchItems(searchQuery);
      setResults(response.data || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce(searchItems, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    onAddItem(item); // This will open the AddItemModal
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Search menu items..."
          className="w-full bg-dark-lighter border border-dark-lighter rounded-xl pl-11 pr-10 py-3 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && (query || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-dark-lighter rounded-xl shadow-xl max-h-80 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-text-secondary">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-text-secondary">
              {query ? 'No items found' : 'Start typing to search'}
            </div>
          ) : (
            <div className="p-2">
              {results.map((item) => (
                <button
                  key={item._id}
                  onClick={() => handleSelect(item)}
                  disabled={!item.isAvailable}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-dark-lighter transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{item.name}</p>
                    <p className="text-text-muted text-sm">{item.category?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-text-muted text-xs">Menu</p>
                    <p className="text-primary font-semibold">{formatPrice(item.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BillSearch;