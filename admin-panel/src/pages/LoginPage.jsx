import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/adminApi.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    try {
      const data = await adminLogin(form);
      localStorage.setItem("adminToken", data.token);
      navigate("/");
    } catch (error) {
      setStatus(error.message || "Login failed");
    }
  };

  return (
    <div className="login-shell">
      <div className="login-panel admin-fade-in">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg">
            B
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage shops, rewards, and performance.
          </p>
        </div>
        {status && <div className="admin-notice error mt-4">{status}</div>}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Email
            <input
              name="username"
              type="email"
              value={form.username}
              onChange={handleChange}
              placeholder="admin@bonyad.com"
              className="admin-input"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="admin-input"
              required
            />
          </label>
          <button className="admin-button mt-6 w-full" type="submit">
            Sign in to Dashboard
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Secure session with end-to-end encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
