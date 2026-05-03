import { FiUser, FiShield, FiMail } from "react-icons/fi";
import { useTranslation } from "../../../hook/useTranslation";

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

const UsersTable = ({ users }: { users: User[] }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{t.usersTitle}</h2>
        <p className="text-slate-500 text-sm mt-0.5">{users.length} {t.usersTitle.toLowerCase()} {t.resultsFound}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 text-center w-10">#</th>
                <th className="px-4 py-3 text-left">{t.usernamePlaceholder}</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">{t.emailPlaceholder}</th>
                <th className="px-4 py-3 text-center">{t.role}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user, index) => (
                <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-center text-slate-400 font-medium">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                        <FiUser size={14} className="text-slate-500" />
                      </div>
                      <span className="font-semibold text-slate-800">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-2 text-slate-500">
                      <FiMail size={13} />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.isAdmin ? (
                      <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
                        <FiShield size={11} /> {t.adminRole}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                        <FiUser size={11} /> {t.userRole}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
