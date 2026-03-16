import { useState, useEffect } from 'react';
import Modal from '../../common/Modal.jsx';
import Input from '../../common/Input.jsx';
import Select from '../../common/Select.jsx';
import Switch from '../../common/Switch.jsx';
import Button from '../../common/Button.jsx';

const UserForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  user = null, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'staff',
        isActive: user.isActive ?? true
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'staff',
        isActive: true
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData, user?._id);
  };

  const roleOptions = [
    { value: 'staff', label: 'Staff' },
    { value: 'customer', label: 'Customer' }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={user ? 'Edit User' : 'Add User'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
          error={errors.name}
        />

        <Input
          label="Email *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          error={errors.email}
          disabled={!!user}
        />

        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+92 300 1234567"
        />

        {user?.role !== 'admin' && (
          <Select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={roleOptions}
          />
        )}

        <Switch
          label="Active"
          description="User can login and access the system"
          checked={formData.isActive}
          onChange={(v) => setFormData(prev => ({ ...prev, isActive: v }))}
        />

        <div className="flex gap-3 pt-4 border-t border-dark-lighter">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} className="flex-1">
            {user ? 'Update User' : 'Add User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserForm;