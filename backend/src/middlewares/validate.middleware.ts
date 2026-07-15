import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const { fieldErrors, formErrors } = result.error.flatten();
      const message = Object.values(fieldErrors).flat()[0] ?? formErrors[0] ?? "Données invalides";
      return res.status(400).json({ message });
    } else {
      next();
    }
  };
};
