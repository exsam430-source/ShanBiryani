import { Check, X, User, Clock } from 'lucide-react';
import { formatRelativeTime } from '../../../utils/formatters.js';
import Avatar from '../../common/Avatar.jsx';
import Button from '../../common/Button.jsx';

const PendingStaff = ({ 
  staff = [], 
  onApprove, 
  onReject, 
  isLoading = false 
}) => {
  if (staff.length === 0) {
    return (
      <div className="bg-dark-card rounded-xl border border-dark-lighter p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Pending Requests</h3>
        <p className="text-text-secondary">All staff registrations have been processed.</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-xl border border-dark-lighter overflow-hidden">
      <div className="p-4 border-b border-dark-lighter">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-white">Pending Staff Approvals</h3>
          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-500 text-xs font-medium rounded-full">
            {staff.length}
          </span>
        </div>
      </div>

      <div className="divide-y divide-dark-lighter">
        {staff.map((user) => (
          <div key={user._id} className="p-4 hover:bg-dark-lighter/30 transition-colors">
            <div className="flex items-center gap-4">
              <Avatar name={user.name} size="lg" />
              
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium">{user.name}</h4>
                <p className="text-text-muted text-sm">{user.email}</p>
                <div className="flex items-center gap-2 mt-1 text-text-muted text-xs">
                  <Clock className="w-3 h-3" />
                  <span>Requested {formatRelativeTime(user.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject?.(user)}
                  disabled={isLoading}
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => onApprove?.(user)}
                  disabled={isLoading}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingStaff;