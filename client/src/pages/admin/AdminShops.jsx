import { useEffect, useState } from "react";
import { createShop, deleteShop, fetchRestaurant, fetchShops, updateShop } from "../../services/adminApi.js";

export default function AdminShops() {
  const [shops, setShops] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [form, setForm] = useState({ name: "", address: "", status: "Active" });
  const [status, setStatus] = useState(null);

  const load = async () => {
    try {
      const [shopRes, restaurantRes] = await Promise.all([fetchShops(), fetchRestaurant()]);
      setShops(shopRes.shops || shopRes || []);
      setRestaurant(restaurantRes.restaurant || restaurantRes || null);
    } catch (error) {
      setStatus(error.message || "Failed to load shops");
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
    if (!restaurant) {
      setStatus("Add the restaurant details first.");
      return;
    }
    try {
      await createShop({ ...form, restaurantId: restaurant._id });
      setForm({ name: "", address: "", status: "Active" });
      setStatus("Shop created successfully!");
      load();
    } catch (error) {
      setStatus(error.message || "Failed to create shop");
    }
  };

  const handleUpdate = async (shopId, nextStatus) => {
    try {
      await updateShop(shopId, { status: nextStatus });
      setStatus("Shop updated successfully!");
      load();
    } catch (error) {
      setStatus(error.message || "Failed to update shop");
    }
  };

  const handleDelete = async (shopId) => {
    if (!window.confirm("Are you sure you want to delete this shop?")) return;
    try {
      await deleteShop(shopId);
      setStatus("Shop deleted successfully!");
      load();
    } catch (error) {
      setStatus(error.message || "Failed to delete shop");
    }
  };

  return (
    <div className="admin-shell space-y-8">
      <header className="admin-card animate-adminFade">
        <span className="admin-chip admin-chip-blue">Shops</span>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Retail Locations</h1>
        <p className="mt-3 max-w-2xl text-sm text-blue-200">
          Create, disable, or manage shop locations with full control.
        </p>
      </header>

      {status && (
        <div className={`admin-notice ${status.toLowerCase().includes('fail') || status.toLowerCase().includes('error') ? 'admin-notice-error' : 'admin-notice-success'}`}>
          {status}
        </div>
      )}

      <form className="admin-card animate-adminSlide" onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold text-white mb-4">Add a New Shop</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm text-blue-100">
            Shop Name
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              className="admin-input" 
              required 
              placeholder="Enter shop name"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-blue-100">
            Shop Address
            <input 
              name="address" 
              value={form.address} 
              onChange={handleChange} 
              className="admin-input" 
              required 
              placeholder="Enter shop address"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-blue-100">
            Status
            <select name="status" value={form.status} onChange={handleChange} className="admin-input">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>
        <button className="admin-button admin-button-primary mt-6" type="submit">
          Create Shop
        </button>
      </form>

      <section className="admin-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Current Shops</h3>
            <p className="text-sm text-blue-300">Track shop performance and status changes.</p>
          </div>
          <span className="admin-chip admin-chip-green">
            {shops.length} {shops.length === 1 ? 'shop' : 'shops'}
          </span>
        </div>
        <div className="overflow-x-auto">
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
              {shops.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-blue-300 py-8">
                    No shops yet. Create your first shop above.
                  </td>
                </tr>
              ) : (
                shops.map((shop) => (
                  <tr key={shop._id}>
                    <td className="font-semibold text-white">{shop.name}</td>
                    <td className="text-blue-200">{shop.address}</td>
                    <td>
                      <span className={`admin-chip ${shop.status === 'Active' ? 'admin-chip-green' : 'admin-chip-gray'}`}>
                        {shop.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="admin-button admin-button-secondary"
                          type="button"
                          onClick={() =>
                            handleUpdate(shop._id, shop.status === "Active" ? "Inactive" : "Active")
                          }
                        >
                          {shop.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          className="admin-button admin-button-warning"
                          type="button"
                          onClick={() => handleDelete(shop._id)}
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
