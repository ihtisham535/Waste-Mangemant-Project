import { useState, useEffect } from "react";

const BonyadLanding = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopItems, setShopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("bonyadDarkMode");
    return saved ? JSON.parse(saved) : true; // Default to true = white background (light mode)
  });
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    localStorage.setItem("bonyadDarkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const fetchShops = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/guest/offers`);
      const data = await response.json();
      setShops(data.shops || []);
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShopClick = (shop) => {
    setSelectedShop(shop);
    setShopItems(shop.items || []);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch(`${apiBaseUrl}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: "Newsletter Subscriber",
          email: email,
          message: "I would like to subscribe to the Bonyad newsletter.",
          to: "thebonyad2@gmail.com",
        }),
      });

      if (response.ok) {
        setSubscribeMessage("Thank you for subscribing! Check your email.");
        setEmail("");
        setTimeout(() => setSubscribeMessage(""), 5000);
      } else {
        setSubscribeMessage("Subscription failed. Please try again.");
        setTimeout(() => setSubscribeMessage(""), 3000);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setSubscribeMessage("Could not subscribe. Please try again later.");
      setTimeout(() => setSubscribeMessage(""), 3000);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-white text-gray-900' : 'bg-slate-950 text-white'} transition-colors duration-300`}>
      <header className={`sticky top-0 z-50 border-b ${darkMode ? 'border-gray-200 bg-white/80' : 'border-white/10 bg-slate-950/80'} backdrop-blur`}>
        <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Bonyad logo" className="h-10 w-10 rounded-xl object-cover" />
            <div>
              <p className={`text-lg font-semibold tracking-wide ${darkMode ? 'text-gray-900' : 'text-white'}`}>Bonyad</p>
              <p className={`text-xs ${darkMode ? 'text-emerald-600' : 'text-emerald-200/80'}`}>Trust-first rewards platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
            <a href="/about" className={`${darkMode ? 'text-gray-600 hover:text-gray-900' : 'text-slate-200 hover:text-white'} transition`}>
              About Us
            </a>
            <a href="#shops" className={`${darkMode ? 'text-gray-600 hover:text-gray-900' : 'text-slate-200 hover:text-white'} transition`}>
              Shops
            </a>
            <a href="/contact" className={`${darkMode ? 'text-gray-600 hover:text-gray-900' : 'text-slate-200 hover:text-white'} transition`}>
              Contact Us
            </a>
            <button
              onClick={toggleDarkMode}
              className={`ml-2 rounded-full p-2 ${darkMode ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-white/10 text-yellow-300 hover:bg-white/20'} transition`}
              title={darkMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {darkMode ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-blue-100 via-emerald-50 to-cyan-100' : 'bg-gradient-to-br from-emerald-500/30 via-cyan-500/20 to-blue-600/30'}`} />
          <div className={`absolute -left-40 top-20 h-72 w-72 rounded-full blur-3xl ${darkMode ? 'bg-blue-200/50' : 'bg-emerald-400/30'}`} />
          <div className={`absolute -right-40 bottom-10 h-72 w-72 rounded-full blur-3xl ${darkMode ? 'bg-emerald-200/50' : 'bg-blue-500/30'}`} />

          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div>
              <p className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-semibold ${darkMode ? 'border-blue-300 bg-blue-100 text-blue-700' : 'border-emerald-300/40 bg-emerald-500/10 text-emerald-200'}`}>
                Reliable loyalty orchestration
              </p>
              <h1 className={`mt-5 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl ${darkMode ? 'text-gray-900' : 'text-white'}`}>
                Bonyad empowers modern rewards with green trust and blue precision.
              </h1>
              <p className={`mt-5 max-w-xl text-base sm:text-lg ${darkMode ? 'text-gray-700' : 'text-slate-200'}`}>
                Orchestrate scans, discounts, and customer retention with a secure, real-time platform that keeps
                shopkeepers, admins, and guests aligned.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="/qr/verify"
                  className={`rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-yellow-500/40'}`}
                >
                  🍽️ Verify Your Plate
                </a>
                <a
                  href="#shops"
                  className={`rounded-full border px-6 py-3 text-sm font-semibold transition ${darkMode ? 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-100' : 'border-white/20 text-white hover:border-white/40'}`}
                >
                  Browse Shops
                </a>
              </div>
              <div className={`mt-8 flex flex-wrap gap-6 text-sm ${darkMode ? 'text-gray-700' : 'text-slate-200'}`}>
                <div>
                  <p className={`text-2xl font-semibold ${darkMode ? 'text-gray-900' : 'text-white'}`}>98.9%</p>
                  <p className={darkMode ? 'text-gray-600' : 'text-slate-300'}>Scan success rate</p>
                </div>
                <div>
                  <p className={`text-2xl font-semibold ${darkMode ? 'text-gray-900' : 'text-white'}`}>2.1s</p>
                  <p className={darkMode ? 'text-gray-600' : 'text-slate-300'}>Average redemption</p>
                </div>
                <div>
                  <p className={`text-2xl font-semibold ${darkMode ? 'text-gray-900' : 'text-white'}`}>1,420+</p>
                  <p className={darkMode ? 'text-gray-600' : 'text-slate-300'}>Active merchants</p>
                </div>
              </div>
            </div>

            <div className={`rounded-3xl border p-6 shadow-2xl backdrop-blur ${darkMode ? 'border-gray-200 bg-white/80 shadow-blue-100' : 'border-white/10 bg-white/5 shadow-emerald-500/10'}`}>
              <div className="space-y-6">
                <div className={`rounded-2xl border p-4 ${darkMode ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-slate-950/60'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${darkMode ? 'text-blue-600' : 'text-emerald-200'}`}>Live scan feed</p>
                  <div className="mt-4 space-y-3">
                    {[
                      { shop: "Harbor Bistro", amount: "$320", status: "Verified" },
                      { shop: "Maple & Co.", amount: "$180", status: "Pending" },
                      { shop: "Seaside Grill", amount: "$240", status: "Approved" },
                    ].map((item) => (
                      <div key={item.shop} className={`flex items-center justify-between rounded-xl px-4 py-3 ${darkMode ? 'bg-gray-100' : 'bg-white/5'}`}>
                        <div>
                          <p className={`text-sm font-semibold ${darkMode ? 'text-gray-900' : 'text-white'}`}>{item.shop}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-slate-300'}`}>Reward payout {item.amount}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${darkMode ? 'bg-blue-100 text-blue-700' : 'bg-amber-300/90 text-slate-900'}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`rounded-2xl border p-5 ${darkMode ? 'border-gray-200 bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50' : 'border-white/10 bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-blue-500/20'}`}>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-gray-900' : 'text-white'}`}>Unified performance snapshot</p>
                  <p className={`mt-3 text-sm ${darkMode ? 'text-gray-700' : 'text-slate-200'}`}>
                    Balance incentive budgets, monitor redemption velocity, and keep your entire network aligned with
                    clear signals.
                  </p>
                  <button
                    type="button"
                    className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-amber-300 text-slate-900 hover:bg-amber-400'}`}
                  >
                    View insights
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${darkMode ? 'text-blue-600' : 'text-emerald-300'}`}>About Bonyad</p>
              <h2 className={`mt-4 text-3xl font-semibold sm:text-4xl ${darkMode ? 'text-gray-900' : 'text-white'}`}>
                Built for resilient loyalty programs and transparent redemption.
              </h2>
            </div>
            <div className={`space-y-4 text-base ${darkMode ? 'text-gray-700' : 'text-slate-200'}`}>
              <p>
                Bonyad coordinates the full rewards journey. From scanning and validation to reward distribution,
                everything stays consistent, auditable, and fast.
              </p>
              <p>
                Purpose-built for multi-location networks, Bonyad aligns administrators, shopkeepers, and guests with
                one trusted operating system.
              </p>
            </div>
          </div>
        </section>

        {/* Shops Section */}
        <section id="shops" className={`py-20 ${darkMode ? 'bg-gray-50' : 'bg-slate-900/60'}`}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${darkMode ? 'text-blue-600' : 'text-emerald-300'}`}>Our Partner Shops</p>
              <h2 className={`mt-3 text-3xl font-semibold sm:text-4xl ${darkMode ? 'text-gray-900' : 'text-white'}`}>Discover Amazing Discounts</h2>
              <p className={`mt-4 max-w-2xl mx-auto ${darkMode ? 'text-gray-600' : 'text-slate-300'}`}>
                Browse our partner shops and discover exclusive discounts available after verifying your clean plate
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className={darkMode ? 'text-gray-600' : 'text-slate-300'}>Loading shops...</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {shops.map((shopData) => (
                    <div
                      key={shopData.shop.id}
                      onClick={() => handleShopClick(shopData)}
                      className={`group cursor-pointer rounded-3xl border p-6 shadow-lg transition hover:-translate-y-1 ${darkMode ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-xl' : 'border-white/10 bg-white/5 hover:border-emerald-300/60'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${darkMode ? 'bg-blue-100 text-blue-600' : 'bg-emerald-400/20 text-amber-300'}`}>
                          <span className="text-2xl">🏪</span>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${darkMode ? 'bg-blue-100 text-blue-700' : 'bg-amber-300/20 text-amber-300'}`}>
                          {shopData.items.length} items
                        </span>
                      </div>
                      <h3 className={`mt-5 text-lg font-semibold ${darkMode ? 'text-gray-900' : 'text-white'}`}>{shopData.shop.name}</h3>
                      <p className={`mt-2 text-sm ${darkMode ? 'text-gray-600' : 'text-slate-300'}`}>{shopData.shop.address}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${darkMode ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-300'}`}>
                          {shopData.shop.status}
                        </span>
                        <span className={`text-sm group-hover:translate-x-1 transition-transform ${darkMode ? 'text-blue-600' : 'text-emerald-300'}`}>
                          View items →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shop Items Modal */}
                {selectedShop && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedShop(null)}>
                    <div className={`rounded-3xl border max-w-4xl w-full max-h-[80vh] overflow-y-auto p-8 ${darkMode ? 'bg-white border-gray-200' : 'bg-slate-900 border-white/10'}`} onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className={`text-2xl font-semibold ${darkMode ? 'text-gray-900' : 'text-white'}`}>{selectedShop.shop.name}</h3>
                          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-600' : 'text-slate-300'}`}>{selectedShop.shop.address}</p>
                        </div>
                        <button
                          onClick={() => setSelectedShop(null)}
                          className={`transition ${darkMode ? 'text-gray-600 hover:text-gray-900' : 'text-slate-400 hover:text-white'}`}
                        >
                          <span className="text-3xl">×</span>
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {shopItems.map((item) => (
                          <div key={item.id} className={`rounded-2xl border p-5 ${darkMode ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-white/5'}`}>
                            <div className="flex items-start justify-between">
                              <h4 className={`text-lg font-semibold ${darkMode ? 'text-gray-900' : 'text-white'}`}>{item.name}</h4>
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${darkMode ? 'bg-green-100 text-green-700' : 'bg-emerald-400/20 text-emerald-300'}`}>
                                {item.discountPercentage}% OFF
                              </span>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-green-600' : 'text-emerald-400'}`}>${item.discountedPrice.toFixed(2)}</p>
                                <p className={`text-sm line-through ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>${item.originalPrice.toFixed(2)}</p>
                              </div>
                              <div className="text-right">
                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>Available</p>
                                <p className={`text-sm font-semibold ${darkMode ? 'text-blue-600' : 'text-amber-300'}`}>{item.quantityAvailable} left</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {shopItems.length === 0 && (
                        <p className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>No items available at this shop</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${darkMode ? 'text-blue-600' : 'text-emerald-300'}`}>Our Team</p>
              <h2 className={`mt-3 text-3xl font-semibold sm:text-4xl ${darkMode ? 'text-gray-900' : 'text-white'}`}>Meet Our Team Members</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {[
                { name: "Ahmad", role: "Member" },
                { name: "Iqra", role: "Member" },
                { name: "Zohaib", role: "Member" },
                { name: "Fakhra", role: "Member" },
                { name: "Amna", role: "Member" },
              ].map((member) => (
                <div key={member.name} className={`rounded-2xl border p-6 text-center ${darkMode ? 'border-gray-200 bg-white' : 'border-white/10 bg-white/5'}`}>
                  <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl ${darkMode ? 'bg-blue-100 text-blue-600' : 'bg-emerald-400/20 text-emerald-300'}`}>
                    {member.name.charAt(0)}
                  </div>
                  <h4 className={`mt-4 text-lg font-semibold ${darkMode ? 'text-gray-900' : 'text-white'}`}>{member.name}</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-600' : 'text-slate-400'}`}>{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="footer" className={`border-t ${darkMode ? 'border-gray-200 bg-gray-100' : 'border-white/10 bg-slate-950/90'}`}>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* About */}
            <div>
              <p className={`text-base font-semibold ${darkMode ? 'text-gray-900' : 'text-white'}`}>Bonyad</p>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-600' : 'text-slate-400'}`}>
                Operational clarity for loyalty leaders. Reduce food waste and earn rewards.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-900' : 'text-white'}`}>Contact Us</p>
              <div className={`space-y-2 text-sm ${darkMode ? 'text-gray-600' : 'text-slate-400'}`}>
                <p>Email: thebonyad2@gmail.com</p>
                <p>Support: Available 24/7</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-900' : 'text-white'}`}>Quick Links</p>
              <div className="space-y-2">
                <a href="/about" className={`block text-sm transition ${darkMode ? 'text-gray-600 hover:text-blue-600' : 'text-slate-400 hover:text-emerald-300'}`}>
                  About Us
                </a>
                <a href="/contact" className={`block text-sm transition ${darkMode ? 'text-gray-600 hover:text-blue-600' : 'text-slate-400 hover:text-emerald-300'}`}>
                  Contact
                </a>
                <a href="/privacy" className={`block text-sm transition ${darkMode ? 'text-gray-600 hover:text-blue-600' : 'text-slate-400 hover:text-emerald-300'}`}>
                  Privacy Policy
                </a>
                <a href="/terms" className={`block text-sm transition ${darkMode ? 'text-gray-600 hover:text-blue-600' : 'text-slate-400 hover:text-emerald-300'}`}>
                  Terms of Service
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-900' : 'text-white'}`}>Subscribe to our Newsletter</p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none ${darkMode ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500' : 'bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-emerald-300'}`}
                  required
                />
                <button
                  type="submit"
                  className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-emerald-400 text-slate-900 hover:bg-emerald-300'}`}
                >
                  Subscribe
                </button>
                {subscribeMessage && (
                  <p className={`text-xs ${darkMode ? 'text-green-600' : 'text-emerald-300'}`}>{subscribeMessage}</p>
                )}
              </form>
            </div>
          </div>

          <div className={`mt-8 border-t pt-8 text-center ${darkMode ? 'border-gray-200' : 'border-white/10'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-600' : 'text-slate-400'}`}>
              © 2026 Bonyad. All rights reserved. Built with ❤️ by our amazing team.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BonyadLanding;
