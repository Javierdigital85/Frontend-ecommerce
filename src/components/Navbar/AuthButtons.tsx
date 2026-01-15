import { Link } from "react-router";

const AuthButtons = () => {
  return (
    <div className="py-4 flex justify-center items-center gap-4 flex-wrap">
      <Link
        className="border-2 border-black hover:bg-gray-100 hover:border-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
        to={"/register"}
      >
        Crear Cuenta
      </Link>

      <div className="hidden lg:block">|</div>
      <Link
        className="border-2 border-black hover:bg-gray-100 hover:border-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
        to={"/login"}
      >
        Iniciar Sesión
      </Link>
    </div>
  );
};

export default AuthButtons;
