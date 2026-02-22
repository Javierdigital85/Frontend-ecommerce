import { FiUser, FiShield } from "react-icons/fi";
import { useTranslation } from "../../../hook/useTranslation";

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface UsersTableProps {
  users: User[];
}

const UsersTable = ({ users }: UsersTableProps) => {
  const { t } = useTranslation();
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <tr>
            <th>#</th>
            <th>{t.usernamePlaceholder}</th>
            <th>{t.emailPlaceholder}</th>
            <th className="text-center">{t.role}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id} className="hover:bg-blue-50 transition-colors">
              <td className="font-semibold text-gray-700">{index + 1}</td>
              <td>
                <div className="flex items-center gap-2">
                  <FiUser className="text-gray-400" />
                  <span className="font-bold text-gray-900">
                    {user.username}
                  </span>
                </div>
              </td>
              <td className="text-gray-600">{user.email}</td>
              <td className="text-center">
                {user.isAdmin ? (
                  <span className="inline-flex items-center justify-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    <FiShield /> {t.adminRole}
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {t.userRole}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
