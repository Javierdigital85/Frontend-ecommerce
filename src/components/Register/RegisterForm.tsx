import { useState } from "react";
import { useUser } from "../../context/useUser";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { RegisterFormValues } from "../../interfaces/RegisterForm";
import { registerService } from "../../services/authService";
import { Navigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "../../hook/useTranslation";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    mode: "onChange",
  });

  const { userInfo, checkSession } = useUser();
  // const { userInfo, checkSession } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    const result = await registerService(
      data,
      reset,
      setRedirect,
      checkSession,
    );

    if (result?.message) {
      toast.success(`${t.registerSuccess}`);
    } else {
      toast.error(`${t.registerError}`);
    }

    console.log(result);
    //Registrar el usuario
  };

  if (redirect && userInfo.isAdmin) {
    //Llevarlo a la pagina de administrador
  }
  if (redirect && !userInfo.isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Username */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {t.usernamePlaceholder}
        </label>
        <input
          /*
        El primer parametro es "username".
        Tipo: String (texto)
        Qué es: El nombre del campo
        Para qué sirve: Identificar el campo en el formulario
        */
          {...register("username", {
            /*  el segundo parametro es un objeto.
            Tipo: Objeto { }
            Qué es: Las reglas de validación y configuración
            Para qué sirve: Definir cómo validar el campo
            */
            required: `${t.usernameRequired}`,
            minLength: { value: 3, message: `${t.usernameMinLength}` },
            maxLength: { value: 20, message: `${t.usernameMaxLength}` },
          })}
          // HTML NATIVO (fuera del register)
          type="text"
          placeholder="Ej: javier123"
          autoComplete="username"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-sm ${
            errors.username
              ? "border-red-400 bg-red-50 focus:border-red-500"
              : "border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white"
          }`}
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1.5 ml-1">⚠ {errors.username.message as string}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {t.emailPlaceholder}
        </label>
        <input
          //el spread operator expande el objeto register
          {...register("email", {
            required: `${t.emailRequired}`,
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Correo electrónico inválido",
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
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-sm pr-12 ${
              errors.password
                ? "border-red-400 bg-red-50 focus:border-red-500"
                : "border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white"
            }`}
          />
          <button
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
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
            Creando cuenta...
          </span>
        ) : (
          t.register
        )}
      </button>

      {/* Link a Login */}
      <p className="text-center text-sm text-gray-500 mt-2">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
