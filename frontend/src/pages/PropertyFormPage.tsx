import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  useCreateProperty,
  useDeleteProperty,
  useGetPropertyById,
  useUpdateProperty,
  useTransferPropertyOwner,
} from "../hooks/useProperty";
import { useActiveProfileStore } from "@/stores/activeProfileStore";
import { useGetAllProfiles } from "@/hooks/useProfile";
import PropertyOwnerSelector from "@/components/property/PropertyOwnerSelector";
import { Button } from "@/components/ui/button";
import { isAxiosError } from "axios";

interface IPropertyForm {
  name: string;
  address: string;
  houseType: "HOUSE" | "APPARTMENT";
  surface: number;
  numberOfLevels: number;
}

const PropertyFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const activeProfileId = useActiveProfileStore((state) => state.activeProfileId);
  const setActiveProfileId = useActiveProfileStore((state) => state.setActiveProfileId);
  const { property, isPending: isLoadingProperty } = useGetPropertyById(id ?? "");
  const { profiles } = useGetAllProfiles();
  const { mutate: createProperty, isPending: isCreating } = useCreateProperty();
  const { mutate: updateProperty, isPending: isUpdating } = useUpdateProperty();
  const { mutate: transferPropertyOwner, isPending: isTransferring } = useTransferPropertyOwner();
  const { mutate: deleteProperty, isPending: isDeleting } = useDeleteProperty();
  const { register, handleSubmit, reset } = useForm<IPropertyForm>();
  const [ownerId, setOwnerId] = useState<string>("");
  const [transferError, setTransferError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [numberOfBasementLevels, setNumberOfBasementLevels] = useState<0 | 1>(0);
  const isPending = isCreating || isUpdating || isTransferring;
  const backTo = isEditing ? `/property/${id}` : "/dashboard";
  const canTransferOwner = isEditing && (profiles?.length ?? 0) > 1;

  const handleDelete = () => {
    if (!window.confirm("Supprimer ce bien ? Tous les documents associés seront supprimés avec lui. Cette action est irréversible."))
      return;
    deleteProperty(id!, {
      onSuccess: () => navigate("/dashboard"),
      onError: () => window.alert("Impossible de supprimer ce bien."),
    });
  };

  // En mode édition, on préremplit le formulaire une fois le bien chargé, y
  // compris le propriétaire actuel du sélecteur (reste local jusqu'à "Valider").
  useEffect(() => {
    if (property) {
      reset(property);
      setOwnerId(property.profileId);
      setNumberOfBasementLevels(property.numberOfBasementLevels > 0 ? 1 : 0);
    }
  }, [property, reset]);

  const onSubmit = (data: IPropertyForm) => {
    const payload = {
      ...data,
      surface: Number(data.surface),
      numberOfLevels: Number(data.numberOfLevels),
      numberOfBasementLevels,
    };
    setTransferError(null);
    setSubmitError(null);

    if (isEditing) {
      const ownerChanged = canTransferOwner && property && ownerId !== property.profileId;
      updateProperty(
        { id, ...payload },
        {
          onSuccess: () => {
            if (!ownerChanged) {
              navigate(`/property/${id}`);
              return;
            }
            // Le changement de propriétaire n'est tenté qu'une fois les autres
            // champs enregistrés avec succès, jamais l'inverse : en cas d'échec
            // ici, les autres champs restent quand même sauvegardés.
            transferPropertyOwner(
              { id: id!, profileId: ownerId },
              {
                onSuccess: () => {
                  // Le profil actif bascule sur le nouveau proprietaire : sinon "Mes biens"
                  // reste filtre sur l'ancien profil et le bien semble avoir disparu au retour.
                  setActiveProfileId(ownerId);
                  navigate(`/property/${id}`);
                },
                onError: () =>
                  setTransferError(
                    "Les autres modifications ont été enregistrées, mais le changement de propriétaire a échoué. Réessayez.",
                  ),
              },
            );
          },
          onError: (error) => {
            setSubmitError(isAxiosError(error) ? (error.response?.data?.message ?? "Erreur inconnue") : "Erreur inconnue");
          },
        },
      );
    } else {
      if (!activeProfileId) return;
      createProperty(
        { ...payload, profileId: activeProfileId },
        {
          onSuccess: () => navigate("/dashboard"),
          onError: (error) => {
            setSubmitError(isAxiosError(error) ? (error.response?.data?.message ?? "Erreur inconnue") : "Erreur inconnue");
          },
        },
      );
    }
  };

  if (isEditing && isLoadingProperty)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
      <div className="w-full max-w-md">
        <Link to={backTo} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft size={16} />
          Retour
        </Link>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-2xl border border-gray-200 w-full flex flex-col gap-4"
        >
          <h1 className="text-xl font-bold text-gray-900">{isEditing ? "Modifier le bien" : "Ajouter un bien"}</h1>

          {canTransferOwner && profiles && (
            <PropertyOwnerSelector profiles={profiles} value={ownerId} onChange={setOwnerId} />
          )}

          {transferError && <p className="text-sm text-red-600">{transferError}</p>}
          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <input {...register("name")} placeholder="Nom du bien" className="border border-gray-200 rounded-lg px-4 py-2 text-base" />
          <input {...register("address")} placeholder="Adresse" className="border border-gray-200 rounded-lg px-4 py-2 text-base" />

          <select {...register("houseType")} className="border border-gray-200 rounded-lg px-4 py-2 text-base">
            <option value="HOUSE">Maison</option>
            <option value="APPARTMENT">Appartement</option>
          </select>

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
          <div className="relative">
            <input
              {...register("numberOfLevels")}
              type="number"
              placeholder="Nombre de niveaux"
              className="border border-gray-200 rounded-lg px-4 py-2 pr-20 text-base w-full"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
              niveau(x)
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-500">Sous-sol</span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={numberOfBasementLevels === 0 ? "default" : "outline"}
                onClick={() => setNumberOfBasementLevels(0)}
              >
                Aucun
              </Button>
              <Button
                type="button"
                size="sm"
                variant={numberOfBasementLevels === 1 ? "default" : "outline"}
                onClick={() => setNumberOfBasementLevels(1)}
              >
                1 niveau (-1)
              </Button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Enregistrement..." : isEditing ? "Enregistrer" : "Créer le bien"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-sm border border-red-200 text-red-600 rounded-lg py-2.5 hover:bg-red-50 disabled:opacity-50"
            >
              {isDeleting ? "Suppression..." : "Supprimer ce bien"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PropertyFormPage;
