import RegisterForm from "../components/Register/RegisterForm";
import { useTranslation } from "../hook/useTranslation";

const Register = () => {
  const { t } = useTranslation();
  return (
    <div className="relative left-1/2 -translate-x-1/2 w-screen min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl text-white font-bold">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t.registerTitle}</h1>
            <p className="text-gray-500 text-sm mt-1">{t.registerSubtitle}</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
