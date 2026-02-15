import { Link } from "react-router-dom";

const HelpCenterPage = () => {
  return (
    <div>
      <header>
        <h1>Help Center</h1>
        <p>Learn how to make the most of your shopkeeper panel</p>
      </header>

      <section className="section" style={{ marginTop: "1.5rem" }}>
        <h2>Getting Started</h2>
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="card">
            <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>📊 Dashboard Overview</h3>
            <p style={{ marginBottom: "0.75rem" }}>
              The dashboard provides a quick overview of your shop's performance, including total items, 
              active discounts, and recent activity.
            </p>
            <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li>View your shop information and statistics</li>
              <li>Monitor item counts and discount status</li>
              <li>Access quick actions for common tasks</li>
            </ul>
          </div>

          <div className="card">
            <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>🛍️ Managing Items</h3>
            <p style={{ marginBottom: "0.75rem" }}>
              The Items page allows you to manage your product inventory with ease.
            </p>
            <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li><strong>Add Items:</strong> Fill out the form with item details and click "Create item"</li>
              <li><strong>Edit Items:</strong> Click "Edit" next to any item to modify its details</li>
              <li><strong>Delete Items:</strong> Click "Delete" to remove items from your inventory</li>
              <li><strong>Set Discounts:</strong> Toggle discount status and set discounted prices</li>
            </ul>
          </div>

          <div className="card">
            <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>💡 Best Practices</h3>
            <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li>Keep your item information up-to-date for accurate inventory tracking</li>
              <li>Use clear, descriptive names for your items</li>
              <li>Set realistic quantities to avoid overselling</li>
              <li>Update prices regularly to reflect market changes</li>
              <li>Monitor discount effectiveness to maximize sales</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" style={{ marginTop: "2rem" }}>
        <h2>Common Tasks</h2>
        <div style={{ marginTop: "1rem" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Steps</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Create a new item</td>
                <td>Go to Items → Fill the form → Click "Create item"</td>
              </tr>
              <tr>
                <td>Activate discount</td>
                <td>Edit item → Set discounted price → Set "Discount active" to Yes → Save</td>
              </tr>
              <tr>
                <td>Update inventory</td>
                <td>Edit item → Update "Quantity available" → Save changes</td>
              </tr>
              <tr>
                <td>Switch theme</td>
                <td>Click the moon/sun icon in the navigation bar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" style={{ marginTop: "2rem" }}>
        <h2>Need More Help?</h2>
        <p style={{ marginBottom: "1rem" }}>
          If you can't find what you're looking for, our support team is here to assist you.
        </p>
        <Link to="/contact-support">
          <button className="button">Contact Support</button>
        </Link>
      </section>

      <section className="section" style={{ marginTop: "2rem" }}>
        <h2>Video Tutorials</h2>
        <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          <div className="card">
            <h4 style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>🎥 Getting Started Guide</h4>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Learn the basics of the shopkeeper panel (5 min)</p>
            <button className="button secondary" style={{ marginTop: "1rem" }}>Watch Video</button>
          </div>
          <div className="card">
            <h4 style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>🎥 Item Management Tutorial</h4>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Master item creation and editing (8 min)</p>
            <button className="button secondary" style={{ marginTop: "1rem" }}>Watch Video</button>
          </div>
          <div className="card">
            <h4 style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>🎥 Discount Strategies</h4>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Optimize your pricing strategy (6 min)</p>
            <button className="button secondary" style={{ marginTop: "1rem" }}>Watch Video</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenterPage;
