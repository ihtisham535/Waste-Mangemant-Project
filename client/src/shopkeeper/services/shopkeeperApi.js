const API_BASE_URL =
  import.meta.env.VITE_SHOPKEEPER_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

const getToken = () => localStorage.getItem("shopkeeperToken");

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

export const loginShopkeeper = (payload) =>
  request("/shopkeeper/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const logoutShopkeeper = () =>
  request("/shopkeeper/auth/logout", {
    method: "POST",
  });

export const fetchShopkeeperProfile = () => request("/shopkeeper/me");

export const fetchShopItems = () => request("/shopkeeper/items");

export const createShopItem = (payload) =>
  request("/shopkeeper/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateShopItem = (id, payload) =>
  request(`/shopkeeper/items/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );

export const deleteShopItem = (id) =>
  request(`/shopkeeper/items/${id}`,
    {
      method: "DELETE",
    }
  );
