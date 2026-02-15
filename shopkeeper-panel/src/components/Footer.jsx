import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="brand-container">
            <img src="/logo.jpeg" alt="Bonyad logo" className="brand-logo" />
            <div className="brand">
              <span>Bonyad</span>
            </div>
          </div>
          <p className="footer-description">
            Empowering shopkeepers with smart inventory management and QR-based solutions.
          </p>
        </div>
        <div className="footer-right">
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/items">Items</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><Link to="/contact-support">Contact Support</Link></li>
              <li><Link to="/help-center">Help Center</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bonyad. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
