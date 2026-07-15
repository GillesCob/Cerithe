import { useState } from "react";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { useAuth } from "../hooks/useAuth";

interface IForgotPasswordForm {
  email: string;
}

const ForgotPasswordPage = () => {
  const { handleForgotPassword } = useAuth();
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IForgotPasswordForm>();

  const onSubmit = async (data: IForgotPasswordForm) => {
    setErrorMessage(null);
    try {
      await handleForgotPassword(data.email);
      setIsSent(true);
    } catch (error) {
      setErrorMessage(isAxiosError(error) ? (error.response?.data?.message ?? "Erreur inconnue") : "Erreur inconnue");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié</h1>
        <p className="text-sm text-gray-500 mb-8">
          Indiquez votre email, nous vous envoyons un lien de réinitialisation s'il correspond à un compte.
        </p>

        {isSent ? (
          <p className="text-sm text-gray-600">
            Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé. Vérifiez votre boîte de
            réception.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "L'email est obligatoire",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email invalide",
                  },
                })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isSubmitting ? "Envoi..." : "Envoyer le lien"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Retour à la connexion
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
