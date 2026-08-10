import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useGetAllProfiles } from "@/hooks/useProfile";
import { useActiveProfileStore } from "@/stores/activeProfileStore";
import { useAuth } from "@/hooks/useAuth";
import type { IProfile } from "@/types/profile";

const roleLabel = (role: string) => (role === "PROFESSIONAL" ? "Professionnel" : "Particulier");

const displayName = (profile: IProfile) =>
  profile.role === "PROFESSIONAL" ? (profile.companyName ?? profile.firstName ?? "") : (profile.firstName ?? "");

const Navbar = () => {
  const { profiles } = useGetAllProfiles();
  const { activeProfileId, setActiveProfileId } = useActiveProfileStore();
  const { handleLogout } = useAuth();
  const [open, setOpen] = useState(false);

  const active = profiles?.find((p: IProfile) => p.id === activeProfileId) ?? profiles?.[0];

  // Resout un profil actif par defaut (premier profil retourne par l'API) si aucun n'est
  // encore persiste, ou si celui persiste ne correspond plus a un profil du compte connecte.
  useEffect(() => {
    if (profiles && profiles.length > 0 && !profiles.find((p: IProfile) => p.id === activeProfileId)) {
      setActiveProfileId(profiles[0].id);
    }
  }, [profiles, activeProfileId, setActiveProfileId]);

  const other = profiles?.find((p: IProfile) => p.id !== active?.id);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 h-[88px] flex items-center justify-between relative">
      <Link to="/dashboard">
        <img src="/logo-cerithe.png" alt="Cerithe" className="h-16 w-auto" />
      </Link>

      <div className="flex items-center gap-5">
        <Link to="/dashboard" className="text-[13.5px] font-medium text-gray-600 hover:text-gray-900">
          Mes biens
        </Link>

        {active && (
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-gray-200 bg-white"
            >
              <span className="w-6.5 h-6.5 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                {displayName(active).charAt(0).toUpperCase()}
              </span>
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[13px] font-medium text-gray-900">{displayName(active)}</span>
                <span className="text-[11px] text-gray-600">{roleLabel(active.role)}</span>
              </span>
              <ChevronDown className={`size-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-65 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-20">
                {other && (
                  <>
                    <div className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg">
                      <span className="w-6.5 h-6.5 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                        {displayName(active).charAt(0).toUpperCase()}
                      </span>
                      <span>
                        <span className="block text-[13.5px] font-semibold text-gray-900">{displayName(active)}</span>
                        <span className="block text-[11.5px] text-gray-600">{roleLabel(active.role)}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveProfileId(other.id);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg hover:bg-gray-50 text-left"
                    >
                      <span className="w-6.5 h-6.5 rounded-full border-1.5 border-gray-200 text-gray-600 text-xs font-semibold flex items-center justify-center shrink-0">
                        {displayName(other).charAt(0).toUpperCase()}
                      </span>
                      <span>
                        <span className="block text-[13.5px] font-semibold text-gray-900">{displayName(other)}</span>
                        <span className="block text-[11.5px] text-gray-600">{roleLabel(other.role)}</span>
                      </span>
                    </button>
                    <hr className="border-t border-gray-200 my-1.5 mx-1" />
                  </>
                )}
                <Link
                  to="/account"
                  onClick={() => setOpen(false)}
                  className="block w-full px-2.5 py-2.5 rounded-lg text-[13.5px] text-gray-900 hover:bg-gray-50"
                >
                  Mon compte
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-2.5 py-2.5 rounded-lg text-[13.5px] text-gray-600 hover:bg-gray-50 text-left"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
