// frontend/src/components/admin/billing/BillItemList.jsx
import { Trash2, Plus, Minus, Edit2, Package, Scale } from 'lucide-react';
import { formatPrice } from '../../../utils/formatters.js';
import { getImageUrl } from '../../../utils/helpers.js';

const getUnitLabel = (unit, quantity) => {
  const labels = {
    piece: quantity > 1 ? 'Pcs' : 'Pc',
    kg: 'Kg',
    gram: 'g',
    dozen: 'Dz',
    plate: quantity > 1 ? 'Plates' : 'Plate',
    box: quantity > 1 ? 'Boxes' : 'Box',
    pack: quantity > 1 ? 'Packs' : 'Pack',
    bottle: quantity > 1 ? 'Bottles' : 'Bottle',
    litre: 'L',
    half: 'Half',
    full: 'Full',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    regular: 'Regular',
    family: 'Family',
    crate: quantity > 1 ? 'Crates' : 'Crate',
    bundle: quantity > 1 ? 'Bundles' : 'Bundle'
  };
  return labels[unit] || unit || 'Pc';
};

const BillItemList = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onEditItem
}) => {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center text-center p-8">
        <div>
          <div className="w-16 h-16 rounded-full bg-dark-lighter flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🛒</span>
          </div>
          <p className="text-text-secondary">No items added yet</p>
          <p className="text-text-muted text-sm mt-1">Click on items or add custom items</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-3">
      {items.map((item, index) => (
        <div
          key={`${item._id}-${index}`}
          className="flex items-center gap-2 p-2 bg-dark-lighter rounded-lg group"
        >
          {/* Image or Custom Icon */}
          {item.isCustom || !item.image ? (
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              {item.isBulk ? (
                <Scale className="w-5 h-5 text-primary" />
              ) : (
                <Package className="w-5 h-5 text-primary" />
              )}
            </div>
          ) : (
            <img
              src={getImageUrl(item.image)}
              alt={item.name}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 flex-wrap">
              <p className="text-white font-medium text-sm truncate">{item.name}</p>
              {item.isCustom && (
                <span className="px-1 py-0.5 text-[10px] bg-primary/20 text-primary rounded flex-shrink-0">
                  Custom
                </span>
              )}
            </div>
            
            <button
              onClick={() => onEditItem(index, item)}
              className="text-primary text-xs hover:underline flex items-center gap-1"
            >
              {formatPrice(item.price)}/{getUnitLabel(item.unit || 'piece', 1)}
              <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100" />
            </button>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-0.5 bg-dark-card rounded-lg flex-shrink-0">
            <button
              onClick={() => {
                const step = item.unit === 'kg' ? 0.25 : item.unit === 'gram' ? 100 : 1;
                onUpdateQuantity(index, Math.max(step, item.quantity - step));
              }}
              className="p-1 text-text-secondary hover:text-white transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-10 text-center text-white text-sm">
              {item.quantity}
            </span>
            <button
              onClick={() => {
                const step = item.unit === 'kg' ? 0.25 : item.unit === 'gram' ? 100 : 1;
                onUpdateQuantity(index, item.quantity + step);
              }}
              className="p-1 text-text-secondary hover:text-white transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Subtotal */}
          <div className="w-16 text-right flex-shrink-0">
            <p className="text-white font-semibold text-sm">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemoveItem(index)}
            className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors flex-shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default BillItemList;