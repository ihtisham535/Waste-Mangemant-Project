import { useEffect, useState } from "react";
import { fetchShopItems, fetchShopkeeperProfile } from "../services/shopkeeperApi.js";

const ShopkeeperDashboard = () => {
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [profile, itemData] = await Promise.all([
          fetchShopkeeperProfile(),
          fetchShopItems(),
        ]);
        setShop(profile.shop);
        setItems(itemData);
      } catch (error) {
        setStatus(error.message || "Failed to load dashboard");
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            Shopkeeper dashboard
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            {shop?.name || "Shop dashboard"}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Review your live inventory, pricing, and discount readiness.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-emerald-300">
            Export summary
          </button>
          <button className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/30">
            Sync inventory
          </button>
        </div>
      </header>

      {status && (
        <div className="rounded-2xl border border-amber-300/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {status}
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6">
          <h3 className="text-sm font-semibold text-emerald-200">Items tracked</h3>
          <p className="mt-3 text-2xl font-semibold text-white">{items.length}</p>
          <p className="text-xs text-slate-400">Active listings</p>
        </div>
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6">
          <h3 className="text-sm font-semibold text-emerald-200">Discounts active</h3>
          <p className="mt-3 text-2xl font-semibold text-white">
            {items.filter((item) => item.discountActive).length}
          </p>
          <p className="text-xs text-slate-400">Items running promos</p>
        </div>
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6">
          <h3 className="text-sm font-semibold text-emerald-200">Low stock</h3>
          <p className="mt-3 text-2xl font-semibold text-white">
            {items.filter((item) => item.quantityAvailable <= 5).length}
          </p>
          <p className="text-xs text-slate-400">Restock recommended</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Item overview</h2>
            <p className="text-sm text-slate-400">Live pricing, discount, and quantity status.</p>
          </div>
          <span className="rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            Updated just now
          </span>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800/70">
          <table className="w-full border-collapse text-sm text-slate-200">
            <thead className="bg-slate-900/80 text-left text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Original</th>
                <th className="px-4 py-3">Discounted</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Discount active</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-t border-slate-800/70 hover:bg-slate-900/60">
                  <td className="px-4 py-3 font-semibold text-white">{item.name}</td>
                  <td className="px-4 py-3">${Number(item.originalPrice || item.price || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">${Number(item.discountedPrice || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">{item.quantityAvailable}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.discountActive
                          ? "bg-emerald-500/15 text-emerald-200"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {item.discountActive ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ShopkeeperDashboard;
