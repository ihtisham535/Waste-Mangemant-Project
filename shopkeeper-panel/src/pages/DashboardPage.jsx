import { useEffect, useState } from "react";
import { fetchShopItems, fetchShopkeeperProfile } from "../services/shopkeeperApi.js";

const DashboardPage = () => {
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [profile, itemData] = await Promise.all([
          fetchShopkeeperProfile(),
          fetchShopItems(),
        ]);
        setShop(profile.shop);
        setItems(itemData);
      } catch (error) {
        setStatus(error.message || "Failed to load dashboard");
      }
    };
    load();
  }, []);

  return (
    <div>
      <header>
        <h1>{shop?.name || "Shop dashboard"}</h1>
        <p>Review your live inventory, pricing, and discount readiness.</p>
      </header>

      {status && <div className="notice">{status}</div>}

      <section className="grid" style={{ marginTop: "1.5rem" }}>
        <div className="card">
          <h3>Items tracked</h3>
          <p>{items.length} active listings</p>
        </div>
        <div className="card">
          <h3>Discounts active</h3>
          <p>{items.filter((item) => item.discountActive).length} items</p>
        </div>
        <div className="card">
          <h3>Low stock</h3>
          <p>{items.filter((item) => item.quantityAvailable <= 5).length} items</p>
        </div>
      </section>

      <section className="section" style={{ marginTop: "2rem" }}>
        <h2>Item overview</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Original</th>
              <th>Discounted</th>
              <th>Quantity</th>
              <th>Discount active</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>${Number(item.originalPrice || item.price || 0).toFixed(2)}</td>
                <td>${Number(item.discountedPrice || 0).toFixed(2)}</td>
                <td>{item.quantityAvailable}</td>
                <td>{item.discountActive ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default DashboardPage;
