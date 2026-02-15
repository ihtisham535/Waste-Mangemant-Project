import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../services/adminApi.js";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Manage Shops", to: "/admin/shops" },
    { label: "Manage Items", to: "/admin/items" },
    { label: "Shopkeepers", to: "/admin/shopkeepers" },
    { label: "Restaurant", to: "/admin/restaurant" },
    { label: "Scans", to: "/admin/scans" },
  ];

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } finally {
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
    }
  };

  return (
    <div className="admin-shell">
      <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800/70 text-slate-200 lg:hidden"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              {sidebarOpen ? "Close" : "Menu"}
            </button>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-lg font-semibold text-emerald-200">
              B
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Bonyad</p>
              <p className="text-xs text-emerald-100/70">Admin Panel</p>
            </div>
          </div>
          <div className="hidden items-center gap-4 lg:flex">
            <span className="rounded-full border border-emerald-300/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
              Secure Session
            </span>
            <button className="admin-button warning" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`admin-slide-in fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-800/70 bg-slate-950/95 px-6 py-8 backdrop-blur lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } transition-transform duration-300`}
        >
          <div className="flex flex-col gap-6">
            <div>
              <span className="admin-chip">Navigation</span>
              <p className="mt-3 text-lg font-semibold text-white">Control Center</p>
              <p className="text-sm text-slate-400">Oversee shops, items, and scan activity.</p>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-emerald-400/20 text-white"
                        : "text-slate-300 hover:bg-emerald-400/10 hover:text-white"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button className="admin-button warning w-full lg:hidden" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
