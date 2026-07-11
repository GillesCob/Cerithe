import apiClient from "../lib/axios";

export const getAllProfiles = async () => {
  const response = await apiClient.get("/api/profiles");
  return response.data;
};
