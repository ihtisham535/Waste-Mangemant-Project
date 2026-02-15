import { useEffect, useState } from "react";
import { fetchScans } from "../../services/adminApi.js";

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

export default function AdminScans() {
  const [scans, setScans] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchScans();
      setScans(Array.isArray(data) ? data : []);
      setStatus(null);
    } catch (error) {
      setStatus(error.message || "Failed to load scans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="admin-shell space-y-8">
      <header className="admin-card admin-fade-in">
        <span className="admin-chip">Scans</span>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">QR Scan Activity</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Monitor scan activity across shops and review applied discounts.
        </p>
      </header>

      {status && (
        <div className="admin-notice">
          {status}
        </div>
      )}

      <section className="admin-card admin-slide-in">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">Recent Scans</h3>
            <p className="text-sm text-slate-300">Newest activity appears first.</p>
          </div>
          <button className="admin-button secondary" type="button" onClick={load}>
            Refresh
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>Shop</th>
                <th>Item</th>
                <th>Discount</th>
                <th>Scanned At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-300">
                    Loading scans...
                  </td>
                </tr>
              ) : scans.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-300">
                    No scans recorded yet.
                  </td>
                </tr>
              ) : (
                scans.map((scan) => (
                  <tr key={scan._id}>
                    <td className="text-slate-100">{scan.restaurant?.name || "-"}</td>
                    <td className="text-slate-200">{scan.shop?.name || "-"}</td>
                    <td className="text-slate-200">{scan.item?.name || "-"}</td>
                    <td className="text-slate-100">
                      {typeof scan.discountAmount === "number" ? `$${scan.discountAmount.toFixed(2)}` : "-"}
                    </td>
                    <td className="text-slate-300">{formatDateTime(scan.scannedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
