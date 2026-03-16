import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderOpen, MoreVertical, Eye, EyeOff } from 'lucide-react';
import { categoryService } from '../../services/categoryService.js';
import { useToast } from '../../hooks/useToast.js';
import { getImageUrl } from '../../utils/helpers.js';
import CategoryForm from '../../components/admin/menu/CategoryForm.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Card from '../../components/common/Card.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Dropdown, { DropdownItem, DropdownDivider } from '../../components/common/Dropdown.jsx';
import { SectionLoader } from '../../components/common/Loader.jsx';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const { showSuccess, showError } = useToast();

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      showError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category) => {
    setDeleteCategory(category);
  };

  const confirmDelete = async () => {
    if (!deleteCategory) return;
    
    setIsSubmitting(true);
    try {
      await categoryService.deleteCategory(deleteCategory._id);
      showSuccess('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      showError(error.message || 'Failed to delete category');
    } finally {
      setIsSubmitting(false);
      setDeleteCategory(null);
    }
  };

  const handleSubmit = async (formData, id) => {
    setIsSubmitting(true);
    try {
      if (id) {
        await categoryService.updateCategory(id, formData);
        showSuccess('Category updated successfully');
      } else {
        await categoryService.createCategory(formData);
        showSuccess('Category created successfully');
      }
      setIsFormOpen(false);
      fetchCategories();
    } catch (error) {
      showError(error.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      await categoryService.toggleStatus(category._id);
      showSuccess(`Category ${category.isActive ? 'deactivated' : 'activated'}`);
      fetchCategories();
    } catch (error) {
      showError(error.message);
    }
  };

  if (isLoading) {
    return <SectionLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-text-secondary mt-1">Organize your menu items into categories</p>
        </div>
        <Button onClick={handleAddNew} leftIcon={<Plus className="w-4 h-4" />}>
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <Card className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No categories yet</h3>
          <p className="text-text-secondary mb-4">Create your first category to organize menu items</p>
          <Button onClick={handleAddNew}>Create Category</Button>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card key={category._id} className="relative group">
              {/* Image */}
              {category.image && (
                <div className="h-32 -mx-4 -mt-4 md:-mx-6 md:-mt-6 mb-4 rounded-t-xl overflow-hidden">
                  <img
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                  <p className="text-text-muted text-sm mt-1 line-clamp-2">
                    {category.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant={category.isActive ? 'success' : 'danger'} size="sm">
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-text-muted text-xs">
                      {category.itemCount || 0} items
                    </span>
                  </div>
                </div>

                <Dropdown
                  align="right"
                  trigger={
                    <button className="p-1.5 hover:bg-dark-lighter rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-text-secondary" />
                    </button>
                  }
                >
                  <DropdownItem icon={Edit} onClick={() => handleEdit(category)}>
                    Edit
                  </DropdownItem>
                  <DropdownItem 
                    icon={category.isActive ? EyeOff : Eye}
                    onClick={() => handleToggleStatus(category)}
                  >
                    {category.isActive ? 'Deactivate' : 'Activate'}
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem icon={Trash2} danger onClick={() => handleDelete(category)}>
                    Delete
                  </DropdownItem>
                </Dropdown>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        category={editingCategory}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteCategory}
        onClose={() => setDeleteCategory(null)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteCategory?.name}"? Make sure no menu items are using this category.`}
        confirmText="Delete"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Categories;