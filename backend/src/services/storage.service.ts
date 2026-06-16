import { supabase } from "../lib/supabase";

export const uploadDocument = async (buffer: Buffer, fileName: string, mimeType: string) => {
  const { data, error } = await supabase.storage.from("documents").upload(fileName, buffer, { contentType: mimeType });
  if (error) throw new Error("Erreur lors de la sauvegarde");
  return data;
};
