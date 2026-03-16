import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Input from '../../common/Input.jsx';
import Textarea from '../../common/Textarea.jsx';
import Switch from '../../common/Switch.jsx';
import Button from '../../common/Button.jsx';
import Card from '../../common/Card.jsx';

const InvoiceSettings = ({ settings, onSave, isLoading = false }) => {
  const [formData, setFormData] = useState({
    showLogo: true,
    footerText: 'Thank you for dining with us!',
    termsAndConditions: ''
  });
  const [currency, setCurrency] = useState({
    symbol: 'Rs.',
    code: 'PKR',
    position: 'before'
  });

  useEffect(() => {
    if (settings) {
      if (settings.invoiceSettings) {
        setFormData({
          showLogo: settings.invoiceSettings.showLogo ?? true,
          footerText: settings.invoiceSettings.footerText || 'Thank you for dining with us!',
          termsAndConditions: settings.invoiceSettings.termsAndConditions || ''
        });
      }
      if (settings.currency) {
        setCurrency({
          symbol: settings.currency.symbol || 'Rs.',
          code: settings.currency.code || 'PKR',
          position: settings.currency.position || 'before'
        });
      }
    }
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ 
      invoiceSettings: formData,
      currency: currency
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Invoice Display */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Invoice Display</h3>
        <div className="space-y-4">
          <Switch
            label="Show Logo on Invoice"
            description="Display restaurant logo at the top of invoices"
            checked={formData.showLogo}
            onChange={(v) => setFormData(prev => ({ ...prev, showLogo: v }))}
          />
          <Input
            label="Invoice Footer Text"
            value={formData.footerText}
            onChange={(e) => setFormData(prev => ({ ...prev, footerText: e.target.value }))}
            placeholder="Thank you for dining with us!"
          />
          <Textarea
            label="Terms & Conditions"
            value={formData.termsAndConditions}
            onChange={(e) => setFormData(prev => ({ ...prev, termsAndConditions: e.target.value }))}
            placeholder="Optional terms and conditions to display on invoices"
            rows={3}
          />
        </div>
      </Card>

      {/* Currency Settings */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Currency Settings</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="Currency Symbol"
            value={currency.symbol}
            onChange={(e) => setCurrency(prev => ({ ...prev, symbol: e.target.value }))}
            placeholder="Rs."
          />
          <Input
            label="Currency Code"
            value={currency.code}
            onChange={(e) => setCurrency(prev => ({ ...prev, code: e.target.value }))}
            placeholder="PKR"
          />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Symbol Position
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrency(prev => ({ ...prev, position: 'before' }))}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  currency.position === 'before'
                    ? 'bg-primary text-white'
                    : 'bg-dark-lighter text-text-secondary hover:text-white'
                }`}
              >
                Before (Rs. 100)
              </button>
              <button
                type="button"
                onClick={() => setCurrency(prev => ({ ...prev, position: 'after' }))}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  currency.position === 'after'
                    ? 'bg-primary text-white'
                    : 'bg-dark-lighter text-text-secondary hover:text-white'
                }`}
              >
                After (100 Rs.)
              </button>
            </div>
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

export default InvoiceSettings;