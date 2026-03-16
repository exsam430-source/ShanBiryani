import { useState, useEffect } from 'react';
import { Save, Percent } from 'lucide-react';
import Input from '../../common/Input.jsx';
import Switch from '../../common/Switch.jsx';
import Button from '../../common/Button.jsx';
import Card from '../../common/Card.jsx';

const TaxSettings = ({ settings, onSave, isLoading = false }) => {
  const [formData, setFormData] = useState({
    enableTax: false,
    taxRate: 0,
    taxName: 'GST'
  });

  useEffect(() => {
    if (settings?.taxSettings) {
      setFormData({
        enableTax: settings.taxSettings.enableTax || false,
        taxRate: settings.taxSettings.taxRate || 0,
        taxName: settings.taxSettings.taxName || 'GST'
      });
    }
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ taxSettings: formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Tax Configuration</h3>
        
        <div className="space-y-6">
          <Switch
            label="Enable Tax"
            description="Apply tax to all orders and bills"
            checked={formData.enableTax}
            onChange={(v) => handleChange('enableTax', v)}
          />

          {formData.enableTax && (
            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-dark-lighter">
              <Input
                label="Tax Name"
                value={formData.taxName}
                onChange={(e) => handleChange('taxName', e.target.value)}
                placeholder="GST"
              />
              <Input
                label="Tax Rate (%)"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.taxRate}
                onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)}
                icon={<Percent className="w-4 h-4" />}
              />
            </div>
          )}

          <div className="p-4 bg-dark-lighter rounded-lg">
            <p className="text-text-secondary text-sm">
              <strong className="text-white">Note:</strong> When tax is enabled, it will be automatically 
              calculated and added to all orders and bills. The tax will be shown separately 
              in invoices and receipts.
            </p>
          </div>
        </div>
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

export default TaxSettings;