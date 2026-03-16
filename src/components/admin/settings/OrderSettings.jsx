import { useState, useEffect } from 'react';
import { Save, Truck, Clock, DollarSign } from 'lucide-react';
import Input from '../../common/Input.jsx';
import Switch from '../../common/Switch.jsx';
import Button from '../../common/Button.jsx';
import Card from '../../common/Card.jsx';

const OrderSettings = ({ settings, onSave, isLoading = false }) => {
  const [formData, setFormData] = useState({
    minOrderAmount: 0,
    deliveryCharges: 0,
    freeDeliveryAbove: 0,
    estimatedDeliveryTime: 45,
    acceptingOrders: true
  });

  useEffect(() => {
    if (settings?.orderSettings) {
      setFormData({
        minOrderAmount: settings.orderSettings.minOrderAmount || 0,
        deliveryCharges: settings.orderSettings.deliveryCharges || 0,
        freeDeliveryAbove: settings.orderSettings.freeDeliveryAbove || 0,
        estimatedDeliveryTime: settings.orderSettings.estimatedDeliveryTime || 45,
        acceptingOrders: settings.orderSettings.acceptingOrders ?? true
      });
    }
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ orderSettings: formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Status */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Order Status</h3>
        <Switch
          label="Accepting Orders"
          description="When disabled, customers cannot place new orders"
          checked={formData.acceptingOrders}
          onChange={(v) => handleChange('acceptingOrders', v)}
        />
      </Card>

      {/* Order Amounts */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Order Amounts</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Minimum Order Amount (Rs.)"
            type="number"
            min="0"
            value={formData.minOrderAmount}
            onChange={(e) => handleChange('minOrderAmount', parseFloat(e.target.value) || 0)}
            icon={<DollarSign className="w-4 h-4" />}
          />
          <Input
            label="Delivery Charges (Rs.)"
            type="number"
            min="0"
            value={formData.deliveryCharges}
            onChange={(e) => handleChange('deliveryCharges', parseFloat(e.target.value) || 0)}
            icon={<Truck className="w-4 h-4" />}
          />
        </div>
      </Card>

      {/* Delivery Settings */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Delivery Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Free Delivery Above (Rs.)"
            type="number"
            min="0"
            value={formData.freeDeliveryAbove}
            onChange={(e) => handleChange('freeDeliveryAbove', parseFloat(e.target.value) || 0)}
            icon={<Truck className="w-4 h-4" />}
          />
          <Input
            label="Estimated Delivery Time (minutes)"
            type="number"
            min="1"
            value={formData.estimatedDeliveryTime}
            onChange={(e) => handleChange('estimatedDeliveryTime', parseInt(e.target.value) || 45)}
            icon={<Clock className="w-4 h-4" />}
          />
        </div>
        <p className="text-text-muted text-sm mt-2">
          Set free delivery above to 0 to disable free delivery
        </p>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default OrderSettings;