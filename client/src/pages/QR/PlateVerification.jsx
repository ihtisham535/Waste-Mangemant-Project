import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PlateVerification = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const [step, setStep] = useState("check"); // check, welcome, upload, verifying, approved, rejected, blocked
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deviceFingerprint, setDeviceFingerprint] = useState("");
  const [eligibility, setEligibility] = useState(null);
  const [scanData, setScanData] = useState(null);
  const [nextAvailable, setNextAvailable] = useState(null);
  const [remainingTime, setRemainingTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Generate device fingerprint on mount
  useEffect(() => {
    const fingerprint = generateDeviceFingerprint();
    setDeviceFingerprint(fingerprint);
    
    // Check if user has unclaimed reward from previous session
    const savedReward = localStorage.getItem('bonyadReward');
    if (savedReward) {
      try {
        const rewardData = JSON.parse(savedReward);
        const expiryTime = new Date(rewardData.expiresAt);
        const now = new Date();
        
        // If reward is still valid, navigate to confirmation page
        if (expiryTime > now) {
          navigate('/qr/confirm');
          return;
        } else {
          // Reward expired, clear it
          localStorage.removeItem('bonyadReward');
        }
      } catch (err) {
        console.error('Error parsing saved reward:', err);
        localStorage.removeItem('bonyadReward');
      }
    }
    
    checkEligibility(fingerprint);
  }, [navigate]);

  // Live countdown timer
  useEffect(() => {
    if (step !== "blocked" || !nextAvailable) return;

    const interval = setInterval(() => {
      const time = calculateRemainingTime();
      if (!time) {
        clearInterval(interval);
        setStep("welcome");
      } else {
        setRemainingTime(time);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [step, nextAvailable]);

  // Calculate remaining time
  const calculateRemainingTime = () => {
    if (!nextAvailable) return null;
    
    const now = new Date();
    const next = new Date(nextAvailable);
    const diff = next - now;
    
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds };
  };

  // Generate a simple device fingerprint
  const generateDeviceFingerprint = () => {
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
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return `device_${Math.abs(hash)}`;
  };

  // Check scan eligibility (24-hour limit)
  const checkEligibility = async (fingerprint) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/plate/check-eligibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceFingerprint: fingerprint }),
      });

      const data = await response.json();
      setEligibility(data);

      if (!data.eligible) {
        setNextAvailable(data.nextAvailableAt);
        // Check if user has unclaimed reward
        const savedReward = localStorage.getItem('bonyadReward');
        if (savedReward) {
          try {
            const rewardData = JSON.parse(savedReward);
            const expiryTime = new Date(rewardData.expiresAt);
            if (expiryTime > new Date()) {
              // User has valid reward, navigate to confirmation
              navigate('/qr/confirm');
              return;
            } else {
              localStorage.removeItem('bonyadReward');
            }
          } catch (err) {
            localStorage.removeItem('bonyadReward');
          }
        }
        setStep("blocked");
      } else {
        setStep("welcome");
      }
    } catch (err) {
      setError("Failed to check eligibility. Please try again.");
      console.error(err);
      setStep("welcome"); // Allow to proceed on error
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  // Upload plate image
  const handleUpload = async () => {
    if (!selectedImage) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setStep("verifying");

    // Clear any existing reward data since user is starting a new verification
    localStorage.removeItem('bonyadReward');

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("deviceFingerprint", deviceFingerprint);
      
      // Add scan context if available
      if (scanId) {
        formData.append("scanId", scanId);
      }

      const uploadResponse = await fetch(`${apiBaseUrl}/api/plate/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const uploadData = await uploadResponse.json();
      const newScanId = uploadData.scan.id;

      // Trigger verification
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
      
      const verifyResponse = await fetch(`${apiBaseUrl}/api/plate/verify/${newScanId}`, {
        method: "POST",
      });

      const verifyData = await verifyResponse.json();
      setScanData(verifyData.scan);
      setStep("result");

    } catch (err) {
      setError(err.message || "Failed to process image. Please try again.");
      setStep("upload");
    } finally {
      setLoading(false);
    }
  };

  // Calculate remaining time
  const getRemainingTime = () => {
    if (!nextAvailable) return null;
    
    const now = new Date();
    const next = new Date(nextAvailable);
    const diff = next - now;
    
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
            <img src="/logo.jpeg" alt="Bonyad logo" className="h-10 w-10 rounded-xl object-cover" />
            <div>
              <p className="text-lg font-semibold tracking-wide text-gray-900">Bonyad</p>
              <p className="text-xs text-emerald-600">Building a hunger-free Pakistan</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
            <button onClick={() => navigate("/home")} className="text-gray-600 hover:text-gray-900 transition">
              Home
            </button>
            <button onClick={() => navigate("/about")} className="text-gray-600 hover:text-gray-900 transition">
              About Us
            </button>
            <button onClick={() => navigate("/contact")} className="text-gray-600 hover:text-gray-900 transition">
              Contact Us
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
        
        {/* Welcome State */}
        {step === "welcome" && (
          <div className="space-y-8 animate-fade-in">
            {/* Welcome Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-6 py-2 text-sm font-semibold text-blue-600 shadow-sm mb-4">
                <span className="text-2xl">🌱</span>
                The Bonyad Rewards
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
                Welcome to The Bonyad<br />Reward Program
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Thank you for being responsible and finishing your meal.<br />
                At The Bonyad, we believe that every grain of food matters.<br />
                Your small action today helps reduce food waste and supports a bigger cause.
              </p>
            </div>

            {/* Mission Statement Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">💚</div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Our Mission</h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    At The Bonyad, we believe that every meal finished is a step toward a world with less waste and more care. 
                    By verifying your clean plate, you're not just earning rewards—you're joining a movement to create sustainable dining habits.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <div className="text-3xl mb-2">🍽️</div>
                  <p className="text-sm font-semibold text-gray-900">Reduce Waste</p>
                  <p className="text-xs text-gray-600 mt-1">Finish what you take</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <div className="text-3xl mb-2">🎁</div>
                  <p className="text-sm font-semibold text-gray-900">Earn Rewards</p>
                  <p className="text-xs text-gray-600 mt-1">Get exclusive benefits</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <div className="text-3xl mb-2">🌍</div>
                  <p className="text-sm font-semibold text-gray-900">Save Planet</p>
                  <p className="text-xs text-gray-600 mt-1">Make an impact</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button
                onClick={() => setStep("upload")}
                className="group relative inline-flex items-center gap-3 rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
              >
                <span>Verify Your Plate</span>
                <span className="text-2xl group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
              <p className="text-gray-600 text-sm mt-4">Start earning rewards today!</p>
            </div>
          </div>
        )}

        {/* Upload State */}
        {step === "upload" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                Verify Your Plate
              </h1>
              <p className="text-gray-700 text-base sm:text-lg max-w-2xl mx-auto">
                Please upload a clear picture of your finished plate to continue and unlock available rewards.
              </p>
            </div>

            {/* Upload Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg">
              
              {error && (
                <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-800 animate-shake">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-sm font-semibold">{error}</p>
                  </div>
                </div>
              )}

              {/* Image Preview */}
              {previewUrl ? (
                <div className="mb-6 rounded-2xl overflow-hidden border-2 border-gray-300 shadow-md">
                  <img
                    src={previewUrl}
                    alt="Plate preview"
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                </div>
              ) : (
                <label className="block cursor-pointer group mb-6">
                  <div className="rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 p-12 sm:p-16 text-center transition-all duration-300 group-hover:border-blue-400 group-hover:bg-blue-100 group-hover:scale-[1.02]">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">📸</div>
                    <p className="text-xl font-bold text-gray-900 mb-2">Click or Drag to Upload</p>
                    <p className="text-sm text-gray-600">PNG, JPG, WebP (max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {previewUrl && (
                  <label className="block cursor-pointer">
                    <div className="rounded-lg border-2 border-gray-300 bg-gray-50 px-6 py-3 text-center font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:border-gray-400">
                      Change Image
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!selectedImage || loading}
                  className="w-full rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? "Processing..." : "Submit for Verification"}
                </button>

                <button
                  onClick={() => setStep("welcome")}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:border-gray-400"
                >
                  Back to Welcome
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Pro Tip</p>
                    <p className="text-xs text-gray-600">
                      Ensure your plate is completely clean with no food residue for successful verification. Good lighting helps too!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verifying State */}
        {step === "verifying" && (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 sm:p-16 shadow-lg text-center space-y-6 animate-fade-in">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-24 w-24 border-8 border-gray-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🍽️</div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Verifying Your Plate...</h2>
            <p className="text-gray-600 text-lg">Image uploaded successfully. Please wait while we verify your plate.</p>
            <div className="flex justify-center gap-2 mt-8">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {/* Result State */}
        {step === "result" && scanData && (
          <div className="space-y-6 animate-fade-in">
            {scanData.rewardUnlocked ? (
              /* Approved State */
              <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-lg text-center">
                <div className="inline-block mb-6 animate-bounce-slow">
                  <div className="text-8xl sm:text-9xl">✅</div>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Your plate has been<br />verified successfully!
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                  Congratulations! Your clean plate has been verified and your reward is now unlocked.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 sm:p-8 mb-8">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <span className="text-4xl">🎉</span>
                    <p className="text-2xl font-bold text-gray-900">Reward Unlocked!</p>
                  </div>
                  <p className="text-gray-700">
                    Thank you for being responsible and finishing your meal. You're making a positive impact!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate("/qr/confirm")}
                    className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                  >
                    Claim Your Reward
                  </button>
                  <button
                    onClick={() => navigate("/home")}
                    className="rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:border-gray-400"
                  >
                    Go to Home Page
                  </button>
                </div>
              </div>
            ) : (
              /* Rejected State */
              <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-lg text-center">
                <div className="inline-block mb-6">
                  <div className="text-8xl sm:text-9xl">❌</div>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Verification Failed
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                  The image is not clear or the plate appears unfinished. Please upload a clear image.
                </p>

                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 mb-8">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <span className="text-3xl">⚠️</span>
                    <p className="text-xl font-bold text-gray-900">Image Not Clear or Plate Unfinished</p>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base">
                    Please ensure your plate is completely clean and the image is clear before uploading.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setStep("upload");
                      setSelectedImage(null);
                      setPreviewUrl(null);
                      setScanData(null);
                    }}
                    className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => navigate("/home")}
                    className="rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:border-gray-400"
                  >
                    Go to Home Page
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Blocked State */}
        {step === "blocked" && (
          <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-lg text-center space-y-6 animate-fade-in">
            <div className="text-7xl sm:text-8xl">⏳</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Scan Limit Reached
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
              You have already scanned today.<br />
              You can scan again after 24 hours.
            </p>

            {remainingTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
                <p className="text-sm font-semibold text-gray-900 mb-4">Next scan available in:</p>
                <div className="flex justify-center gap-4">
                  <div className="bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
                    <p className="text-3xl font-bold text-gray-900">{String(remainingTime.hours).padStart(2, '0')}</p>
                    <p className="text-xs text-gray-600 mt-1">Hours</p>
                  </div>
                  <div className="bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
                    <p className="text-3xl font-bold text-gray-900">{String(remainingTime.minutes).padStart(2, '0')}</p>
                    <p className="text-xs text-gray-600 mt-1">Minutes</p>
                  </div>
                  <div className="bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
                    <p className="text-3xl font-bold text-gray-900">{String(remainingTime.seconds).padStart(2, '0')}</p>
                    <p className="text-xs text-gray-600 mt-1">Seconds</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate("/home")}
              className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
            >
              Go to Home Page
            </button>
          </div>
        )}

        {/* Loading State */}
        {step === "check" && loading && (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 sm:p-16 shadow-lg text-center space-y-6 animate-fade-in">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-8 border-gray-200 border-t-blue-600"></div>
            <p className="text-xl text-gray-700">Checking eligibility...</p>
          </div>
        )}

        {/* Footer Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm bg-gray-50 rounded-full px-6 py-3 inline-block border border-gray-200">
            🌱 Part of Bonyad's mission to reduce food waste and fight hunger
          </p>
        </div>
      </div>
    </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* About */}
            <div>
              <p className="text-base font-semibold text-gray-900">Bonyad</p>
              <p className="mt-2 text-sm text-gray-600">
                Operational clarity for loyalty leaders. Reduce food waste and earn rewards.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <p className="text-sm font-semibold mb-3 text-gray-900">Contact Us</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Email: thebonyad2@gmail.com</p>
                <p>Support: Available 24/7</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p className="text-sm font-semibold mb-3 text-gray-900">Quick Links</p>
              <div className="space-y-2">
                <a href="/about" className="block text-sm transition text-gray-600 hover:text-blue-600">
                  About Us
                </a>
                <a href="/contact" className="block text-sm transition text-gray-600 hover:text-blue-600">
                  Contact
                </a>
                <a href="/privacy" className="block text-sm transition text-gray-600 hover:text-blue-600">
                  Privacy Policy
                </a>
                <a href="/terms" className="block text-sm transition text-gray-600 hover:text-blue-600">
                  Terms of Service
                </a>
              </div>
            </div>

            {/* Info */}
            <div>
              <p className="text-sm font-semibold mb-3 text-gray-900">Our Mission</p>
              <p className="text-sm text-gray-600">
                Building a hunger-free Pakistan by reducing food waste and connecting surplus food with those in need.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t pt-8 text-center border-gray-200">
            <p className="text-sm text-gray-600">
              © 2026 Bonyad. All rights reserved. Built with ❤️ by our amazing team.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlateVerification;
