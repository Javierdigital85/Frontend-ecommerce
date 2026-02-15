import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { LoginFormValues } from "../../interfaces/LoginForm";
import { loginService } from "../../services/authService";
import { useUser } from "../../context/useUser";
import toast from "react-hot-toast";
import { Navigate } from "react-router";
import { useTranslation } from "../../hook/useTranslation";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    mode: "onChange", //validación en tiempo real
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      action=""
      className="mt-8 flex flex-col gap-4 lg:gap6 max-w-[500px] mx-auto"
    >
      <div>
        <input
          {...register("email", {
            required: `${t.emailRequired}`,
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: `${t.emailInvalid}`,
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
      {/* password */}
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
          type={openEye ? "text" : "password"}
          placeholder={t.passwordPlaceholder}
          className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
            errors.password
              ? "border-red-500 outline-red-500 focus:outline-red-500"
              : ""
          }`}
        />
        <button
          type="button"
          className="cursor-pointer absolute right-4 top-[20px] transform -translate-y-1/2 text-gray-600"
          onClick={() => setOpenEye((prev) => !prev)}
        >
          {openEye ? <FaEye size={23} /> : <FaEyeSlash size={23} />}
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
        {t.loginButton}
      </button>
    </form>
  );
};

export default LoginForm;
