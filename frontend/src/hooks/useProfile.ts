import { useQuery } from "@tanstack/react-query";
import { getAllProfiles } from "../services/profileService";

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
