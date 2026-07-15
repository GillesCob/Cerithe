import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useTokenStore } from "@/stores/authStore";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const accessToken = useTokenStore((state) => state.accessToken);
  const isBootstrapped = useTokenStore((state) => state.isBootstrapped);
  const location = useLocation();

  if (!isBootstrapped) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
