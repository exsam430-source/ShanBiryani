import { useState } from 'react';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { authService } from '../../services/authService.js';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/common/Avatar.jsx';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const response = await authService.updateProfile(profileData);
      updateUser(response.data);
      showSuccess('Profile updated successfully');
    } catch (error) {
      showError(error.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      showSuccess('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showError(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-text-secondary mt-1">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={user?.name} size="xl" />
          <div>
            <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
            <p className="text-text-secondary capitalize">{user?.role}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            icon={<User className="w-4 h-4" />}
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleProfileChange}
            icon={<Mail className="w-4 h-4" />}
            disabled
          />
          <Input
            label="Phone Number"
            name="phone"
            value={profileData.phone}
            onChange={handleProfileChange}
            icon={<Phone className="w-4 h-4" />}
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              isLoading={isUpdatingProfile}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            icon={<Lock className="w-4 h-4" />}
          />
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            icon={<Lock className="w-4 h-4" />}
          />
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            icon={<Lock className="w-4 h-4" />}
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              isLoading={isChangingPassword}
              leftIcon={<Lock className="w-4 h-4" />}
            >
              Change Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;