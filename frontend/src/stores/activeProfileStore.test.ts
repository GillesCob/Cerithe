import { beforeEach, describe, expect, it } from "vitest";
import { useActiveProfileStore } from "./activeProfileStore";

beforeEach(() => {
  useActiveProfileStore.setState({ activeProfileId: null });
});

describe("useActiveProfileStore", () => {
  it("demarre a null quand aucun profil actif n'a ete choisi", () => {
    expect(useActiveProfileStore.getState().activeProfileId).toBeNull();
  });

  it("setActiveProfileId met a jour le profil actif", () => {
    useActiveProfileStore.getState().setActiveProfileId("profile-1");

    expect(useActiveProfileStore.getState().activeProfileId).toBe("profile-1");
  });

  it("setActiveProfileId remplace un profil actif deja present par le nouveau", () => {
    useActiveProfileStore.getState().setActiveProfileId("profile-1");
    useActiveProfileStore.getState().setActiveProfileId("profile-2");

    expect(useActiveProfileStore.getState().activeProfileId).toBe("profile-2");
  });

  it("clearActiveProfileId revient a null", () => {
    useActiveProfileStore.getState().setActiveProfileId("profile-1");
    useActiveProfileStore.getState().clearActiveProfileId();

    expect(useActiveProfileStore.getState().activeProfileId).toBeNull();
  });
});
