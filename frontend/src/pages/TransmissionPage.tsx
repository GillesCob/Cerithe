import { useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { useGetAllProfiles } from "../hooks/useProfile";
import {
  useGetTransmissionByToken,
  useSelectRecipientProfile,
  useAcceptTransmission,
  useCancelTransmission,
} from "../hooks/useTransmission";
import ProfileSelectionModal from "../components/transmission/ProfileSelectionModal";
import AcceptDeclineModal from "../components/transmission/AcceptDeclineModal";

const TransmissionPage = () => {
  const { token } = useParams<{ token: string }>();
  const { profiles, isPending } = useGetAllProfiles();
  const { transmission, isError, error } = useGetTransmissionByToken(token!);
  const { mutate: selectProfile, isSuccess: profileSelected } = useSelectRecipientProfile(token!);
  const {
    mutate: acceptTransmission,
    isPending: isAccepting,
    isError: isAcceptError,
    error: acceptError,
  } = useAcceptTransmission(token!);
  const {
    mutate: declineTransmission,
    isPending: isDeclining,
    isError: isDeclineError,
    error: declineError,
  } = useCancelTransmission(token!);

  const decisionError = isAcceptError
    ? isAxiosError(acceptError)
      ? (acceptError.response?.data?.message ?? "Erreur inconnue")
      : "Erreur inconnue"
    : isDeclineError
      ? isAxiosError(declineError)
        ? (declineError.response?.data?.message ?? "Erreur inconnue")
        : "Erreur inconnue"
      : null;

  if (isPending) return <div>Chargement...</div>;

  if (isError) {
    const message = isAxiosError(error) ? (error.response?.data?.message ?? "Erreur inconnue") : "Erreur inconnue";
    return <div className="text-red-600">{message}</div>;
  }

  const needsProfileSelection = (profiles?.length ?? 0) > 1 && !profileSelected;
  const needsDecision = !needsProfileSelection && transmission?.status === "clicked";

  return (
    <div>
      {needsProfileSelection && <ProfileSelectionModal profiles={profiles!} onSelect={selectProfile} />}
      {needsDecision && (
        <AcceptDeclineModal
          property={transmission.property}
          owner={transmission.owner}
          onAccept={() => acceptTransmission()}
          onDecline={() => declineTransmission()}
          isAccepting={isAccepting}
          isDeclining={isDeclining}
          errorMessage={decisionError}
        />
      )}
      <div style={{ opacity: needsProfileSelection || needsDecision ? 0.2 : 1 }}>
        <p>Page de transmission (token : {token})</p>
        <p>Transmission chargée : {transmission ? "oui" : "non"}</p>
        {transmission?.status && <p>Statut : {transmission.status}</p>}
      </div>
    </div>
  );
};

export default TransmissionPage;
