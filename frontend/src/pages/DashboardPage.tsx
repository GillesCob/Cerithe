import { Link } from "react-router-dom";
import { useGetProperties } from "../hooks/useProperty";
import { useAuth } from "../hooks/useAuth";
import type { IProperty } from "../types/property";
import { PropertyCard } from "@/components/property/PropertyCard";

const DashboardPage = () => {
  const { properties, isPending, isError } = useGetProperties();
  const { handleLogout } = useAuth();
  if (isPending) return <div>Chargement...</div>;
  if (isError) return <div>Erreur lors du chargement des biens</div>;

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 flex items-center justify-between">
        <img src="/logo-cerithe.png" alt="Cerithe" className="h-25 w-auto" />
        <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">
          Déconnexion
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes biens</h2>
        {properties && properties.length > 0 ? (
          <>
            {properties.map((p: IProperty) => (
              <PropertyCard key={p.id} property={p} />
            ))}
            <Link
              to="/property-form"
              className="inline-block px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter un bien
            </Link>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-400 text-sm mb-4">Vous n'avez pas encore de bien enregistré.</p>
            <Link
              to="/property-form"
              className="inline-block px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter mon premier bien
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
