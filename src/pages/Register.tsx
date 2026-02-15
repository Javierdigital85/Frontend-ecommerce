import RegisterForm from "../components/Register/RegisterForm";
import { useTranslation } from "../hook/useTranslation";

const Register = () => {
  const {t} = useTranslation();
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-center">{t.register}</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
