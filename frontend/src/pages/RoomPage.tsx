import { useParams, Link } from "react-router-dom";
import { useGetRoomById } from "../hooks/useRoom";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import UploadDocumentForm from "@/components/document/UploadDocumentForm";
import FeatureComingSoonButton from "@/components/shared/FeatureComingSoonButton";
import { useGetDocumentsByRoom, useDeleteDocument, useDownloadDocument } from "@/hooks/useDocument";
import type { IDocument } from "@/types/document";
import Navbar from "@/components/layout/Navbar";
import { ROOM_TYPE_CONFIG } from "@/components/room/roomTypeConfig";
import { levelLabel } from "@/utils/propertyLevels";
import type { RoomType } from "@/types/room";

// Champs pas encore renseignables (finitions), grises avec badge "i" + tooltip, cf mockup page-piece.html.
const SoonInfoBadge = () => (
  <span className="relative group inline-flex">
    <span className="w-[13px] h-[13px] rounded-full bg-gray-100 text-gray-400 text-[9px] font-bold flex items-center justify-center cursor-default">
      i
    </span>
    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-max bg-gray-800 text-white text-[11px] font-medium px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap">
      En développement
    </span>
  </span>
);

const RoomPage = () => {
  const { id } = useParams<{ id: string }>();
  const { room, isPending, isError } = useGetRoomById(id!);
  const [isUploading, setIsUploading] = useState(false);
  const { documents } = useGetDocumentsByRoom(id!);
  const { mutate: deleteDocument, isPending: isDeletingDocument } = useDeleteDocument();
  const { mutate: downloadDocument, isPending: isDownloadingDocument } = useDownloadDocument();

  const handleDeleteDocument = (documentId: string) => {
    if (!window.confirm("Supprimer ce document ? Cette action est irréversible.")) return;
    deleteDocument(documentId, { onError: () => window.alert("Impossible de supprimer ce document.") });
  };

  const handleDownloadDocument = (documentId: string) => {
    downloadDocument(documentId, { onError: () => window.alert("Impossible d'ouvrir ce document.") });
  };

  if (isPending)
    return (
      <div className="min-h-dvh bg-gray-50">
        <Navbar />
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-gray-400" />
        </div>
      </div>
    );
  if (isError || !room)
    return (
      <div className="min-h-dvh bg-gray-50">
        <Navbar />
        <div className="p-8">Pièce introuvable</div>
      </div>
    );

  const typeConfig = ROOM_TYPE_CONFIG[room.roomType as RoomType];
  const Icon = typeConfig.icon;

  return (
    <div className="min-h-dvh bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link
          to={`/property/${room.propertyId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={16} />
          Retour au bien
        </Link>

        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <Icon size={22} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
          </div>
          <Link
            to={`/room-form/${id}`}
            className="text-sm border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Modifier
          </Link>
        </div>
        <p className="text-sm text-gray-500 mb-10">{levelLabel(room.level)}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white border border-gray-200 rounded-2xl p-5 mb-2">
          <div>
            <p className="text-[11.5px] uppercase tracking-wide text-gray-400 mb-1">Type</p>
            <p className="text-sm font-medium text-gray-900">{typeConfig.label}</p>
          </div>
          <div>
            <p className="text-[11.5px] uppercase tracking-wide text-gray-400 mb-1">Niveau</p>
            <p className="text-sm font-medium text-gray-900">{levelLabel(room.level)}</p>
          </div>
          <div>
            <p className="text-[11.5px] uppercase tracking-wide text-gray-400 mb-1">Surface</p>
            <p className="text-sm font-medium text-gray-900">{room.surface !== null ? `${room.surface} m²` : "—"}</p>
          </div>
          <div>
            <p className="text-[11.5px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
              Finition sol <SoonInfoBadge />
            </p>
            <p className="text-sm font-medium text-gray-400">—</p>
          </div>
          <div>
            <p className="text-[11.5px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
              Finition mur <SoonInfoBadge />
            </p>
            <p className="text-sm font-medium text-gray-400">—</p>
          </div>
          <div>
            <p className="text-[11.5px] uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-1">
              Finition plafond <SoonInfoBadge />
            </p>
            <p className="text-sm font-medium text-gray-400">—</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
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
          {isUploading && <UploadDocumentForm roomId={id!} onClose={() => setIsUploading(false)} />}
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
              <p className="text-gray-400 text-sm mb-4">Ajoutez ici les documents relatifs à cette pièce.</p>
              <button
                onClick={() => setIsUploading(true)}
                className="inline-block px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Ajouter un document
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8 mb-20">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Projet</h2>
          <FeatureComingSoonButton label="+ Ajouter un projet" />
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
