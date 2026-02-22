import { Link } from "react-router-dom";
import { useUser } from "../../context/useUser";
import toast from "react-hot-toast";
import { logOutService } from "../../services/authService";
import { useTranslation } from "../../hook/useTranslation";

const UserDropDown = () => {
  const { userInfo, setUserInfo } = useUser();
  const { t } = useTranslation();
  console.log("Que tiene userInfooooo!!!", userInfo);

  const handleLogout = async () => {
    try {
      await logOutService();
      setUserInfo({});
      toast.success(t.logoutSuccess);
    } catch (error) {
      console.log(error);
      toast.error(t.logoutError);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost"
      >
        <div>
          <p>{userInfo.username}</p>
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
      >
        {/* <li>
          <Link to="/" className="justify-between">
            Perfil
            <span className="badge">Nuevo</span>
          </Link>
        </li> */}
        <li>
          <Link to="/profile" className="justify-between">
            {t.settings}
          </Link>
        </li>
        <li>
          <Link to="/" className="justify-between" onClick={handleLogout}>
            {t.logout}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserDropDown;
