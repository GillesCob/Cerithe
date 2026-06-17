import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Cerithe</h1>
        <div className="flex items-center gap-4">
          <Link to="/property-form" className="text-sm text-blue-600 hover:underline">
            + Ajouter un bien
          </Link>
          <Link to="/account" className="text-sm text-gray-600 hover:text-gray-900">
            Mon compte
          </Link>
        </div>
      </nav>

      {/* Contenu */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes biens</h2>

        {/* État vide */}
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-400 text-sm mb-4">Vous n'avez pas encore de bien enregistré.</p>
          <Link
            to="/property-form"
            className="inline-block px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ajouter mon premier bien
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
