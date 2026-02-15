import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const navLinks = [
  { label: "Home", to: "/home" },
  { label: "Admin", to: "/admin/login" },
  { label: "Shopkeeper", to: "/shopkeeper/login" },
  { label: "QR Offers", to: "/qr/offers" },
];

const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className="fwrs-header">
      <div className="fwrs-container fwrs-header-inner">
        <div className="fwrs-brand">
          <div className="fwrs-brand-mark">B</div>
          <div>
            <p className="fwrs-brand-title">Bonyad</p>
            <p className="fwrs-brand-subtitle">Trust-first rewards operations</p>
          </div>
        </div>

        <nav className="fwrs-nav">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`fwrs-nav-link ${pathname === item.to ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="fwrs-header-actions">
          <button className="fwrs-ghost-btn" type="button">
            Contact
          </button>
          <div className="fwrs-avatar">
            <span>BY</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
