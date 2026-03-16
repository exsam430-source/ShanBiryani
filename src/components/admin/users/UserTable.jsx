import {
  Edit,
  Trash2,
  MoreVertical,
  UserCheck,
  UserX,
  Key,
  Users
} from 'lucide-react';
import { formatSmartDate } from '../../../utils/formatters.js';
import { classNames, getRoleColor } from '../../../utils/helpers.js';
import Badge from '../../common/Badge.jsx';
import Avatar from '../../common/Avatar.jsx';
import Dropdown, { DropdownItem, DropdownDivider } from '../../common/Dropdown.jsx';

const UserTable = ({
  users = [],
  onEdit,
  onDelete,
  onToggleStatus,
  onResetPassword,
  isLoading = false,
  showRole = true
}) => {
  if (isLoading) {
    return (
      <div className="bg-dark-card rounded-xl border border-dark-lighter">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-lighter">
                {['User', 'Email', 'Phone', showRole && 'Role', 'Status', 'Joined', 'Actions']
                  .filter(Boolean)
                  .map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                      {h}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-lighter">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 skeleton rounded-full" />
                      <div className="h-4 w-24 skeleton rounded" />
                    </div>
                  </td>
                  {[...Array(showRole ? 5 : 4)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 w-20 skeleton rounded" />
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="h-8 w-8 skeleton rounded ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-dark-card rounded-xl border border-dark-lighter p-12 text-center">
        <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No users found</h3>
        <p className="text-text-secondary">Users will appear here when they register.</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-xl border border-dark-lighter">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-lighter bg-dark-lighter/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Phone
              </th>
              {showRole && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Role
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Joined
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-dark-lighter">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-dark-lighter/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} size="sm" />
                    <span className="text-white font-medium">{user.name}</span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="text-text-secondary">{user.email}</span>
                </td>

                <td className="px-4 py-3">
                  <span className="text-text-secondary">{user.phone || 'N/A'}</span>
                </td>

                {showRole && (
                  <td className="px-4 py-3">
                    <span
                      className={classNames(
                        'px-2 py-1 rounded-full text-xs font-medium capitalize',
                        getRoleColor(user.role)
                      )}
                    >
                      {user.role}
                    </span>
                  </td>
                )}

                <td className="px-4 py-3">
                  <Badge variant={user.isActive ? 'success' : 'danger'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>

                <td className="px-4 py-3">
                  <span className="text-text-secondary text-sm">
                    {formatSmartDate(user.createdAt)}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-end relative">
                    <Dropdown
                      align="right"
                      trigger={
                        <button
                          type="button"
                          className="p-2 hover:bg-dark-lighter rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-text-secondary" />
                        </button>
                      }
                    >
                      <DropdownItem icon={Edit} onClick={() => onEdit?.(user)}>
                        Edit
                      </DropdownItem>

                      <DropdownItem icon={Key} onClick={() => onResetPassword?.(user)}>
                        Reset Password
                      </DropdownItem>

                      <DropdownItem
                        icon={user.isActive ? UserX : UserCheck}
                        onClick={() => onToggleStatus?.(user)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownItem>

                      {user.role !== 'admin' && (
                        <>
                          <DropdownDivider />
                          <DropdownItem icon={Trash2} danger onClick={() => onDelete?.(user)}>
                            Delete
                          </DropdownItem>
                        </>
                      )}
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

export default UserTable;