import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../services/adminApi.js";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("adminDarkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("adminDarkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } finally {
      localStorage.removeItem("adminToken");
      navigate("/login");
    }
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const navItems = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Manage Shops", to: "/shops" },
    { label: "Manage Items", to: "/items" },
    { label: "Shopkeepers", to: "/shopkeepers" },
    { label: "Restaurant", to: "/restaurant" },
    { label: "Scans", to: "/scans" },
  ];

  return (
    <div className="admin-shell">
      <header className="sticky top-0 z-40 border-b shadow-sm admin-header">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border lg:hidden sidebar-toggle-btn"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              {sidebarOpen ? "×" : "≡"}
            </button>
            <img src="/logo.jpeg" alt="Bonyad logo" className="h-11 w-11 rounded-lg object-cover" />
            <div>
              <p className="text-sm font-bold admin-header-text">Bonyad</p>
              <p className="text-xs admin-header-subtext">Admin Panel</p>
            </div>
          </div>
          <div className="hidden items-center gap-4 lg:flex">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg border theme-toggle-btn"
              onClick={toggleTheme}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              )}
            </button>
            <span className="rounded-full border border-green-300 bg-green-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-green-700">
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
          className={`admin-slide-in fixed inset-y-0 left-0 z-30 w-72 border-r px-6 py-8 shadow-lg admin-sidebar lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } transition-transform duration-300`}
        >
          <div className="flex flex-col gap-6">
            <div>
              <span className="admin-chip">Navigation</span>
              <p className="mt-3 text-lg font-bold admin-header-text">Control Center</p>
              <p className="text-sm text-adaptive-600">Oversee shops, items, and scan activity.</p>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "admin-nav-link-active"
                        : "admin-nav-link"
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
