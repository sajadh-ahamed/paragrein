import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import CustomerDashboard from "../pages/CustomerDashboard";
import DriverDashboard from "../pages/DriverDashboard";
import WarehouseDashboard from "../pages/WarehouseDashboard";
import FinanceDashboard from "../pages/FinanceDashboard";
import OperationsDashboard from "../pages/OperationsDashboard";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

function getRoleHomePath(role) {
  switch (role) {
    case "ADMIN":
      return "/dashboard";
    case "CUSTOMER":
      return "/customer-dashboard";
    case "DRIVER":
      return "/driver-dashboard";
    case "WAREHOUSE":
      return "/warehouse-dashboard";
    case "FINANCE":
      return "/finance-dashboard";
    case "OPERATIONS":
      return "/operations-dashboard";
    default:
      return "/";
  }
}

function RoleHomeRedirect() {
  const role = localStorage.getItem("role");
  return <Navigate to={getRoleHomePath(role)} replace />;
}

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={getRoleHomePath(role)} replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-dashboard"
          element={
            <ProtectedRoute allowedRoles={["DRIVER"]}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warehouse-dashboard"
          element={
            <ProtectedRoute allowedRoles={["WAREHOUSE"]}>
              <WarehouseDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance-dashboard"
          element={
            <ProtectedRoute allowedRoles={["FINANCE"]}>
              <FinanceDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations-dashboard"
          element={
            <ProtectedRoute allowedRoles={["OPERATIONS"]}>
              <OperationsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <RoleHomeRedirect />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<RoleHomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
