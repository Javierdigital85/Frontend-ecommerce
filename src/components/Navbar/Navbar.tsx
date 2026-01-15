import { Link } from "react-router-dom";
import Cart from "./Cart";
import AuthButtons from "./AuthButtons";
import UserDropDown from "./UserDropDown";
import { useUser } from "../../context/useUser";

const Navbar = () => {
  const { loading, userInfo } = useUser();

  console.log("userInfo", userInfo);
  console.log("loading", loading);
  return (
    <header>
      <AuthButtons />
      <nav className="navbar bg-base-100 shadow-sm lg:rounded-box w-full">
        <div className="navbar-start">
          <Link className="btn btn-ghost text-xl" to="/">
            E-Commerce
          </Link>
        </div>
        <div className="navbar-end gap-3">
          {userInfo?.isAdmin && (
            <Link className="btn btn-ghost" to="/admin/dashboard/products">
              Dashboard
            </Link>
          )}
          <Cart />
          {!loading && userInfo?.id && <UserDropDown />}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
