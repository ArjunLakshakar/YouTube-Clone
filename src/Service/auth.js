// src/hooks/auth.js

// Set token and expiry (1 hour from now)
export const storeTokenWithExpiry = (token) => {
  const expiry = new Date().getTime() + 60 * 60 * 1000; // 1 hour
  localStorage.setItem("token", token);
  localStorage.setItem("tokenExpiry", expiry.toString());
};

// Check if token is still valid
export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("tokenExpiry");
  if (!token || !expiry) return false;
  return new Date().getTime() < Number(expiry);
};

// Clear token if invalid or on logout
export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiry");
};
