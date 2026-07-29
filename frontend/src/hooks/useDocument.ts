import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDocument, downloadDocument, getDocumentsByProperty, uploadDocument } from "../services/documentService";

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ propertyId, file }: { propertyId: string; file: File }) => uploadDocument(propertyId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};

export const useGetDocuments = (propertyId: string) => {
  const {
    data: documents,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["documents", propertyId],
    queryFn: () => getDocumentsByProperty(propertyId),
    enabled: !!propertyId,
  });
  return { documents, isPending, isError };
};

export const useDownloadDocument = () => {
  return useMutation({
    mutationFn: downloadDocument,
    onSuccess: (blob) => {
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, "_blank", "noopener,noreferrer");
      // Révoqué après un délai plutôt qu'immédiatement : le nouvel onglet a besoin de temps pour charger le blob.
      setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};
