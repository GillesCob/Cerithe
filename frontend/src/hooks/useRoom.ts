import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRooms, deleteRoom, getRoomById, updateRoom } from "../services/roomService";
import type { RoomType } from "../types/room";

export const useCreateRooms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ propertyId, rooms }: { propertyId: string; rooms: { level: number; roomType: RoomType; quantity: number }[] }) =>
      createRooms(propertyId, rooms),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["property", variables.propertyId] });
    },
  });
};

export const useGetRoomById = (id: string) => {
  const {
    data: room,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["room", id],
    queryFn: () => getRoomById(id),
    enabled: !!id,
  });
  return { room, isPending, isError };
};

interface IUpdateRoomPayload {
  id: string;
  propertyId: string;
  name?: string;
  level?: number;
  roomType?: RoomType;
  surface?: number;
}

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name, level, roomType, surface }: IUpdateRoomPayload) => updateRoom(id, name, level, roomType, surface),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["room", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["property", variables.propertyId] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; propertyId: string }) => deleteRoom(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["property", variables.propertyId] });
    },
  });
};
