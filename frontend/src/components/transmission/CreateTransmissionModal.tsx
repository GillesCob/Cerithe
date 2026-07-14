import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { useCreateTransmission, useGetActiveTransmissionForProperty } from "@/hooks/useTransmission";
import PendingTransmissionModal from "./PendingTransmissionModal";
import AcceptedTransmissionModal from "./AcceptedTransmissionModal";

interface ICreateTransmissionModalProps {
  propertyId: string;
  onClose: () => void;
}

interface ICreateTransmissionForm {
  recipientEmail: string;
}

const CreateTransmissionModal = ({ propertyId, onClose }: ICreateTransmissionModalProps) => {
  const { activeTransmission, isPending: isLoadingActive } = useGetActiveTransmissionForProperty(propertyId);
  const { register, handleSubmit } = useForm<ICreateTransmissionForm>();
  const { mutate, isPending, isError, error, isSuccess } = useCreateTransmission(propertyId);

  const onSubmit = (form: ICreateTransmissionForm) => {
    mutate(form.recipientEmail);
  };

  const errorMessage =
    isError && isAxiosError(error) ? (error.response?.data?.message ?? "Erreur lors de la création de la transmission") : null;

  // Chargement du statut de la transmission en cours, avant de savoir quelle vue afficher.
  if (isLoadingActive) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transmettre ce bien</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Chargement...</p>
        </DialogContent>
      </Dialog>
    );
  }

  // Le destinataire a accepté : le vendeur doit valider définitivement ou refuser.
  if (activeTransmission?.status === "accepted") {
    return <AcceptedTransmissionModal propertyId={propertyId} token={activeTransmission.token} onClose={onClose} />;
  }

  // Une transmission est en cours (pending ou clicked) : on montre le lien existant plutôt qu'un nouveau formulaire.
  // Couvre aussi le cas "on vient de créer le lien" : la création invalide activeTransmission, qui se
  // recharge avec la transmission fraîchement créée et bascule ici automatiquement.
  if (activeTransmission) {
    return (
      <PendingTransmissionModal
        propertyId={propertyId}
        token={activeTransmission.token}
        recipientEmail={activeTransmission.recipientEmail}
        onClose={onClose}
      />
    );
  }

  // Aucune transmission en cours : formulaire de création classique.
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transmettre ce bien</DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          // Bascule automatiquement sur PendingTransmissionModal dès que activeTransmission se recharge
          // (invalidé par la création) : ce texte n'est visible qu'un très bref instant, le temps du refetch.
          <p className="text-sm text-gray-500">Lien généré...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              type="email"
              placeholder="Email du destinataire"
              className="w-full border rounded-md px-3 py-2 text-sm"
              {...register("recipientEmail", { required: true })}
            />
            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
          </form>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {isSuccess ? "Fermer" : "Annuler"}
          </Button>
          {!isSuccess && (
            <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
              {isPending ? "Envoi..." : "Générer le lien"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransmissionModal;
