// frontend/src/pages/admin/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
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
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      
      console.log('Login success response:', response); // Debug
      
      // Check if user is admin or staff
      if (response?.data?.role === 'customer') {
        showError('Access denied. Admin or staff account required.');
        return;
      }

      showSuccess(`Welcome back, ${response?.data?.name || 'Admin'}!`);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error); // Debug
      showError(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-white font-bold text-xl font-heading">S</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold font-heading text-white">Admin Panel</h1>
            <p className="text-text-secondary mt-2">Sign in to manage your restaurant</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@shanbiryani.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              leftIcon={<LogIn className="w-5 h-5" />}
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-text-secondary hover:text-primary transition-colors text-sm">
              ← Back to Website
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary-dark items-center justify-center p-12">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold font-heading mb-4">Shan Biryani</h2>
          <p className="text-xl opacity-90 mb-8">Restaurant Management System</p>
          <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
            {[
              { label: 'Orders', value: '500+' },
              { label: 'Revenue', value: 'Rs. 1M+' },
              { label: 'Customers', value: '2000+' },
              { label: 'Menu Items', value: '100+' }
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;