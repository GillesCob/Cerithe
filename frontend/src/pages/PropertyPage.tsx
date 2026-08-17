import { useParams, Link } from "react-router-dom";
import { useGetPropertyById } from "../hooks/useProperty";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import UploadDocumentForm from "@/components/document/UploadDocumentForm";
import CreateTransmissionModal from "@/components/transmission/CreateTransmissionModal";
import AddRoomsModal from "@/components/room/AddRoomsModal";
import FeatureComingSoonButton from "@/components/shared/FeatureComingSoonButton";
import { ROOM_TYPE_CONFIG } from "@/components/room/roomTypeConfig";
import { getPropertyLevels, levelLabel } from "@/utils/propertyLevels";
import { useGetDocuments, useDeleteDocument, useDownloadDocument } from "@/hooks/useDocument";
import type { IDocument } from "@/types/document";
import type { IRoom } from "@/types/room";
import Navbar from "@/components/layout/Navbar";

const PropertyPage = () => {
  const { id } = useParams<{ id: string }>();
  const { property, isPending, isError } = useGetPropertyById(id!);
  const [isUploading, setIsUploading] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isAddingRooms, setIsAddingRooms] = useState(false);
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

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white border border-gray-200 rounded-2xl p-5 mb-10">
          <div>
            <p className="text-[11.5px] uppercase tracking-wide text-gray-400 mb-1">Adresse</p>
            <p className="text-sm font-medium text-gray-900">{property.address}</p>
          </div>
          <div>
            <p className="text-[11.5px] uppercase tracking-wide text-gray-400 mb-1">Type</p>
            <p className="text-sm font-medium text-gray-900">{property.houseType === "HOUSE" ? "Maison" : "Appartement"}</p>
          </div>
          <div>
            <p className="text-[11.5px] uppercase tracking-wide text-gray-400 mb-1">Surface</p>
            <p className="text-sm font-medium text-gray-900">{property.surface} m²</p>
          </div>
          <div>
            <p className="text-[11.5px] uppercase tracking-wide text-gray-400 mb-1">Niveaux</p>
            <p className="text-sm font-medium text-gray-900">
              {property.numberOfLevels} niveau{property.numberOfLevels > 1 ? "x" : ""}
            </p>
          </div>
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

          {getPropertyLevels(property)
            .map((level) => ({
              level,
              rooms: (property.room ?? []).filter((room: IRoom) => room.level === level),
            }))
            .filter(({ rooms }) => rooms.length > 0)
            .map(({ level, rooms }) => (
              <div key={level} className="mb-3.5 border border-gray-200 rounded-xl p-3.5 pb-2">
                <h3 className="text-[13px] font-bold text-gray-900 mb-2.5">{levelLabel(level)}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {rooms.map((room: IRoom) => {
                    const RoomIcon = ROOM_TYPE_CONFIG[room.roomType].icon;
                    return (
                      <Link
                        key={room.id}
                        to={`/room/${room.id}`}
                        className="flex items-center gap-2.5 border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50"
                      >
                        <RoomIcon size={20} className="text-blue-600 shrink-0" />
                        <span className="text-sm font-medium text-gray-900 truncate">{room.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

          <div className="flex flex-wrap gap-3 mt-6 mb-20">
            <button
              type="button"
              onClick={() => setIsAddingRooms(true)}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {(property.room ?? []).length > 0 ? "Gérer mes pièces" : "+ Ajouter une pièce"}
            </button>
            <FeatureComingSoonButton label="+ Ajouter des travaux" />
            <FeatureComingSoonButton label="Vue 3D du bien" />
          </div>
          {isAddingRooms && <AddRoomsModal property={property} onClose={() => setIsAddingRooms(false)} />}
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
