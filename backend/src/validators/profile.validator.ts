import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z
    .string()
    .min(1)
    .nullish()
    .transform((value) => value ?? null),
  phoneNumber: z
    .string()
    .min(1)
    .nullish()
    .transform((value) => value ?? null),
  role: z.enum(["PROFESSIONAL", "INDIVIDUAL"]),
});

export type ProfileDto = z.infer<typeof profileSchema>;
