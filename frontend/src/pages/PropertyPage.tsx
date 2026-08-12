import { useParams, Link } from "react-router-dom";
import { useGetPropertyById } from "../hooks/useProperty";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import UploadDocumentForm from "@/components/document/UploadDocumentForm";
import CreateTransmissionModal from "@/components/transmission/CreateTransmissionModal";
import { useGetDocuments, useDeleteDocument, useDownloadDocument } from "@/hooks/useDocument";
import type { IDocument } from "@/types/document";
import Navbar from "@/components/layout/Navbar";

const FeatureComingSoonButton = ({ label }: { label: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ferme le tooltip sur n'importe quel clic en dehors du bouton, pas seulement en recliquant
  // dessus (mobile n'a pas de hover pour le fermer autrement).
  useEffect(() => {
    if (!showTooltip) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showTooltip]);

  return (
    <div ref={containerRef} className="relative group">
      <button
        type="button"
        onClick={() => setShowTooltip((v) => !v)}
        className="cursor-pointer text-sm bg-gray-100 text-gray-400 px-4 py-2 rounded-lg"
      >
        {label}
      </button>
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max max-w-[9rem] text-center bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg pointer-events-none z-10 transition-opacity ${
          showTooltip ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-gray-800 rotate-45" />
        En développement
      </div>
    </div>
  );
};

const PropertyPage = () => {
  const { id } = useParams<{ id: string }>();
  const { property, isPending, isError } = useGetPropertyById(id!);
  const [isUploading, setIsUploading] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const { documents } = useGetDocuments(id!);
  const { mutate: deleteDocument, isPending: isDeletingDocument } = useDeleteDocument();
  const { mutate: downloadDocument, isPending: isDownloadingDocument } = useDownloadDocument();

  const handleDeleteDocument = (documentId: string) => {
    if (!window.confirm("Supprimer ce document ? Cette action est irréversible.")) return;
    deleteDocument(documentId, { onError: () => window.alert("Impossible de supprimer ce document.") });
  };

  const handleDownloadDocument = (documentId: string) => {
    downloadDocument(documentId, { onError: () => window.alert("Impossible d'ouvrir ce document.") });
  };

  // Navbar toujours montee, avant les etats de chargement/erreur (meme raison que
  // DashboardPage, cf son commentaire) : elle ne depend pas de ce bien pour s'afficher.
  if (isPending)
    return (
      <div className="min-h-dvh bg-gray-50">
        <Navbar />
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-gray-400" />
        </div>
      </div>
    );
  if (isError)
    return (
      <div className="min-h-dvh bg-gray-50">
        <Navbar />
        <div className="p-8">Erreur</div>
      </div>
    );
  if (!property)
    return (
      <div className="min-h-dvh bg-gray-50">
        <Navbar />
        <div className="p-8">Bien introuvable</div>
      </div>
    );

  return (
    <div className="min-h-dvh bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8">
          <ArrowLeft size={16} />
          Retour
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
          <div className="flex items-center gap-2">
            <Link
              to={`/property-form/${id}`}
              className="text-sm border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Modifier
            </Link>
            <button
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => setIsTransmitting(true)}
            >
              Transmettre
            </button>
          </div>
        </div>
        {isTransmitting && <CreateTransmissionModal propertyId={id!} onClose={() => setIsTransmitting(false)} />}

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-500 mb-10">
          <span>{property.address}</span>
          <span className="hidden sm:inline">·</span>
          <span>{property.houseType === "HOUSE" ? "Maison" : "Appartement"}</span>
          <span className="hidden sm:inline">·</span>
          <span>{property.surface} m²</span>
          <span className="hidden sm:inline">·</span>
          <span>
            {property.numberOfLevels} niveau{property.numberOfLevels > 1 ? "x" : ""}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
            {documents && documents.length > 0 && (
              <button
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => setIsUploading(true)}
              >
                + Ajouter un document
              </button>
            )}
          </div>
          {isUploading && <UploadDocumentForm propertyId={id!} onClose={() => setIsUploading(false)} />}
          {documents && documents.length > 0 ? (
            documents.map((doc: IDocument) => (
              <div key={doc.id} className="flex items-center justify-between gap-2 py-3 border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => handleDownloadDocument(doc.id)}
                  disabled={isDownloadingDocument}
                  className="min-w-0 truncate text-sm text-blue-600 hover:underline text-left disabled:opacity-50"
                >
                  {doc.title}
                </button>
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  disabled={isDeletingDocument}
                  aria-label="Supprimer le document"
                  className="shrink-0 text-gray-400 hover:text-red-600 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-400 text-sm mb-4">
                Ajoutez ici les documents relatifs à ce bien : plan, cadastre, diagnostics...
              </p>
              <button
                onClick={() => setIsUploading(true)}
                className="inline-block px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Ajouter un document
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Pièces & travaux</h2>
          <div className="flex flex-wrap gap-3 mb-20">
            <FeatureComingSoonButton label="+ Ajouter une pièce" />
            <FeatureComingSoonButton label="+ Ajouter des travaux" />
            <FeatureComingSoonButton label="Vue 3D du bien" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
