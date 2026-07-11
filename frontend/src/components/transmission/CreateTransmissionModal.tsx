import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { useCreateTransmission, useCancelTransmission } from "@/hooks/useTransmission";

interface ICreateTransmissionModalProps {
  propertyId: string;
  onClose: () => void;
}

interface ICreateTransmissionForm {
  recipientEmail: string;
}

const CreateTransmissionModal = ({ propertyId, onClose }: ICreateTransmissionModalProps) => {
  const { register, handleSubmit } = useForm<ICreateTransmissionForm>();
  const { mutate, isPending, isError, error, isSuccess, data: transmissionUrl, reset } = useCreateTransmission(propertyId);

  const onSubmit = (form: ICreateTransmissionForm) => {
    mutate(form.recipientEmail);
  };

  const errorMessage =
    isError && isAxiosError(error) ? (error.response?.data?.message ?? "Erreur lors de la création de la transmission") : null;
  const conflictToken: string | undefined =
    isError && isAxiosError(error) && error.response?.status === 409 ? error.response.data?.transmissionToken : undefined;

  const { mutate: cancelExisting, isPending: isCancelling } = useCancelTransmission(conflictToken ?? "");
  const handleCancelExisting = () => cancelExisting(undefined, { onSuccess: () => reset() });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transmettre ce bien</DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Lien de transmission généré :</p>
            <input readOnly value={transmissionUrl} className="w-full border rounded-md px-3 py-2 text-sm" onFocus={(e) => e.target.select()} />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              type="email"
              placeholder="Email du destinataire"
              className="w-full border rounded-md px-3 py-2 text-sm"
              {...register("recipientEmail", { required: true })}
            />
            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
            {conflictToken && (
              <Button type="button" variant="outline" onClick={handleCancelExisting} disabled={isCancelling}>
                {isCancelling ? "Annulation..." : "Annuler cette transmission"}
              </Button>
            )}
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
