import { useEffect, useState } from "react";
import { fetchRestaurant, saveRestaurant } from "../../services/adminApi.js";

export default function AdminRestaurant() {
  const [form, setForm] = useState({ name: "", address: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchRestaurant();
      setForm({
        name: data?.name || "",
        address: data?.address || "",
      });
      setStatus(null);
    } catch (error) {
      const message = (error && error.message) || "Failed to load restaurant";
      if (message.toLowerCase().includes("not found")) {
        setStatus("No restaurant profile yet. Add details below.");
      } else {
        setStatus(message);
      }
    } finally {
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
      await saveRestaurant(form);
      setStatus("Restaurant details saved.");
      load();
    } catch (error) {
      setStatus(error.message || "Failed to save restaurant");
    }
  };

  return (
    <div className="admin-shell space-y-8">
      <header className="admin-card admin-fade-in">
        <span className="admin-chip">Restaurant</span>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Restaurant Profile</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Maintain the master restaurant details used across all shops.
        </p>
      </header>

      {status && (
        <div className="admin-notice">
          {status}
        </div>
      )}

      <form className="admin-card admin-slide-in" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Restaurant Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="admin-input"
              required
              placeholder="Bonyad Central Kitchen"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Address
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="admin-input"
              required
              placeholder="Main street, City"
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button className="admin-button" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Details"}
          </button>
          <button className="admin-button secondary" type="button" onClick={load}>
            Refresh
          </button>
        </div>
      </form>
    </div>
  );
}
