import { supabase } from "../lib/supabase";

export const uploadDocument = async (buffer: Buffer, fileName: string, mimeType: string) => {
  const newDocument = supabase.storage.from("documents").upload(fileName, buffer, { contentType: mimeType });
  if (!newDocument) throw new Error("Erreur lors de la sauvegarde");
  return newDocument;
};
