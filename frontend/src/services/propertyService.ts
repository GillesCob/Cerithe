import apiClient from "../lib/axios";

export const addProperty = async (name: string, address: string, houseType: string, surface: number, numberOfLevels: number) => {
  const response = await apiClient.post("/api/property", {
    name,
    address,
    houseType,
    surface,
    numberOfLevels,
  });
  return response.data;
};

export const getPropertyById = async (id: string) => {
  const response = await apiClient.get(`/api/properties/${id}`);
  return response.data;
};

export const getAllProperties = async () => {
  const response = await apiClient.get(`/api/properties`);
  return response.data;
};

export const updateProperty = async (
  id: string,
  name?: string,
  address?: string,
  houseType?: string,
  surface?: number,
  numberOfLevels?: number,
) => {
  const response = await apiClient.put(`/api/property/${id}`, {
    name,
    address,
    houseType,
    surface,
    numberOfLevels,
  });
  return response.data;
};

export const deleteProperty = async (id: string) => {
  const response = await apiClient.delete(`/api/property/${id}`);
  return response.data;
};
