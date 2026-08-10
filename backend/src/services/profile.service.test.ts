import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDeep, mockReset, type DeepMockProxy } from "vitest-mock-extended";
import type { PrismaClient } from "../../prisma/generated/client.js";
import prisma from "../lib/prisma";
import { deleteProfile, getProfileById, updateProfile } from "./profile.service";

vi.mock("../lib/prisma", () => ({
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("getProfileById", () => {
  const profileId = "profile-1";
  const userId = "user-1";

  it("rejette si le profil n'existe pas", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(null);

    await expect(getProfileById(profileId, userId)).rejects.toThrow("Profil non trouvé");
  });

  it("rejette si le profil appartient à un autre utilisateur", async () => {
    prismaMock.profile.findUnique.mockResolvedValue({ id: profileId, userId: "someone-else" } as any);

    await expect(getProfileById(profileId, userId)).rejects.toThrow("Non autorisé");
  });

  it("renvoie le profil si l'appelant en est bien le propriétaire", async () => {
    const profile = { id: profileId, userId };
    prismaMock.profile.findUnique.mockResolvedValue(profile as any);

    const result = await getProfileById(profileId, userId);

    expect(result).toEqual(profile);
  });
});

describe("updateProfile", () => {
  const profileId = "profile-1";
  const userId = "user-1";
  const data = { firstName: "Gilles" };

  it("rejette si le profil n'existe pas", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(null);

    await expect(updateProfile(profileId, userId, data)).rejects.toThrow("Erreur lors de la mise à jour du profil");
  });

  it("rejette si l'appelant n'est pas le propriétaire", async () => {
    prismaMock.profile.findUnique.mockResolvedValue({ id: profileId, userId: "someone-else" } as any);

    await expect(updateProfile(profileId, userId, data)).rejects.toThrow("Non autorisé");
  });

  it("met à jour le profil si l'appelant est le propriétaire", async () => {
    prismaMock.profile.findUnique.mockResolvedValue({ id: profileId, userId } as any);
    prismaMock.profile.update.mockResolvedValue({ id: profileId, ...data } as any);

    const result = await updateProfile(profileId, userId, data);

    expect(prismaMock.profile.update).toHaveBeenCalledWith({ where: { id: profileId }, data });
    expect(result).toEqual({ id: profileId, ...data });
  });
});

describe("deleteProfile", () => {
  const profileId = "profile-1";
  const userId = "user-1";

  it("rejette si le profil n'existe pas", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(null);

    await expect(deleteProfile(profileId, userId)).rejects.toThrow("Profil non trouvé");
  });

  it("rejette si l'appelant n'est pas le propriétaire", async () => {
    prismaMock.profile.findUnique.mockResolvedValue({ id: profileId, userId: "someone-else" } as any);

    await expect(deleteProfile(profileId, userId)).rejects.toThrow("Non autorisé");
  });

  it("rejette si c'est l'unique profil de l'utilisateur (cf cerithe-decisions-produit.md, 05/08)", async () => {
    prismaMock.profile.findUnique.mockResolvedValue({ id: profileId, userId } as any);
    prismaMock.profile.count.mockResolvedValue(1);

    await expect(deleteProfile(profileId, userId)).rejects.toThrow(
      "Impossible de supprimer votre unique profil, supprimez votre compte à la place.",
    );
    expect(prismaMock.profile.delete).not.toHaveBeenCalled();
  });

  it("supprime le profil si l'appelant est le propriétaire et qu'il reste un autre profil", async () => {
    prismaMock.profile.findUnique.mockResolvedValue({ id: profileId, userId } as any);
    prismaMock.profile.count.mockResolvedValue(2);
    prismaMock.profile.delete.mockResolvedValue({ id: profileId } as any);

    await deleteProfile(profileId, userId);

    expect(prismaMock.profile.delete).toHaveBeenCalledWith({ where: { id: profileId } });
  });
});
