import { useEffect, useState } from "react";
import {
  createShopItem,
  deleteShopItem,
  fetchShopItems,
  updateShopItem,
} from "../services/shopkeeperApi.js";

const emptyForm = {
  name: "",
  originalPrice: "",
  discountedPrice: "",
  quantityAvailable: "",
  discountActive: false,
};

const ShopkeeperItems = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);

  const load = async () => {
    const data = await fetchShopItems();
    setItems(data);
  };

  useEffect(() => {
    load().catch((error) => setStatus(error.message || "Failed to load items"));
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "discountActive"
          ? value === "true"
          : type === "checkbox"
            ? checked
            : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    try {
      if (editingId) {
        await updateShopItem(editingId, form);
        setStatus("Item updated.");
      } else {
        await createShopItem(form);
        setStatus("Item created.");
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (error) {
      setStatus(error.message || "Failed to save item");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      originalPrice: item.originalPrice ?? item.price ?? 0,
      discountedPrice: item.discountedPrice ?? 0,
      quantityAvailable: item.quantityAvailable ?? 0,
      discountActive: Boolean(item.discountActive),
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteShopItem(id);
      setStatus("Item deleted.");
      load();
    } catch (error) {
      setStatus(error.message || "Failed to delete item");
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            Item management
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Manage your inventory</h1>
          <p className="mt-2 text-sm text-slate-300">Add, edit, and remove items tied only to your shop.</p>
        </div>
      </header>

      {status && (
        <div className="rounded-2xl border border-amber-300/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {status}
        </div>
      )}

      <section className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6">
        <h2 className="text-xl font-semibold text-white">{editingId ? "Edit item" : "Add new item"}</h2>
        <form className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Item name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Original price
            <input
              name="originalPrice"
              value={form.originalPrice}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Discounted price
            <input
              name="discountedPrice"
              value={form.discountedPrice}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Quantity available
            <input
              name="quantityAvailable"
              value={form.quantityAvailable}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Discount active
            <select
              name="discountActive"
              value={String(form.discountActive)}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>
          <div className="flex flex-wrap items-end gap-3">
            <button
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
              type="submit"
            >
              {editingId ? "Save changes" : "Create item"}
            </button>
            {editingId && (
              <button
                type="button"
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Your items</h2>
            <p className="text-sm text-slate-400">Update pricing and discounts in real time.</p>
          </div>
          <span className="rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            {items.length} items
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
                <th className="px-4 py-3">Actions</th>
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
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 hover:border-emerald-300"
                        type="button"
                        onClick={() => startEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-slate-900"
                        type="button"
                        onClick={() => handleDelete(item._id)}
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

export default ShopkeeperItems;
