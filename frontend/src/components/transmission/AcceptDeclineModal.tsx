import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface IAcceptDeclineModalProps {
  property: { name: string; address: string; houseType: string; surface: number };
  owner: { firstName: string; lastName: string };
  onAccept: () => void;
  onDecline: () => void;
  isAccepting: boolean;
  isDeclining: boolean;
  errorMessage: string | null;
}

const AcceptDeclineModal = ({
  property,
  owner,
  onAccept,
  onDecline,
  isAccepting,
  isDeclining,
  errorMessage,
}: IAcceptDeclineModalProps) => {
  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transmission de bien</DialogTitle>
        </DialogHeader>
        <div className="space-y-1 text-sm">
          <p>
            {owner.firstName} {owner.lastName} souhaite vous transmettre :
          </p>
          <p className="font-semibold">{property.name}</p>
          <p>{property.address}</p>
          <p>
            {property.houseType === "HOUSE" ? "Maison" : "Appartement"} · {property.surface} m²
          </p>
        </div>
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onDecline} disabled={isDeclining || isAccepting}>
            {isDeclining ? "Refus..." : "Refuser"}
          </Button>
          <Button onClick={onAccept} disabled={isAccepting || isDeclining}>
            {isAccepting ? "Acceptation..." : "Accepter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptDeclineModal;
