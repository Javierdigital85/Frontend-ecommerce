import { useUser } from "../../context/useUser";
import { Navigate } from "react-router";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { userInfo, loading } = useUser();

  console.log(userInfo, loading, "ProtectedRoute");

  if (loading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (Object.keys(userInfo).length === 0) {
    return <Navigate to="/" replace />;
  }

  if (!userInfo.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
