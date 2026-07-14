import { Resend } from "resend";

// Instanciation lazy (dans la fonction appelante, pas au démarrage du serveur) : évite de planter le
// serveur si RESEND_API_KEY n'est pas encore configurée, tant qu'aucun email n'est réellement envoyé.
export const sendPasswordResetEmail = async (email: string, rawToken: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

  await resend.emails.send({
    from: "Cerithe <onboarding@resend.dev>",
    to: email,
    subject: "Réinitialisation de votre mot de passe Cerithe",
    html: `<p>Vous avez demandé la réinitialisation de votre mot de passe Cerithe.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Ce lien est valable 15 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>`,
  });
};
