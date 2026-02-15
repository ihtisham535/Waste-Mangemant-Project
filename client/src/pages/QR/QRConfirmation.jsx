import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Alert from "../../components/Alert/Alert.jsx";
import Button from "../../components/Button/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import "./QRConfirmation.css";

const QRConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scan, restaurant } = location.state || {};

  useEffect(() => {
    // Redirect if no scan data
    if (!scan) {
      navigate("/qr/offers");
    }
  }, [scan, navigate]);

  if (!scan) {
    return null;
  }

  return (
    <div className="fwrs-app">
      <Header />
      <main className="qr-confirm-page">
        <Card className="qr-confirm-card">
          <div className="qr-confirm-header">
            <span className="fwrs-chip">Reward confirmed</span>
            <h1 className="qr-confirm-title">Congratulations! Your Reward is Ready</h1>
            <p className="qr-confirm-subtitle">
              You have successfully unlocked a discount reward.<br />
              Please show the unique code below at the selected shop to claim your item.
            </p>
          </div>

          <Alert variant="success" title="Reward Unlocked">
            This discount is reserved for you. Visit the shop to claim it!
          </Alert>

          <div className="qr-confirm-grid">
            <div className="qr-confirm-block">
              <p className="qr-confirm-label">Item</p>
              <p className="qr-confirm-value">{scan.item}</p>
            </div>
            <div className="qr-confirm-block">
              <p className="qr-confirm-label">Shop</p>
              <p className="qr-confirm-value">{scan.shop}</p>
            </div>
            <div className="qr-confirm-block">
              <p className="qr-confirm-label">Discounted Price</p>
              <div>
                <p className="qr-confirm-value text-emerald-400">
                  ${scan.discountedPrice?.toFixed(2)}
                </p>
                <p className="text-sm text-slate-400 line-through">
                  ${scan.originalPrice?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Unique Code Display */}
          <div className="mt-8 mb-6 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 p-8 text-center shadow-2xl">
            <p className="text-lg font-semibold text-gray-900 mb-3">Your Code:</p>
            <p className="text-5xl font-bold text-gray-900 tracking-wider mb-2">
              {scan.id ? `BNY-${scan.id.slice(-5).toUpperCase()}` : 'BNY-XXXXX'}
            </p>
            <p className="text-sm text-gray-800 mt-4">
              ⏰ This code is valid for 24 hours.
            </p>
          </div>

          <div className="text-center space-y-3 mb-6">
            <p className="text-white/90">
              Present this code at the shop to receive your discounted item.
            </p>
            <p className="text-emerald-400 font-semibold">
              Thank you for helping reduce food waste.
            </p>
          </div>

          <div className="qr-confirm-actions">
            <Link to="/home">
              <Button variant="ghost">Go Home</Button>
            </Link>
            <Button onClick={() => window.print()}>Print Code</Button>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-800/50 border border-slate-700 p-4">
            <p className="text-sm text-slate-300 text-center">
              ⏰ Remember: This code expires in 24 hours. Present it at {scan.shop} to claim your reward.
            </p>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default QRConfirmation;
