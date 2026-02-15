import { useEffect, useState } from "react";
import {
  createShopkeeper,
  deleteShopkeeper,
  fetchShopkeepers,
  fetchShops,
  updateShopkeeper,
} from "../../services/adminApi.js";

export default function AdminShopkeepers() {
  const [shopkeepers, setShopkeepers] = useState([]);
  const [shops, setShops] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", shopId: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [shopkeeperRes, shopRes] = await Promise.all([fetchShopkeepers(), fetchShops()]);
      setShopkeepers(shopkeeperRes.shopkeepers || shopkeeperRes || []);
      setShops(shopRes.shops || shopRes || []);
      setLoading(false);
    } catch (error) {
      setStatus(error.message || "Failed to load shopkeepers");
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createShopkeeper(form);
      setForm({ name: "", email: "", password: "", shopId: "" });
      setStatus("Shopkeeper created successfully!");
      load();
    } catch (error) {
      setStatus(error.message || "Failed to create shopkeeper");
    }
  };

  const handleDisable = async (id, isActive) => {
    try {
      await updateShopkeeper(id, { isActive });
      setStatus(`Shopkeeper ${isActive ? 'enabled' : 'disabled'} successfully!`);
      load();
    } catch (error) {
      setStatus(error.message || "Failed to update shopkeeper");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shopkeeper?")) return;
    try {
      await deleteShopkeeper(id);
      setStatus("Shopkeeper deleted successfully!");
      load();
    } catch (error) {
      setStatus(error.message || "Failed to delete shopkeeper");
    }
  };

  return (
    <div className="admin-shell space-y-8">
      <header className="admin-card animate-adminFade">
        <span className="admin-chip admin-chip-purple">Shopkeepers</span>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Staff Access</h1>
        <p className="mt-3 max-w-2xl text-sm text-blue-200">
          Assign one shopkeeper to one shop to maintain accountability.
        </p>
      </header>

      {status && (
        <div className={`admin-notice ${status.toLowerCase().includes('fail') || status.toLowerCase().includes('error') ? 'admin-notice-error' : 'admin-notice-success'}`}>
          {status}
        </div>
      )}

      <form className="admin-card animate-adminSlide" onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold text-white mb-4">Create Shopkeeper Account</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-2 text-sm text-blue-100">
            Name
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              className="admin-input" 
              required 
              placeholder="Enter shopkeeper name"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-blue-100">
            Email
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              className="admin-input" 
              required 
              placeholder="shopkeeper@example.com"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-blue-100">
            Temporary Password
            <input 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              className="admin-input" 
              required 
              placeholder="Temporary password"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-blue-100">
            Assign to Shop
            <select name="shopId" value={form.shopId} onChange={handleChange} className="admin-input" required>
              <option value="">Select shop</option>
              {shops.map((shop) => (
                <option key={shop._id} value={shop._id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="admin-button admin-button-primary mt-6" type="submit">
          Create Shopkeeper
        </button>
      </form>

      <section className="admin-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Existing Shopkeepers</h3>
            <p className="text-sm text-blue-300">Manage access and disable accounts as needed.</p>
          </div>
          <span className="admin-chip admin-chip-purple">
            {shopkeepers.length} {shopkeepers.length === 1 ? 'account' : 'accounts'}
          </span>
        </div>
        <div className="overflow-x-auto">
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                    <p className="text-blue-200 mt-2">Loading shopkeepers...</p>
                  </td>
                </tr>
              ) : shopkeepers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-blue-300 py-8">
                    No shopkeepers yet. Create your first shopkeeper above.
                  </td>
                </tr>
              ) : (
                shopkeepers.map((keeper) => (
                  <tr key={keeper._id}>
                    <td className="font-semibold text-white">{keeper.name}</td>
                    <td className="text-blue-200">{keeper.email}</td>
                    <td className="text-blue-200">{keeper.shop?.name || "Unassigned"}</td>
                    <td>
                      <span className={`admin-chip ${keeper.isActive ? 'admin-chip-green' : 'admin-chip-gray'}`}>
                        {keeper.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="admin-button admin-button-secondary"
                          type="button"
                          onClick={() => handleDisable(keeper._id, !keeper.isActive)}
                        >
                          {keeper.isActive ? "Disable" : "Enable"}
                        </button>
                        <button
                          className="admin-button admin-button-warning"
                          type="button"
                          onClick={() => handleDelete(keeper._id)}
                        >
                          Delete
                        </button>
                      </div>
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
