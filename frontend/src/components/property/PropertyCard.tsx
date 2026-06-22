import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IProperty } from "@/types/property";
import { useNavigate } from "react-router-dom";

export const PropertyCard = ({ property }: { property: IProperty }) => {
  const navigate = useNavigate();
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow mb-4" onClick={() => navigate(`/property/${property.id}`)}>
      <CardHeader>
        <CardTitle>{property.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{property.address}</p>
        <p>{property.surface} m²</p>
      </CardContent>
    </Card>
  );
};
