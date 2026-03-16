import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  Download,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { billService } from '../../services/billService.js';
import { dashboardService } from '../../services/dashboardService.js';
import { useToast } from '../../hooks/useToast.js';
import { formatPrice, formatDate } from '../../utils/formatters.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Select from '../../components/common/Select.jsx';
import DatePicker from '../../components/common/DatePicker.jsx';
import StatsCard from '../../components/admin/dashboard/StatsCard.jsx';
import { SectionLoader } from '../../components/common/Loader.jsx';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [dateRange, setDateRange] = useState('30');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { showSuccess, showError } = useToast();

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const [salesRes, analyticsRes, categoryRes] = await Promise.all([
        billService.getSalesReport({ 
          startDate: startDate || undefined, 
          endDate: endDate || undefined,
          groupBy: 'day'
        }),
        dashboardService.getAnalytics(parseInt(dateRange)),
        dashboardService.getCategorySales(parseInt(dateRange))
      ]);

      setReportData(salesRes);
      setTopItems(analyticsRes.data?.topSellingItems || []);
      setCategoryData(categoryRes.data || []);
    } catch (error) {
      showError('Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [dateRange, startDate, endDate]);

  const handleExport = async () => {
    try {
      const blob = await billService.exportBills({ startDate, endDate });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales_report_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      showSuccess('Report exported successfully');
    } catch (error) {
      showError('Failed to export report');
    }
  };

  const COLORS = ['#DC2626', '#F59E0B', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'];

  const dateRangeOptions = [
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: '365', label: 'Last Year' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card border border-dark-lighter rounded-lg p-3 shadow-xl">
          <p className="text-text-secondary text-sm mb-1">{label}</p>
          <p className="text-white font-semibold">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <SectionLoader />;
  }

  const summary = reportData?.summary || {};
  const dailyData = reportData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-text-secondary mt-1">Sales reports and performance analytics</p>
        </div>
        <Button 
          onClick={handleExport}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="w-48">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={dateRangeOptions}
          />
        </div>
        <div className="flex gap-2">
          <DatePicker
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <DatePicker
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={summary.totalRevenue || 0}
          icon={DollarSign}
          color="primary"
          isCurrency={true}
          index={0}
        />
        <StatsCard
          title="Total Bills"
          value={summary.totalBills || 0}
          icon={ShoppingCart}
          color="blue"
          index={1}
        />
        <StatsCard
          title="Average Order Value"
          value={summary.averageOrderValue || 0}
          icon={TrendingUp}
          color="green"
          isCurrency={true}
          index={2}
        />
        <StatsCard
          title="Total Tax Collected"
          value={summary.totalTax || 0}
          icon={BarChart3}
          color="purple"
          isCurrency={true}
          index={3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Daily Sales</h3>
          {dailyData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#737373" 
                    fontSize={12}
                    tickFormatter={(value) => formatDate(value, 'MMM dd')}
                  />
                  <YAxis 
                    stroke="#737373" 
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="totalRevenue" fill="#DC2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-text-secondary">
              No sales data available
            </div>
          )}
        </Card>

        {/* Category Sales Pie Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Sales by Category</h3>
          {categoryData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="totalRevenue"
                    nameKey="category"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatPrice(value)}
                    contentStyle={{ 
                      background: '#1F1F1F', 
                      border: '1px solid #262626',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom"
                    formatter={(value) => <span className="text-text-secondary">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-text-secondary">
              No category data available
            </div>
          )}
        </Card>
      </div>

      {/* Top Selling Items */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Top Selling Items</h3>
        {topItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-lighter">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Item Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Quantity Sold</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-lighter">
                {topItems.slice(0, 10).map((item, index) => (
                  <tr key={item._id} className="hover:bg-dark-lighter/30">
                    <td className="px-4 py-3 text-text-muted">{index + 1}</td>
                    <td className="px-4 py-3 text-white font-medium">{item._id}</td>
                    <td className="px-4 py-3 text-text-secondary">{item.totalQuantity}</td>
                    <td className="px-4 py-3 text-primary font-medium">{formatPrice(item.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-text-secondary">
            No sales data available for this period
          </div>
        )}
      </Card>
    </div>
  );
};

export default Reports;