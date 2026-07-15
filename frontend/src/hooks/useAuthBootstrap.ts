import { useEffect } from "react";
import { refreshAccessToken } from "../services/authService";
import { useTokenStore } from "../stores/authStore";

export const useAuthBootstrap = () => {
  const setAccessToken = useTokenStore((state) => state.setAccessToken);

  useEffect(() => {
    refreshAccessToken()
      .then(({ accessToken }) => setAccessToken(accessToken))
      .catch(() => {});
  }, [setAccessToken]);
};
