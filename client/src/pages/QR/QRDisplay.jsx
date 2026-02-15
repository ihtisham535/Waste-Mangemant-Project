/**
 * FRONTEND QR CODE DISPLAY EXAMPLE
 * File: src/pages/QR/QRDisplay.jsx
 * 
 * This example shows how to:
 * 1. Fetch a QR code from the backend
 * 2. Display it as an image
 * 3. Handle loading and error states
 * 4. Include copy/download functionality
 * 5. Redirect to plate verification for rewards
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QRDisplay = ({ orderId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const resolvedOrderId = orderId || id;
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Fetch QR code from backend
  useEffect(() => {
    const fetchQR = async () => {
      setLoading(true);
      setError(null);

      try {
        // Call the backend QR generation endpoint for restaurant
        const response = await fetch(
          `${apiBaseUrl}/api/guest/qr/${resolvedOrderId}`
        );

        if (!response.ok) {
          throw new Error("Failed to generate QR code");
        }

        const data = await response.json();
        setQr(data.qr); // data.qr is the base64 Data URL
      } catch (err) {
        setError(err.message);
        console.error("QR fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (resolvedOrderId) {
      fetchQR();
    }
  }, [apiBaseUrl, resolvedOrderId]);

  // Redirect to plate verification
  const handleVerifyPlate = () => {
    navigate("/qr/verify");
  };

  // Download QR code as image
  const downloadQR = () => {
    if (!qr) return;

    const link = document.createElement("a");
    link.href = qr;
    link.download = `order-${orderId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy QR Data URL to clipboard
  const copyToClipboard = async () => {
    if (!qr) return;
    try {
      await navigator.clipboard.writeText(qr);
      alert("QR code copied to clipboard!");
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Generating QR code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-rose-400 text-xl font-semibold">Error: {error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {qr && (
          <div className="text-center space-y-6">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 p-8 backdrop-blur shadow-2xl">
              <h1 className="text-3xl font-bold mb-6">Your QR Code</h1>
              
              {/* Display QR Code Image */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
                <img 
                  src={qr} 
                  alt="QR Code" 
                  className="mx-auto max-w-full" 
                  style={{ maxWidth: "300px" }} 
                />
              </div>

              <p className="text-slate-300 mb-6">Order ID: {resolvedOrderId}</p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button 
                  onClick={downloadQR}
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                >
                  Download
                </button>
                <button 
                  onClick={copyToClipboard}
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Plate Verification CTA */}
            <div className="rounded-3xl border border-emerald-300/20 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent p-8 backdrop-blur">
              <div className="text-4xl mb-4">🍽️</div>
              <h2 className="text-2xl font-bold mb-3">Ready to Claim Your Reward?</h2>
              <p className="text-slate-300 mb-6">
                Upload a photo of your clean plate to verify and unlock your reward!
              </p>
              <button
                onClick={handleVerifyPlate}
                className="rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 transition hover:-translate-y-0.5"
              >
                Verify Clean Plate & Get Reward
              </button>
              <p className="text-xs text-slate-400 mt-4">
                Part of Bonyad's mission to reduce food waste
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRDisplay;

// Usage in another component:
// import QRDisplay from "./QRDisplay";
// <QRDisplay orderId="507f1f77bcf86cd799439011" />

