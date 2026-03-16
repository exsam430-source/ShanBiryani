// frontend/src/components/admin/menu/MenuForm.jsx
import { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Modal from '../../common/Modal.jsx';
import Button from '../../common/Button.jsx';
import { getImageUrl } from '../../../utils/helpers.js';

const MenuForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  item = null, 
  categories = [],
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    discount: '0',
    isAvailable: true,
    isFeatured: false,
    isVeg: false,
    spiceLevel: 'medium'
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes or item changes
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({
          name: item.name || '',
          description: item.description || '',
          price: item.price?.toString() || '',
          category: item.category?._id || item.category || '',
          stock: item.stock?.toString() || '',
          discount: item.discount?.toString() || '0',
          isAvailable: item.isAvailable ?? true,
          isFeatured: item.isFeatured ?? false,
          isVeg: item.isVeg ?? false,
          spiceLevel: item.spiceLevel || 'medium'
        });
        setImagePreview(item.image ? getImageUrl(item.image) : '');
      } else {
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          stock: '',
          discount: '0',
          isAvailable: true,
          isFeatured: false,
          isVeg: false,
          spiceLevel: 'medium'
        });
        setImagePreview('');
      }
      setImage(null);
      setErrors({});
    }
  }, [isOpen, item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = new FormData();
    
    // Append all form fields
    submitData.append('name', formData.name.trim());
    submitData.append('description', formData.description.trim());
    submitData.append('price', formData.price);
    submitData.append('category', formData.category);
    submitData.append('stock', formData.stock || '0');
    submitData.append('discount', formData.discount || '0');
    submitData.append('isAvailable', formData.isAvailable);
    submitData.append('isFeatured', formData.isFeatured);
    submitData.append('isVeg', formData.isVeg);
    submitData.append('spiceLevel', formData.spiceLevel);
    
    if (image) {
      submitData.append('image', image);
    }

    onSubmit(submitData, item?._id);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      discount: '0',
      isAvailable: true,
      isFeatured: false,
      isVeg: false,
      spiceLevel: 'medium'
    });
    setImage(null);
    setImagePreview('');
    setErrors({});
    onClose();
  };

  const spiceLevelOptions = [
    { value: 'none', label: 'No Spice' },
    { value: 'mild', label: 'Mild' },
    { value: 'medium', label: 'Medium' },
    { value: 'hot', label: 'Hot' },
    { value: 'extra-hot', label: 'Extra Hot' }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={item ? 'Edit Menu Item' : 'Add Menu Item'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col" style={{ maxHeight: '70vh' }}>
        {/* Scrollable Content */}
        <div 
          className="flex-1 overflow-y-auto space-y-4 pr-2"
          style={{ 
            maxHeight: 'calc(70vh - 80px)',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#374151 transparent'
          }}
        >
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Item Image
            </label>
            {imagePreview ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden bg-dark-lighter">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-dark-lighter rounded-lg cursor-pointer hover:border-primary transition-colors bg-dark-lighter/50">
                <ImageIcon className="w-8 h-8 text-text-muted mb-2" />
                <span className="text-sm text-text-muted">Click to upload image</span>
                <span className="text-xs text-text-muted mt-1">PNG, JPG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
              className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2.5 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Price & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Price (Rs.) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2.5 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Stock & Discount Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock (optional)"
                className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2.5 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                min="0"
                max="100"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2.5 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Spice Level */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Spice Level
            </label>
            <select
              name="spiceLevel"
              value={formData.spiceLevel}
              onChange={handleChange}
              className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {spiceLevelOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description (optional)"
              rows={3}
              className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2.5 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {/* Toggle Options */}
          <div className="p-3 bg-dark-lighter rounded-lg space-y-3">
            <p className="text-sm font-medium text-text-secondary">Options</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-dark-lighter bg-dark-card text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-sm text-white">Available</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-dark-lighter bg-dark-card text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-sm text-white">Featured</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isVeg"
                  checked={formData.isVeg}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-dark-lighter bg-dark-card text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-sm text-white">Vegetarian</span>
              </label>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Actions - Always Visible */}
        <div className="flex-shrink-0 flex gap-3 pt-4 mt-4 border-t border-dark-lighter bg-dark-card">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose} 
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1" 
            isLoading={isLoading}
          >
            {item ? 'Update Item' : 'Add Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MenuForm;