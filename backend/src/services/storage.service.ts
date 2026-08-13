import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

// Defaut aligne sur le volume Docker monte en prod (docker-compose.yml, WORKDIR /app). Override
// via .env pour le dev local (npm run dev, hors Docker), ou /app n'existe pas.
const STORAGE_DIR = process.env.STORAGE_DIR ?? "/app/storage/documents";

export const uploadDocument = async (buffer: Buffer, fileName: string) => {
  await mkdir(STORAGE_DIR, { recursive: true });
  const uniqueFileName = `${Date.now()}-${fileName}`;
  await writeFile(path.join(STORAGE_DIR, uniqueFileName), buffer);
  return { path: uniqueFileName };
};

export const deleteDocumentFile = async (fileName: string) => {
  await unlink(path.join(STORAGE_DIR, fileName));
};
