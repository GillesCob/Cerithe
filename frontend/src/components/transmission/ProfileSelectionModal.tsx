import type { IProfile } from "../../types/profile";

interface IProfileSelectionModalProps {
  profiles: IProfile[];
  onSelect: (profileId: string) => void;
}

const ProfileSelectionModal = ({ profiles, onSelect }: IProfileSelectionModalProps) => {
  return (
    <div>
      <p>Choisissez votre profil</p>
      {profiles.map((profile) => (
        <button key={profile.id} onClick={() => onSelect(profile.id)}>
          {profile.firstName} {profile.lastName}
        </button>
      ))}
    </div>
  );
};

export default ProfileSelectionModal;
