import { NavLink, useNavigate } from "react-router-dom";
import { logoutShopkeeper } from "../services/shopkeeperApi.js";

const ShopkeeperNavbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("shopkeeperToken");
  const shopName = localStorage.getItem("shopkeeperShopName");

  const handleLogout = async () => {
    try {
      await logoutShopkeeper();
    } finally {
      localStorage.removeItem("shopkeeperToken");
      localStorage.removeItem("shopkeeperShopName");
      navigate("/shopkeeper/login");
    }
  };

  return (
    <aside className="border-b border-slate-800/80 bg-slate-950/90 px-4 py-6 backdrop-blur lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-6">
      <div className="flex items-center justify-between lg:flex-col lg:items-start lg:gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-lg font-semibold text-emerald-200">
            B
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Bonyad</p>
            <p className="text-xs text-emerald-100/70">Shopkeeper console</p>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          {shopName && (
            <span className="rounded-full border border-emerald-300/30 px-3 py-1 text-xs font-semibold text-emerald-200">
              {shopName}
            </span>
          )}
          <button
            type="button"
            className="rounded-full border border-emerald-200/40 px-3 py-1 text-xs font-semibold text-emerald-100"
            onClick={token ? handleLogout : () => navigate("/shopkeeper/login")}
          >
            {token ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-2">
        <NavLink
          end
          to="/shopkeeper/dashboard"
          className={({ isActive }) =>
            `rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-emerald-400/20 text-white"
                : "text-slate-300 hover:bg-emerald-400/10 hover:text-white"
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/shopkeeper/items"
          className={({ isActive }) =>
            `rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-emerald-400/20 text-white"
                : "text-slate-300 hover:bg-emerald-400/10 hover:text-white"
            }`
          }
        >
          Items
        </NavLink>
      </nav>

      <div className="mt-6 hidden flex-col gap-4 lg:flex">
        {shopName && (
          <span className="rounded-full border border-emerald-300/30 px-4 py-2 text-xs font-semibold text-emerald-200">
            {shopName}
          </span>
        )}
        <button
          type="button"
          className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/30"
          onClick={token ? handleLogout : () => navigate("/shopkeeper/login")}
        >
          {token ? "Logout" : "Login"}
        </button>
      </div>
    </aside>
  );
};

export default ShopkeeperNavbar;
