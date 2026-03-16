import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Store, Truck, Percent, FileText } from 'lucide-react';
import { settingsService } from '../../services/settingsService.js';
import { useToast } from '../../hooks/useToast.js';
import Tabs from '../../components/common/Tabs.jsx';
import GeneralSettings from '../../components/admin/settings/GeneralSettings.jsx';
import OrderSettings from '../../components/admin/settings/OrderSettings.jsx';
import TaxSettings from '../../components/admin/settings/TaxSettings.jsx';
import InvoiceSettings from '../../components/admin/settings/InvoiceSettings.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchSettings = async () => {
    try {
      const response = await settingsService.getSettings();
      setSettings(response.data);
    } catch (error) {
      showError('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (data, logo = null) => {
    setIsSaving(true);
    try {
      await settingsService.updateSettings(data);
      
      if (logo) {
        const formData = new FormData();
        formData.append('image', logo);
        await settingsService.updateLogo(formData);
      }
      
      showSuccess('Settings saved successfully');
      fetchSettings();
    } catch (error) {
      showError(error.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  const tabs = [
    {
      id: 'general',
      label: 'General',
      icon: Store,
      content: <GeneralSettings settings={settings} onSave={handleSave} isLoading={isSaving} />
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: Truck,
      content: <OrderSettings settings={settings} onSave={handleSave} isLoading={isSaving} />
    },
    {
      id: 'tax',
      label: 'Tax',
      icon: Percent,
      content: <TaxSettings settings={settings} onSave={handleSave} isLoading={isSaving} />
    },
    {
      id: 'invoice',
      label: 'Invoice',
      icon: FileText,
      content: <InvoiceSettings settings={settings} onSave={handleSave} isLoading={isSaving} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-text-secondary mt-1">Configure your restaurant settings</p>
      </div>

      {/* Settings Tabs */}
      <Tabs tabs={tabs} defaultTab="general" />
    </div>
  );
};

export default Settings;