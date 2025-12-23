import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import "./index.css";

// Simple routing based on pathname
const pathname = window.location.pathname;
const isAdminPage = pathname === "/admin" || pathname === "/admin/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdminPage ? <AdminPage /> : <App />}
  </React.StrictMode>
);
