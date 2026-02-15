import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginShopkeeper } from "../services/shopkeeperApi.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    try {
      const data = await loginShopkeeper(form);
      localStorage.setItem("shopkeeperToken", data.token);
      localStorage.setItem("shopkeeperShopName", data.shop?.name || "Your shop");
      navigate("/");
    } catch (error) {
      setStatus(error.message || "Login failed");
    }
  };

  return (
    <section className="section">
      <div className="grid" style={{ alignItems: "center" }}>
        <div>
          <h1>Welcome back, shopkeeper.</h1>
          <p>Use your admin-issued credentials to manage your inventory and discounts.</p>
        </div>
        <div className="card">
          <h3>Sign in</h3>
          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              Email
              <input name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" />
            </label>
            <label className="field">
              Password
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" />
            </label>
            <button className="button" type="submit">
              Login
            </button>
          </form>
          {status && <div className="notice">{status}</div>}
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
