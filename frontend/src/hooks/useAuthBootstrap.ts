import { useEffect } from "react";
import { refreshAccessToken } from "../services/authService";
import { useTokenStore } from "../stores/authStore";

export const useAuthBootstrap = () => {
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const setBootstrapped = useTokenStore((state) => state.setBootstrapped);

  useEffect(() => {
    refreshAccessToken()
      .then(({ accessToken }) => setAccessToken(accessToken))
      .catch(() => {})
      .finally(() => setBootstrapped());
  }, [setAccessToken, setBootstrapped]);
};
