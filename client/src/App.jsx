import { Navigate, Route, Routes } from "react-router-dom";
import BonyadLanding from "./pages/Landing/BonyadLanding.jsx";
import AboutUs from "./pages/Landing/AboutUs.jsx";
import ContactUs from "./pages/Landing/ContactUs.jsx";
import TermsAndConditions from "./pages/Landing/TermsAndConditions.jsx";
import PrivacyPolicy from "./pages/Landing/PrivacyPolicy.jsx";
import AdminRoutes from "./routes/adminRoutes.jsx";
import QRConfirmation from "./pages/QR/QRConfirmation.jsx";
import QRDisplay from "./pages/QR/QRDisplay.jsx";
import QRDiscountListing from "./pages/QR/QRDiscountListing.jsx";
import PlateVerification from "./pages/QR/PlateVerification.jsx";
import ShopkeeperLayout from "./shopkeeper/components/ShopkeeperLayout.jsx";
import ShopkeeperProtectedRoute from "./shopkeeper/components/ShopkeeperProtectedRoute.jsx";
import ShopkeeperDashboard from "./shopkeeper/pages/ShopkeeperDashboard.jsx";
import ShopkeeperItems from "./shopkeeper/pages/ShopkeeperItems.jsx";
import ShopkeeperLogin from "./shopkeeper/pages/ShopkeeperLogin.jsx";

const App = () => (
  <Routes>
    <Route path="/" element={<PlateVerification />} />
    <Route path="/home" element={<BonyadLanding />} />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/contact" element={<ContactUs />} />
    <Route path="/terms" element={<TermsAndConditions />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/admin/*" element={<AdminRoutes />} />
    <Route path="/shopkeeper" element={<ShopkeeperLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="login" element={<ShopkeeperLogin />} />
      <Route element={<ShopkeeperProtectedRoute />}>
        <Route path="dashboard" element={<ShopkeeperDashboard />} />
        <Route path="items" element={<ShopkeeperItems />} />
      </Route>
    </Route>
    <Route path="/qr" element={<Navigate to="/qr/offers" replace />} />
    <Route path="/qr/:id" element={<QRDisplay />} />
    <Route path="/qr/verify/:scanId?" element={<PlateVerification />} />
    <Route path="/qr/offers" element={<QRDiscountListing />} />
    <Route path="/qr/confirm" element={<QRConfirmation />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
