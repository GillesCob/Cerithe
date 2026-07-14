import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[a-z]/, "Doit contenir au moins une minuscule")
    .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
    .regex(/\d/, "Doit contenir au moins un chiffre")
    .regex(/[@$!%*?&]/, "Doit contenir au moins un caractère spécial (@$!%*?&)"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[a-z]/, "Doit contenir au moins une minuscule")
    .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
    .regex(/\d/, "Doit contenir au moins un chiffre")
    .regex(/[@$!%*?&]/, "Doit contenir au moins un caractère spécial (@$!%*?&)"),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
