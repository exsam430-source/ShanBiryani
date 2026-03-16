import { useState, useEffect } from 'react';
import { UserPlus, Clock } from 'lucide-react';
import { authService } from '../../services/authService.js';
import { useToast } from '../../hooks/useToast.js';
import UserTable from '../../components/admin/users/UserTable.jsx';
import UserForm from '../../components/admin/users/UserForm.jsx';
import PendingStaff from '../../components/admin/users/PendingStaff.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Tabs from '../../components/common/Tabs.jsx';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [pendingStaff, setPendingStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [rejectUser, setRejectUser] = useState(null);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  
  const { showSuccess, showError } = useToast();

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const [staffRes, pendingRes] = await Promise.all([
        authService.getAllStaff({
          page: currentPage,
          limit: 15,
          search: searchQuery || undefined,
          isVerified: 'true'
        }),
        authService.getPendingStaff()
      ]);
      
      setStaff(staffRes.data || []);
      setTotalPages(staffRes.pagination?.pages || 1);
      setPendingStaff(pendingRes.data || []);
    } catch (error) {
      showError('Failed to load staff');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [currentPage, searchQuery]);

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
      showSuccess('Staff member deleted successfully');
      fetchStaff();
    } catch (error) {
      showError(error.message || 'Failed to delete staff');
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
        showSuccess('Staff updated successfully');
      }
      setIsFormOpen(false);
      fetchStaff();
    } catch (error) {
      showError(error.message || 'Failed to save staff');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await authService.toggleUserStatus(user._id);
      showSuccess(`Staff ${user.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchStaff();
    } catch (error) {
      showError(error.message || 'Failed to update status');
    }
  };

  const handleApproveStaff = async (user) => {
    setIsSubmitting(true);
    try {
      await authService.verifyStaff(user._id);
      showSuccess(`${user.name} has been approved and can now login`);
      fetchStaff();
    } catch (error) {
      showError(error.message || 'Failed to approve staff');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectStaff = (user) => {
    setRejectUser(user);
  };

  const confirmRejectStaff = async () => {
    if (!rejectUser) return;
    setIsSubmitting(true);
    try {
      await authService.rejectStaff(rejectUser._id);
      showSuccess(`${rejectUser.name}'s registration has been rejected`);
      fetchStaff();
    } catch (error) {
      showError(error.message || 'Failed to reject staff');
    } finally {
      setIsSubmitting(false);
      setRejectUser(null);
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

  const tabs = [
    {
      id: 'active',
      label: 'Active Staff',
      icon: UserPlus,
      content: (
        <div className="space-y-6">
          <SearchBar
            placeholder="Search staff by name, email or phone..."
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <UserTable
            users={staff}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onResetPassword={handleResetPassword}
            showRole={false}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )
    },
    {
      id: 'pending',
      label: `Pending Approvals ${pendingStaff.length > 0 ? `(${pendingStaff.length})` : ''}`,
      icon: Clock,
      content: (
        <PendingStaff
          staff={pendingStaff}
          onApprove={handleApproveStaff}
          onReject={handleRejectStaff}
          isLoading={isSubmitting}
        />
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Staff Management</h1>
        <p className="text-text-secondary mt-1">Manage staff accounts and approvals</p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="active" />

      {/* Edit Staff Form */}
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
        title="Delete Staff"
        message={`Are you sure you want to delete "${deleteUser?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
      />

      {/* Reject Confirmation */}
      <ConfirmDialog
        isOpen={!!rejectUser}
        onClose={() => setRejectUser(null)}
        onConfirm={confirmRejectStaff}
        title="Reject Staff Registration"
        message={`Are you sure you want to reject "${rejectUser?.name}"'s registration? They will need to register again.`}
        confirmText="Reject"
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

export default Staff;