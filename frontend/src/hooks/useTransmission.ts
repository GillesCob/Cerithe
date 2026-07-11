import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptTransmission,
  cancelTransmission,
  createTransmission,
  getTransmissionByToken,
  selectRecipientProfile,
} from "../services/transmissionService";

export const useCreateTransmission = (propertyId: string) => {
  return useMutation({
    mutationFn: (recipientEmail: string) => createTransmission(propertyId, recipientEmail),
  });
};

export const useGetTransmissionByToken = (token: string) => {
  const {
    data: transmission,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["transmission", token],
    queryFn: () => getTransmissionByToken(token),
    enabled: !!token,
  });
  return { transmission, isPending, isError, error };
};

export const useSelectRecipientProfile = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileId: string) => selectRecipientProfile(token, profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transmission", token] });
    },
  });
};

export const useAcceptTransmission = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => acceptTransmission(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transmission", token] });
    },
  });
};

export const useCancelTransmission = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cancelTransmission(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transmission", token] });
    },
  });
};
