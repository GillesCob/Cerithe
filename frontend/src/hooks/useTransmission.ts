import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptTransmission,
  cancelTransmission,
  confirmTransmission,
  createTransmission,
  getLatestTransmissionForProperty,
  getTransmissionByToken,
  selectRecipientProfile,
} from "../services/transmissionService";

export const useCreateTransmission = (propertyId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipientEmail: string) => createTransmission(propertyId, recipientEmail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeTransmission", propertyId] });
    },
  });
};

export const useGetActiveTransmissionForProperty = (propertyId: string) => {
  const {
    data: activeTransmission,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: ["activeTransmission", propertyId],
    queryFn: () => getLatestTransmissionForProperty(propertyId),
    enabled: !!propertyId,
  });
  return { activeTransmission, isPending, isSuccess };
};

export const useGetTransmissionByToken = (token: string, isAuthenticated: boolean) => {
  const {
    data: transmission,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["transmission", token],
    queryFn: () => getTransmissionByToken(token),
    enabled: !!token && isAuthenticated,
    // Une erreur ici (mauvais compte connecté, token invalide) est définitive, pas transitoire : retenter
    // 3 fois par défaut ne fait qu'allonger l'attente avant d'afficher le message d'erreur pour rien.
    retry: false,
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

export const useConfirmTransmission = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => confirmTransmission(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transmission", token] });
    },
  });
};
