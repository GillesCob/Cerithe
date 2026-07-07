import { z } from "zod";

export const transmissionchema = z.object({
  recipientEmail: z.string().email({ message: "Email invalide" }),
});

export type ProfileDto = z.infer<typeof transmissionchema>;

export const selectRecipientProfileSchema = z.object({
  profileId: z.string().uuid({ message: "profileId invalide" }),
});

export type SelectRecipientProfileDto = z.infer<typeof selectRecipientProfileSchema>;
