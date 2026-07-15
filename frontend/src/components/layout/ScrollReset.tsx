import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollReset() {
  const { pathname } = useLocation();

  // Desactive la restauration native du navigateur (bouton retour) pour eviter
  // qu'elle n'entre en conflit avec le reset gere ici en SPA.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.documentElement.scrollTo({ top: 0, behavior: "instant" });
    document.body.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
