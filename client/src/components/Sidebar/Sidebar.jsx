import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const sidebarLinks = [
  { label: "Overview", to: "/admin/dashboard" },
  { label: "Shops", to: "/admin/dashboard#shops" },
  { label: "Items", to: "/admin/dashboard#items" },
  { label: "Scans", to: "/admin/dashboard#scans" },
];

const quickActions = [
  { label: "Create Campaign", meta: "Reward drop" },
  { label: "Verify Payout", meta: "Daily sweep" },
  { label: "Sync Inventory", meta: "Realtime" },
];

const Sidebar = ({ role = "Admin" }) => {
  const { pathname } = useLocation();

  return (
    <aside className="fwrs-sidebar">
      <div className="fwrs-sidebar-card">
        <p className="fwrs-sidebar-role">{role} Console</p>
        <p className="fwrs-sidebar-title">Control Center</p>

        <nav className="fwrs-sidebar-nav">
          {sidebarLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`fwrs-sidebar-link ${pathname === item.to.split("#")[0] ? "active" : ""}`}
            >
              <span className="fwrs-link-dot" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="fwrs-sidebar-actions">
        <p className="fwrs-sidebar-subtitle">Quick actions</p>
        {quickActions.map((action) => (
          <div key={action.label} className="fwrs-action-item">
            <div>
              <p className="fwrs-action-title">{action.label}</p>
              <p className="fwrs-action-meta">{action.meta}</p>
            </div>
            <button className="fwrs-link" type="button">
              Open
            </button>
          </div>
        ))}
      </div>

      <div className="fwrs-sidebar-note">
        <p className="fwrs-note-title">System status</p>
        <p className="fwrs-note-text">All services are operating within the safe thresholds.</p>
        <span className="fwrs-chip">99.98% uptime</span>
      </div>
    </aside>
  );
};

export default Sidebar;
