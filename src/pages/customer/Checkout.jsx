import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  CreditCard, 
  Banknote,
  Smartphone,
  ShoppingBag,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { orderService } from '../../services/orderService.js';
import { formatPrice } from '../../utils/formatters.js';
import { getImageUrl, classNames } from '../../utils/helpers.js';
import { validateForm, hasErrors } from '../../utils/validators.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    notes: '',
    paymentMethod: 'cash',
    orderType: 'delivery'
  });

  // Delivery charges (simplified)
  const deliveryCharges = formData.orderType === 'delivery' ? 100 : 0;
  const taxRate = 16; // 16% GST
  const taxAmount = (cartTotal * taxRate) / 100;
  const grandTotal = cartTotal + deliveryCharges + taxAmount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateCheckoutForm = () => {
    const rules = {
      name: { required: true, requiredMessage: 'Name is required' },
      phone: { required: true, phone: true },
      address: { required: formData.orderType === 'delivery', requiredMessage: 'Delivery address is required' }
    };
    const validationErrors = validateForm(formData, rules);
    setErrors(validationErrors);
    return !hasErrors(validationErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCheckoutForm()) {
      showError('Please fill in all required fields correctly');
      return;
    }

    if (items.length === 0) {
      showError('Your cart is empty');
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address
        },
        items: items.map(item => ({
          menuItem: item._id,
          quantity: item.quantity
        })),
        orderType: formData.orderType,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      const response = await orderService.createOrder(orderData);
      
      clearCart();
      showSuccess('Order placed successfully!');
      navigate(`/order-success/${response.data.orderNumber}`);
    } catch (error) {
      showError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-text-secondary mb-6">Add some items to checkout</p>
          <Button onClick={() => navigate('/menu')}>
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card rounded-xl border border-dark-lighter p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Checkout Details</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Order Type */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-3">
                    Order Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'delivery', label: 'Delivery', icon: MapPin },
                      { value: 'pickup', label: 'Pickup', icon: ShoppingBag }
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, orderType: type.value })}
                        className={classNames(
                          'flex items-center justify-center gap-2 p-4 rounded-xl border transition-all',
                          formData.orderType === type.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-dark-lighter text-text-secondary hover:border-text-muted'
                        )}
                      >
                        <type.icon className="w-5 h-5" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    icon={<User className="w-4 h-4" />}
                    error={errors.name}
                  />
                  <Input
                    label="Phone Number *"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    icon={<Phone className="w-4 h-4" />}
                    error={errors.phone}
                  />
                </div>

                <Input
                  label="Email (Optional)"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />

                {formData.orderType === 'delivery' && (
                  <Input
                    label="Delivery Address *"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your complete delivery address"
                    icon={<MapPin className="w-4 h-4" />}
                    error={errors.address}
                  />
                )}

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions for your order..."
                    rows={3}
                    className="w-full bg-dark-lighter border border-dark-lighter rounded-lg px-4 py-2.5 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'cash', label: 'Cash', icon: Banknote },
                      { value: 'card', label: 'Card', icon: CreditCard },
                      { value: 'online', label: 'Online', icon: Smartphone }
                    ].map((method) => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                        className={classNames(
                          'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                          formData.paymentMethod === method.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-dark-lighter text-text-secondary hover:border-text-muted'
                        )}
                      >
                        <method.icon className="w-6 h-6" />
                        <span className="text-sm">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button (Mobile) */}
                <div className="lg:hidden">
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    isLoading={isLoading}
                  >
                    Place Order • {formatPrice(grandTotal)}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-dark-card rounded-xl border border-dark-lighter p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => {
                  const price = item.discount > 0 
                    ? item.price - (item.price * item.discount / 100)
                    : item.price;
                  
                  return (
                    <div key={item._id} className="flex gap-3">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-medium truncate">{item.name}</h4>
                        <p className="text-text-muted text-xs">Qty: {item.quantity}</p>
                        <p className="text-primary font-medium text-sm">
                          {formatPrice(price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="border-t border-dark-lighter pt-4 space-y-3">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(cartTotal)}</span>
                </div>
                {formData.orderType === 'delivery' && (
                  <div className="flex justify-between text-text-secondary">
                    <span>Delivery Fee</span>
                    <span className="text-white">{formatPrice(deliveryCharges)}</span>
                  </div>
                )}
                <div className="flex justify-between text-text-secondary">
                  <span>Tax ({taxRate}%)</span>
                  <span className="text-white">{formatPrice(taxAmount)}</span>
                </div>
                <div className="border-t border-dark-lighter pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-white">Total</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button (Desktop) */}
              <div className="hidden lg:block mt-6">
                <Button
                  onClick={handleSubmit}
                  fullWidth
                  size="lg"
                  isLoading={isLoading}
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;