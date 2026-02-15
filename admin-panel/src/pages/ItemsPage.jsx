import { useEffect, useState } from "react";
import { fetchItems, updateItem } from "../services/adminApi.js";

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState(null);
  const [messageType, setMessageType] = useState("info"); // info, success, error

  const load = async () => {
    const data = await fetchItems();
    setItems(data);
  };

  useEffect(() => {
    load().catch((error) => {
      setStatus("✗ Failed to load items: " + (error.message || "Unknown error"));
      setMessageType("error");
    });
  }, []);

  useEffect(() => {
    if (status && messageType === "success") {
      const timer = setTimeout(() => {
        setStatus(null);
      }, 8000); // Auto-clear success messages after 8 seconds
      return () => clearTimeout(timer);
    }
  }, [status, messageType]);

  const handleToggle = async (id, isActive) => {
    setStatus(null);
    try {
      await updateItem(id, { isActive });
      setStatus(`✓ Item ${isActive ? "enabled" : "disabled"} successfully!`);
      setMessageType("success");
      load();
    } catch (error) {
      setStatus("✗ " + (error.message || "Failed to update item. Please try again."));
      setMessageType("error");
    }
  };

  return (
    <div className="space-y-8">
      <header className="admin-card admin-fade-in">
        <span className="admin-chip">Items</span>
        <h1 className="mt-4 text-3xl font-semibold text-adaptive-900 sm:text-4xl">Item control</h1>
        <p className="mt-3 max-w-2xl text-sm text-adaptive-600">
          Review, enable, or disable items across all shops.
        </p>
      </header>

      {status && <div className={`admin-notice ${messageType}`}>{status}</div>}

      <section className="admin-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold table-heading">All items</h3>
            <p className="text-sm table-subheading">Control visibility and discount eligibility.</p>
          </div>
          <span className="rounded-full border px-3 py-1 text-xs font-semibold count-badge">
            {items.length} items
          </span>
        </div>
        <div className="admin-table-wrap">
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
              {items.map((item) => (
                <tr key={item._id}>
                  <td className="font-semibold table-cell-emphasis">{item.name}</td>
                  <td className="table-cell-text">{item.shop?.name || ""}</td>
                  <td className="table-cell-text">{item.shop?.restaurant?.name || ""}</td>
                  <td className="table-cell-text">${item.price.toFixed(2)}</td>
                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.isActive
                          ? "status-badge-active"
                          : "status-badge-inactive"
                      }`}
                    >
                      {item.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="admin-button secondary"
                      type="button"
                      onClick={() => handleToggle(item._id, !item.isActive)}
                    >
                      {item.isActive ? "Disable" : "Enable"}
                    </button>
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

export default ItemsPage;
