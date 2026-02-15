import { useState, useEffect } from 'react';
import { fetchDashboardMetrics, fetchShops, fetchItems, fetchShopkeepers } from '../../services/adminApi';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalShops: 0,
    totalItems: 0,
    activeDiscounts: 0,
    totalUsers: 0,
    totalScans: 0,
    totalRewards: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch metrics from various endpoints
      const [shopsRes, itemsRes, shopkeepersRes] = await Promise.all([
        fetchShops(),
        fetchItems(),
        fetchShopkeepers()
      ]);

      // Calculate metrics
      const shops = shopsRes.success ? shopsRes.shops : [];
      const items = itemsRes.success ? itemsRes.items : [];
      const shopkeepers = shopkeepersRes.success ? shopkeepersRes.shopkeepers : [];

      const activeDiscounts = items.filter(item => item.discount && item.discount > 0).length;

      setMetrics({
        totalShops: shops.length,
        totalItems: items.length,
        activeDiscounts: activeDiscounts,
        totalUsers: shopkeepers.length,
        totalScans: 0, // Will be updated from scans API
        totalRewards: 0 // Will be calculated from scans
      });

      // Generate recent activity from shops and items
      const activity = [];
      shops.slice(0, 3).forEach(shop => {
        activity.push({
          id: `shop-${shop._id}`,
          type: 'shop',
          description: `Shop "${shop.name}" is active`,
          timestamp: shop.createdAt || new Date().toISOString()
        });
      });
      items.slice(0, 2).forEach(item => {
        activity.push({
          id: `item-${item._id}`,
          type: 'item',
          description: `Item "${item.name}" available`,
          timestamp: item.updatedAt || new Date().toISOString()
        });
      });

      setRecentActivity(activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, icon, color }) => (
    <div className={`admin-card hover:shadow-xl transition-shadow duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-200 text-sm font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{loading ? '...' : value}</p>
        </div>
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${color} bg-opacity-10 flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const SummaryCard = ({ title, value, subtitle, color }) => (
    <div className="admin-card">
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <p className={`text-4xl font-bold ${color} mb-2`}>{loading ? '...' : value}</p>
      <p className="text-blue-300 text-sm">{subtitle}</p>
    </div>
  );

  return (
    <div className="admin-shell">
      {/* Header */}
      <div className="mb-8 animate-adminFade">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-blue-200">Welcome back! Here's what's happening with your restaurant system.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-adminSlide">
        <MetricCard
          title="Total Shops"
          value={metrics.totalShops}
          color="text-blue-400"
          icon={
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <MetricCard
          title="Total Items"
          value={metrics.totalItems}
          color="text-green-400"
          icon={
            <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <MetricCard
          title="Active Discounts"
          value={metrics.activeDiscounts}
          color="text-yellow-400"
          icon={
            <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Shopkeepers"
          value={metrics.totalUsers}
          color="text-purple-400"
          icon={
            <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SummaryCard
          title="Total QR Scans"
          value={metrics.totalScans}
          subtitle="Total scans across all shops"
          color="text-indigo-400"
        />
        <SummaryCard
          title="Rewards Issued"
          value={metrics.totalRewards}
          subtitle="Number of rewards given to customers"
          color="text-pink-400"
        />
      </div>

      {/* Recent Activity */}
      <div className="admin-card">
        <h2 className="text-2xl font-semibold text-white mb-4">Recent Activity</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <p className="text-blue-200 mt-2">Loading activity...</p>
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-blue-300">No recent activity to display</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity) => (
                  <tr key={activity.id}>
                    <td>
                      <span className={`admin-chip ${
                        activity.type === 'shop' ? 'admin-chip-blue' : 
                        activity.type === 'item' ? 'admin-chip-green' : 
                        'admin-chip-gray'
                      }`}>
                        {activity.type}
                      </span>
                    </td>
                    <td className="text-white">{activity.description}</td>
                    <td className="text-blue-300">
                      {new Date(activity.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
