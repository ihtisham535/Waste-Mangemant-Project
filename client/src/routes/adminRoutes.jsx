import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import AdminProtectedRoute from "../components/admin/AdminProtectedRoute.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminItems from "../pages/admin/AdminItems.jsx";
import AdminLogin from "../pages/admin/AdminLogin.jsx";
import AdminRegister from "../pages/admin/AdminRegister.jsx";
import AdminRestaurant from "../pages/admin/AdminRestaurant.jsx";
import AdminScans from "../pages/admin/AdminScans.jsx";
import AdminShopkeepers from "../pages/admin/AdminShopkeepers.jsx";
import AdminShops from "../pages/admin/AdminShops.jsx";

const AdminRoutes = () => (
  <Routes>
    <Route path="login" element={<AdminLogin />} />
    <Route path="register" element={<AdminRegister />} />
    <Route element={<AdminProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="shops" element={<AdminShops />} />
        <Route path="items" element={<AdminItems />} />
        <Route path="shopkeepers" element={<AdminShopkeepers />} />
        <Route path="restaurant" element={<AdminRestaurant />} />
        <Route path="scans" element={<AdminScans />} />
      </Route>
    </Route>
  </Routes>
);

export default AdminRoutes;
