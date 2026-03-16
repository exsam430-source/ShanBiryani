// frontend/src/components/admin/billing/EditPriceModal.jsx
import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import Modal from '../../common/Modal.jsx';
import Input from '../../common/Input.jsx';
import Button from '../../common/Button.jsx';

const EditPriceModal = ({ isOpen, onClose, item, onSave }) => {
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (item) {
      setPrice(item.price?.toString() || '');
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPrice = parseFloat(price);
    if (newPrice > 0) {
      onSave(newPrice);
      onClose();
    }
  };

  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Price" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-white font-medium">{item.name}</p>
          <p className="text-text-muted text-sm">Original: Rs. {item.originalPrice || item.price}</p>
        </div>

        <Input
          label="New Price (Rs.)"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter new price"
          icon={<DollarSign className="w-4 h-4" />}
          autoFocus
        />

        {/* Quick adjustments */}
        <div className="flex flex-wrap gap-2">
          {[-50, -20, -10, 10, 20, 50].map(adj => (
            <button
              key={adj}
              type="button"
              onClick={() => setPrice((parseFloat(price) + adj).toString())}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                adj < 0 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              }`}
            >
              {adj > 0 ? '+' : ''}{adj}
            </button>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Update Price
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPriceModal;