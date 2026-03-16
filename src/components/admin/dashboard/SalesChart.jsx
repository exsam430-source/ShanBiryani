import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { formatPrice, formatDate } from '../../../utils/formatters.js';
import { classNames } from '../../../utils/helpers.js';

const SalesChart = ({ data = [], isLoading = false }) => {
  const [period, setPeriod] = useState('7days');

  const periods = [
    { value: '7days', label: '7 Days' },
    { value: '30days', label: '30 Days' },
    { value: '90days', label: '90 Days' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card border border-dark-lighter rounded-lg p-3 shadow-xl">
          <p className="text-text-secondary text-sm mb-1">{label}</p>
          <p className="text-white font-semibold">
            {formatPrice(payload[0].value)}
          </p>
          <p className="text-text-muted text-xs mt-1">
            {payload[0].payload.totalBills} bills
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-32 skeleton rounded" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 w-16 skeleton rounded" />
            ))}
          </div>
        </div>
        <div className="h-64 skeleton rounded" />
      </div>
    );
  }

  // Transform data for chart
  const chartData = data.map(item => ({
    date: formatDate(item.date, 'MMM dd'),
    totalSales: item.totalRevenue || 0,
    totalBills: item.totalBills || 0
  }));

  return (
    <div className="bg-dark-card rounded-xl border border-dark-lighter p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-white">Sales Overview</h3>
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={classNames(
                'px-3 py-1.5 text-sm rounded-lg transition-colors',
                period === p.value
                  ? 'bg-primary text-white'
                  : 'bg-dark-lighter text-text-secondary hover:text-white'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-text-secondary">
          No sales data available
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis 
                dataKey="date" 
                stroke="#737373" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#737373" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="totalSales"
                stroke="#DC2626"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SalesChart;