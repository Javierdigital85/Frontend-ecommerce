import { Link } from "react-router-dom";
import Cart from "./Cart";
import AuthButtons from "./AuthButtons";
import UserDropDown from "./UserDropDown";
import { useUser } from "../../context/useUser";

const Navbar = () => {
  const { loading, userInfo } = useUser();
  const categories = ["Music", "Videos Games", "Camaras"];
  const handleCategory = (cat: string) => {
    console.log("holaaa", cat);
  };

  console.log("userInfo", userInfo);
  console.log("loading", loading);
  return (
    <header className="sticky top-0 z-50 bg-base-100 shadow">
      <nav className="navbar bg-base-100 shadow-sm lg:rounded-box w-full">
        <div className="navbar-start">
          <Link className="btn btn-ghost text-xl" to="/">
            E-Commerce
          </Link>
        </div>
        <div className="navbar-end gap-3">
          <div className="dropdown">
            <button className="">Categories</button>
            <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              {categories.map((cat) => (
                <li key={cat}>
                  <button onClick={() => handleCategory(cat)}>{cat}</button>
                </li>
              ))}
            </ul>
          </div>
          {userInfo?.isAdmin && (
            <Link
              className="btn btn-info hover:text-white"
              to="/admin/dashboard/products"
            >
              Dashboard
            </Link>
          )}
          {!loading && !userInfo?.id && <AuthButtons />}
          <Cart />
          {!loading && userInfo?.id && <UserDropDown />}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
