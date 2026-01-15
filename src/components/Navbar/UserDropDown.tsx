import { Link } from "react-router-dom";
import { useUser } from "../../context/useUser";
import toast from "react-hot-toast";
import { logOutService } from "../../services/authService";

const UserDropDown = () => {
  const { setUserInfo } = useUser();

  const handleLogout = async () => {
    try {
      await logOutService();
      setUserInfo({});
      toast.success("Has cerrado sesión");
    } catch (error) {
      console.log(error);
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            alt="Avatar"
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
      >
        <li>
          <Link to="/" className="justify-between">
            Perfil
            <span className="badge">Nuevo</span>
          </Link>
        </li>
        <li>
          <Link to="/profile" className="justify-between">
            Configuración
          </Link>
        </li>
        <li>
          <Link to="/" className="justify-between" onClick={handleLogout}>
            Cerrar Sesión
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserDropDown;
