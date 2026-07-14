import type { IProfile } from "../../types/profile";

interface IProfileSelectionModalProps {
  profiles: IProfile[];
  onSelect: (profileId: string) => void;
}

const ProfileSelectionModal = ({ profiles, onSelect }: IProfileSelectionModalProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center space-y-4">
        <p className="text-sm text-gray-600">Vous avez plusieurs profils. Choisissez celui qui reçoit ce bien :</p>
        <div className="space-y-2">
          {profiles.map((profile) => {
            // firstName/lastName vides (profil auto-créé à l'inscription, jamais complété) : repli sur l'email.
            const label = profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.email;
            return (
              <button
                key={profile.id}
                onClick={() => onSelect(profile.id)}
                className="w-full text-sm border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileSelectionModal;
