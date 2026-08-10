import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useGetAllProfiles, useCreateProfile, useUpdateProfile, useDeleteProfile, useDeleteAccount } from "@/hooks/useProfile";
import { useActiveProfileStore } from "@/stores/activeProfileStore";
import { useAuth } from "@/hooks/useAuth";
import type { IProfile } from "@/types/profile";
import { Loader2 } from "lucide-react";

const roleLabel = (role: string) => (role === "PROFESSIONAL" ? "Professionnel" : "Particulier");

interface IProfileFormState {
  role: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
}

const emptyForm: IProfileFormState = { role: "INDIVIDUAL", firstName: "", lastName: "", companyName: "", phoneNumber: "" };

const AccountPage = () => {
  const { profiles, isPending } = useGetAllProfiles();
  const { setActiveProfileId } = useActiveProfileStore();
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();
  const deleteProfile = useDeleteProfile();
  const deleteAccount = useDeleteAccount();

  const [editing, setEditing] = useState<IProfile | null>(null);
  const [editForm, setEditForm] = useState<IProfileFormState>(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<IProfileFormState>(emptyForm);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

  if (isPending)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );

  const list: IProfile[] = profiles ?? [];
  const usedRoles = new Set(list.map((p) => p.role));
  const availableRoleForCreate = usedRoles.has("INDIVIDUAL") ? "PROFESSIONAL" : "INDIVIDUAL";

  const openEdit = (p: IProfile) => {
    setEditing(p);
    setEditForm({
      role: p.role,
      firstName: p.firstName ?? "",
      lastName: p.lastName ?? "",
      companyName: p.companyName ?? "",
      phoneNumber: "",
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    await updateProfile.mutateAsync({
      id: editing.id,
      data: {
        firstName: editForm.firstName || undefined,
        lastName: editForm.lastName || undefined,
        companyName: editForm.role === "PROFESSIONAL" ? editForm.companyName || undefined : undefined,
      },
    });
    setEditing(null);
  };

  const removeProfile = async (p: IProfile) => {
    await deleteProfile.mutateAsync(p.id);
  };

  const submitCreate = async () => {
    const created = await createProfile.mutateAsync({
      role: availableRoleForCreate,
      firstName: createForm.firstName || undefined,
      lastName: createForm.lastName || undefined,
      companyName: availableRoleForCreate === "PROFESSIONAL" ? createForm.companyName || undefined : undefined,
      phoneNumber: createForm.phoneNumber || undefined,
    });
    setActiveProfileId(created.id);
    setCreating(false);
    setCreateForm(emptyForm);
  };

  const submitDeleteAccount = async () => {
    await deleteAccount.mutateAsync();
    await handleLogout();
    navigate("/login");
  };

  return (
    <div className="min-h-dvh bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Mon compte</h2>
        <p className="text-sm text-gray-600 mb-6">Consultez et modifiez les informations de votre profil.</p>

        {list.map((p) => (
          <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{roleLabel(p.role)}</h3>
              <button onClick={() => openEdit(p)} className="text-sm text-blue-600 hover:underline">
                Modifier
              </button>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Prénom</span>
                <span className="text-gray-900">{p.firstName || "Non renseigné"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nom</span>
                <span className="text-gray-900">{p.lastName || "Non renseigné"}</span>
              </div>
              {p.role === "PROFESSIONAL" && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Nom entreprise</span>
                  <span className="text-gray-900">{p.companyName || "Non renseigné"}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-900">{p.email}</span>
              </div>
            </div>
            {list.length > 1 && (
              <button
                onClick={() => removeProfile(p)}
                className="mt-3 text-sm text-red-600 hover:underline"
              >
                Supprimer ce profil
              </button>
            )}
          </div>
        ))}

        {list.length < 2 && (
          <button
            onClick={() => setCreating(true)}
            className="w-full border border-dashed border-gray-300 rounded-xl p-5 text-left hover:bg-white mb-4"
          >
            <h3 className="font-semibold text-gray-900">Ajouter un second profil</h3>
            <p className="text-sm text-gray-600">
              Créez un profil {roleLabel(availableRoleForCreate).toLowerCase()} pour séparer deux usages distincts.
            </p>
          </button>
        )}

        <div className="border border-red-200 bg-red-50 rounded-xl p-5 mt-8">
          <h3 className="font-semibold text-red-900 mb-1">Supprimer mon compte</h3>
          <p className="text-sm text-red-700 mb-3">
            Supprime définitivement votre compte, vos profils et l'ensemble de vos biens associés. Action
            irréversible.
          </p>
          <Button variant="destructive" onClick={() => setConfirmDeleteAccount(true)}>
            Supprimer mon compte
          </Button>
        </div>
      </main>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le profil</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {editForm.role === "PROFESSIONAL" && (
              <label className="block text-sm">
                Nom entreprise
                <input
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={editForm.companyName}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                />
              </label>
            )}
            <label className="block text-sm">
              Prénom
              <input
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              Nom
              <input
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
              />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Annuler
            </Button>
            <Button onClick={saveEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un profil {roleLabel(availableRoleForCreate).toLowerCase()}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {availableRoleForCreate === "PROFESSIONAL" && (
              <label className="block text-sm">
                Nom entreprise
                <input
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={createForm.companyName}
                  onChange={(e) => setCreateForm({ ...createForm, companyName: e.target.value })}
                />
              </label>
            )}
            <label className="block text-sm">
              Prénom
              <input
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={createForm.firstName}
                onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              Nom
              <input
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={createForm.lastName}
                onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              Téléphone
              <input
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={createForm.phoneNumber}
                onChange={(e) => setCreateForm({ ...createForm, phoneNumber: e.target.value })}
              />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreating(false)}>
              Annuler
            </Button>
            <Button onClick={submitCreate}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDeleteAccount} onOpenChange={setConfirmDeleteAccount}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer définitivement votre compte ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Tous vos profils, biens et documents seront supprimés. Cette action est irréversible.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteAccount(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={submitDeleteAccount}>
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountPage;
