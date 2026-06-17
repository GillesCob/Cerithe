import { useNavigate } from "react-router-dom";
import { login, register } from "../services/authService";
import { useTokenStore } from "../stores/authStore";

export const useAuth = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useTokenStore();

  const handleRegister = async (email: string, password: string) => {
    const newUser = await register(email, password);
    const { accessToken } = newUser;
    setAccessToken(accessToken);
    navigate("/dashboard");
  };

  const handleLogin = async (email: string, password: string) => {
    const user = await login(email, password);
    const { accessToken } = user;
    setAccessToken(accessToken);
    navigate("/dashboard");
  };
  return { handleRegister, handleLogin };
};
