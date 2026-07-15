import { Link } from "react-router-dom";

const VALUE_POINTS = [
  {
    title: "Un historique centralisé",
    desc: "Travaux, diagnostics, documents : tout ce qui concerne votre bien reste au même endroit, daté et rattaché.",
  },
  {
    title: "Transmis en un clic",
    desc: "Le jour de la vente, transférez l'intégralité de l'historique au nouveau propriétaire, sans dossier à reconstituer.",
  },
  {
    title: "Toujours à jour",
    desc: "Ajoutez un document ou une intervention au fil de l'eau, sans attendre la prochaine transaction.",
  },
];

export default function ProtoLandingPage() {
  return (
    <div className="min-h-dvh bg-gray-50">
      <section className="flex flex-col items-center px-6 pt-20 pb-16 text-center">
        <img src="/logo-cerithe.png" alt="Cerithe" className="h-20 w-auto mb-8" />
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight max-w-xl">
          Le carnet de santé numérique de votre bien immobilier
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-500 max-w-lg">
          Centralisez travaux, diagnostics et documents. Transmettez tout l'historique à votre acheteur en quelques
          clics.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            to="/register"
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer un compte
          </Link>
          <Link
            to="/login"
            className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-white transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto grid gap-5 md:grid-cols-3">
          {VALUE_POINTS.map((point) => (
            <div key={point.title} className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-display font-semibold text-gray-900 mb-2 text-sm">{point.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
