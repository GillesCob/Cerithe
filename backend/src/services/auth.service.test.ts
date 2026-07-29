import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDeep, mockReset, type DeepMockProxy } from "vitest-mock-extended";
import type { PrismaClient } from "../../prisma/generated/client.js";
import prisma from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/hash";
import { sendPasswordResetEmail } from "../lib/resend";
import {
  generateTokens,
  login,
  refreshAccessToken,
  register,
  requestPasswordReset,
  resetPassword,
  userConnectedInfos,
} from "./auth.service";

vi.mock("../lib/prisma", () => ({
  default: mockDeep<PrismaClient>(),
}));

vi.mock("../lib/hash", () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
  hashResetToken: vi.fn((token: string) => `hashed-${token}`),
}));

vi.mock("../lib/resend", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const hashPasswordMock = vi.mocked(hashPassword);
const verifyPasswordMock = vi.mocked(verifyPassword);
const sendPasswordResetEmailMock = vi.mocked(sendPasswordResetEmail);

beforeEach(() => {
  mockReset(prismaMock);
  hashPasswordMock.mockReset();
  verifyPasswordMock.mockReset();
  sendPasswordResetEmailMock.mockReset();
  process.env.JWT_SECRET = "test-secret";
  process.env.JWT_REFRESH_SECRET = "test-refresh-secret";
  process.env.JWT_EXPIRES_IN = "15m";
  process.env.JWT_REFRESH_EXPIRES_IN = "7d";
});

describe("register", () => {
  const email = "gilles@example.com";
  const password = "un-mot-de-passe";

  it("rejette si l'email est déjà utilisé", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "user-1", email } as any);

    await expect(register(email, password)).rejects.toThrow("L'email est déjà utilisé");
  });

  it("crée le user avec le mot de passe hashé, ne sélectionne jamais le password", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    hashPasswordMock.mockResolvedValue("hashed-password");
    prismaMock.user.create.mockResolvedValue({ id: "user-1", email, createdAt: new Date() } as any);

    await register(email, password);

    expect(hashPasswordMock).toHaveBeenCalledWith(password);
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: { email, password: "hashed-password" },
      select: { id: true, email: true, createdAt: true },
    });
  });
});

describe("login", () => {
  const email = "gilles@example.com";
  const password = "un-mot-de-passe";

  it("rejette avec le même message si l'email est inconnu", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(login(email, password)).rejects.toThrow("Identifiants incorrects");
  });

  it("rejette avec le même message si le mot de passe est incorrect", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "user-1", email, password: "hashed" } as any);
    verifyPasswordMock.mockResolvedValue(false);

    await expect(login(email, password)).rejects.toThrow("Identifiants incorrects");
  });

  it("renvoie le user sans le champ password en cas de succès", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "user-1", email, password: "hashed" } as any);
    verifyPasswordMock.mockResolvedValue(true);

    const result = await login(email, password);

    expect(result).toEqual({ id: "user-1", email });
  });
});

describe("generateTokens / refreshAccessToken", () => {
  it("refreshAccessToken rejette si le refresh token est invalide", async () => {
    await expect(refreshAccessToken("token-invalide")).rejects.toThrow();
  });

  it("refreshAccessToken régénère un access et un refresh token pour le même userId", async () => {
    const { refreshToken } = await generateTokens("user-1");

    const result = await refreshAccessToken(refreshToken);

    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
  });
});

describe("userConnectedInfos", () => {
  it("rejette si le user n'existe pas", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(userConnectedInfos("user-1")).rejects.toThrow("User non trouvé");
  });

  it("renvoie le user sans le champ password", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "user-1", email: "a@b.com", password: "hashed" } as any);

    const result = await userConnectedInfos("user-1");

    expect(result).toEqual({ id: "user-1", email: "a@b.com" });
  });
});

describe("requestPasswordReset", () => {
  const email = "gilles@example.com";

  it("ne fait rien et n'envoie aucun email si l'email est inconnu (pas de fuite d'existence)", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await requestPasswordReset(email);

    expect(prismaMock.passwordResetToken.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.passwordResetToken.create).not.toHaveBeenCalled();
    expect(sendPasswordResetEmailMock).not.toHaveBeenCalled();
  });

  it("invalide les anciens tokens, en crée un nouveau et envoie l'email si l'email est connu", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "user-1", email } as any);

    await requestPasswordReset(email);

    expect(prismaMock.passwordResetToken.deleteMany).toHaveBeenCalledWith({ where: { userId: "user-1" } });
    expect(prismaMock.passwordResetToken.create).toHaveBeenCalled();
    expect(sendPasswordResetEmailMock).toHaveBeenCalledWith(email, expect.any(String));
  });
});

describe("resetPassword", () => {
  const rawToken = "raw-token";
  const newPassword = "nouveau-mot-de-passe";

  it("rejette si le token n'existe pas", async () => {
    prismaMock.passwordResetToken.findUnique.mockResolvedValue(null);

    await expect(resetPassword(rawToken, newPassword)).rejects.toThrow(
      "Lien de réinitialisation invalide ou déjà utilisé",
    );
  });

  it("supprime le token expiré avant de rejeter", async () => {
    prismaMock.passwordResetToken.findUnique.mockResolvedValue({
      id: "token-1",
      userId: "user-1",
      expiresAt: new Date(Date.now() - 1000),
    } as any);

    await expect(resetPassword(rawToken, newPassword)).rejects.toThrow(
      "Lien de réinitialisation expiré, faites une nouvelle demande",
    );
    expect(prismaMock.passwordResetToken.delete).toHaveBeenCalledWith({ where: { id: "token-1" } });
  });

  it("met à jour le mot de passe et supprime le token si celui-ci est valide", async () => {
    prismaMock.passwordResetToken.findUnique.mockResolvedValue({
      id: "token-1",
      userId: "user-1",
      expiresAt: new Date(Date.now() + 1000),
    } as any);
    hashPasswordMock.mockResolvedValue("hashed-new-password");

    await resetPassword(rawToken, newPassword);

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { password: "hashed-new-password" },
    });
    expect(prismaMock.passwordResetToken.delete).toHaveBeenCalledWith({ where: { id: "token-1" } });
  });
});
