import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDeep, mockReset, type DeepMockProxy } from "vitest-mock-extended";
import type { PrismaClient } from "../../prisma/generated/client.js";
import { Prisma } from "../../prisma/generated/client.js";
import prisma from "../lib/prisma";
import { createTransmissionToken } from "./transmission.service";

vi.mock("../lib/prisma", () => ({
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("createTransmissionToken", () => {
  const ownerId = "owner-1";
  const propertyId = "property-1";
  const ownerEmail = "owner@example.com";
  const recipientEmail = "recipient@example.com";
  const baseProperty = { id: propertyId, profileId: ownerId } as any;

  const mockOwnerAndProperty = () => {
    prismaMock.profile.findUnique.mockResolvedValue({ user: { email: ownerEmail } } as any);
    prismaMock.property.findUnique.mockResolvedValue(baseProperty);
  };

  it("crée la transmission dans le cas nominal", async () => {
    mockOwnerAndProperty();
    prismaMock.transmissionToken.findFirst.mockResolvedValue(null);
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.transmissionToken.create.mockResolvedValue({ id: "token-1" } as any);

    const result = await createTransmissionToken(recipientEmail, ownerId, propertyId);

    expect(prismaMock.transmissionToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ recipientEmail, propertyId, recipientProfileId: null }),
    });
    expect(result).toEqual({ id: "token-1" });
  });

  it("rejette si l'email destinataire est le même que le propriétaire", async () => {
    prismaMock.profile.findUnique.mockResolvedValue({ user: { email: ownerEmail } } as any);

    await expect(createTransmissionToken(ownerEmail, ownerId, propertyId)).rejects.toThrow(
      "L'email du destinataire est le même que le propriétaire actuel du bien.",
    );
  });

  it("rejette si le bien n'existe pas", async () => {
    prismaMock.profile.findUnique.mockResolvedValue({ user: { email: ownerEmail } } as any);
    prismaMock.property.findUnique.mockResolvedValue(null);

    await expect(createTransmissionToken(recipientEmail, ownerId, propertyId)).rejects.toThrow("Bien introuvable");
  });

  it("rejette si l'appelant n'est pas le propriétaire du bien", async () => {
    prismaMock.profile.findUnique.mockResolvedValue({ user: { email: ownerEmail } } as any);
    prismaMock.property.findUnique.mockResolvedValue({ id: propertyId, profileId: "someone-else" } as any);

    await expect(createTransmissionToken(recipientEmail, ownerId, propertyId)).rejects.toThrow("Non autorisé");
  });

  it("rejette avec le message 'déjà en cours' si une transmission pending/clicked existe", async () => {
    mockOwnerAndProperty();
    prismaMock.transmissionToken.findFirst.mockResolvedValue({ status: "pending", token: "existing-token" } as any);

    await expect(createTransmissionToken(recipientEmail, ownerId, propertyId)).rejects.toThrow(
      "Une transmission est déjà en cours pour ce bien.",
    );
  });

  it("rejette avec le message 'confirmation finale' si une transmission accepted existe", async () => {
    mockOwnerAndProperty();
    prismaMock.transmissionToken.findFirst.mockResolvedValue({ status: "accepted", token: "existing-token" } as any);

    await expect(createTransmissionToken(recipientEmail, ownerId, propertyId)).rejects.toThrow(
      "Une transmission est en attente de votre confirmation finale.",
    );
  });

  it("gère la race condition (P2002) en renvoyant la même erreur 'déjà en cours'", async () => {
    mockOwnerAndProperty();
    prismaMock.transmissionToken.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ status: "pending", token: "concurrent-token" } as any);
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.transmissionToken.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "7.8.0",
      }),
    );

    await expect(createTransmissionToken(recipientEmail, ownerId, propertyId)).rejects.toThrow(
      "Une transmission est déjà en cours pour ce bien.",
    );
  });

  it("laisse recipientProfileId à null si le destinataire est inconnu", async () => {
    mockOwnerAndProperty();
    prismaMock.transmissionToken.findFirst.mockResolvedValue(null);
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.transmissionToken.create.mockResolvedValue({ id: "token-1" } as any);

    await createTransmissionToken(recipientEmail, ownerId, propertyId);

    expect(prismaMock.transmissionToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ recipientProfileId: null }),
    });
  });

  it("résout recipientProfileId si le destinataire a exactement un profil", async () => {
    mockOwnerAndProperty();
    prismaMock.transmissionToken.findFirst.mockResolvedValue(null);
    prismaMock.user.findUnique.mockResolvedValue({ profile: [{ id: "recipient-profile-1" }] } as any);
    prismaMock.transmissionToken.create.mockResolvedValue({ id: "token-1" } as any);

    await createTransmissionToken(recipientEmail, ownerId, propertyId);

    expect(prismaMock.transmissionToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ recipientProfileId: "recipient-profile-1" }),
    });
  });

  it("laisse recipientProfileId à null si le destinataire a plusieurs profils", async () => {
    mockOwnerAndProperty();
    prismaMock.transmissionToken.findFirst.mockResolvedValue(null);
    prismaMock.user.findUnique.mockResolvedValue({
      profile: [{ id: "recipient-profile-1" }, { id: "recipient-profile-2" }],
    } as any);
    prismaMock.transmissionToken.create.mockResolvedValue({ id: "token-1" } as any);

    await createTransmissionToken(recipientEmail, ownerId, propertyId);

    expect(prismaMock.transmissionToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ recipientProfileId: null }),
    });
  });
});
