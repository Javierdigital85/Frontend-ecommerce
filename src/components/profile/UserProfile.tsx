import { useForm } from "react-hook-form";
import type { RegisterFormValues } from "../../interfaces/RegisterForm";
import type { UserInfo } from "../../interfaces/User";
import { useEffect } from "react";
import { updateUserService } from "../../services/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useTranslation } from "../../hook/useTranslation";

interface Props {
  userInfo: UserInfo | null;
  checkSession: () => Promise<void>;
  getUserId: () => string | null;
}

const UserProfile = ({ userInfo, getUserId, checkSession }: Props) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RegisterFormValues>({ mode: "onChange" });
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (userInfo) reset({ username: userInfo.username || "", email: userInfo.email || "" });
  }, [userInfo, reset]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const userId = getUserId();
      if (!userId) { toast.error(t.logoutError); return; }
      const res = await updateUserService(userId, { username: data.username, email: data.email });
      toast.success(res.message || t.registerSuccess);
      await checkSession();
      navigate("/");
    } catch {
      toast.error(t.registerError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Username */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.usernamePlaceholder}</label>
        <input
          {...register("username", {
            required: t.usernameRequired,
            minLength: { value: 2, message: t.usernameMinLength },
            maxLength: { value: 30, message: t.usernameMaxLength },
          })}
          type="text"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-sm ${
            errors.username ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white"
          }`}
        />
        {errors.username && <p className="text-red-500 text-xs mt-1.5 ml-1">⚠ {errors.username.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.emailPlaceholder}</label>
        <input
          {...register("email", {
            required: t.emailRequired,
            pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: t.emailInvalid },
            minLength: { value: 6, message: t.emailMinLength },
            maxLength: { value: 254, message: t.emailMaxLength },
          })}
          autoComplete="email"
          type="email"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-sm ${
            errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white"
          }`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">⚠ {errors.email.message as string}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg mt-1"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="loading loading-spinner loading-sm"></span>
            {t.creatingAccount}
          </span>
        ) : t.saveChanges}
      </button>
    </form>
  );
};

export default UserProfile;
