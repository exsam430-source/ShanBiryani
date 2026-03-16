// frontend/src/components/admin/AdminSidebar.jsx
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  FolderOpen,
  ShoppingCart, 
  Receipt, 
  FileText,
  Users, 
  UserCheck,
  UserCog,
  Settings, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  X,
  User
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { classNames } from '../../utils/helpers.js';

const AdminSidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  // Main menu items - accessible by both admin and staff
  const mainMenuItems = [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: LayoutDashboard 
    },
    { 
      name: 'Menu Items', 
      path: '/admin/menu', 
      icon: UtensilsCrossed 
    },
    { 
      name: 'Categories', 
      path: '/admin/categories', 
      icon: FolderOpen 
    },
    { 
      name: 'Orders', 
      path: '/admin/orders', 
      icon: ShoppingCart 
    },
    { 
      name: 'Billing (POS)', 
      path: '/admin/billing', 
      icon: Receipt 
    },
    { 
      name: 'Bills History', 
      path: '/admin/bills', 
      icon: FileText 
    }
  ];

  // Admin only items
  const adminOnlyItems = [
    { 
      name: 'All Users', 
      path: '/admin/users', 
      icon: Users 
    },
    { 
      name: 'Staff Management', 
      path: '/admin/staff', 
      icon: UserCog 
    },
    { 
      name: 'Customers', 
      path: '/admin/customers', 
      icon: UserCheck 
    },
    { 
      name: 'Reports', 
      path: '/admin/reports', 
      icon: BarChart3 
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: Settings 
    }
  ];

  // Profile item - accessible by all
  const profileItem = { 
    name: 'My Profile', 
    path: '/admin/profile', 
    icon: User 
  };

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path || 
                     (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
    
    return (
      <NavLink
        to={item.path}
        onClick={() => window.innerWidth < 1024 && onClose()}
        className={classNames(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
          isActive
            ? 'bg-primary text-white shadow-lg shadow-primary/30'
            : 'text-text-secondary hover:text-white hover:bg-dark-lighter'
        )}
        title={isCollapsed ? item.name : ''}
      >
        <item.icon className={classNames(
          'w-5 h-5 flex-shrink-0',
          isCollapsed && 'mx-auto'
        )} />
        {!isCollapsed && (
          <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[198] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={classNames(
          'fixed top-0 left-0 h-full bg-dark-card border-r border-dark-lighter z-[199] transition-all duration-300 flex flex-col',
          'lg:sticky lg:top-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between h-16 px-4 border-b border-dark-lighter">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-white">Admin Panel</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">S</span>
            </div>
          )}
          
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-text-secondary hover:text-white hover:bg-dark-lighter rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Button */}
          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 text-text-secondary hover:text-white hover:bg-dark-lighter rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Collapse Button when collapsed */}
        {isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 mx-auto mt-2 text-text-secondary hover:text-white hover:bg-dark-lighter rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Main Menu Section */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Main Menu
              </p>
            )}
            {isCollapsed && <div className="h-2" />}
            {mainMenuItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>

          {/* Admin Only Section */}
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-dark-lighter space-y-1">
              {!isCollapsed && (
                <p className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Administration
                </p>
              )}
              {isCollapsed && <div className="h-2" />}
              {adminOnlyItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          )}

          {/* Account Section */}
          <div className="pt-4 mt-4 border-t border-dark-lighter space-y-1">
            {!isCollapsed && (
              <p className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Account
              </p>
            )}
            {isCollapsed && <div className="h-2" />}
            <NavItem item={profileItem} />
          </div>
        </nav>

        {/* User Info Footer */}
        <div className="flex-shrink-0 p-3 border-t border-dark-lighter">
          <div className={classNames(
            'flex items-center gap-3 px-3 py-2 rounded-lg bg-dark-lighter/50',
            isCollapsed && 'justify-center px-2'
          )}>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-medium text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-text-muted capitalize">
                  {user?.role || 'Unknown'}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;