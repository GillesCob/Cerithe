import { useParams, Link } from "react-router-dom";
import { useGetPropertyById } from "../hooks/useProperty";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import UploadDocumentForm from "@/components/document/UploadDocumentForm";
import CreateTransmissionModal from "@/components/transmission/CreateTransmissionModal";
import { useGetDocuments, useDeleteDocument } from "@/hooks/useDocument";
import type { IDocument } from "@/types/document";

const PropertyPage = () => {
  const { id } = useParams<{ id: string }>();
  const { property, isPending, isError } = useGetPropertyById(id!);
  const [isUploading, setIsUploading] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const { documents } = useGetDocuments(id!);
  const { mutate: deleteDocument, isPending: isDeletingDocument } = useDeleteDocument();

  const handleDeleteDocument = (documentId: string) => {
    if (!window.confirm("Supprimer ce document ? Cette action est irréversible.")) return;
    deleteDocument(documentId, { onError: () => window.alert("Impossible de supprimer ce document.") });
  };

  if (isPending)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  if (isError) return <div className="p-8">Erreur</div>;
  if (!property) return <div className="p-8">Bien introuvable</div>;

  return (
    <div className="min-h-dvh bg-gray-50">
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
            <button
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => setIsUploading(true)}
            >
              + Ajouter un document
            </button>
          </div>
          {isUploading && <UploadDocumentForm propertyId={id!} onClose={() => setIsUploading(false)} />}
          {documents && documents.length > 0 ? (
            documents.map((doc: IDocument) => (
              <div key={doc.id} className="flex items-center justify-between gap-2 py-3 border-b border-gray-100">
                <a
                  href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/documents/${doc.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 truncate text-sm text-blue-600 hover:underline"
                >
                  {doc.title}
                </a>
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
            <p className="text-sm text-gray-400">Aucun document pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
