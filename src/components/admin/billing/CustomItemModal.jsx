// frontend/src/components/admin/billing/CustomItemModal.jsx
import { useState } from 'react';
import { Package, DollarSign, Hash, X } from 'lucide-react';
import Modal from '../../common/Modal.jsx';
import Input from '../../common/Input.jsx';
import Button from '../../common/Button.jsx';

const CustomItemModal = ({ isOpen, onClose, onAddItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: 1
  });
  const [errors, setErrors] = useState({});

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
      newErrors.price = 'Valid price is required';
    }
    if (!formData.quantity || parseInt(formData.quantity) < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const customItem = {
      _id: `custom_${Date.now()}`, // Unique ID for custom items
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      isCustom: true, // Flag to identify custom items
      image: null
    };

    onAddItem(customItem);
    handleClose();
  };

  const handleClose = () => {
    setFormData({ name: '', price: '', quantity: 1 });
    setErrors({});
    onClose();
  };

  // Quick price buttons
  const quickPrices = [50, 100, 150, 200, 250, 500];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Custom Item" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Name */}
        <Input
          label="Item Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter item name (e.g., Special Dish)"
          icon={<Package className="w-4 h-4" />}
          error={errors.name}
        />

        {/* Price */}
        <div>
          <Input
            label="Price (Rs.)"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            icon={<DollarSign className="w-4 h-4" />}
            error={errors.price}
          />
          
          {/* Quick Price Buttons */}
          <div className="flex flex-wrap gap-2 mt-2">
            {quickPrices.map(price => (
              <button
                key={price}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, price: price.toString() }))}
                className="px-3 py-1 text-sm bg-dark-lighter text-text-secondary hover:bg-primary hover:text-white rounded-lg transition-colors"
              >
                Rs.{price}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <Input
          label="Quantity"
          name="quantity"
          type="number"
          min="1"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Enter quantity"
          icon={<Hash className="w-4 h-4" />}
          error={errors.quantity}
        />

        {/* Preview */}
        {formData.name && formData.price && (
          <div className="p-3 bg-dark-lighter rounded-lg">
            <p className="text-text-muted text-sm mb-1">Preview:</p>
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">
                {formData.name} x {formData.quantity || 1}
              </span>
              <span className="text-primary font-bold">
                Rs. {((parseFloat(formData.price) || 0) * (parseInt(formData.quantity) || 1)).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Add Item
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomItemModal;