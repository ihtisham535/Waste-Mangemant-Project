const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("adminToken");

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken() ? `Bearer ${getToken()}` : undefined,
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const adminLogin = (email, password) =>
  request("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ username: email, password }),
  });

export const registerAdmin = (payload) =>
  request("/admin/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const logoutAdmin = () =>
  request("/admin/auth/logout", {
    method: "POST",
  });

export const fetchDashboardMetrics = () => request("/admin/scans/metrics");

export const fetchRestaurant = () => request("/admin/restaurant");
export const saveRestaurant = (payload) =>
  request("/admin/restaurant", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const fetchShops = () => request("/admin/shops");
export const createShop = (payload) =>
  request("/admin/shops", {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const updateShop = (id, payload) =>
  request(`/admin/shops/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
export const deleteShop = (id) => request(`/admin/shops/${id}`, { method: "DELETE" });

export const fetchShopkeepers = () => request("/admin/shopkeepers");
export const createShopkeeper = (payload) =>
  request("/admin/shopkeepers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const updateShopkeeper = (id, payload) =>
  request(`/admin/shopkeepers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
export const deleteShopkeeper = (id) => request(`/admin/shopkeepers/${id}`, { method: "DELETE" });

export const fetchItems = () => request("/admin/items");
export const updateItem = (id, payload) =>
  request(`/admin/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const fetchScans = () => request("/admin/scans");
