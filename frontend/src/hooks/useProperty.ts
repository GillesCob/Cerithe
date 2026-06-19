import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addProperty, getAllProperties } from "../services/propertyService";

export const useGetProperties = () => {
  const {
    data: properties,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: getAllProperties,
  });
  return { properties, isPending, isError };
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
