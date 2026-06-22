import apiClient from "../lib/axios";

export const uploadDocument = async (propertyId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("propertyId", propertyId);
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
