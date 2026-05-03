import { Link, useLocation } from "react-router-dom";
import Cart from "./Cart";
import AuthButtons from "./AuthButtons";
import UserDropDown from "./UserDropDown";
import { useUser } from "../../context/useUser";
import { FiMenu, FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useLanguage } from "../../context/useLanguage";
import { useTranslation } from "../../hook/useTranslation";
import { useSearch } from "../../context/useSearch";

const Navbar = () => {
  const { loading, userInfo } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const { searchTerm, setSearchTerm } = useSearch();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-base-100 shadow">
      <nav className="w-full px-2 sm:px-4 h-16 flex items-center gap-2">
        {/* Logo */}
        <Link className="btn btn-ghost text-lg sm:text-xl shrink-0 px-2" to="/">
          Musical Store
        </Link>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-2">
            {isHome && (
            <div className="relative flex items-center">
              <FiSearch className="absolute left-3 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder={t.searchProducts}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-100 rounded-full pl-10 pr-4 py-2 w-64 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            )}
            {userInfo?.isAdmin && (
              <Link className="btn btn-info btn-sm hover:text-white" to="/admin/dashboard/products">
                {t.dashboard}
              </Link>
            )}
            {!loading && !userInfo?.id && <AuthButtons />}
          </div>

          {!loading && userInfo?.id && <UserDropDown />}

          <Cart />

          <button className="btn btn-ghost btn-sm bg-green-100 px-2" onClick={toggleLanguage}>
            {language === "en" ? "🇺🇸" : "🇦🇷"}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-circle md:hidden"
          >
            <FiMenu className="text-2xl" />
          </button>
        </div>
      </nav>

      {/* Mobile search bar */}
      {isHome && (
      <div className="md:hidden px-4 pb-3 bg-base-100">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-3 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder={t.searchProducts}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-100 rounded-full pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-base-100 shadow-lg border-t">
          <div className="flex flex-col gap-2 p-4">
            {userInfo?.isAdmin && (
              <Link
                to="/admin/dashboard/products"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-info hover:text-white w-full"
              >
                {t.dashboard}
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
