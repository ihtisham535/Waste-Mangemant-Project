import { useEffect, useState } from "react";
import { fetchRestaurant, saveRestaurant } from "../services/adminApi.js";

const RestaurantPage = () => {
  const [form, setForm] = useState({ name: "", address: "" });
  const [status, setStatus] = useState(null);
  const [messageType, setMessageType] = useState("info"); // info, success, error

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRestaurant();
        setForm({ name: data.name, address: data.address });
      } catch (error) {
        setStatus("No restaurant saved yet. Add details below.");
        setMessageType("info");
      }
    };
    load();
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
    try {
      await saveRestaurant(form);
      setStatus("✓ Restaurant details saved successfully!");
      setMessageType("success");
    } catch (error) {
      setStatus("✗ " + (error.message || "Failed to save restaurant. Please try again."));
      setMessageType("error");
    }
  };

  return (
    <div className="space-y-8">
      <header className="admin-card admin-fade-in">
        <span className="admin-chip">Restaurant</span>
        <h1 className="mt-4 text-3xl font-semibold text-adaptive-900 sm:text-4xl">Master restaurant record</h1>
        <p className="mt-3 max-w-2xl text-sm text-adaptive-600">
          Maintain the single source of truth for all QR redemptions.
        </p>
      </header>

      {status && <div className={`admin-notice ${messageType}`}>{status}</div>}

      <form className="admin-card" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm form-label">
            Restaurant name
            <input name="name" value={form.name} onChange={handleChange} className="admin-input" placeholder="Enter restaurant name" />
          </label>
          <label className="flex flex-col gap-2 text-sm form-label">
            Address
            <input name="address" value={form.address} onChange={handleChange} className="admin-input" placeholder="Enter restaurant address" />
          </label>
        </div>
        <button className="admin-button mt-6" type="submit">
          Save restaurant
        </button>
      </form>
    </div>
  );
};

export default RestaurantPage;
