import { Link } from "react-router-dom";
import Cart from "./Cart";
import AuthButtons from "./AuthButtons";
import UserDropDown from "./UserDropDown";
import { useUser } from "../../context/useUser";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";
import { useLanguage } from "../../context/useLanguage";
import { useTranslation } from "../../hook/useTranslation";

const Navbar = () => {
  const { loading, userInfo } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 bg-base-100 shadow">
      <nav className="navbar bg-base-100 shadow-sm lg:rounded-box w-full">
        <div className="navbar-start">
          <Link className="btn btn-ghost text-xl" to="/">
            Musical Store
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-end gap-3">
          <div className="hidden md:flex items-center gap-3">
            {userInfo?.isAdmin && (
              <Link
                className="btn btn-info hover:text-white"
                to="/admin/dashboard/products"
              >
                {t.dashboard}
              </Link>
            )}
            {!loading && !userInfo?.id && <AuthButtons />}
          </div>

          {/* User dropdown - siempre visible */}
          {!loading && userInfo?.id && <UserDropDown />}

          <Cart />

          <button
            className="btn btn-ghost btn-sm bg-green-100 p-2"
            onClick={toggleLanguage}
          >
            {language === "en" ? "🇺🇸 en" : "🇦🇷 es"}
          </button>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-circle md:hidden"
          >
            <FiMenu className="text-2xl" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-base-100 shadow-lg border-t">
          <div className="flex flex-col gap-2 p-4">
            {userInfo?.isAdmin && (
              <Link
                to="/admin/dashboard/products"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-info hover:text-white w-full"
              >
                Dashboard
              </Link>
            )}
            {!loading && !userInfo?.id && (
              <div onClick={() => setMobileMenuOpen(false)}>
                <AuthButtons />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
