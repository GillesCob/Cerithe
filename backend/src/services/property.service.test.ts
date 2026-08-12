import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDeep, mockReset, type DeepMockProxy } from "vitest-mock-extended";
import type { PrismaClient } from "../../prisma/generated/client.js";
import prisma from "../lib/prisma";
import {
  allOwnerProperties,
  createProperty,
  deleteProperty,
  getPropertyById,
  updateProperty,
  transferPropertyOwner,
} from "./property.service";

vi.mock("../lib/prisma", () => ({
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("createProperty", () => {
  const profileId = "profile-1";
  const data = {
    name: "Maison",
    address: "1 rue du Test",
    houseType: "HOUSE" as const,
    surface: 90,
    numberOfLevels: 2,
    profileId,
  };

  it("crée le bien avec le profileId fourni dans data", async () => {
    prismaMock.property.create.mockResolvedValue({ id: "property-1", ...data } as any);

    const result = await createProperty(data);

    expect(prismaMock.property.create).toHaveBeenCalledWith({ data });
    expect(result).toEqual({ id: "property-1", ...data });
  });
});

describe("getPropertyById", () => {
  const propertyId = "property-1";
  const userId = "user-1";

  it("rejette si le bien n'existe pas", async () => {
    prismaMock.property.findUnique.mockResolvedValue(null);

    await expect(getPropertyById(propertyId, userId)).rejects.toThrow("Bien non trouvé");
  });

  it("rejette si le bien appartient à un autre profil", async () => {
    prismaMock.property.findUnique.mockResolvedValue({
      id: propertyId,
      profile: { userId: "someone-else" },
    } as any);

    await expect(getPropertyById(propertyId, userId)).rejects.toThrow("Non autorisé");
  });

  it("renvoie le bien si l'appelant est bien le propriétaire", async () => {
    const property = { id: propertyId, profile: { userId } };
    prismaMock.property.findUnique.mockResolvedValue(property as any);

    const result = await getPropertyById(propertyId, userId);

    expect(result).toEqual(property);
  });
});

describe("allOwnerProperties", () => {
  it("renvoie une liste vide si le profil actif n'a aucun bien", async () => {
    prismaMock.property.findMany.mockResolvedValue([]);

    const result = await allOwnerProperties("profile-1");

    expect(prismaMock.property.findMany).toHaveBeenCalledWith({ where: { profileId: "profile-1" } });
    expect(result).toEqual([]);
  });

  it("filtre strictement sur le profil actif, jamais les biens des autres profils (cf cerithe-decisions-produit.md, 29/07)", async () => {
    const properties = [{ id: "property-1", profileId: "profile-1" }];
    prismaMock.property.findMany.mockResolvedValue(properties as any);

    const result = await allOwnerProperties("profile-1");

    expect(prismaMock.property.findMany).toHaveBeenCalledWith({ where: { profileId: "profile-1" } });
    expect(result).toEqual(properties);
  });
});

describe("updateProperty", () => {
  const propertyId = "property-1";
  const userId = "user-1";
  const data = { name: "Nouveau nom" };

  it("rejette si le bien n'existe pas", async () => {
    prismaMock.property.findUnique.mockResolvedValue(null);

    await expect(updateProperty(propertyId, userId, data)).rejects.toThrow("Bien non trouvé");
  });

  it("rejette si l'appelant n'est pas le propriétaire", async () => {
    prismaMock.property.findUnique.mockResolvedValue({
      id: propertyId,
      profile: { userId: "someone-else" },
    } as any);

    await expect(updateProperty(propertyId, userId, data)).rejects.toThrow("Non autorisé");
  });

  it("met à jour le bien si l'appelant est le propriétaire", async () => {
    prismaMock.property.findUnique.mockResolvedValue({ id: propertyId, profile: { userId } } as any);
    prismaMock.property.update.mockResolvedValue({ id: propertyId, ...data } as any);

    const result = await updateProperty(propertyId, userId, data);

    expect(prismaMock.property.update).toHaveBeenCalledWith({ where: { id: propertyId }, data });
    expect(result).toEqual({ id: propertyId, ...data });
  });
});

describe("transferPropertyOwner", () => {
  const propertyId = "property-1";
  const userId = "user-1";
  const previousOwnerId = "profile-1";
  const newProfileId = "profile-2";

  it("rejette si le bien n'existe pas", async () => {
    prismaMock.property.findUnique.mockResolvedValue(null);

    await expect(transferPropertyOwner(propertyId, userId, newProfileId)).rejects.toThrow("Bien non trouvé");
  });

  it("rejette si l'appelant n'est pas le propriétaire actuel du bien", async () => {
    prismaMock.property.findUnique.mockResolvedValue({
      id: propertyId,
      profileId: previousOwnerId,
      profile: { userId: "someone-else" },
    } as any);

    await expect(transferPropertyOwner(propertyId, userId, newProfileId)).rejects.toThrow("Non autorisé");
  });

  it("rejette si le nouveau profil n'appartient pas au même compte", async () => {
    prismaMock.property.findUnique.mockResolvedValue({
      id: propertyId,
      profileId: previousOwnerId,
      profile: { userId },
    } as any);
    // getProfileById interroge prisma.profile.findUnique : profil existant mais compte différent.
    prismaMock.profile.findUnique.mockResolvedValue({ id: newProfileId, userId: "someone-else" } as any);

    await expect(transferPropertyOwner(propertyId, userId, newProfileId)).rejects.toThrow("Non autorisé");
  });

  it("rejette si le nouveau profil est déjà le propriétaire actuel", async () => {
    prismaMock.property.findUnique.mockResolvedValue({
      id: propertyId,
      profileId: previousOwnerId,
      profile: { userId },
    } as any);
    prismaMock.profile.findUnique.mockResolvedValue({ id: previousOwnerId, userId } as any);

    await expect(transferPropertyOwner(propertyId, userId, previousOwnerId)).rejects.toThrow(
      "Ce bien appartient déjà à ce profil",
    );
  });

  it("rejette si une transmission est en cours sur ce bien", async () => {
    prismaMock.property.findUnique.mockResolvedValue({
      id: propertyId,
      profileId: previousOwnerId,
      profile: { userId },
    } as any);
    prismaMock.profile.findUnique.mockResolvedValue({ id: newProfileId, userId } as any);
    prismaMock.transmissionToken.findUnique.mockResolvedValue({ id: "token-1", activePropertyId: propertyId } as any);

    await expect(transferPropertyOwner(propertyId, userId, newProfileId)).rejects.toThrow(
      "Une transmission est en cours sur ce bien, impossible de changer de propriétaire",
    );
  });

  it("transfère le bien et crée une ligne Transmission si tous les contrôles passent", async () => {
    prismaMock.property.findUnique.mockResolvedValue({
      id: propertyId,
      profileId: previousOwnerId,
      profile: { userId },
    } as any);
    prismaMock.profile.findUnique.mockResolvedValue({ id: newProfileId, userId } as any);
    prismaMock.transmissionToken.findUnique.mockResolvedValue(null);
    const updatedProperty = { id: propertyId, profileId: newProfileId };
    prismaMock.$transaction.mockImplementation(((ops: unknown[]) => Promise.all(ops)) as any);
    prismaMock.property.update.mockResolvedValue(updatedProperty as any);
    prismaMock.transmission.create.mockResolvedValue({ id: "transmission-1" } as any);

    const result = await transferPropertyOwner(propertyId, userId, newProfileId);

    expect(prismaMock.property.update).toHaveBeenCalledWith({
      where: { id: propertyId },
      data: { profileId: newProfileId },
    });
    expect(prismaMock.transmission.create).toHaveBeenCalledWith({
      data: { propertyId, previousOwnerId, newOwnerId: newProfileId },
    });
    expect(result).toEqual(updatedProperty);
  });
});

describe("deleteProperty", () => {
  const propertyId = "property-1";
  const userId = "user-1";

  it("rejette si le bien n'existe pas", async () => {
    prismaMock.property.findUnique.mockResolvedValue(null);

    await expect(deleteProperty(propertyId, userId)).rejects.toThrow("Bien non trouvé");
  });

  it("rejette si l'appelant n'est pas le propriétaire", async () => {
    prismaMock.property.findUnique.mockResolvedValue({
      id: propertyId,
      profile: { userId: "someone-else" },
    } as any);

    await expect(deleteProperty(propertyId, userId)).rejects.toThrow("Non autorisé");
  });

  it("supprime le bien si l'appelant est le propriétaire", async () => {
    prismaMock.property.findUnique.mockResolvedValue({ id: propertyId, profile: { userId } } as any);
    prismaMock.property.delete.mockResolvedValue({ id: propertyId } as any);

    await deleteProperty(propertyId, userId);

    expect(prismaMock.property.delete).toHaveBeenCalledWith({ where: { id: propertyId } });
  });
});
