import { useEffect, useState } from "react";
import { fetchItems, updateItem } from "../../services/adminApi.js";

export default function AdminItems() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchItems();
      setItems(data.items || data || []);
      setLoading(false);
    } catch (error) {
      setStatus(error.message || "Failed to load items");
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (id, isActive) => {
    try {
      await updateItem(id, { isActive });
      setStatus(`Item ${isActive ? 'enabled' : 'disabled'} successfully!`);
      load();
    } catch (error) {
      setStatus(error.message || "Failed to update item");
    }
  };

  return (
    <div className="admin-shell space-y-8">
      <header className="admin-card animate-adminFade">
        <span className="admin-chip admin-chip-green">Items</span>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Item Control</h1>
        <p className="mt-3 max-w-2xl text-sm text-blue-200">
          Review, enable, or disable items across all shops.
        </p>
      </header>

      {status && (
        <div className={`admin-notice ${status.toLowerCase().includes('fail') || status.toLowerCase().includes('error') ? 'admin-notice-error' : 'admin-notice-success'}`}>
          {status}
        </div>
      )}

      <section className="admin-card animate-adminSlide">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">All Items</h3>
            <p className="text-sm text-blue-300">Control visibility and discount eligibility.</p>
          </div>
          <span className="admin-chip admin-chip-green">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Shop</th>
                <th>Restaurant</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                    <p className="text-blue-200 mt-2">Loading items...</p>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-blue-300 py-8">
                    No items found. Add items from shopkeeper panels.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id}>
                    <td className="font-semibold text-white">{item.name}</td>
                    <td className="text-blue-200">{item.shop?.name || "N/A"}</td>
                    <td className="text-blue-200">{item.shop?.restaurant?.name || "N/A"}</td>
                    <td className="text-white">${item.price?.toFixed(2) || "0.00"}</td>
                    <td>
                      <span className={`admin-chip ${item.isActive ? 'admin-chip-green' : 'admin-chip-gray'}`}>
                        {item.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="admin-button admin-button-secondary"
                        type="button"
                        onClick={() => handleToggle(item._id, !item.isActive)}
                      >
                        {item.isActive ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
