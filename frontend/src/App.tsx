import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import PropertyListPage from "./pages/PropertyListPage";
import PropertyFormPage from "./pages/PropertyFormPage";
import PropertyPage from "./pages/PropertyPage";
import TransmissionPage from "./pages/TransmissionPage";
import { useAuthBootstrap } from "./hooks/useAuthBootstrap";
import ScrollReset from "./components/layout/ScrollReset";

export default function App() {
  const { isReady } = useAuthBootstrap();
  if (!isReady) return <div className="p-8">Chargement...</div>;

  return (
    <BrowserRouter>
      <ScrollReset />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/property-list" element={<PropertyListPage />} />
        <Route path="/property-form" element={<PropertyFormPage />} />
        <Route path="/property-form/:id" element={<PropertyFormPage />} />
        <Route path="/property/:id" element={<PropertyPage />} />
        <Route path="/transmission/:token" element={<TransmissionPage />} />
      </Routes>
    </BrowserRouter>
  );
}
