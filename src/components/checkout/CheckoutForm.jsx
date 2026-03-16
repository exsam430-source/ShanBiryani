import { useState } from 'react';
import { User, Phone, Mail, MapPin, FileText } from 'lucide-react';
import Input from '../common/Input.jsx';
import { classNames } from '../../utils/helpers.js';

const CheckoutForm = ({ formData, onChange, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-6">
      {/* Order Type */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-3">
          Order Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 'delivery', label: 'Delivery', icon: '🚚' },
            { value: 'pickup', label: 'Pickup', icon: '🏪' }
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange({ ...formData, orderType: type.value })}
              className={classNames(
                'flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all',
                formData.orderType === type.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-dark-lighter text-text-secondary hover:border-text-muted'
              )}
            >
              <span className="text-xl">{type.icon}</span>
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
        icon={<Mail className="w-4 h-4" />}
        error={errors.email}
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
          <FileText className="w-4 h-4 inline mr-2" />
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
    </div>
  );
};

export default CheckoutForm;