import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().min(1),
  role: z.enum(["PROFESSIONAL", "INDIVIDUAL"]),
});

export type ProfileDto = z.infer<typeof profileSchema>;
