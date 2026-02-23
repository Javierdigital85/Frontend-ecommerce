import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { LoginFormValues } from "../../interfaces/LoginForm";
import { loginService } from "../../services/authService";
import { useUser } from "../../context/useUser";
import toast from "react-hot-toast";
import { Navigate, Link } from "react-router";
import { useTranslation } from "../../hook/useTranslation";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    mode: "onChange",
  });
  const { userInfo, setUserInfo } = useUser();
  const [openEye, setOpenEye] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    const result = await loginService(data, reset, setRedirect, setUserInfo);

    if (result?.success) {
      toast.success(`${t.loginSuccess}`);
    } else if (result) {
      toast.error(`${t.loginError}`);
    }
  };

  if (redirect && userInfo.isAdmin) {
    return <Navigate to="/" />;
  }

  if (redirect && !userInfo.isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {t.emailPlaceholder}
        </label>
        <input
          {...register("email", {
            required: `${t.emailRequired}`,
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: `${t.emailInvalid}`,
            },
            minLength: { value: 6, message: `${t.emailMinLength}` },
            maxLength: { value: 254, message: `${t.emailMaxLength}` },
          })}
          autoComplete="email"
          type="email"
          placeholder="tu@email.com"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-sm ${
            errors.email
              ? "border-red-400 bg-red-50 focus:border-red-500"
              : "border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1.5 ml-1">⚠ {errors.email.message as string}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {t.passwordPlaceholder}
        </label>
        <div className="relative">
          <input
            {...register("password", {
              required: `${t.passwordRequired}`,
              minLength: { value: 6, message: `${t.passwordMinLength}` },
              maxLength: { value: 254, message: `${t.passwordMaxLength}` },
            })}
            type={openEye ? "text" : "password"}
            placeholder="••••••••"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-sm pr-12 ${
              errors.password
                ? "border-red-400 bg-red-50 focus:border-red-500"
                : "border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white"
            }`}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setOpenEye((prev) => !prev)}
          >
            {openEye ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1.5 ml-1">⚠ {errors.password.message as string}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg mt-1"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="loading loading-spinner loading-sm"></span>
            Ingresando...
          </span>
        ) : (
          t.loginButton
        )}
      </button>

      {/* Link a Register */}
      <p className="text-center text-sm text-gray-500 mt-2">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
          Crear cuenta
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
