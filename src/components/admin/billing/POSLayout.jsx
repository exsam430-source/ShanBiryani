// frontend/src/components/admin/billing/POSLayout.jsx
import { useState, useEffect } from 'react';
import { Grid, List, RefreshCw, Plus, Package, Scale, Layers } from 'lucide-react';
import { menuService } from '../../../services/menuService.js';
import { categoryService } from '../../../services/categoryService.js';
import { formatPrice } from '../../../utils/formatters.js';
import { getImageUrl, classNames } from '../../../utils/helpers.js';
import BillSearch from './BillSearch.jsx';
import BillItemList from './BillItemList.jsx';
import BillSummary from './BillSummary.jsx';
import AddItemModal from './AddItemModal.jsx';
import BulkItemModal from './BulkItemModal.jsx';
import CategoryTabs from '../../menu/CategoryTabs.jsx';
import Button from '../../common/Button.jsx';

const POSLayout = ({ onGenerateBill, isLoading = false, taxRate = 0 }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [billItems, setBillItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('fixed');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  
  // Modals
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showBulkItemModal, setShowBulkItemModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  // Fetch categories and menu items
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingMenu(true);
      try {
        const [catResponse, menuResponse] = await Promise.all([
          categoryService.getCategories({ active: true }),
          menuService.getMenuItems({ available: true, limit: 100 })
        ]);
        setCategories(catResponse.data || []);
        setMenuItems(menuResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingMenu(false);
      }
    };
    fetchData();
  }, []);

  // Filter items by category
  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category?._id === activeCategory);

  // Open add item modal with menu item
  const handleMenuItemClick = (item) => {
    setSelectedMenuItem(item);
    setEditingIndex(null);
    setShowAddItemModal(true);
  };

  // Open add item modal for custom item
  const handleAddCustomItem = () => {
    setSelectedMenuItem(null);
    setEditingIndex(null);
    setShowAddItemModal(true);
  };

  // Add item to bill
  const handleAddItem = (item) => {
    if (editingIndex !== null) {
      setBillItems(prev => {
        const updated = [...prev];
        updated[editingIndex] = item;
        return updated;
      });
      setEditingIndex(null);
    } else {
      setBillItems(prev => {
        const existingIndex = prev.findIndex(i => 
          i.name === item.name && 
          i.price === item.price && 
          i.unit === item.unit &&
          !i.notes
        );
        
        if (existingIndex >= 0 && !item.notes) {
          const updated = [...prev];
          updated[existingIndex].quantity += item.quantity;
          return updated;
        }
        return [...prev, item];
      });
    }
  };

  // Add multiple bulk items
  const handleAddBulkItems = (items) => {
    setBillItems(prev => [...prev, ...items]);
  };

  // Update item quantity
  const handleUpdateQuantity = (index, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(index);
      return;
    }
    setBillItems(prev => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  // Remove item
  const handleRemoveItem = (index) => {
    setBillItems(prev => prev.filter((_, i) => i !== index));
  };

  // Edit existing item
  const handleEditItem = (index, item) => {
    setSelectedMenuItem({
      ...item,
      _id: item.menuItemId || item._id
    });
    setEditingIndex(index);
    setShowAddItemModal(true);
  };

  // Clear all items
  const handleClearAll = () => {
    setBillItems([]);
    setDiscount(0);
  };

  // Calculate subtotal
  const subtotal = billItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Handle generate bill
  const handleGenerateBill = (paymentInfo) => {
    const billData = {
      items: billItems.map(item => ({
        menuItem: item.menuItemId || (item.isCustom ? null : item._id),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit || 'piece',
        subtotal: item.price * item.quantity,
        isCustom: item.isCustom || false,
        notes: item.notes || ''
      })),
      discount,
      discountType,
      ...paymentInfo
    };
    
    onGenerateBill(billData);
    
    // Clear bill after generation
    setBillItems([]);
    setDiscount(0);
  };

  return (
    <>
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        {/* Left Side - Menu Items */}
        <div className="flex-1 flex flex-col bg-dark-card rounded-xl border border-dark-lighter overflow-hidden">
          {/* Header - Fixed */}
          <div className="flex-shrink-0 p-3 border-b border-dark-lighter">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-white">Menu Items</h2>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomItem}
                  leftIcon={<Plus className="w-3 h-3" />}
                  className="text-xs px-2 py-1"
                >
                  Custom
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkItemModal(true)}
                  leftIcon={<Layers className="w-3 h-3" />}
                  className="text-xs px-2 py-1"
                >
                  Bulk
                </Button>
                
                <button
                  onClick={() => setViewMode('grid')}
                  className={classNames(
                    'p-1.5 rounded-lg transition-colors',
                    viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={classNames(
                    'p-1.5 rounded-lg transition-colors',
                    viewMode === 'list' ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            <BillSearch onAddItem={handleMenuItemClick} />
          </div>

          {/* Category Tabs - Fixed */}
          <div className="flex-shrink-0 px-3 py-2 border-b border-dark-lighter overflow-x-auto">
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Items Grid/List - Scrollable */}
          <div className="flex-1 overflow-y-auto p-3">
            {isLoadingMenu ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-dark-lighter rounded-lg p-2">
                    <div className="h-16 skeleton rounded mb-2" />
                    <div className="h-3 skeleton rounded w-3/4 mb-1" />
                    <div className="h-3 skeleton rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {/* Quick Add Custom Item Card */}
                <button
                  onClick={handleAddCustomItem}
                  className="bg-dark-lighter rounded-lg p-2 text-center hover:bg-primary/20 border-2 border-dashed border-dark-lighter hover:border-primary transition-all group min-h-[100px] flex flex-col items-center justify-center"
                >
                  <Package className="w-8 h-8 text-text-muted group-hover:text-primary transition-colors mb-1" />
                  <p className="text-text-muted group-hover:text-primary font-medium text-xs">
                    Custom Item
                  </p>
                </button>

                {/* Quick Add Bulk Items Card */}
                <button
                  onClick={() => setShowBulkItemModal(true)}
                  className="bg-dark-lighter rounded-lg p-2 text-center hover:bg-orange-500/20 border-2 border-dashed border-dark-lighter hover:border-orange-500 transition-all group min-h-[100px] flex flex-col items-center justify-center"
                >
                  <Scale className="w-8 h-8 text-text-muted group-hover:text-orange-500 transition-colors mb-1" />
                  <p className="text-text-muted group-hover:text-orange-500 font-medium text-xs">
                    Bulk Items
                  </p>
                </button>

                {filteredItems.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => handleMenuItemClick(item)}
                    disabled={!item.isAvailable}
                    className="bg-dark-lighter rounded-lg p-2 text-left hover:bg-dark-lighter/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="relative mb-1.5 overflow-hidden rounded-lg">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-16 object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-white font-medium text-xs truncate">{item.name}</p>
                    <p className="text-text-muted text-[10px]">
                      {formatPrice(item.price)}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                <button
                  onClick={handleAddCustomItem}
                  className="w-full flex items-center gap-2 bg-dark-lighter rounded-lg p-2 text-left hover:bg-primary/20 border-2 border-dashed border-dark-lighter hover:border-primary transition-all"
                >
                  <Package className="w-8 h-8 text-text-muted p-1" />
                  <div className="flex-1">
                    <p className="text-text-muted font-medium text-sm">Custom Item</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowBulkItemModal(true)}
                  className="w-full flex items-center gap-2 bg-dark-lighter rounded-lg p-2 text-left hover:bg-orange-500/20 border-2 border-dashed border-dark-lighter hover:border-orange-500 transition-all"
                >
                  <Scale className="w-8 h-8 text-text-muted p-1" />
                  <div className="flex-1">
                    <p className="text-text-muted font-medium text-sm">Bulk Items</p>
                  </div>
                </button>

                {filteredItems.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => handleMenuItemClick(item)}
                    disabled={!item.isAvailable}
                    className="w-full flex items-center gap-2 bg-dark-lighter rounded-lg p-2 text-left hover:bg-dark-lighter/80 transition-colors disabled:opacity-50"
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{item.name}</p>
                    </div>
                    <p className="text-primary font-semibold text-sm">{formatPrice(item.price)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Bill (Fixed Height with Internal Scroll) */}
        <div className="w-full lg:w-[380px] flex flex-col gap-3 h-full overflow-hidden">
          {/* Bill Items Card */}
          <div className="bg-dark-card rounded-xl border border-dark-lighter flex flex-col overflow-hidden flex-shrink-0" style={{ height: '35%', minHeight: '150px' }}>
            {/* Header */}
            <div className="flex-shrink-0 p-2 border-b border-dark-lighter flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm">
                Current Bill 
                {billItems.length > 0 && (
                  <span className="ml-1 text-primary">({billItems.length})</span>
                )}
              </h3>
              {billItems.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="text-xs text-text-secondary hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
            
            {/* Scrollable Items */}
            <div className="flex-1 overflow-y-auto">
              <BillItemList
                items={billItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onEditItem={handleEditItem}
              />
            </div>
            
            {/* Subtotal Footer */}
            {billItems.length > 0 && (
              <div className="flex-shrink-0 px-3 py-1.5 border-t border-dark-lighter bg-dark-lighter/50">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">{billItems.length} items</span>
                  <span className="text-white font-medium">
                    Subtotal: {formatPrice(subtotal)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bill Summary - Takes remaining space */}
          <div className="flex-1 overflow-hidden" style={{ minHeight: '300px' }}>
            <BillSummary
              subtotal={subtotal}
              discount={discount}
              discountType={discountType}
              taxRate={taxRate}
              onDiscountChange={setDiscount}
              onDiscountTypeChange={setDiscountType}
              onGenerateBill={handleGenerateBill}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddItemModal
        isOpen={showAddItemModal}
        onClose={() => {
          setShowAddItemModal(false);
          setSelectedMenuItem(null);
          setEditingIndex(null);
        }}
        onAddItem={handleAddItem}
        selectedItem={selectedMenuItem}
      />

      <BulkItemModal
        isOpen={showBulkItemModal}
        onClose={() => setShowBulkItemModal(false)}
        onAddItems={handleAddBulkItems}
      />
    </>
  );
};

export default POSLayout;