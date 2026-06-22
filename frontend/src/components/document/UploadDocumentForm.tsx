import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUploadDocument } from "@/hooks/useDocument";

interface IUploadDocumentFormProps {
  propertyId: string;
  onClose: () => void;
}

const UploadDocumentForm = ({ propertyId: propertyId, onClose }: IUploadDocumentFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending } = useUploadDocument();

  const handleSubmit = () => {
    if (!file) return;
    mutate({ propertyId, file }, { onSuccess: onClose });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>
        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!file || isPending}>
            {isPending ? "Envoi..." : "Envoyer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentForm;
