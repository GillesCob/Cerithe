import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import AccountPage from "./pages/AccountPage";
import PropertyListPage from "./pages/PropertyListPage";
import PropertyFormPage from "./pages/PropertyFormPage";
import PropertyPage from "./pages/PropertyPage";
import RoomPage from "./pages/RoomPage";
import RoomFormPage from "./pages/RoomFormPage";
import TransmissionPage from "./pages/TransmissionPage";
import { useAuthBootstrap } from "./hooks/useAuthBootstrap";
import ScrollReset from "./components/layout/ScrollReset";
import ProtectedRoute from "./components/layout/ProtectedRoute";

export default function App() {
  useAuthBootstrap();

  return (
    <BrowserRouter>
      <ScrollReset />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/property-list"
          element={
            <ProtectedRoute>
              <PropertyListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/property-form"
          element={
            <ProtectedRoute>
              <PropertyFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/property-form/:id"
          element={
            <ProtectedRoute>
              <PropertyFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/property/:id"
          element={
            <ProtectedRoute>
              <PropertyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:id"
          element={
            <ProtectedRoute>
              <RoomPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room-form/:id"
          element={
            <ProtectedRoute>
              <RoomFormPage />
            </ProtectedRoute>
          }
        />
        <Route path="/transmission/:token" element={<TransmissionPage />} />
      </Routes>
    </BrowserRouter>
  );
}
