import { Outlet, Link, useLocation } from "react-router";
import { FiPackage, FiUsers, FiArrowLeft, FiMenu, FiX, FiHome } from "react-icons/fi";
import { useState } from "react";
import UserDropDown from "../components/Navbar/UserDropDown";
import { useUser } from "../context/useUser";
import { useTranslation } from "../hook/useTranslation";
import { useLanguage } from "../context/useLanguage";

const navItems = (t: ReturnType<typeof useTranslation>["t"]) => [
  { to: "/admin/dashboard/products", icon: <FiPackage size={18} />, label: t.products },
  { to: "/admin/dashboard/users", icon: <FiUsers size={18} />, label: t.usersTitle },
];

const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userInfo, loading } = useUser();
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white z-40 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:sticky md:top-0 md:translate-x-0 md:flex md:self-start md:h-screen`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
          <span className="text-lg font-bold tracking-tight">⚙ Admin</span>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems(t).map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all text-sm
                ${isActive(to)
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>

        {/* Back to store */}
        <div className="px-3 py-4 border-t border-slate-700">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <FiHome size={16} />
            {t.backToStore}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu size={20} />
            </button>
            <h1 className="font-semibold text-slate-800 text-sm sm:text-base">{t.adminDashboard}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/dashboard/products"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              <FiArrowLeft size={15} />
              {t.backToProducts}
            </Link>
            <Link
              to="/"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              <FiHome size={15} />
              {t.backToStore}
            </Link>
            <button
              className="btn btn-ghost btn-sm bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 px-3"
              onClick={toggleLanguage}
            >
              {language === "en" ? "🇺🇸 EN" : "🇦🇷 ES"}
            </button>
            {!loading && userInfo?.id && <UserDropDown />}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
