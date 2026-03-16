// frontend/src/components/admin/billing/AddItemModal.jsx
import { useState, useEffect, useRef } from 'react';
import { Package, DollarSign, Hash, Scale } from 'lucide-react';
import Modal from '../../common/Modal.jsx';
import Input from '../../common/Input.jsx';
import Button from '../../common/Button.jsx';
import Select from '../../common/Select.jsx';
import { formatPrice } from '../../../utils/formatters.js';
import { getImageUrl } from '../../../utils/helpers.js';

const UNIT_TYPES = [
  { value: 'piece', label: 'Piece (Pcs)' },
  { value: 'kg', label: 'Kilogram (Kg)' },
  { value: 'gram', label: 'Gram (g)' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'plate', label: 'Plate' },
  { value: 'box', label: 'Box' },
  { value: 'pack', label: 'Pack' },
  { value: 'bottle', label: 'Bottle' },
  { value: 'litre', label: 'Litre (L)' },
  { value: 'half', label: 'Half Plate' },
  { value: 'full', label: 'Full Plate' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'regular', label: 'Regular' },
  { value: 'family', label: 'Family Pack' }
];

const AddItemModal = ({ isOpen, onClose, onAddItem, selectedItem = null }) => {
  const priceInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '1',
    unit: 'piece',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (selectedItem) {
        setFormData({
          name: selectedItem.name || '',
          price: '',
          quantity: '1',
          unit: 'piece',
          notes: ''
        });
      } else {
        setFormData({
          name: '',
          price: '',
          quantity: '1',
          unit: 'piece',
          notes: ''
        });
      }
      setErrors({});
      
      setTimeout(() => {
        priceInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, selectedItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Item name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const item = {
      _id: selectedItem?._id || `custom_${Date.now()}`,
      menuItemId: selectedItem?._id || null,
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      notes: formData.notes.trim(),
      isCustom: !selectedItem?._id,
      image: selectedItem?.image || null,
      originalMenuPrice: selectedItem?.price || null
    };

    onAddItem(item);
    onClose();
  };

  const handleClose = () => {
    setFormData({ name: '', price: '', quantity: '1', unit: 'piece', notes: '' });
    setErrors({});
    onClose();
  };

  const quickPrices = [50, 100, 150, 200, 250, 300, 400, 500, 750, 1000];
  
  const getQuickQuantities = () => {
    switch (formData.unit) {
      case 'kg':
        return [0.25, 0.5, 1, 1.5, 2, 2.5, 3, 5];
      case 'gram':
        return [100, 250, 500, 750, 1000];
      case 'dozen':
        return [0.5, 1, 2, 3, 4, 5];
      case 'litre':
        return [0.5, 1, 1.5, 2, 3, 5];
      default:
        return [1, 2, 3, 4, 5, 6, 10, 12];
    }
  };

  const total = (parseFloat(formData.price) || 0) * (parseFloat(formData.quantity) || 0);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Item to Bill" size="md">
      <form onSubmit={handleSubmit} className="flex flex-col max-h-[70vh]">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {/* Selected Item Preview */}
          {selectedItem && (
            <div className="flex items-center gap-3 p-3 bg-dark-lighter rounded-lg">
              {selectedItem.image ? (
                <img
                  src={getImageUrl(selectedItem.image)}
                  alt={selectedItem.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{selectedItem.name}</p>
                {selectedItem.price && (
                  <p className="text-text-muted text-sm">
                    Menu Price: {formatPrice(selectedItem.price)} 
                    <span className="text-xs ml-1">(Reference only)</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
              className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Price (Rs.)
            </label>
            <input
              ref={priceInputRef}
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter selling price"
              className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            
            {/* Quick Price Buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickPrices.map(price => (
                <button
                  key={price}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, price: price.toString() }))}
                  className="px-2 py-1 text-xs bg-dark-lighter text-text-secondary hover:bg-primary hover:text-white rounded transition-colors"
                >
                  {price}
                </button>
              ))}
            </div>
            
            {selectedItem?.price && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, price: selectedItem.price.toString() }))}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Use menu price ({formatPrice(selectedItem.price)})
              </button>
            )}
          </div>

          {/* Unit Type & Quantity Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Unit Type
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {UNIT_TYPES.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                min="0.01"
                step="0.01"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>
          </div>

          {/* Quick Quantity Buttons */}
          <div>
            <p className="text-xs text-text-muted mb-1.5">Quick Quantity:</p>
            <div className="flex flex-wrap gap-1.5">
              {getQuickQuantities().map(qty => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, quantity: qty.toString() }))}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    parseFloat(formData.quantity) === qty
                      ? 'bg-primary text-white'
                      : 'bg-dark-lighter text-text-secondary hover:bg-dark-card hover:text-white'
                  }`}
                >
                  {qty} {formData.unit === 'kg' ? 'kg' : formData.unit === 'gram' ? 'g' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g., Extra spicy, No onion, Bulk order"
              className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Total Preview */}
          {formData.price && formData.quantity && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-text-secondary text-sm">Total Amount</p>
                  <p className="text-white text-xs">
                    {formData.name || 'Item'} × {formData.quantity} {formData.unit}
                  </p>
                </div>
                <p className="text-xl font-bold text-primary">
                  {formatPrice(total)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Actions */}
        <div className="flex-shrink-0 flex gap-3 pt-4 mt-4 border-t border-dark-lighter">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Add to Bill
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddItemModal;