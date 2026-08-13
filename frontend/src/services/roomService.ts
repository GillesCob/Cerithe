import apiClient from "../lib/axios";
import type { RoomType } from "../types/room";

export const createRooms = async (propertyId: string, rooms: { level: number; roomType: RoomType; quantity: number }[]) => {
  const response = await apiClient.post("/api/rooms", { propertyId, rooms });
  return response.data;
};

export const getRoomById = async (id: string) => {
  const response = await apiClient.get(`/api/rooms/${id}`);
  return response.data;
};

export const updateRoom = async (
  id: string,
  name?: string,
  level?: number,
  roomType?: RoomType,
  surface?: number,
) => {
  const response = await apiClient.patch(`/api/rooms/${id}`, { name, level, roomType, surface });
  return response.data;
};

export const deleteRoom = async (id: string) => {
  const response = await apiClient.delete(`/api/rooms/${id}`);
  return response.data;
};
