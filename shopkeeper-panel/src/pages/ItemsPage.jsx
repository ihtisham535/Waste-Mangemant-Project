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

const ItemsPage = () => {
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
    <div>
      <header>
        <h1>Item management</h1>
        <p>Add, edit, and remove items tied only to your shop.</p>
      </header>

      {status && <div className="notice">{status}</div>}

      <section className="section" style={{ marginTop: "1.5rem" }}>
        <h2>{editingId ? "Edit item" : "Add new item"}</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            Item name
            <input name="name" value={form.name} onChange={handleChange} placeholder="Enter item name" />
          </label>
          <label className="field">
            Original price
            <input name="originalPrice" value={form.originalPrice} onChange={handleChange} placeholder="Enter original price" />
          </label>
          <label className="field">
            Discounted price
            <input name="discountedPrice" value={form.discountedPrice} onChange={handleChange} placeholder="Enter discounted price" />
          </label>
          <label className="field">
            Quantity available
            <input name="quantityAvailable" value={form.quantityAvailable} onChange={handleChange} placeholder="Enter quantity available" />
          </label>
          <label className="field">
            Discount active
            <select name="discountActive" value={String(form.discountActive)} onChange={handleChange}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>
          <button className="button" type="submit">
            {editingId ? "Save changes" : "Create item"}
          </button>
          {editingId && (
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="section" style={{ marginTop: "2rem" }}>
        <h2>Your items</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Original</th>
              <th>Discounted</th>
              <th>Quantity</th>
              <th>Discount active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>${Number(item.originalPrice || item.price || 0).toFixed(2)}</td>
                <td>${Number(item.discountedPrice || 0).toFixed(2)}</td>
                <td>{item.quantityAvailable}</td>
                <td>{item.discountActive ? "Yes" : "No"}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="button secondary" type="button" onClick={() => startEdit(item)}>
                      Edit
                    </button>
                    <button className="button" type="button" onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ItemsPage;
