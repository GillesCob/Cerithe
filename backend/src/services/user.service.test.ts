import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDeep, mockReset, type DeepMockProxy } from "vitest-mock-extended";
import type { PrismaClient } from "../../prisma/generated/client.js";
import prisma from "../lib/prisma";
import { deleteUser } from "./user.service";

vi.mock("../lib/prisma", () => ({
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("deleteUser", () => {
  const userId = "user-1";

  it("rejette si l'utilisateur n'existe pas", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(deleteUser(userId)).rejects.toThrow("Utilisateur non trouvé");
    expect(prismaMock.user.delete).not.toHaveBeenCalled();
  });

  it("supprime l'utilisateur s'il existe (cascade tous les profils et leurs biens en base)", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: userId } as any);
    prismaMock.user.delete.mockResolvedValue({ id: userId } as any);

    await deleteUser(userId);

    expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
  });
});
