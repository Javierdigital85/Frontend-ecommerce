import { Outlet, Link, useLocation } from "react-router";
import { FiPackage, FiUsers } from "react-icons/fi";
import { useState } from "react";
import UserDropDown from "../components/Navbar/UserDropDown";
import { useUser } from "../context/useUser";
import { useTranslation } from "../hook/useTranslation";
import { useLanguage } from "../context/useLanguage";

const DashboardLayout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userInfo, loading } = useUser();
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile top bar */}
          <div className="flex md:hidden items-center justify-between py-3">
            <span className="font-bold text-gray-800">{t.adminDashboard}</span>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-ghost btn-sm bg-green-100 p-2"
                onClick={toggleLanguage}
              >
                {language === "en" ? "🇺🇸 en" : "🇦🇷 es"}
              </button>
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <div className="w-6 flex flex-col gap-1.5">
                  <span
                    className={`block h-0.5 bg-gray-700 transition-all duration-300 origin-center ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
                  ></span>
                  <span
                    className={`block h-0.5 bg-gray-700 transition-all duration-300 ${mobileMenuOpen ? "opacity-0 scale-x-0" : ""}`}
                  ></span>
                  <span
                    className={`block h-0.5 bg-gray-700 transition-all duration-300 origin-center ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between py-3">
            <Link
              to="/"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              {t.backToStore}
            </Link>
            <div className="flex items-center gap-2">
              <Link
                to="/admin/dashboard/products"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${isActive("/products") ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"}`}
              >
                <FiPackage className="text-lg" />
                {t.products}
              </Link>
              <Link
                to="/admin/dashboard/users"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${isActive("/users") ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"}`}
              >
                <FiUsers className="text-lg" />
                {t.usersTitle}
              </Link>
              <button
                className="btn btn-ghost btn-sm bg-green-100 p-2"
                onClick={toggleLanguage}
              >
                {language === "en" ? "🇺🇸 en" : "🇦🇷 es"}
              </button>
              {!loading && userInfo?.id && <UserDropDown />}
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-2">
                <Link
                  to="/admin/dashboard/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${isActive("/products") ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"}`}
                >
                  <FiPackage className="text-lg" />
                  {t.products}
                </Link>
                <Link
                  to="/admin/dashboard/users"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${isActive("/users") ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"}`}
                >
                  <FiUsers className="text-lg" />
                  {t.usersTitle}
                </Link>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                >
                  {t.backToStore}
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
