import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { authService } from '../../services/authService.js';
import { useToast } from '../../hooks/useToast.js';
import UserTable from '../../components/admin/users/UserTable.jsx';
import UserForm from '../../components/admin/users/UserForm.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Select from '../../components/common/Select.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  
  const { showSuccess, showError } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await authService.getAllUsers({
        page: currentPage,
        limit: 15,
        search: searchQuery || undefined,
        role: roleFilter || undefined
      });
      setUsers(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error) {
      showError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery, roleFilter]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user) => {
    setDeleteUser(user);
  };

  const confirmDelete = async () => {
    if (!deleteUser) return;
    setIsSubmitting(true);
    try {
      await authService.deleteUser(deleteUser._id);
      showSuccess('User deleted successfully');
      fetchUsers();
    } catch (error) {
      showError(error.message || 'Failed to delete user');
    } finally {
      setIsSubmitting(false);
      setDeleteUser(null);
    }
  };

  const handleSubmit = async (formData, id) => {
    setIsSubmitting(true);
    try {
      if (id) {
        await authService.updateUser(id, formData);
        showSuccess('User updated successfully');
      }
      setIsFormOpen(false);
      fetchUsers();
    } catch (error) {
      showError(error.message || 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await authService.toggleUserStatus(user._id);
      showSuccess(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error) {
      showError(error.message || 'Failed to update user status');
    }
  };

  const handleResetPassword = (user) => {
    setResetPasswordUser(user);
    setNewPassword('');
  };

  const confirmResetPassword = async () => {
    if (!resetPasswordUser || !newPassword) {
      showError('Please enter a new password');
      return;
    }
    
    if (newPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await authService.resetUserPassword(resetPasswordUser._id, newPassword);
      showSuccess(`Password reset successfully for ${resetPasswordUser.name}`);
      setResetPasswordUser(null);
      setNewPassword('');
    } catch (error) {
      showError(error.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'staff', label: 'Staff' },
    { value: 'customer', label: 'Customer' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-text-secondary mt-1">Manage all system users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by name, email or phone..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={roleOptions}
          />
        </div>
      </div>

      {/* Users Table */}
      <UserTable
        users={users}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onResetPassword={handleResetPassword}
        showRole={true}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Edit User Form */}
      <UserForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmit}
        user={editingUser}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteUser?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
      />

      {/* Reset Password Modal */}
      <Modal
        isOpen={!!resetPasswordUser}
        onClose={() => {
          setResetPasswordUser(null);
          setNewPassword('');
        }}
        title="Reset Password"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Set a new password for <span className="text-white font-medium">{resetPasswordUser?.name}</span>
          </p>
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min 6 characters)"
          />
          <div className="flex gap-3 pt-2">
            <Button 
              variant="ghost" 
              onClick={() => {
                setResetPasswordUser(null);
                setNewPassword('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmResetPassword}
              isLoading={isSubmitting}
              className="flex-1"
            >
              Reset Password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;