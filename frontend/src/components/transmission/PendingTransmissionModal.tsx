import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useCancelTransmission } from "@/hooks/useTransmission";

interface IPendingTransmissionModalProps {
  propertyId: string;
  token: string;
  recipientEmail: string;
  onClose: () => void;
}

const PendingTransmissionModal = ({ propertyId, token, recipientEmail, onClose }: IPendingTransmissionModalProps) => {
  const queryClient = useQueryClient();
  const { mutate: cancelTransmission, isPending: isCancelling } = useCancelTransmission(token);
  const [isCopied, setIsCopied] = useState(false);

  const transmissionUrl = `${window.location.origin}/transmission/${token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(transmissionUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleCancel = () => {
    cancelTransmission(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["activeTransmission", propertyId] });
        onClose();
      },
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transmission en cours du bien vers {recipientEmail}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">Lien à transmettre au futur propriétaire</p>
          <Button variant="outline" onClick={handleCopy} className="w-full">
            {isCopied ? "Copié !" : "Copier le lien"}
          </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isCancelling}>
            {isCancelling ? "Annulation..." : "Annuler cette transmission"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PendingTransmissionModal;
