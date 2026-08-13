import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, Loader2 } from "lucide-react";
import { isAxiosError } from "axios";
import { useGetRoomById, useUpdateRoom, useDeleteRoom } from "../hooks/useRoom";
import { useGetPropertyById } from "../hooks/useProperty";
import RoomTypeSelector from "@/components/room/RoomTypeSelector";
import { ROOM_TYPE_CONFIG } from "@/components/room/roomTypeConfig";
import { getPropertyLevels, levelLabel } from "@/utils/propertyLevels";
import type { RoomType } from "@/types/room";

interface IRoomForm {
  name: string;
  level: number;
  surface: number | "";
}

const RoomFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { room, isPending: isLoadingRoom } = useGetRoomById(id!);
  const { property, isPending: isLoadingProperty } = useGetPropertyById(room?.propertyId ?? "");
  const { mutate: updateRoom, isPending: isUpdating } = useUpdateRoom();
  const { mutate: deleteRoom, isPending: isDeleting } = useDeleteRoom();
  const { register, handleSubmit, reset } = useForm<IRoomForm>();
  const [roomType, setRoomType] = useState<RoomType>("BEDROOM");
  const [isPickingType, setIsPickingType] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (room) {
      reset({ name: room.name, level: room.level, surface: room.surface ?? "" });
      setRoomType(room.roomType);
    }
  }, [room, reset]);

  const handleDelete = () => {
    if (
      !window.confirm(
        "Supprimer cette pièce ? Tous les documents associés seront supprimés avec elle. Cette action est irréversible.",
      )
    )
      return;
    deleteRoom(
      { id: id!, propertyId: room!.propertyId },
      {
        onSuccess: () => navigate(`/property/${room!.propertyId}`),
        onError: () => window.alert("Impossible de supprimer cette pièce."),
      },
    );
  };

  const onSubmit = (data: IRoomForm) => {
    setErrorMessage(null);
    updateRoom(
      {
        id: id!,
        propertyId: room!.propertyId,
        name: data.name,
        level: Number(data.level),
        roomType,
        surface: data.surface === "" ? undefined : Number(data.surface),
      },
      {
        onSuccess: () => navigate(`/room/${id}`),
        onError: (error) => {
          setErrorMessage(isAxiosError(error) ? (error.response?.data?.message ?? "Erreur inconnue") : "Erreur inconnue");
        },
      },
    );
  };

  if (isLoadingRoom || isLoadingProperty || !room || !property)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );

  const levels = getPropertyLevels(property);
  const typeConfig = ROOM_TYPE_CONFIG[roomType];
  const TypeIcon = typeConfig.icon;

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
      <div className="w-full max-w-md">
        <Link
          to={`/room/${id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} />
          Retour
        </Link>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-2xl border border-gray-200 w-full flex flex-col gap-4"
        >
          <h1 className="text-xl font-bold text-gray-900">Modifier la pièce</h1>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <input
            {...register("name")}
            placeholder="Nom de la pièce"
            className="border border-gray-200 rounded-lg px-4 py-2 text-base"
          />

          <select {...register("level")} className="border border-gray-200 rounded-lg px-4 py-2 text-base">
            {levels.map((level) => (
              <option key={level} value={level}>
                {levelLabel(level)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setIsPickingType(true)}
            className="flex items-center gap-2.5 border border-gray-200 rounded-lg px-4 py-2 text-left"
          >
            <TypeIcon size={18} className="text-blue-600 shrink-0" />
            <span className="flex-1 text-base text-gray-900">{typeConfig.label}</span>
            <ChevronDown size={16} className="text-gray-400 shrink-0" />
          </button>
          {isPickingType && (
            <RoomTypeSelector
              value={roomType}
              onConfirm={(t) => {
                setRoomType(t);
                setIsPickingType(false);
              }}
              onClose={() => setIsPickingType(false)}
            />
          )}

          <div className="relative">
            <input
              {...register("surface")}
              type="number"
              placeholder="Surface"
              className="border border-gray-200 rounded-lg px-4 py-2 pr-10 text-base w-full"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
              m²
            </span>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdating ? "Enregistrement..." : "Enregistrer"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-sm border border-red-200 text-red-600 rounded-lg py-2.5 hover:bg-red-50 disabled:opacity-50"
          >
            {isDeleting ? "Suppression..." : "Supprimer cette pièce"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomFormPage;
