import LoginForm from "../components/Login/LoginForm";
import { useTranslation } from "../hook/useTranslation";

const Login = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full">
        <h1 className="text-center font-bold text-2xl">{t.login}</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
