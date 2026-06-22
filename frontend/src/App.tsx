import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PropertyListPage from "./pages/PropertyListPage";
import PropertyFormPage from "./pages/PropertyFormPage";
import PropertyPage from "./pages/PropertyPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/property-list" element={<PropertyListPage />} />
        <Route path="/property-form" element={<PropertyFormPage />} />
        <Route path="/property/:id" element={<PropertyPage />} />
      </Routes>
    </BrowserRouter>
  );
}
