import { NavLink, useNavigate } from "react-router-dom";
import { logoutShopkeeper } from "../services/shopkeeperApi.js";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("shopkeeperToken");
  const shopName = localStorage.getItem("shopkeeperShopName");

  const handleLogout = async () => {
    try {
      await logoutShopkeeper();
    } finally {
      localStorage.removeItem("shopkeeperToken");
      localStorage.removeItem("shopkeeperShopName");
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      <div className="brand-container">
        <img src="/logo.jpeg" alt="Bonyad logo" className="brand-logo" />
        <div className="brand">
          <span>Bonyad</span>
          <strong>Shopkeeper Panel</strong>
        </div>
      </div>
      <div className="nav-links">
        <NavLink end to="/" className="nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/items" className="nav-link">
          Items
        </NavLink>
        <NavLink to="/help-center" className="nav-link">
          Help
        </NavLink>
      </div>
      <div className="nav-actions">
        {shopName && <span className="chip">{shopName}</span>}
        <button 
          type="button" 
          className="theme-toggle-btn"
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
          )}
        </button>
        {token ? (
          <button type="button" className="button secondary" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button type="button" className="button secondary" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
