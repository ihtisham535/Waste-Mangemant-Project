import { useEffect, useState } from "react";
import { fetchDashboardMetrics, fetchItems, fetchShopkeepers, fetchShops } from "../services/adminApi.js";

const DashboardPage = () => {
  const [metrics, setMetrics] = useState({ totalScans: 0, totalRewards: 0, recent: [] });
  const [summary, setSummary] = useState({ shops: 0, items: 0, discounts: 0, users: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [data, shops, items, shopkeepers] = await Promise.all([
          fetchDashboardMetrics(),
          fetchShops(),
          fetchItems(),
          fetchShopkeepers(),
        ]);
        setMetrics(data);
        setSummary({
          shops: shops.length,
          items: items.length,
          discounts: items.filter((item) => item.isActive).length,
          users: shopkeepers.length,
        });
      } catch (err) {
        setError("✗ Failed to load dashboard: " + (err.message || "Unknown error"));
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-10">
      <header className="admin-card admin-fade-in">
        <span className="admin-chip">Overview</span>
        <h1 className="mt-4 text-3xl font-semibold text-adaptive-900 sm:text-4xl">
          Welcome to Bonyad Admin Panel
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-adaptive-600">
          Monitor scan activity, reward spending, and operational performance across every live location.
        </p>
      </header>

      {error && <div className="admin-notice error">{error}</div>}

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total shops", value: summary.shops },
          { label: "Total items", value: summary.items },
          { label: "Active discounts", value: summary.discounts },
          { label: "Total users", value: summary.users },
        ].map((card, index) => (
          <div
            key={card.label}
            className="admin-card admin-fade-in"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <p className="text-xs uppercase tracking-[0.2em] admin-chip-text">{card.label}</p>
            <p className="mt-4 text-3xl font-semibold text-adaptive-900">{card.value}</p>
            <p className="mt-2 text-xs text-adaptive-600">Live sync from admin services</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card">
          <p className="text-xs uppercase tracking-[0.2em] admin-chip-text">QR scans</p>
          <p className="mt-4 text-3xl font-semibold text-adaptive-900">{metrics.totalScans}</p>
          <p className="mt-2 text-sm text-adaptive-600">Total scans recorded across all regions.</p>
        </div>
        <div className="admin-card">
          <p className="text-xs uppercase tracking-[0.2em] admin-chip-text">Rewards issued</p>
          <p className="mt-4 text-3xl font-semibold text-adaptive-900">${metrics.totalRewards.toFixed(2)}</p>
          <p className="mt-2 text-sm text-adaptive-600">Total reward value approved this period.</p>
        </div>
      </section>

      <section className="admin-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold table-heading">Recent scan activity</h2>
            <p className="text-sm table-subheading">Latest guest redemptions across shops.</p>
          </div>
          <span className="rounded-full border px-3 py-1 text-xs font-semibold count-badge">
            Updated just now
          </span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date & time</th>
                <th>Shop</th>
                <th>Item</th>
                <th>Discount applied</th>
              </tr>
            </thead>
            <tbody>
              {metrics.recent.map((scan) => (
                <tr key={scan.id}>
                  <td className="table-cell-text">{new Date(scan.scannedAt).toLocaleString()}</td>
                  <td className="table-cell-text">{scan.shopName}</td>
                  <td className="table-cell-text">{scan.itemName}</td>
                  <td className="table-cell-text">${scan.discountApplied.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
