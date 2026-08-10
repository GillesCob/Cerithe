import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  deleteAccount,
  type IProfilePayload,
} from "../services/profileService";

export const useGetAllProfiles = () => {
  const {
    data: profiles,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["profiles"],
    queryFn: getAllProfiles,
  });
  return { profiles, isPending, isError };
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IProfilePayload) => createProfile(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profiles"] }),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IProfilePayload> }) => updateProfile(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profiles"] }),
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProfile(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profiles"] }),
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: deleteAccount,
  });
};
