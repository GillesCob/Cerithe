import { z } from "zod";

export const transmissionchema = z.object({
  recipientEmail: z.string().email({ message: "Email invalide" }),
});

export type ProfileDto = z.infer<typeof transmissionchema>;
