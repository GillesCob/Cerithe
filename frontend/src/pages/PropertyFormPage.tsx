import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateProperty } from "../hooks/useProperty";

interface IPropertyForm {
  name: string;
  address: string;
  houseType: "HOUSE" | "APPARTMENT";
  surface: number;
  numberOfLevels: number;
}

const PropertyFormPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateProperty();
  const { register, handleSubmit } = useForm<IPropertyForm>();

  const onSubmit = (data: IPropertyForm) => {
    mutate(
      { ...data, surface: Number(data.surface), numberOfLevels: Number(data.numberOfLevels) },
      { onSuccess: () => navigate("/dashboard") },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl border border-gray-200 w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold text-gray-900">Ajouter un bien</h1>

        <input {...register("name")} placeholder="Nom du bien" className="border border-gray-200 rounded-lg px-4 py-2 text-sm" />
        <input {...register("address")} placeholder="Adresse" className="border border-gray-200 rounded-lg px-4 py-2 text-sm" />

        <select {...register("houseType")} className="border border-gray-200 rounded-lg px-4 py-2 text-sm">
          <option value="HOUSE">Maison</option>
          <option value="APPARTMENT">Appartement</option>
        </select>

        <input
          {...register("surface")}
          type="number"
          placeholder="Surface (m²)"
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
        />
        <input
          {...register("numberOfLevels")}
          type="number"
          placeholder="Nombre de niveaux"
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
        />

        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Création..." : "Créer le bien"}
        </button>
      </form>
    </div>
  );
};

export default PropertyFormPage;
