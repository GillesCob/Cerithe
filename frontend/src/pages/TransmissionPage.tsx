import { useParams, useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { useGetAllProfiles } from "../hooks/useProfile";
import { useTokenStore } from "../stores/authStore";
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
  const navigate = useNavigate();
  const goToDashboard = () => navigate("/dashboard");
  const handleAcceptSuccess = () => {
    window.alert("Le propriétaire actuel a été informé de votre acceptation. Il doit maintenant confirmer une dernière fois la transmission pour que le bien vous soit officiellement transféré.");
    goToDashboard();
  };
  const isAuthenticated = useTokenStore((state) => !!state.accessToken);
  const { profiles, isPending } = useGetAllProfiles();
  const { transmission, isError } = useGetTransmissionByToken(token!, isAuthenticated);
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

  // Pas connecté : on n'affiche aucune info du bien avant authentification (décision produit du 04/07).
  if (!isAuthenticated) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center space-y-4">
          <p className="text-sm text-gray-600">Un bien vous a été transmis. Connectez-vous ou inscrivez-vous pour le consulter.</p>
          <div className="flex gap-3 justify-center">
            <Link
              to={`/login?redirect=/transmission/${token}`}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Se connecter
            </Link>
            <Link
              to={`/register?redirect=/transmission/${token}`}
              className="text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isPending) return <div>Chargement...</div>;

  const needsProfileSelection = (profiles?.length ?? 0) > 1 && !profileSelected;
  const needsDecision = !needsProfileSelection && transmission?.status === "clicked";

  if (needsProfileSelection) {
    return <ProfileSelectionModal profiles={profiles!} onSelect={selectProfile} />;
  }

  if (needsDecision) {
    return (
      <AcceptDeclineModal
        property={transmission.property}
        owner={transmission.owner}
        onAccept={() => acceptTransmission(undefined, { onSuccess: handleAcceptSuccess })}
        onDecline={() => declineTransmission(undefined, { onSuccess: goToDashboard })}
        isAccepting={isAccepting}
        isDeclining={isDeclining}
        errorMessage={decisionError}
      />
    );
  }

  // Statuts restants (accepted en attente de confirmation vendeur, confirmed, cancelled, expired) : le cas
  // normal (accepted) redirige déjà vers le dashboard juste après l'acceptation ci-dessus, ceci ne s'affiche
  // qu'en cas de rechargement de page ou de retour arrière sur ce lien.
  // isError couvre notamment le cas "mauvais compte connecté" : un seul message générique, sans détail
  // technique (pas de mention d'email), plutôt que de forwarder le message brut du backend.
  const statusMessages: Record<string, string> = {
    accepted: "Votre choix a été transmis, en attente de la confirmation du vendeur.",
    confirmed: "Ce bien vous a été transmis avec succès.",
    cancelled: "Cette transmission a été annulée.",
    expired: "Ce lien de transmission a expiré.",
  };
  const genericMessage = "Ce lien de transmission Cerithe doit être ouvert par la personne à qui il a été envoyé.";
  const message = isError ? genericMessage : (transmission?.status && statusMessages[transmission.status]) || genericMessage;

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center space-y-4">
        <p className="text-sm text-gray-600">{message}</p>
        <Link to="/dashboard" className="text-sm text-blue-600 hover:underline font-medium">
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
};

export default TransmissionPage;
