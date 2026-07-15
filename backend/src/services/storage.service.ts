import { supabase } from "../lib/supabase";

export const uploadDocument = async (buffer: Buffer, fileName: string, mimeType: string) => {
  const uniqueFileName = `${Date.now()}-${fileName}`;
  const { data, error } = await supabase.storage
    .from("documents")
    .upload(uniqueFileName, buffer, { contentType: mimeType });
  if (error) {
    console.error(error);
    throw new Error("Erreur lors de la sauvegarde");
  }
  return data;
};

export const deleteDocumentFile = async (path: string) => {
  const { error } = await supabase.storage.from("documents").remove([path]);
  if (error) {
    console.error(error);
    throw new Error("Erreur lors de la suppression du fichier");
  }
};
