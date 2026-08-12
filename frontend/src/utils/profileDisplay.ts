import type { IProfile } from "@/types/profile";

export const roleLabel = (role: string) => (role === "PROFESSIONAL" ? "Professionnel" : "Particulier");

export const displayName = (profile: IProfile) =>
  profile.role === "PROFESSIONAL" ? (profile.companyName ?? profile.firstName ?? "") : (profile.firstName ?? "");
