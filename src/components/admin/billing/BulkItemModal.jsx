// frontend/src/components/admin/billing/BulkItemModal.jsx
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Modal from '../../common/Modal.jsx';
import Button from '../../common/Button.jsx';
import { formatPrice } from '../../../utils/formatters.js';

const UNIT_TYPES = [
  { value: 'piece', label: 'Piece' },
  { value: 'kg', label: 'Kg' },
  { value: 'gram', label: 'Gram' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'pack', label: 'Pack' },
  { value: 'box', label: 'Box' },
  { value: 'crate', label: 'Crate' },
  { value: 'bundle', label: 'Bundle' }
];

const PRESET_ITEMS = [
  { name: 'Bread', defaultUnit: 'piece' },
  { name: 'Roti', defaultUnit: 'piece' },
  { name: 'Naan', defaultUnit: 'piece' },
  { name: 'Paratha', defaultUnit: 'piece' },
  { name: 'Rice', defaultUnit: 'kg' },
  { name: 'Biryani', defaultUnit: 'kg' },
  { name: 'Chicken', defaultUnit: 'kg' },
  { name: 'Mutton', defaultUnit: 'kg' }
];

const BulkItemModal = ({ isOpen, onClose, onAddItems }) => {
  const [items, setItems] = useState([
    { id: 1, name: '', price: '', quantity: '1', unit: 'piece' }
  ]);

  const addRow = () => {
    setItems(prev => [
      ...prev,
      { id: Date.now(), name: '', price: '', quantity: '1', unit: 'piece' }
    ]);
  };

  const removeRow = (id) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const selectPreset = (id, preset) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, name: preset.name, unit: preset.defaultUnit }
        : item
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validItems = items.filter(item => 
      item.name.trim() && 
      parseFloat(item.price) > 0 && 
      parseFloat(item.quantity) > 0
    );

    if (validItems.length === 0) return;

    const formattedItems = validItems.map(item => ({
      _id: `bulk_${Date.now()}_${Math.random()}`,
      name: item.name.trim(),
      price: parseFloat(item.price),
      quantity: parseFloat(item.quantity),
      unit: item.unit,
      isCustom: true,
      isBulk: true
    }));

    onAddItems(formattedItems);
    handleClose();
  };

  const handleClose = () => {
    setItems([{ id: 1, name: '', price: '', quantity: '1', unit: 'piece' }]);
    onClose();
  };

  const totalAmount = items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseFloat(item.quantity) || 0;
    return sum + (price * qty);
  }, 0);

  const validItemCount = items.filter(item => 
    item.name.trim() && parseFloat(item.price) > 0
  ).length;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Bulk Items" size="xl">
      <form onSubmit={handleSubmit} className="flex flex-col max-h-[70vh]">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {/* Quick Presets */}
          <div>
            <p className="text-sm text-text-muted mb-2">Quick Add Common Items:</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_ITEMS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    const emptyRow = items.find(i => !i.name.trim());
                    if (emptyRow) {
                      selectPreset(emptyRow.id, preset);
                    } else {
                      setItems(prev => [
                        ...prev,
                        { id: Date.now(), name: preset.name, price: '', quantity: '1', unit: preset.defaultUnit }
                      ]);
                    }
                  }}
                  className="px-2 py-1 text-xs bg-dark-lighter text-text-secondary hover:bg-primary hover:text-white rounded transition-colors"
                >
                  + {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-dark-lighter rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 p-2 bg-dark-card text-xs font-semibold text-text-muted uppercase">
              <div className="col-span-4">Item Name</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Unit</div>
              <div className="col-span-1">Total</div>
              <div className="col-span-1"></div>
            </div>

            {/* Rows */}
            <div className="max-h-[30vh] overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 p-2 border-t border-dark-card items-center">
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="Item name"
                      className="w-full bg-dark-card border-none rounded px-2 py-1.5 text-white text-sm placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
                      list={`presets-${item.id}`}
                    />
                    <datalist id={`presets-${item.id}`}>
                      {PRESET_ITEMS.map(p => (
                        <option key={p.name} value={p.name} />
                      ))}
                    </datalist>
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                      placeholder="Rs."
                      className="w-full bg-dark-card border-none rounded px-2 py-1.5 text-white text-sm placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      placeholder="Qty"
                      className="w-full bg-dark-card border-none rounded px-2 py-1.5 text-white text-sm placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="col-span-2">
                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      className="w-full bg-dark-card border-none rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {UNIT_TYPES.map(u => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-1">
                    <span className="text-primary font-medium text-sm">
                      {formatPrice((parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0), false)}
                    </span>
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeRow(item.id)}
                      disabled={items.length === 1}
                      className="p-1 text-red-500 hover:bg-red-500/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Row Button */}
          <Button
            type="button"
            variant="outline"
            onClick={addRow}
            leftIcon={<Plus className="w-4 h-4" />}
            fullWidth
            size="sm"
          >
            Add Another Item
          </Button>

          {/* Summary */}
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-text-secondary text-sm">Total Items: {validItemCount}</p>
              </div>
              <div className="text-right">
                <p className="text-text-secondary text-sm">Grand Total</p>
                <p className="text-xl font-bold text-primary">{formatPrice(totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Actions */}
        <div className="flex-shrink-0 flex gap-3 pt-4 mt-4 border-t border-dark-lighter">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={validItemCount === 0}>
            Add {validItemCount} Item{validItemCount !== 1 ? 's' : ''} to Bill
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BulkItemModal;