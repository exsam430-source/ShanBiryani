import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { menuService } from '../../services/menuService.js';
import { categoryService } from '../../services/categoryService.js';
import { useToast } from '../../hooks/useToast.js';
import MenuTable from '../../components/admin/menu/MenuTable.jsx';
import MenuForm from '../../components/admin/menu/MenuForm.jsx';
import Button from '../../components/common/Button.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Select from '../../components/common/Select.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  
  const { showSuccess, showError } = useToast();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch menu items
  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        category: categoryFilter || undefined
      };
      const response = await menuService.getMenuItems(params);
      setItems(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error) {
      showError('Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage, searchQuery, categoryFilter]);

  // Handlers
  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item) => {
    setDeleteItem(item);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    
    setIsSubmitting(true);
    try {
      await menuService.deleteMenuItem(deleteItem._id);
      showSuccess('Item deleted successfully');
      fetchItems();
    } catch (error) {
      showError(error.message || 'Failed to delete item');
    } finally {
      setIsSubmitting(false);
      setDeleteItem(null);
    }
  };

  const handleSubmit = async (formData, id) => {
    setIsSubmitting(true);
    try {
      if (id) {
        await menuService.updateMenuItem(id, formData);
        showSuccess('Item updated successfully');
      } else {
        await menuService.createMenuItem(formData);
        showSuccess('Item created successfully');
      }
      setIsFormOpen(false);
      fetchItems();
    } catch (error) {
      showError(error.message || 'Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await menuService.toggleAvailability(item._id);
      showSuccess(`${item.name} is now ${item.isAvailable ? 'unavailable' : 'available'}`);
      fetchItems();
    } catch (error) {
      showError(error.message);
    }
  };

  const handleToggleFeatured = async (item) => {
    try {
      await menuService.toggleFeatured(item._id);
      showSuccess(`${item.name} ${item.featured ? 'removed from' : 'added to'} featured`);
      fetchItems();
    } catch (error) {
      showError(error.message);
    }
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat._id, label: cat.name }))
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Menu Management</h1>
          <p className="text-text-secondary mt-1">Manage your restaurant menu items</p>
        </div>
        <Button onClick={handleAddNew} leftIcon={<Plus className="w-4 h-4" />}>
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categoryOptions}
          />
        </div>
      </div>

      {/* Table */}
      <MenuTable
        items={items}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleAvailability={handleToggleAvailability}
        onToggleFeatured={handleToggleFeatured}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Form Modal */}
      <MenuForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        item={editingItem}
        categories={categories}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default MenuManagement;