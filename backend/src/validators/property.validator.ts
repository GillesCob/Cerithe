import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(1),
  address: z.string(),
  houseType: z.enum(["HOUSE", "APPARTMENT"]),
  surface: z.number(),
  numberOfLevels: z.number(),
});

export type PropertyDto = z.infer<typeof propertySchema>;
