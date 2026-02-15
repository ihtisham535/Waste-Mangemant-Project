import { useEffect, useState } from "react";
import { fetchScans } from "../services/adminApi.js";

const ScansPage = () => {
  const [scans, setScans] = useState([]);
  const [status, setStatus] = useState(null);
  const [messageType, setMessageType] = useState("error"); // Only errors expected here

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchScans();
        setScans(data);
      } catch (error) {
        setStatus("✗ Failed to load scans: " + (error.message || "Unknown error"));
        setMessageType("error");
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <header className="admin-card admin-fade-in">
        <span className="admin-chip">Scans</span>
        <h1 className="mt-4 text-3xl font-semibold text-adaptive-900 sm:text-4xl">Scan & reward tracking</h1>
        <p className="mt-3 max-w-2xl text-sm text-adaptive-600">
          Every QR scan is recorded automatically for full compliance.
        </p>
      </header>

      {status && <div className={`admin-notice ${messageType}`}>{status}</div>}

      <section className="admin-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold table-heading">Scan ledger</h3>
            <p className="text-sm table-subheading">Immutable scan history across all shops.</p>
          </div>
          <span className="rounded-full border px-3 py-1 text-xs font-semibold count-badge">
            {scans.length} records
          </span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Scan ID</th>
                <th>Date & time</th>
                <th>Restaurant</th>
                <th>Shop</th>
                <th>Item</th>
                <th>Original</th>
                <th>Discounted</th>
                <th>Discount</th>
                <th>Guest</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr key={scan._id}>
                  <td className="font-semibold table-cell-emphasis">{scan._id}</td>
                  <td className="table-cell-text">{new Date(scan.scannedAt).toLocaleString()}</td>
                  <td className="table-cell-text">{scan.restaurant?.name}</td>
                  <td className="table-cell-text">{scan.shop?.name}</td>
                  <td className="table-cell-text">{scan.item?.name}</td>
                  <td className="table-cell-text">${scan.originalPrice.toFixed(2)}</td>
                  <td className="table-cell-text">${scan.discountedPrice.toFixed(2)}</td>
                  <td className="table-cell-text">${scan.discountAmount.toFixed(2)}</td>
                  <td className="table-cell-text">{scan.guestName || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ScansPage;
