import { useEffect, useState } from "react";
import { refreshAccessToken } from "../services/authService";
import { useTokenStore } from "../stores/authStore";

export const useAuthBootstrap = () => {
  const [isReady, setIsReady] = useState(false);
  const setAccessToken = useTokenStore((state) => state.setAccessToken);

  useEffect(() => {
    refreshAccessToken()
      .then(({ accessToken }) => setAccessToken(accessToken))
      .catch(() => {})
      .finally(() => setIsReady(true));
  }, [setAccessToken]);

  return { isReady };
};
