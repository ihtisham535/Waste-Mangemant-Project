import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import RestaurantPage from "./pages/RestaurantPage.jsx";
import ShopsPage from "./pages/ShopsPage.jsx";
import ShopkeepersPage from "./pages/ShopkeepersPage.jsx";
import ItemsPage from "./pages/ItemsPage.jsx";
import ScansPage from "./pages/ScansPage.jsx";

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="restaurant" element={<RestaurantPage />} />
        <Route path="shops" element={<ShopsPage />} />
        <Route path="shopkeepers" element={<ShopkeepersPage />} />
        <Route path="items" element={<ItemsPage />} />
        <Route path="scans" element={<ScansPage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;
