import UserProfile from "../components/profile/UserProfile";
import { useUser } from "../context/useUser";

const Profile = () => {
  const { userInfo, getUserId, loading, checkSession } = useUser();

  console.log("userInfo en Profileeeeeeeeeee:", userInfo);

  if (loading || !userInfo?.id) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Edit Profile</h1>
      <UserProfile
        userInfo={userInfo}
        getUserId={getUserId}
        checkSession={checkSession}
      />
    </div>
  );
};

export default Profile;
