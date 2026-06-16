import type { Express } from "multer";

declare namespace Express {
  interface Request {
    user?: { userId: string };
    file?: Express.Multer.File;
  }
}
