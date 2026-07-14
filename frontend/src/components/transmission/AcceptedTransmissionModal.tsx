import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useConfirmTransmission, useCancelTransmission } from "@/hooks/useTransmission";

interface IAcceptedTransmissionModalProps {
  propertyId: string;
  token: string;
  onClose: () => void;
}

const AcceptedTransmissionModal = ({ propertyId, token, onClose }: IAcceptedTransmissionModalProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    mutate: confirmTransmission,
    isPending: isConfirming,
    isError: isConfirmError,
    error: confirmError,
  } = useConfirmTransmission(token);
  const {
    mutate: cancelTransmission,
    isPending: isCancelling,
    isError: isCancelError,
    error: cancelError,
  } = useCancelTransmission(token);

  const errorMessage = isConfirmError
    ? isAxiosError(confirmError)
      ? (confirmError.response?.data?.message ?? "Erreur inconnue")
      : "Erreur inconnue"
    : isCancelError
      ? isAxiosError(cancelError)
        ? (cancelError.response?.data?.message ?? "Erreur inconnue")
        : "Erreur inconnue"
      : null;

  // Après confirmation, le bien vient de quitter ce profil : on ne reste pas sur sa propre page.
  const handleConfirmSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["activeTransmission", propertyId] });
    onClose();
    navigate("/dashboard");
  };

  // Après refus, le bien reste au vendeur : on referme simplement la modale, pas besoin de rediriger.
  const handleCancelSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["activeTransmission", propertyId] });
    onClose();
  };

  const handleConfirm = () => confirmTransmission(undefined, { onSuccess: handleConfirmSuccess });
  const handleCancel = () => cancelTransmission(undefined, { onSuccess: handleCancelSuccess });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transmettre ce bien</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Le destinataire a accepté la transmission. Valider est définitif et transfère immédiatement le bien : le
          destinataire devient le nouveau propriétaire.
        </p>
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isCancelling || isConfirming}>
            {isCancelling ? "Refus..." : "Refuser"}
          </Button>
          <Button onClick={handleConfirm} disabled={isConfirming || isCancelling}>
            {isConfirming ? "Validation..." : "Valider définitivement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptedTransmissionModal;
