// frontend/src/components/admin/categories/CategoryForm.jsx
import { useState, useEffect } from 'react';
import { Upload, X, FolderOpen } from 'lucide-react';
import Modal from '../../common/Modal.jsx';
import Button from '../../common/Button.jsx';
import { getImageUrl } from '../../../utils/helpers.js';

const CategoryForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  category = null,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    sortOrder: '0'
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name || '',
          description: category.description || '',
          isActive: category.isActive ?? true,
          sortOrder: category.sortOrder?.toString() || '0'
        });
        setImagePreview(category.image ? getImageUrl(category.image) : '');
      } else {
        setFormData({
          name: '',
          description: '',
          isActive: true,
          sortOrder: '0'
        });
        setImagePreview('');
      }
      setImage(null);
      setErrors({});
    }
  }, [isOpen, category]);

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
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = new FormData();
    submitData.append('name', formData.name.trim());
    submitData.append('description', formData.description.trim());
    submitData.append('isActive', formData.isActive);
    submitData.append('sortOrder', formData.sortOrder || '0');
    
    if (image) {
      submitData.append('image', image);
    }

    onSubmit(submitData, category?._id);
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', isActive: true, sortOrder: '0' });
    setImage(null);
    setImagePreview('');
    setErrors({});
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={category ? 'Edit Category' : 'Add Category'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col" style={{ maxHeight: '70vh' }}>
        {/* Scrollable Content */}
        <div 
          className="flex-1 overflow-y-auto space-y-4 pr-2"
          style={{ 
            maxHeight: 'calc(70vh - 80px)',
            overflowY: 'auto'
          }}
        >
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Category Image
            </label>
            {imagePreview ? (
              <div className="relative w-full h-32 rounded-lg overflow-hidden bg-dark-lighter">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-dark-lighter rounded-lg cursor-pointer hover:border-primary transition-colors bg-dark-lighter/50">
                <FolderOpen className="w-8 h-8 text-text-muted mb-1" />
                <span className="text-sm text-text-muted">Upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2.5 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Sort Order
            </label>
            <input
              type="number"
              name="sortOrder"
              min="0"
              value={formData.sortOrder}
              onChange={handleChange}
              placeholder="0"
              className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2.5 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
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
              placeholder="Enter category description (optional)"
              rows={3}
              className="w-full bg-dark-lighter border-none rounded-lg px-3 py-2.5 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {/* Active Toggle */}
          <div className="p-3 bg-dark-lighter rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded border-dark-lighter bg-dark-card text-primary focus:ring-primary"
              />
              <div>
                <span className="text-sm text-white font-medium">Active Category</span>
                <p className="text-xs text-text-muted">Category will be visible on the menu</p>
              </div>
            </label>
          </div>
        </div>

        {/* Fixed Bottom Actions */}
        <div className="flex-shrink-0 flex gap-3 pt-4 mt-4 border-t border-dark-lighter">
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
            {category ? 'Update Category' : 'Add Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryForm;