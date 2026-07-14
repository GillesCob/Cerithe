import type { Express } from "multer";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
      file?: Express.Multer.File;
    }
  }
}
