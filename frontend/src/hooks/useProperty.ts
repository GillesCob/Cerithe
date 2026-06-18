import { useQuery } from "@tanstack/react-query";
import { getAllProperties } from "../services/propertyService";

export const useProperties = () => {
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
