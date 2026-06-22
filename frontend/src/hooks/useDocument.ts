import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDocumentsByProperty, uploadDocument } from "../services/documentService";

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
