import { useState } from "react";
import { useUser } from "../../context/useUser";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { RegisterFormValues } from "../../interfaces/RegisterForm";
import { registerService } from "../../services/authService";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "../../hook/useTranslation";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    mode: "onChange", //validación en tiempo real
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 flex flex-col gap-4 lg:gap6 max-w-[500px] mx-auto"
      action=""
    >
      <div>
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
            minLength: {
              value: 3,
              message: `${t.usernameMinLength}`,
            },
            maxLength: {
              value: 20,
              message: `${t.usernameMaxLength}`,
            },
          })}
          // HTML NATIVO (fuera del register)
          type="text"
          placeholder={t.usernamePlaceholder}
          autoComplete="usernames"
          className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
            errors.username
              ? "border-red-500 outline-red-500 focus:outline-red-500"
              : ""
          }`}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-2 ml-1">
            {errors.username.message as string}
          </p>
        )}
      </div>

      <div>
        <input
          //el spread operator expande el objeto register
          {...register("email", {
            required: `${t.emailRequired}`,
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Correo electronico invalido",
            },
            minLength: {
              value: 6,
              message: `${t.emailMinLength}`,
            },
            maxLength: {
              value: 254,
              message: `${t.emailMaxLength}`,
            },
          })}
          autoComplete="email"
          type="email"
          placeholder={t.emailPlaceholder}
          name="email"
          className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
            errors.email
              ? "border-red-500 outline-red-500 focus:outline-red-500"
              : ""
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-2 ml-1">
            {errors.email.message as string}
          </p>
        )}
      </div>

      <div className="relative">
        <input
          {...register("password", {
            required: `${t.passwordRequired}`,
            minLength: {
              value: 6,
              message: `${t.passwordMinLength}`,
            },
            maxLength: {
              value: 254,
              message: `${t.passwordMaxLength}`,
            },
          })}
          type={showPassword ? "text" : "password"}
          placeholder={t.passwordPlaceholder}
          autoCapitalize="current-password"
          className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
            errors.password
              ? "border-red-500 outline-red-500 focus:outline-red-500"
              : ""
          }`}
        />
        <button
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={
            showPassword ? "Ocultar contraseña" : "Mostrar constraseña"
          }
          type="button"
          className="cursor-pointer absolute right-4 top-[20px] transform -translate-y-1/2 text-gray-600"
        >
          {showPassword ? <FaEye size={23} /> : <FaEyeSlash size={23} />}
        </button>
        {errors.password && (
          <p className="text-red-500 text-sm mt-2 ml-1">
            {errors.password.message as string}
          </p>
        )}
      </div>
      <button
        className="btn bg-blue-600 hover:bg-blue-700 text-white"
        type="submit"
      >
        {t.register}
      </button>
    </form>
  );
};

export default RegisterForm;
