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
  };

  it("crée le bien avec le profileId fourni", async () => {
    prismaMock.property.create.mockResolvedValue({ id: "property-1", ...data, profileId } as any);

    const result = await createProperty(data, profileId);

    expect(prismaMock.property.create).toHaveBeenCalledWith({
      data: { ...data, profileId },
    });
    expect(result).toEqual({ id: "property-1", ...data, profileId });
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
  it("renvoie une liste vide si aucun profileId n'est fourni", async () => {
    prismaMock.property.findMany.mockResolvedValue([]);

    const result = await allOwnerProperties([]);

    expect(prismaMock.property.findMany).toHaveBeenCalledWith({ where: { profileId: { in: [] } } });
    expect(result).toEqual([]);
  });

  it("agrège les biens de plusieurs profileIds (comportement actuel, cf cerithe-dette.md)", async () => {
    const properties = [
      { id: "property-1", profileId: "profile-1" },
      { id: "property-2", profileId: "profile-2" },
    ];
    prismaMock.property.findMany.mockResolvedValue(properties as any);

    const result = await allOwnerProperties(["profile-1", "profile-2"]);

    expect(prismaMock.property.findMany).toHaveBeenCalledWith({
      where: { profileId: { in: ["profile-1", "profile-2"] } },
    });
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
