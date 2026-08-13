import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { isAxiosError } from "axios";
import { useUploadDocument } from "@/hooks/useDocument";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB, cohérent avec upload.middleware.ts et le vhost Nginx

// propertyId/roomId exclusifs (l'un des deux fourni selon le contexte d'appel, jamais les deux),
// cf createDocumentController cote back.
interface IUploadDocumentFormProps {
  propertyId?: string;
  roomId?: string;
  onClose: () => void;
}

const UploadDocumentForm = ({ propertyId, roomId, onClose }: IUploadDocumentFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useUploadDocument();

  const handleFileChange = (selected: File | null) => {
    setErrorMessage(
      selected && selected.size > MAX_FILE_SIZE ? "Fichier trop volumineux (10MB maximum)" : null,
    );
    setFile(selected && selected.size <= MAX_FILE_SIZE ? selected : null);
  };

  const handleSubmit = () => {
    if (!file) return;
    setErrorMessage(null);
    mutate(
      { propertyId, roomId, file },
      {
        onSuccess: onClose,
        onError: (error) => {
          // Un fichier trop volumineux peut être rejeté par Nginx (client_max_body_size) avant même
          // d'atteindre le backend : la réponse est alors une page d'erreur Nginx, pas du JSON avec
          // un champ "message", d'où ce cas spécial sur le code HTTP, indépendant du corps de la réponse.
          if (isAxiosError(error) && error.response?.status === 413) {
            setErrorMessage("Fichier trop volumineux (10MB maximum)");
            return;
          }
          setErrorMessage(isAxiosError(error) ? (error.response?.data?.message ?? "Erreur inconnue") : "Erreur inconnue");
        },
      },
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-2.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-600 hover:bg-gray-50 text-left"
        >
          {file ? file.name : "Cliquer pour choisir un fichier (PDF, JPG, PNG, 10MB max)"}
        </button>
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
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
