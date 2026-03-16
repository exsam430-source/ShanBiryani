import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  UtensilsCrossed,
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { dashboardService } from '../../services/dashboardService.js';
import { useToast } from '../../hooks/useToast.js';
import StatsCard from '../../components/admin/dashboard/StatsCard.jsx';
import RecentOrders from '../../components/admin/dashboard/RecentOrders.jsx';
import SalesChart from '../../components/admin/dashboard/SalesChart.jsx';
import LowStockAlert from '../../components/admin/dashboard/LowStockAlert.jsx';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [overviewRes, analyticsRes, ordersRes, stockRes] = await Promise.all([
          dashboardService.getOverview(),
          dashboardService.getAnalytics(7),
          dashboardService.getRecentOrders(5),
          dashboardService.getLowStockItems()
        ]);

        setOverview(overviewRes.data);
        setAnalytics(analyticsRes.data);
        setRecentOrders(ordersRes.data || []);
        setLowStockItems(stockRes.data || []);
      } catch (error) {
        showError('Failed to load dashboard data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Today's Sales",
      value: overview?.today?.sales || 0,
      icon: DollarSign,
      color: 'primary',
      isCurrency: true,
      change: 12,
      changeType: 'increase'
    },
    {
      title: "Today's Orders",
      value: overview?.today?.orders || 0,
      icon: ShoppingCart,
      color: 'blue',
      change: 8,
      changeType: 'increase'
    },
    {
      title: 'Total Revenue',
      value: overview?.totals?.revenue || 0,
      icon: TrendingUp,
      color: 'green',
      isCurrency: true
    },
    {
      title: 'Menu Items',
      value: overview?.totals?.menuItems || 0,
      icon: UtensilsCrossed,
      color: 'orange'
    },
    {
      title: 'Total Customers',
      value: overview?.totals?.users || 0,
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Pending Orders',
      value: overview?.alerts?.pendingOrders || 0,
      icon: Clock,
      color: 'secondary'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-text-secondary mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Charts & Orders */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={analytics?.dailySales || []} isLoading={isLoading} />
        </div>
        <div>
          <LowStockAlert items={lowStockItems} isLoading={isLoading} />
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={recentOrders} isLoading={isLoading} />
    </div>
  );
};

export default Dashboard;