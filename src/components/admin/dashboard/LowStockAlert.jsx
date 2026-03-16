import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Package } from 'lucide-react';
import { getImageUrl } from '../../../utils/helpers.js';
import Button from '../../common/Button.jsx';

const LowStockAlert = ({ items = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 skeleton rounded" />
          <div className="h-5 w-32 skeleton rounded" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 skeleton rounded" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-24 skeleton rounded" />
                <div className="h-3 w-16 skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-white">Stock Status</h3>
        </div>
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-green-500 font-medium">All items in stock!</p>
          <p className="text-text-muted text-sm mt-1">No low stock alerts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-xl border border-orange-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-white">Low Stock Alert</h3>
          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-500 text-xs font-medium rounded-full">
            {items.length}
          </span>
        </div>
        <Link to="/admin/menu">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Manage
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {items.slice(0, 5).map((item) => (
          <div 
            key={item._id} 
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-lighter transition-colors"
          >
            <img
              src={getImageUrl(item.image)}
              alt={item.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{item.name}</p>
              <p className="text-text-muted text-xs">{item.category?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-orange-500 font-semibold">{item.stock}</p>
              <p className="text-text-muted text-xs">left</p>
            </div>
          </div>
        ))}
      </div>

      {items.length > 5 && (
        <Link 
          to="/admin/menu?filter=low-stock" 
          className="block text-center text-primary text-sm mt-4 hover:underline"
        >
          View all {items.length} items
        </Link>
      )}
    </div>
  );
};

export default LowStockAlert;