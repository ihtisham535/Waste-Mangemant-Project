import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children || <Outlet />;
};

export default AdminProtectedRoute;
