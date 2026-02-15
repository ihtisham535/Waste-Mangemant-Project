import { useEffect, useState } from "react";
import {
  createShopkeeper,
  deleteShopkeeper,
  fetchShopkeepers,
  fetchShops,
  updateShopkeeper,
} from "../services/adminApi.js";

const ShopkeepersPage = () => {
  const [shopkeepers, setShopkeepers] = useState([]);
  const [shops, setShops] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState(null);
  const [messageType, setMessageType] = useState("info"); // info, success, error

  const load = async () => {
    const [shopkeeperData, shopData] = await Promise.all([fetchShopkeepers(), fetchShops()]);
    setShopkeepers(shopkeeperData);
    setShops(shopData);
  };

  useEffect(() => {
    load().catch((error) => {
      setStatus("✗ Failed to load shopkeepers: " + (error.message || "Unknown error"));
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
    
    if (!form.name || !form.email || !form.password) {
      setStatus("✗ Please fill in name, email, and password");
      setMessageType("error");
      return;
    }

    try {
      await createShopkeeper(form);
      setForm({ name: "", email: "", password: "" });
      setStatus("✓ Shopkeeper created successfully!");
      setMessageType("success");
      load();
    } catch (error) {
      setStatus("✗ " + (error.message || "Failed to create shopkeeper. Please try again."));
      setMessageType("error");
    }
  };

  const handleDisable = async (id, isActive) => {
    setStatus(null);
    try {
      await updateShopkeeper(id, { isActive });
      setStatus(`✓ Shopkeeper ${isActive ? "enabled" : "disabled"} successfully!`);
      setMessageType("success");
      load();
    } catch (error) {
      setStatus("✗ " + (error.message || "Failed to update shopkeeper. Please try again."));
      setMessageType("error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this shopkeeper?")) {
      return;
    }
    setStatus(null);
    try {
      await deleteShopkeeper(id);
      setStatus("✓ Shopkeeper deleted successfully!");
      setMessageType("success");
      load();
    } catch (error) {
      setStatus("✗ " + (error.message || "Failed to delete shopkeeper. Please try again."));
      setMessageType("error");
    }
  };

  const handleAssignShop = async (shopkeeperId, shopId) => {
    setStatus(null);
    try {
      await updateShopkeeper(shopkeeperId, { shop: shopId || null });
      setStatus("✓ Shop assignment updated successfully!");
      setMessageType("success");
      load();
    } catch (error) {
      setStatus("✗ " + (error.message || "Failed to assign shop. Please try again."));
      setMessageType("error");
    }
  };

  return (
    <div className="space-y-8">
      <header className="admin-card admin-fade-in">
        <span className="admin-chip">Shopkeepers</span>
        <h1 className="mt-4 text-3xl font-bold text-adaptive-900 sm:text-4xl">Staff Access Management</h1>
        <p className="mt-3 max-w-2xl text-sm text-adaptive-600">
          Create and manage shopkeeper accounts for your retail locations.
        </p>
      </header>

      {status && <div className={`admin-notice ${messageType}`}>{status}</div>}

      <form className="admin-card" onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold form-heading">Create shopkeeper account</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm form-label">
            Name
            <input name="name" value={form.name} onChange={handleChange} className="admin-input" placeholder="Enter shopkeeper name" required />
          </label>
          <label className="flex flex-col gap-2 text-sm form-label">
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} className="admin-input" placeholder="Enter email address" required />
          </label>
          <label className="flex flex-col gap-2 text-sm form-label">
            Temporary password
            <input name="password" type="password" value={form.password} onChange={handleChange} className="admin-input" placeholder="Enter temporary password" required />
          </label>
        </div>
        <button className="admin-button mt-6" type="submit">
          Create shopkeeper
        </button>
      </form>

      <section className="admin-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold table-heading">Existing shopkeepers</h3>
            <p className="text-sm table-subheading">Manage access and disable accounts as needed.</p>
          </div>
          <span className="rounded-full border px-3 py-1 text-xs font-semibold count-badge">
            {shopkeepers.length} accounts
          </span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Shop</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shopkeepers.map((keeper) => (
                <tr key={keeper._id}>
                  <td className="font-semibold table-cell-emphasis">{keeper.name}</td>
                  <td className="table-cell-text">{keeper.email}</td>
                  <td>
                    <select
                      value={keeper.shop?._id || ""}
                      onChange={(e) => handleAssignShop(keeper._id, e.target.value)}
                      className="admin-input text-xs py-1"
                    >
                      <option value="">Unassigned</option>
                      {shops.map((shop) => (
                        <option key={shop._id} value={shop._id}>
                          {shop.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        keeper.isActive
                          ? "status-badge-active"
                          : "status-badge-inactive"
                      }`}
                    >
                      {keeper.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="admin-button secondary"
                        type="button"
                        onClick={() => handleDisable(keeper._id, !keeper.isActive)}
                      >
                        {keeper.isActive ? "Disable" : "Enable"}
                      </button>
                      <button
                        className="admin-button warning"
                        type="button"
                        onClick={() => handleDelete(keeper._id)}
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

export default ShopkeepersPage;
