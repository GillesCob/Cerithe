import apiClient from "../lib/axios";

export const createTransmission = async (propertyId: string, recipientEmail: string): Promise<string> => {
  const response = await apiClient.post<string>(`/api/transmissions/${propertyId}`, { recipientEmail });
  return response.data;
};

export const getTransmissionByToken = async (token: string) => {
  const response = await apiClient.get(`/api/transmissions/${token}`);
  return response.data;
};

export const selectRecipientProfile = async (token: string, profileId: string) => {
  const response = await apiClient.post(`/api/transmissions/${token}/profile`, { profileId });
  return response.data;
};

export const acceptTransmission = async (token: string) => {
  const response = await apiClient.post(`/api/transmissions/${token}/accept`);
  return response.data;
};

export const cancelTransmission = async (token: string) => {
  const response = await apiClient.post(`/api/transmissions/${token}/cancel`);
  return response.data;
};
