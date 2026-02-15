import { Navigate, Route, Routes } from "react-router-dom";
import ShopkeeperLayout from "./components/ShopkeeperLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ItemsPage from "./pages/ItemsPage.jsx";
import ContactSupportPage from "./pages/ContactSupportPage.jsx";
import HelpCenterPage from "./pages/HelpCenterPage.jsx";

const App = () => (
  <Routes>
    <Route element={<ShopkeeperLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route index element={<DashboardPage />} />
        <Route path="items" element={<ItemsPage />} />
        <Route path="contact-support" element={<ContactSupportPage />} />
        <Route path="help-center" element={<HelpCenterPage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
