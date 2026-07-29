import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

const STORAGE_DIR = "/app/storage/documents";

export const uploadDocument = async (buffer: Buffer, fileName: string) => {
  await mkdir(STORAGE_DIR, { recursive: true });
  const uniqueFileName = `${Date.now()}-${fileName}`;
  await writeFile(path.join(STORAGE_DIR, uniqueFileName), buffer);
  return { path: uniqueFileName };
};

export const deleteDocumentFile = async (fileName: string) => {
  await unlink(path.join(STORAGE_DIR, fileName));
};
