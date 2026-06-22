import { useParams, Link } from "react-router-dom";
import { useGetPropertyById } from "../hooks/useProperty";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import UploadDocumentForm from "@/components/document/UploadDocumentForm";
import { useGetDocuments } from "@/hooks/useDocument";
import type { IDocument } from "@/types/document";

const PropertyPage = () => {
  const { id } = useParams<{ id: string }>();
  const { property, isPending, isError } = useGetPropertyById(id!);
  const [isUploading, setIsUploading] = useState(false);
  const { documents } = useGetDocuments(id!);

  if (isPending) return <div className="p-8">Chargement...</div>;
  if (isError) return <div className="p-8">Erreur</div>;
  if (!property) return <div className="p-8">Bien introuvable</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8">
          <ArrowLeft size={16} />
          Retour
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.name}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-10">
          <span>{property.address}</span>
          <span>·</span>
          <span>{property.houseType === "HOUSE" ? "Maison" : "Appartement"}</span>
          <span>·</span>
          <span>{property.surface} m²</span>
          <span>·</span>
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
              <a
                key={doc.id}
                href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/documents/${doc.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 border-b border-gray-100 text-sm text-blue-600 hover:underline block"
              >
                {doc.title}
              </a>
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
