import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IProperty } from "@/types/property";

export const PropertyCard = ({ property }: { property: IProperty }) => {
  return (
    <Card>
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
