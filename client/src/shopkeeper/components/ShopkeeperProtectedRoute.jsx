import { Navigate, Outlet } from "react-router-dom";

const ShopkeeperProtectedRoute = () => {
  const token = localStorage.getItem("shopkeeperToken");
  if (!token) {
    return <Navigate to="/shopkeeper/login" replace />;
  }
  return <Outlet />;
};

export default ShopkeeperProtectedRoute;
