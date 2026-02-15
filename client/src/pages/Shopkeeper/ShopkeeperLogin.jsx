import { useMemo, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Alert from "../../components/Alert/Alert.jsx";
import Button from "../../components/Button/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import "./ShopkeeperLogin.css";

const ShopkeeperLogin = () => {
  const [form, setForm] = useState({ email: "", password: "", storeId: "" });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState(null);

  const errors = useMemo(() => {
    const next = {};
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.password.trim()) {
      next.password = "Password is required.";
    } else if (form.password.length < 8) {
      next.password = "Use at least 8 characters.";
    }
    if (!form.storeId.trim()) {
      next.storeId = "Store ID is required.";
    } else if (!/^\d+$/.test(form.storeId)) {
      next.storeId = "Store ID must be numeric.";
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
    setTouched({ email: true, password: true, storeId: true });
    if (!isValid) {
      setStatus({ type: "error", message: "Please check your credentials and store ID." });
      return;
    }
    setStatus({ type: "success", message: "Welcome back. Your shop console is loading." });
  };

  return (
    <div className="fwrs-app">
      <Header />
      <main className="auth-page shop-auth-page">
        <div className="auth-grid">
          <Card className="auth-card">
            <div>
              <span className="fwrs-chip">Shopkeeper login</span>
              <h1 className="auth-title">Sign in to your store console.</h1>
              <p className="auth-subtitle">Monitor inventory, discounts, and customer rewards in real time.</p>
            </div>

            {status && <Alert variant={status.type} title={status.message} />}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="fwrs-field">
                <label className="fwrs-label" htmlFor="shop-email">
                  Email address
                </label>
                <input
                  id="shop-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`fwrs-input ${touched.email && errors.email ? "invalid" : ""}`}
                  placeholder="team@yourshop.com"
                />
                {touched.email && errors.email && <p className="fwrs-helper">{errors.email}</p>}
              </div>

              <div className="fwrs-field">
                <label className="fwrs-label" htmlFor="shop-password">
                  Password
                </label>
                <input
                  id="shop-password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`fwrs-input ${touched.password && errors.password ? "invalid" : ""}`}
                  placeholder="Enter your secure password"
                />
                {touched.password && errors.password && <p className="fwrs-helper">{errors.password}</p>}
              </div>

              <div className="fwrs-field">
                <label className="fwrs-label" htmlFor="shop-store">
                  Store ID
                </label>
                <input
                  id="shop-store"
                  name="storeId"
                  type="text"
                  value={form.storeId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`fwrs-input ${touched.storeId && errors.storeId ? "invalid" : ""}`}
                  placeholder="e.g., 45023"
                />
                {touched.storeId && errors.storeId && <p className="fwrs-helper">{errors.storeId}</p>}
              </div>

              <div className="auth-actions">
                <Button type="submit" disabled={!isValid}>
                  Enter console
                </Button>
                <Button variant="ghost" type="button">
                  Request access
                </Button>
              </div>
            </form>
          </Card>

          <aside className="auth-aside">
            <div className="fwrs-gradient-panel">
              <p className="auth-aside-title">Before you open</p>
              <ul className="auth-aside-list">
                <li>Check your scanner connectivity.</li>
                <li>Confirm daily discount windows.</li>
                <li>Review last payout summary.</li>
              </ul>
            </div>
            <div className="auth-aside-card">
              <p className="auth-aside-title">Support channel</p>
              <p className="auth-aside-text">Chat with the retail team at retail@freshwave.io.</p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopkeeperLogin;
