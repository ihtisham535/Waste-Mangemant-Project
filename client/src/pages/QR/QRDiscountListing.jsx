import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Alert from "../../components/Alert/Alert.jsx";
import Button from "../../components/Button/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import "./QRDiscountListing.css";

const QRDiscountListing = () => {
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');
  
  const [restaurant, setRestaurant] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Generate device fingerprint
  const getDeviceFingerprint = () => {
    const nav = window.navigator;
    const screen = window.screen;
    const data = [
      nav.userAgent,
      nav.language,
      screen.colorDepth,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
    ].join("|");
    
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return `device_${Math.abs(hash)}`;
  };

  // Fetch discount offers
  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = restaurantId 
          ? `${apiBaseUrl}/api/guest/offers?restaurantId=${restaurantId}`
          : `${apiBaseUrl}/api/guest/offers`;

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Failed to load discount offers");
        }

        const data = await response.json();
        setRestaurant(data.restaurant);
        setShops(data.shops || []);
        
        if (data.shops.length === 0) {
          setError("No discount offers available at this time");
        }
      } catch (err) {
        setError(err.message || "Failed to load offers");
        console.error("Fetch offers error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [apiBaseUrl, restaurantId]);

  const flattenedItems = useMemo(() => {
    const items = [];
    shops.forEach(shopData => {
      shopData.items.forEach(item => {
        items.push({
          ...item,
          shopId: shopData.shop.id,
          shopName: shopData.shop.name,
          shopAddress: shopData.shop.address
        });
      });
    });
    return items;
  }, [shops]);

  const selectedItem = useMemo(
    () => flattenedItems.find((item) => item.id === selectedItemId),
    [flattenedItems, selectedItemId]
  );

  const handleSelect = (itemId, shopId) => {
    setSelectedItemId(itemId);
    setSelectedShopId(shopId);
    setStatus({ type: "success", message: "Reward selected. Continue to confirm." });
  };

  const handleClear = () => {
    setSelectedItemId(null);
    setSelectedShopId(null);
    setStatus(null);
  };

  const handleContinue = async () => {
    if (!selectedItemId || !selectedShopId) {
      setStatus({ type: "error", message: "Select one reward before continuing." });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const deviceFingerprint = getDeviceFingerprint();
      
      const response = await fetch(`${apiBaseUrl}/api/guest/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          shopId: selectedShopId,
          itemId: selectedItemId,
          guestName: "Guest",
          deviceFingerprint
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to claim reward");
      }

      // Save reward data to localStorage with 24-hour expiry
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + 24);
      
      const rewardData = {
        scan: data.scan,
        restaurant: restaurant,
        expiresAt: expiryTime.toISOString(),
        claimedAt: new Date().toISOString()
      };
      
      localStorage.setItem('bonyadReward', JSON.stringify(rewardData));

      // Navigate to confirmation page with scan data
      navigate("/qr/confirm", { 
        state: { 
          scan: data.scan,
          restaurant: restaurant
        } 
      });

    } catch (err) {
      setStatus({ 
        type: "error", 
        message: err.message || "Failed to claim reward. Please try again." 
      });
      console.error("Claim reward error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fwrs-app">
        <Header />
        <main className="qr-offers-page">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-lg text-slate-300">Loading discount offers...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && (!shops || shops.length === 0)) {
    return (
      <div className="fwrs-app">
        <Header />
        <main className="qr-offers-page">
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <p className="text-lg text-red-400">{error}</p>
            <Button onClick={() => navigate("/home")}>Return Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="fwrs-app">
      <Header />
      <main className="qr-offers-page">
        {restaurant && (
          <section className="qr-restaurant-header mb-8">
            <div className="rounded-3xl border border-emerald-300/20 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent p-8 backdrop-blur text-center">
              <div className="text-5xl mb-4">🍽️</div>
              <h1 className="text-3xl font-bold text-white mb-2">{restaurant.name}</h1>
              <p className="text-slate-300">{restaurant.address}</p>
              <div className="mt-6 inline-block rounded-full bg-emerald-500/20 border border-emerald-300/40 px-6 py-2">
                <p className="text-emerald-200 font-semibold">
                  🎉 Thank you for cleaning your plate! Select your reward below.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="qr-offers-hero">
          <div>
            <span className="fwrs-chip">Available rewards</span>
            <h2 className="qr-offers-title">Available Rewards for You</h2>
            <p className="qr-offers-subtitle">
              As a token of appreciation, you can select one discounted item from the partnered shops below.
            </p>
            <p className="text-yellow-400 font-semibold mt-2">
              ⚠️ You can select only one item.
            </p>
          </div>
          <div className="qr-offers-actions">
            <Button variant="ghost" onClick={handleClear} disabled={!selectedItemId || submitting}>
              Clear selection
            </Button>
            <Button onClick={handleContinue} disabled={!selectedItemId || submitting}>
              {submitting ? "Processing..." : "Continue"}
            </Button>
          </div>
        </section>

        {status && <Alert variant={status.type} title={status.message} />}

        <section className="qr-shop-section">
          <h2 className="fwrs-section-title">Featured shops</h2>
          <div className="qr-shop-grid">
            {shops.map((shopData) => (
              <Card key={shopData.shop.id} className="qr-shop-card">
                <div>
                  <p className="qr-shop-name">{shopData.shop.name}</p>
                  <p className="fwrs-muted">{shopData.shop.address}</p>
                </div>
                <div className="qr-shop-meta">
                  <span className="fwrs-badge info">{shopData.items.length} offers</span>
                  <span className="fwrs-badge success">{shopData.shop.status}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="qr-item-section">
          <h2 className="fwrs-section-title">Available rewards</h2>
          <div className="qr-item-grid">
            {flattenedItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              const isDisabled = selectedItemId && !isSelected;
              return (
                <Card
                  key={item.id}
                  className={`qr-item-card ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
                >
                  <div>
                    <p className="qr-item-name">{item.name}</p>
                    <p className="fwrs-muted">{item.shopName}</p>
                  </div>
                  <div className="qr-item-meta">
                    <span className="fwrs-badge info">{item.discountPercentage}% off</span>
                    <span className="fwrs-badge warning">Qty: {item.quantityAvailable}</span>
                  </div>
                  <div className="qr-item-actions">
                    <div>
                      <p className="qr-item-price">${item.discountedPrice.toFixed(2)}</p>
                      <p className="text-xs text-slate-400 line-through">${item.originalPrice.toFixed(2)}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSelect(item.id, item.shopId)}
                      disabled={isDisabled || submitting}
                      variant={isSelected ? "secondary" : "primary"}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {selectedItem && (
          <Card className="qr-selection-summary">
            <p className="qr-summary-title">Your selected reward</p>
            <p className="qr-summary-item">{selectedItem.name}</p>
            <p className="fwrs-muted">{selectedItem.shopName}</p>
            <div className="mt-2">
              <span className="text-lg font-bold text-emerald-400">
                ${selectedItem.discountedPrice.toFixed(2)}
              </span>
              <span className="text-sm text-slate-400 line-through ml-2">
                ${selectedItem.originalPrice.toFixed(2)}
              </span>
              <span className="text-sm text-emerald-300 ml-2">
                (Save ${selectedItem.discountAmount.toFixed(2)})
              </span>
            </div>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default QRDiscountListing;
