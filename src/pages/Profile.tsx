import UserProfile from "../components/profile/UserProfile";
import { useUser } from "../context/useUser";
import { useTranslation } from "../hook/useTranslation";
import { FiUser } from "react-icons/fi";

const Profile = () => {
  const { userInfo, getUserId, loading, checkSession } = useUser();
  const { t } = useTranslation();

  if (loading || !userInfo?.id) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-screen min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiUser className="text-blue-600" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t.settings}</h1>
            <p className="text-gray-500 text-sm mt-1">@{userInfo.username}</p>
          </div>
          <UserProfile userInfo={userInfo} getUserId={getUserId} checkSession={checkSession} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
