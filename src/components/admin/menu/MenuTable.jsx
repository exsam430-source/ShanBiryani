import { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  MoreVertical, 
  Eye, 
  EyeOff, 
  Star,
  StarOff,
  Package
} from 'lucide-react';
import { formatPrice } from '../../../utils/formatters.js';
import { getImageUrl, classNames } from '../../../utils/helpers.js';
import Badge from '../../common/Badge.jsx';
import Dropdown, { DropdownItem, DropdownDivider } from '../../common/Dropdown.jsx';

const MenuTable = ({ 
  items = [], 
  onEdit, 
  onDelete, 
  onToggleAvailability,
  onToggleFeatured,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="bg-dark-card rounded-xl border border-dark-lighter overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-lighter">
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Item</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-lighter">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 skeleton rounded-lg" />
                      <div className="space-y-1">
                        <div className="h-4 w-24 skeleton rounded" />
                        <div className="h-3 w-32 skeleton rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><div className="h-4 w-16 skeleton rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-16 skeleton rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-12 skeleton rounded" /></td>
                  <td className="px-4 py-3"><div className="h-6 w-20 skeleton rounded-full" /></td>
                  <td className="px-4 py-3"><div className="h-8 w-8 skeleton rounded ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-dark-card rounded-xl border border-dark-lighter p-12 text-center">
        <Package className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No menu items</h3>
        <p className="text-text-secondary">Add your first menu item to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-xl border border-dark-lighter overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-lighter bg-dark-lighter/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Item
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-lighter">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-dark-lighter/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{item.name}</p>
                        {item.featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <p className="text-text-muted text-sm truncate max-w-[200px]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-text-secondary">{item.category?.name || 'N/A'}</span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-white font-medium">{formatPrice(item.price)}</p>
                    {item.discount > 0 && (
                      <p className="text-green-500 text-sm">{item.discount}% off</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={classNames(
                    'font-medium',
                    item.stock <= item.lowStockThreshold ? 'text-orange-500' : 'text-white'
                  )}>
                    {item.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={item.isAvailable ? 'success' : 'danger'}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <Dropdown
                      align="right"
                      trigger={
                        <button className="p-2 hover:bg-dark-lighter rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-text-secondary" />
                        </button>
                      }
                    >
                      <DropdownItem icon={Edit} onClick={() => onEdit?.(item)}>
                        Edit
                      </DropdownItem>
                      <DropdownItem 
                        icon={item.isAvailable ? EyeOff : Eye} 
                        onClick={() => onToggleAvailability?.(item)}
                      >
                        {item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                      </DropdownItem>
                      <DropdownItem 
                        icon={item.featured ? StarOff : Star} 
                        onClick={() => onToggleFeatured?.(item)}
                      >
                        {item.featured ? 'Remove Featured' : 'Mark Featured'}
                      </DropdownItem>
                      <DropdownDivider />
                      <DropdownItem icon={Trash2} danger onClick={() => onDelete?.(item)}>
                        Delete
                      </DropdownItem>
                    </Dropdown>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuTable;