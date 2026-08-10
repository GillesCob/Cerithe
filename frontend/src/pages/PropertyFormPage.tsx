import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCreateProperty, useDeleteProperty, useGetPropertyById, useUpdateProperty } from "../hooks/useProperty";
import { useActiveProfileStore } from "@/stores/activeProfileStore";

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
  const { property, isPending: isLoadingProperty } = useGetPropertyById(id ?? "");
  const { mutate: createProperty, isPending: isCreating } = useCreateProperty();
  const { mutate: updateProperty, isPending: isUpdating } = useUpdateProperty();
  const { mutate: deleteProperty, isPending: isDeleting } = useDeleteProperty();
  const { register, handleSubmit, reset } = useForm<IPropertyForm>();
  const isPending = isCreating || isUpdating;
  const backTo = isEditing ? `/property/${id}` : "/dashboard";

  const handleDelete = () => {
    if (!window.confirm("Supprimer ce bien ? Tous les documents associés seront supprimés avec lui. Cette action est irréversible."))
      return;
    deleteProperty(id!, {
      onSuccess: () => navigate("/dashboard"),
      onError: () => window.alert("Impossible de supprimer ce bien."),
    });
  };

  // En mode édition, on préremplit le formulaire une fois le bien chargé.
  useEffect(() => {
    if (property) reset(property);
  }, [property, reset]);

  const onSubmit = (data: IPropertyForm) => {
    const payload = { ...data, surface: Number(data.surface), numberOfLevels: Number(data.numberOfLevels) };
    if (isEditing) {
      updateProperty({ id, ...payload }, { onSuccess: () => navigate(`/property/${id}`) });
    } else {
      if (!activeProfileId) return;
      createProperty({ ...payload, profileId: activeProfileId }, { onSuccess: () => navigate("/dashboard") });
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

          <input {...register("name")} placeholder="Nom du bien" className="border border-gray-200 rounded-lg px-4 py-2 text-base" />
          <input {...register("address")} placeholder="Adresse" className="border border-gray-200 rounded-lg px-4 py-2 text-base" />

          <select {...register("houseType")} className="border border-gray-200 rounded-lg px-4 py-2 text-base">
            <option value="HOUSE">Maison</option>
            <option value="APPARTMENT">Appartement</option>
          </select>

          <input
            {...register("surface")}
            type="number"
            placeholder="Surface (m²)"
            className="border border-gray-200 rounded-lg px-4 py-2 text-base"
          />
          <input
            {...register("numberOfLevels")}
            type="number"
            placeholder="Nombre de niveaux"
            className="border border-gray-200 rounded-lg px-4 py-2 text-base"
          />

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
