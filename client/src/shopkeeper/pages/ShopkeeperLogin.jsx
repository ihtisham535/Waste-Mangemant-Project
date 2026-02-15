import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginShopkeeper } from "../services/shopkeeperApi.js";

const ShopkeeperLogin = () => {
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
      navigate("/shopkeeper/dashboard");
    } catch (error) {
      setStatus(error.message || "Login failed");
    }
  };

  return (
    <section className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            Shopkeeper login
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Welcome back, shopkeeper.</h1>
          <p className="mt-3 text-sm text-slate-300">
            Use your admin-issued credentials to manage inventory, pricing, and discount readiness.
          </p>
          <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
            Only authorized shopkeepers can access their own store data.
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-6">
          <h3 className="text-lg font-semibold text-white">Sign in</h3>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Email
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </label>
            <button
              className="w-full rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/30"
              type="submit"
            >
              Login
            </button>
          </form>
          {status && (
            <div className="mt-4 rounded-xl border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              {status}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopkeeperLogin;
