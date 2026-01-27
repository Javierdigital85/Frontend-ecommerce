import { useForm } from "react-hook-form";
import type { RegisterFormValues } from "../../interfaces/RegisterForm";
import type { UserInfo } from "../../interfaces/User";
// import { useUser } from "../../context/useUser";
import { useEffect } from "react";
import { updateUserService } from "../../services/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

// podemos usar getUserId para obtener a un usuario!
interface Props {
  userInfo: UserInfo | null;
  checkSession: () => Promise<void>;
  getUserId: () => string | null;
}

const UserProfile = ({ userInfo, getUserId, checkSession }: Props) => {
  // const { userInfo, checkSession, getUserId } = useUser();
  console.log("userInfooooooooooo", userInfo);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    mode: "onChange",
  });

  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const userId = getUserId();
      if (!userId) {
        toast.error("No se pudo obtener el ID del usuario");
        return;
      }

      const userData = {
        username: data.username,
        email: data.email,
      };

      console.log("Datos a enviar:", userData);
      console.log("User ID:", userId);

      const res = await updateUserService(userId, userData);
      toast.success(res.message || "Perfil actualizado correctamente");
      await checkSession(); // Actualiza el contexto con los nuevos datos
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar el perfil");
    }
  };

  useEffect(() => {
    console.log("userInfo recibido:", userInfo);
    if (userInfo) {
      reset({
        username: userInfo.username || "",
        email: userInfo.email || "",
      });
    }
  }, [userInfo, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      action=""
      className="mt-8 flex flex-col gap-4 lg:gap6 max-w-[500px] mx-auto"
    >
      <div>
        <h1 className="text-center">Edit Profile</h1>
        {/* name */}
        <input
          {...register("username", {
            required: "El nombre es requerido",
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: "Nombre invalido",
            },
            minLength: {
              value: 2,
              message: "minimo 2 caracteres",
            },
            maxLength: {
              value: 30,
              message: "Maximo 30 caracteres",
            },
          })}
          type="text"
          placeholder="name"
          className={`p-2 outline-2 rounded border focus:outline-primary w-full ${
            errors.username
              ? "border-red-500 outline-red-500 focus:outline-red-500"
              : ""
          }`}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-2 ml-1">
            {errors.username.message}
          </p>
        )}
      </div>
      <div>
        {/* email */}
        <input
          {...register("email", {
            required: "El nombre es requerido",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Email invalido",
            },
            minLength: {
              value: 6,
              message: "minimo de 6 caracteres",
            },
            maxLength: {
              value: 254,
              message: "maximo de 254 caracteres",
            },
          })}
          autoComplete="email"
          type="email"
          placeholder="Email"
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
      <button
        className="btn bg-purple-600 hover:bg-purple-700 text-white"
        type="submit"
      >
        Update user profile
      </button>
    </form>
  );
};

export default UserProfile;
