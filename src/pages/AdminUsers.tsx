import { useEffect, useState } from "react";
import UsersTable from "../components/AdminDashboard/UsersTable/UsersTable";
import { getUsersService } from "../services/authService";
import { FiUsers } from "react-icons/fi";
import { useTranslation } from "../hook/useTranslation";

const AdminUsers = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await getUsersService();
        console.log("que pasooo!", response)
        setUsers(response.users);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los usuarios", error);
      }
    };
    getUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FiUsers /> {t.usersTitle}
        </h1>
        <p className="text-gray-600">{users.length}</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="loading loading-spinner loading-lg text-blue-600"></div>
          </div>
        ) : (
          <UsersTable users={users} />
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
