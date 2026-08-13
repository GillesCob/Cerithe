import apiClient from "../lib/axios";

// propertyId/roomId exclusifs (jamais les deux), cf backend createDocumentController.
export const uploadDocument = async ({ propertyId, roomId, file }: { propertyId?: string; roomId?: string; file: File }) => {
  const formData = new FormData();
  formData.append("file", file);
  if (propertyId) formData.append("propertyId", propertyId);
  if (roomId) formData.append("roomId", roomId);
  formData.append("title", file.name);
  formData.append("documentType", "BLUEPRINT");

  const response = await apiClient.post("/api/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getDocumentsByProperty = async (propertyId: string) => {
  const response = await apiClient.get(`/api/documents/${propertyId}`);
  return response.data;
};

export const getDocumentsByRoom = async (roomId: string) => {
  const response = await apiClient.get(`/api/documents/room/${roomId}`);
  return response.data;
};

export const deleteDocument = async (id: string) => {
  const response = await apiClient.delete(`/api/documents/${id}`);
  return response.data;
};

export const downloadDocument = async (id: string) => {
  const response = await apiClient.get(`/api/documents/${id}/download`, { responseType: "blob" });
  return response.data as Blob;
};
