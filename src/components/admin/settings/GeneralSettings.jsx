import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Input from '../../common/Input.jsx';
import Textarea from '../../common/Textarea.jsx';
import FileUpload from '../../common/FileUpload.jsx';
import Button from '../../common/Button.jsx';
import Card from '../../common/Card.jsx';

const GeneralSettings = ({ settings, onSave, isLoading = false }) => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    tagline: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      fullAddress: ''
    },
    contact: {
      phone: '',
      altPhone: '',
      email: '',
      whatsapp: ''
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    }
  });
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        restaurantName: settings.restaurantName || '',
        tagline: settings.tagline || '',
        description: settings.description || '',
        address: {
          street: settings.address?.street || '',
          city: settings.address?.city || '',
          state: settings.address?.state || '',
          zipCode: settings.address?.zipCode || '',
          country: settings.address?.country || '',
          fullAddress: settings.address?.fullAddress || ''
        },
        contact: {
          phone: settings.contact?.phone || '',
          altPhone: settings.contact?.altPhone || '',
          email: settings.contact?.email || '',
          whatsapp: settings.contact?.whatsapp || ''
        },
        socialMedia: {
          facebook: settings.socialMedia?.facebook || '',
          instagram: settings.socialMedia?.instagram || '',
          twitter: settings.socialMedia?.twitter || '',
          youtube: settings.socialMedia?.youtube || ''
        }
      });
    }
  }, [settings]);

  const handleChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, logo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Restaurant Name"
              value={formData.restaurantName}
              onChange={(e) => handleChange(null, 'restaurantName', e.target.value)}
              placeholder="Shan Biryani"
            />
            <Input
              label="Tagline"
              value={formData.tagline}
              onChange={(e) => handleChange(null, 'tagline', e.target.value)}
              placeholder="Where Every Grain Tells a Story"
            />
          </div>
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange(null, 'description', e.target.value)}
            placeholder="Brief description of your restaurant"
            rows={3}
          />
          <FileUpload
            label="Restaurant Logo"
            value={settings?.logo}
            onChange={setLogo}
            accept="image/*"
          />
        </div>
      </Card>

      {/* Address */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
        <div className="space-y-4">
          <Input
            label="Street Address"
            value={formData.address.street}
            onChange={(e) => handleChange('address', 'street', e.target.value)}
            placeholder="123 Food Street"
          />
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="City"
              value={formData.address.city}
              onChange={(e) => handleChange('address', 'city', e.target.value)}
              placeholder="Karachi"
            />
            <Input
              label="State/Province"
              value={formData.address.state}
              onChange={(e) => handleChange('address', 'state', e.target.value)}
              placeholder="Sindh"
            />
            <Input
              label="Zip Code"
              value={formData.address.zipCode}
              onChange={(e) => handleChange('address', 'zipCode', e.target.value)}
              placeholder="75500"
            />
          </div>
          <Textarea
            label="Full Address (for display)"
            value={formData.address.fullAddress}
            onChange={(e) => handleChange('address', 'fullAddress', e.target.value)}
            placeholder="123 Food Street, Gulshan-e-Iqbal, Karachi, Pakistan"
            rows={2}
          />
        </div>
      </Card>

      {/* Contact Info */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            value={formData.contact.phone}
            onChange={(e) => handleChange('contact', 'phone', e.target.value)}
            placeholder="+92 300 1234567"
          />
          <Input
            label="Alternate Phone"
            value={formData.contact.altPhone}
            onChange={(e) => handleChange('contact', 'altPhone', e.target.value)}
            placeholder="+92 21 1234567"
          />
          <Input
            label="Email"
            type="email"
            value={formData.contact.email}
            onChange={(e) => handleChange('contact', 'email', e.target.value)}
            placeholder="info@shanbiryani.com"
          />
          <Input
            label="WhatsApp"
            value={formData.contact.whatsapp}
            onChange={(e) => handleChange('contact', 'whatsapp', e.target.value)}
            placeholder="+92 300 1234567"
          />
        </div>
      </Card>

      {/* Social Media */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Social Media</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Facebook"
            value={formData.socialMedia.facebook}
            onChange={(e) => handleChange('socialMedia', 'facebook', e.target.value)}
            placeholder="https://facebook.com/shanbiryani"
          />
          <Input
            label="Instagram"
            value={formData.socialMedia.instagram}
            onChange={(e) => handleChange('socialMedia', 'instagram', e.target.value)}
            placeholder="https://instagram.com/shanbiryani"
          />
          <Input
            label="Twitter"
            value={formData.socialMedia.twitter}
            onChange={(e) => handleChange('socialMedia', 'twitter', e.target.value)}
            placeholder="https://twitter.com/shanbiryani"
          />
          <Input
            label="YouTube"
            value={formData.socialMedia.youtube}
            onChange={(e) => handleChange('socialMedia', 'youtube', e.target.value)}
            placeholder="https://youtube.com/shanbiryani"
          />
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

export default GeneralSettings;