import RegisterForm from "../components/Register/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-center">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
