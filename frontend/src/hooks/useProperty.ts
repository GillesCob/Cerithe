import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProperty,
  deleteProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  transferPropertyOwner,
} from "../services/propertyService";

export const useGetProperties = (profileId: string | null) => {
  const {
    data: properties,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["properties", profileId],
    queryFn: () => getAllProperties(profileId as string),
    enabled: !!profileId,
  });
  return { properties, isPending, isError };
};

export const useGetPropertyById = (id: string) => {
  const {
    data: property,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getPropertyById(id),
    enabled: !!id,
  });
  return { property, isPending, isError };
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

interface IUpdatePropertyPayload {
  id: string;
  name?: string;
  address?: string;
  houseType?: string;
  surface?: number;
  numberOfLevels?: number;
  numberOfBasementLevels?: number;
}

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name, address, houseType, surface, numberOfLevels, numberOfBasementLevels }: IUpdatePropertyPayload) =>
      updateProperty(id, name, address, houseType, surface, numberOfLevels, numberOfBasementLevels),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", variables.id] });
    },
  });
};

export const useTransferPropertyOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, profileId }: { id: string; profileId: string }) => transferPropertyOwner(id, profileId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", variables.id] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};
