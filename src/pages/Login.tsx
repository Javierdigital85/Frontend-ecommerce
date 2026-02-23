import LoginForm from "../components/Login/LoginForm";

const Login = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl text-white font-bold">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Bienvenido de vuelta</h1>
            <p className="text-gray-500 text-sm mt-1">Ingresá a tu cuenta para continuar</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
