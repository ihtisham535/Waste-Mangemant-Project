import { useEffect, useState } from "react";
import { createShop, deleteShop, fetchRestaurant, fetchShops, updateShop } from "../services/adminApi.js";

const ShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [form, setForm] = useState({ name: "", address: "", status: "Active" });
  const [status, setStatus] = useState(null);
  const [messageType, setMessageType] = useState("info"); // info, success, error

  const load = async () => {
    const [shopData, restaurantData] = await Promise.all([fetchShops(), fetchRestaurant()]);
    setShops(shopData);
    setRestaurant(restaurantData);
  };

  useEffect(() => {
    load().catch((error) => {
      setStatus("✗ Failed to load shops: " + (error.message || "Unknown error"));
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    
    if (!restaurant) {
      setStatus("✗ Add the restaurant details first.");
      setMessageType("error");
      return;
    }
    
    if (!form.name || !form.address) {
      setStatus("✗ Please fill in all required fields");
      setMessageType("error");
      return;
    }
    
    try {
      await createShop({ ...form, restaurantId: restaurant._id });
      setForm({ name: "", address: "", status: "Active" });
      setStatus("✓ Shop created successfully!");
      setMessageType("success");
      load();
    } catch (error) {
      setStatus("✗ " + (error.message || "Failed to create shop. Please try again."));
      setMessageType("error");
    }
  };

  const handleUpdate = async (shopId, nextStatus) => {
    setStatus(null);
    try {
      await updateShop(shopId, { status: nextStatus });
      setStatus(`✓ Shop ${nextStatus === "Active" ? "activated" : "deactivated"} successfully!`);
      setMessageType("success");
      load();
    } catch (error) {
      setStatus("✗ " + (error.message || "Failed to update shop. Please try again."));
      setMessageType("error");
    }
  };

  const handleDelete = async (shopId) => {
    if (!confirm("Are you sure you want to delete this shop?")) {
      return;
    }
    setStatus(null);
    try {
      await deleteShop(shopId);
      setStatus("✓ Shop deleted successfully!");
      setMessageType("success");
      load();
    } catch (error) {
      setStatus("✗ " + (error.message || "Failed to delete shop. Please try again."));
      setMessageType("error");
    }
  };

  return (
    <div className="space-y-8">
      <header className="admin-card admin-fade-in">
        <span className="admin-chip">Shops</span>
        <h1 className="mt-4 text-3xl font-semibold text-adaptive-900 sm:text-4xl">Retail locations</h1>
        <p className="mt-3 max-w-2xl text-sm text-adaptive-600">
          Create, disable, or refresh shop credentials with full audit visibility.
        </p>
      </header>

      {status && <div className={`admin-notice ${messageType}`}>{status}</div>}

      <form className="admin-card" onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold form-heading">Add a new shop</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm form-label">
            Shop name
            <input name="name" value={form.name} onChange={handleChange} className="admin-input" placeholder="Enter shop name" />
          </label>
          <label className="flex flex-col gap-2 text-sm form-label">
            Shop address
            <input name="address" value={form.address} onChange={handleChange} className="admin-input" placeholder="Enter shop address" />
          </label>
          <label className="flex flex-col gap-2 text-sm form-label">
            Status
            <select name="status" value={form.status} onChange={handleChange} className="admin-input">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>
        <button className="admin-button mt-6" type="submit">
          Create shop
        </button>
      </form>

      <section className="admin-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold table-heading">Current shops</h3>
            <p className="text-sm table-subheading">Track shop performance and status changes.</p>
          </div>
          <span className="rounded-full border px-3 py-1 text-xs font-semibold count-badge">
            {shops.length} shops
          </span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop._id}>
                  <td className="font-semibold table-cell-emphasis">{shop.name}</td>
                  <td className="table-cell-text">{shop.address}</td>
                  <td className="table-cell-text">{shop.status}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="admin-button secondary"
                        type="button"
                        onClick={() =>
                          handleUpdate(shop._id, shop.status === "Active" ? "Inactive" : "Active")
                        }
                      >
                        Toggle
                      </button>
                      <button
                        className="admin-button warning"
                        type="button"
                        onClick={() => handleDelete(shop._id)}
                      >
                        Delete
                      </button>
                    </div>
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

export default ShopsPage;
