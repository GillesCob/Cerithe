import { useNavigate } from "react-router-dom";
import { login, logout, register, forgotPassword, resetPassword } from "../services/authService";
import { useTokenStore } from "../stores/authStore";

export const useAuth = () => {
  const navigate = useNavigate();
  const { setAccessToken, logout: clearAccessToken } = useTokenStore();

  const handleRegister = async (email: string, password: string, redirectTo?: string) => {
    const newUser = await register(email, password);
    const { accessToken } = newUser;
    setAccessToken(accessToken);
    navigate(redirectTo ?? "/dashboard");
  };

  const handleLogin = async (email: string, password: string, redirectTo?: string) => {
    const user = await login(email, password);
    const { accessToken } = user;
    setAccessToken(accessToken);
    navigate(redirectTo ?? "/dashboard");
  };

  const handleLogout = async () => {
    await logout();
    clearAccessToken();
    navigate("/login");
  };

  const handleForgotPassword = async (email: string) => {
    await forgotPassword(email);
  };

  const handleResetPassword = async (token: string, newPassword: string) => {
    await resetPassword(token, newPassword);
    navigate("/login");
  };

  return { handleRegister, handleLogin, handleLogout, handleForgotPassword, handleResetPassword };
};
