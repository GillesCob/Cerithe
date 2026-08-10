import apiClient from "../lib/axios";
import type { IProfile } from "../types/profile";

export const getAllProfiles = async () => {
  const response = await apiClient.get("/api/profiles");
  return response.data;
};

export interface IProfilePayload {
  role: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phoneNumber?: string;
}

export const createProfile = async (data: IProfilePayload) => {
  const response = await apiClient.post("/api/profiles", data);
  return response.data as IProfile;
};

export const updateProfile = async (id: string, data: Partial<IProfilePayload>) => {
  const response = await apiClient.put(`/api/profiles/${id}`, data);
  return response.data as IProfile;
};

export const deleteProfile = async (id: string) => {
  await apiClient.delete(`/api/profiles/${id}`);
};

export const deleteAccount = async () => {
  await apiClient.delete("/api/users/me");
};
