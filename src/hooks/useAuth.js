// frontend/src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    ...context,
    isAdmin: context.user?.role === 'admin',
    isStaff: context.user?.role === 'staff',
    isCustomer: context.user?.role === 'customer'
  };
};