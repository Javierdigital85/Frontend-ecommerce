import LoginForm from "../components/Login/LoginForm";
import { useTranslation } from "../hook/useTranslation";

const Login = () => {
  const { t } = useTranslation();
  return (
    <div className="relative left-1/2 -translate-x-1/2 w-screen min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-blue-600 tracking-tight mb-4">Musical Store</h2>
            <h1 className="text-2xl font-bold text-gray-900">{t.loginWelcome}</h1>
            <p className="text-gray-500 text-sm mt-1">{t.loginSubtitle}</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
