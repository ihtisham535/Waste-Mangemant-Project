import { useMemo, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Alert from "../../components/Alert/Alert.jsx";
import Button from "../../components/Button/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import "./ItemForm.css";

const initialAddForm = {
  name: "",
  category: "",
  price: "",
  quantity: "",
  discount: "",
  status: "Active",
  description: "",
};

const initialEditForm = {
  name: "Harbor salmon bowl",
  category: "Prepared foods",
  price: "14.20",
  quantity: "32",
  discount: "20",
  status: "Active",
  description: "Signature bowl with seasonal herbs and citrus glaze.",
};

const ItemForm = ({ mode = "add" }) => {
  const [form, setForm] = useState(mode === "edit" ? initialEditForm : initialAddForm);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState(null);

  const errors = useMemo(() => {
    const next = {};
    if (!form.name.trim()) {
      next.name = "Item name is required.";
    }
    if (!form.category.trim()) {
      next.category = "Category is required.";
    }
    if (!form.price.trim()) {
      next.price = "Price is required.";
    } else if (Number.isNaN(Number(form.price)) || Number(form.price) <= 0) {
      next.price = "Price must be a positive number.";
    }
    if (!form.quantity.trim()) {
      next.quantity = "Quantity is required.";
    } else if (!/^\d+$/.test(form.quantity)) {
      next.quantity = "Quantity must be a whole number.";
    }
    if (!form.discount.trim()) {
      next.discount = "Discount is required.";
    } else if (Number.isNaN(Number(form.discount)) || Number(form.discount) < 0 || Number(form.discount) > 100) {
      next.discount = "Discount must be between 0 and 100.";
    }
    return next;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    setTouched((prev) => ({ ...prev, [event.target.name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ name: true, category: true, price: true, quantity: true, discount: true });
    if (!isValid) {
      setStatus({ type: "error", message: "Please resolve the validation errors before saving." });
      return;
    }
    setStatus({
      type: "success",
      message: mode === "edit" ? "Item updated successfully." : "Item added to inventory.",
    });
  };

  return (
    <div className="fwrs-app">
      <Header />
      <main className="item-form-page">
        <Card className="item-form-card">
          <div>
            <span className="fwrs-chip">Inventory</span>
            <h1 className="item-form-title">{mode === "edit" ? "Edit item" : "Add new item"}</h1>
            <p className="item-form-subtitle">Maintain accurate stock levels and discount settings.</p>
          </div>

          {status && <Alert variant={status.type} title={status.message} />}

          <form className="item-form" onSubmit={handleSubmit}>
            <div className="item-form-grid">
              <div className="fwrs-field">
                <label className="fwrs-label" htmlFor="item-name">
                  Item name
                </label>
                <input
                  id="item-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`fwrs-input ${touched.name && errors.name ? "invalid" : ""}`}
                  placeholder="e.g., Harbor salmon bowl"
                />
                {touched.name && errors.name && <p className="fwrs-helper">{errors.name}</p>}
              </div>

              <div className="fwrs-field">
                <label className="fwrs-label" htmlFor="item-category">
                  Category
                </label>
                <input
                  id="item-category"
                  name="category"
                  type="text"
                  value={form.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`fwrs-input ${touched.category && errors.category ? "invalid" : ""}`}
                  placeholder="Prepared foods"
                />
                {touched.category && errors.category && <p className="fwrs-helper">{errors.category}</p>}
              </div>

              <div className="fwrs-field">
                <label className="fwrs-label" htmlFor="item-price">
                  Price (USD)
                </label>
                <input
                  id="item-price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`fwrs-input ${touched.price && errors.price ? "invalid" : ""}`}
                  placeholder="14.20"
                  min="0"
                  step="0.01"
                />
                {touched.price && errors.price && <p className="fwrs-helper">{errors.price}</p>}
              </div>

              <div className="fwrs-field">
                <label className="fwrs-label" htmlFor="item-quantity">
                  Quantity
                </label>
                <input
                  id="item-quantity"
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`fwrs-input ${touched.quantity && errors.quantity ? "invalid" : ""}`}
                  placeholder="32"
                  min="0"
                />
                {touched.quantity && errors.quantity && <p className="fwrs-helper">{errors.quantity}</p>}
              </div>

              <div className="fwrs-field">
                <label className="fwrs-label" htmlFor="item-discount">
                  Discount (%)
                </label>
                <input
                  id="item-discount"
                  name="discount"
                  type="number"
                  value={form.discount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`fwrs-input ${touched.discount && errors.discount ? "invalid" : ""}`}
                  placeholder="20"
                  min="0"
                  max="100"
                />
                {touched.discount && errors.discount && <p className="fwrs-helper">{errors.discount}</p>}
              </div>

              <div className="fwrs-field">
                <label className="fwrs-label" htmlFor="item-status">
                  Discount status
                </label>
                <select
                  id="item-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="fwrs-input"
                >
                  <option>Active</option>
                  <option>Limited</option>
                  <option>Paused</option>
                </select>
              </div>
            </div>

            <div className="fwrs-field">
              <label className="fwrs-label" htmlFor="item-description">
                Description
              </label>
              <textarea
                id="item-description"
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                className="fwrs-input item-form-textarea"
                placeholder="Share prep notes or seasonal detail for the team."
              />
            </div>

            <div className="item-form-actions">
              <Button type="submit" disabled={!isValid}>
                {mode === "edit" ? "Save changes" : "Add item"}
              </Button>
              <Button variant="ghost" type="button">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ItemForm;
