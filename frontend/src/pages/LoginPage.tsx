import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../hooks/useAuth";

interface ILoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { handleLogin } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? undefined;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginForm>();

  const onSubmit = async (data: ILoginForm) => {
    setErrorMessage(null);
    try {
      await handleLogin(data.email, data.password, redirectTo);
    } catch (error) {
      setErrorMessage(isAxiosError(error) ? (error.response?.data?.message ?? "Erreur inconnue") : "Erreur inconnue");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h1>
        <p className="text-sm text-gray-500 mb-8">Accédez à votre espace Cerithe</p>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              {...register("password", {
                required: "Le mot de passe est obligatoire",
                minLength: {
                  value: 8,
                  message: "Minimum 8 caractères",
                },
              })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            <a href="/forgot-password" className="mt-1 inline-block text-xs text-blue-600 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Pas encore de compte ?{" "}
          <a
            href={redirectTo ? `/register?redirect=${redirectTo}` : "/register"}
            className="text-blue-600 hover:underline font-medium"
          >
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
