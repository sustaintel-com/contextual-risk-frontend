// import React, { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { useNavigate, useSearchParams } from "react-router";
// import { useSnackbar } from "../../../Context/SnackbarContext";
// import {
//   getAllAdminUser,
//   updateAdminUserStatus,
//   deleteAdminUser,
// } from "../Services/AdminUsermanagementService";
// import type { AdminUser } from "../Services/AdminUsermanagementModel";
// import Button from "../../../components/buttons/Button";
// import { UserPlus, Pencil, Trash2, ToggleLeft, ToggleRight, Search } from "lucide-react";

// const AdminUserManagementList: React.FC = () => {
//   const { t } = useTranslation();
//   const { showSnackbar } = useSnackbar();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   // Read current tab & page from URL search params (matching AddUser return path logic)
//   const currentTab = searchParams.get("tab") || "users";
//   const currentPage = Number(searchParams.get("page")) || 1;

//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [searchTerm, setSearchTerm] = useState<string>("");

//   // Fetch all admin users
//   const fetchUsers = async () => {
//     setIsLoading(true);
//     try {
//       const response = await getAllAdminUser();
//       setUsers(response.data || []);
//     } catch (error: any) {
//       showSnackbar(
//         error?.response?.data?.message || error?.message || "Failed to load users.",
//         { type: "error", duration: 3000 }
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Handle navigate to Add User page
//   const handleAddUserClick = () => {
//     navigate("/user-management/add", {
//       state: {
//         from: `/user-management?tab=${currentTab}&page=${currentPage}`,
//         returnTab: currentTab,
//         returnPage: currentPage,
//       },
//     });
//   };

//   // Handle navigate to Edit User page
//   const handleEditUserClick = (user: AdminUser) => {
//     navigate(`/user-management/edit/${user.id}`, {
//       state: {
//         user,
//         from: `/user-management?tab=${currentTab}&page=${currentPage}`,
//         returnTab: currentTab,
//         returnPage: currentPage,
//       },
//     });
//   };

//   // Handle status toggle
//   const handleToggleStatus = async (userId: number) => {
//     try {
//       const response = await updateAdminUserStatus(userId);
//       showSnackbar(response.data?.message || "User status updated successfully", {
//         type: "success",
//         duration: 3000,
//       });
//       fetchUsers();
//     } catch (error: any) {
//       showSnackbar(
//         error?.response?.data?.message || error?.message || "Failed to update status.",
//         { type: "error", duration: 3000 }
//       );
//     }
//   };

//   // Handle delete user
//   const handleDeleteUser = async (userId: number) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     try {
//       const response = await deleteAdminUser(userId);
//       showSnackbar(response.data?.message || "User deleted successfully", {
//         type: "success",
//         duration: 3000,
//       });
//       fetchUsers();
//     } catch (error: any) {
//       showSnackbar(
//         error?.response?.data?.message || error?.message || "Failed to delete user.",
//         { type: "error", duration: 3000 }
//       );
//     }
//   };

//   // Filter users based on search input
//   const filteredUsers = users.filter(
//     (u) =>
//       u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       u.role.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-6 font-sans">
//       {/* Header section */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">
//             {t("pages.userManagement.title", "User Management")}
//           </h2>
//           <p className="text-gray-500 mt-1">
//             {t("pages.userManagement.subtitle", "Manage system users and their roles.")}
//           </p>
//         </div>
//         <Button
//           label={t("pages.userManagement.addUser", "Add User")}
//           size="sm"
//           variant="success"
//           type="button"
//           icon={<UserPlus size={18} />}
//           onClick={handleAddUserClick}
//         />
//       </div>

//       {/* Search and Filters Bar */}
//       <div className="bg-white p-4 rounded-md shadow mb-6 flex items-center justify-between border border-gray-100">
//         <div className="relative w-full md:w-1/3">
//           <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
//             <Search size={18} />
//           </span>
//           <input
//             type="text"
//             placeholder="Search by email or role..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Users Table */}
//       <div className="bg-white rounded-md shadow overflow-hidden border border-gray-100">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 <th className="py-3 px-6">ID</th>
//                 <th className="py-3 px-6">Email</th>
//                 <th className="py-3 px-6">Role</th>
//                 <th className="py-3 px-6">Status</th>
//                 <th className="py-3 px-6 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
//               {isLoading ? (
//                 <tr>
//                   <td colSpan={5} className="py-6 text-center text-gray-500">
//                     Loading users...
//                   </td>
//                 </tr>
//               ) : filteredUsers.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="py-6 text-center text-gray-500">
//                     No users found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredUsers.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="py-4 px-6 font-medium text-gray-900">{user.id}</td>
//                     <td className="py-4 px-6">{user.email}</td>
//                     <td className="py-4 px-6">
//                       <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600">
//                         {user.role}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span
//                         className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
//                           user.isActive && !user.isDeleted
//                             ? "bg-green-50 text-green-600"
//                             : "bg-red-50 text-red-600"
//                         }`}
//                       >
//                         {user.isDeleted ? "Deleted" : user.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6 text-right space-x-2">
//                       <button
//                         title="Toggle Status"
//                         onClick={() => handleToggleStatus(user.id)}
//                         className="text-gray-500 hover:text-blue-600 transition-colors"
//                       >
//                         {user.isActive ? <ToggleRight size={20} className="text-green-600 inline" /> : <ToggleLeft size={20} className="text-gray-400 inline" />}
//                       </button>
//                       <button
//                         title="Edit User"
//                         onClick={() => handleEditUserClick(user)}
//                         className="text-gray-500 hover:text-indigo-600 transition-colors inline-block"
//                       >
//                         <Pencil size={18} />
//                       </button>
//                       <button
//                         title="Delete User"
//                         onClick={() => handleDeleteUser(user.id)}
//                         className="text-gray-500 hover:text-red-600 transition-colors inline-block"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminUserManagementList;

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { useSnackbar } from "../../../Context/SnackbarContext";
import {
  getAllAdminUser,
  updateAdminUserStatus,
  deleteAdminUser,
} from "../Services/AdminUsermanagementService";
import type { AdminUser } from "../Services/AdminUsermanagementModel";
import Button from "../../../components/buttons/Button";
import { UserPlus, Pencil, Trash2, ToggleLeft, ToggleRight, Search } from "lucide-react";

const AdminUserManagementList: React.FC = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read current tab & page from URL search params (matching AddUser return path logic)
  const currentTab = searchParams.get("tab") || "users";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch all admin users safely handling different response structures
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllAdminUser();
      
      // Safely resolve data whether it's directly an array or nested under data/result
      let userList: AdminUser[] = [];
      if (Array.isArray(response?.data)) {
        userList = response.data;
      } else if (response?.data && Array.isArray((response.data as any).data)) {
        userList = (response.data as any).data;
      } else if (response?.data && Array.isArray((response.data as any).result)) {
        userList = (response.data as any).result;
      }

      setUsers(userList);
    } catch (error: any) {
      showSnackbar(
        error?.response?.data?.message || error?.message || "Failed to load users.",
        { type: "error", duration: 3000 }
      );
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle navigate to Add User page
  const handleAddUserClick = () => {
    navigate("/user-management/add-user", {
      state: {
        from: `/user-management?tab=${currentTab}&page=${currentPage}`,
        returnTab: currentTab,
        returnPage: currentPage,
      },
    });
  };

  // Handle navigate to Edit User page
  const handleEditUserClick = (user: AdminUser) => {
    navigate(`/user-management/edit/${user.id}`, {
      state: {
        user,
        from: `/user-management?tab=${currentTab}&page=${currentPage}`,
        returnTab: currentTab,
        returnPage: currentPage,
      },
    });
  };

  // Handle status toggle
  const handleToggleStatus = async (userId: number) => {
    try {
      const response = await updateAdminUserStatus(userId);
      showSnackbar(response.data?.message || "User status updated successfully", {
        type: "success",
        duration: 3000,
      });
      fetchUsers();
    } catch (error: any) {
      showSnackbar(
        error?.response?.data?.message || error?.message || "Failed to update status.",
        { type: "error", duration: 3000 }
      );
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await deleteAdminUser(userId);
      showSnackbar(response.data?.message || "User deleted successfully", {
        type: "success",
        duration: 3000,
      });
      fetchUsers();
    } catch (error: any) {
      showSnackbar(
        error?.response?.data?.message || error?.message || "Failed to delete user.",
        { type: "error", duration: 3000 }
      );
    }
  };

  // Safely filter users only if users is confirmed to be an array
  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (u) =>
          u?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u?.role?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="p-6 font-sans">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("pages.userManagement.title", "User Management")}
          </h2>
          <p className="text-gray-500 mt-1">
            {t("pages.userManagement.subtitle", "Manage system users and their roles.")}
          </p>
        </div>
        <Button
          label={t("pages.userManagement.addUser", "Add User")}
          size="sm"
          variant="success"
          type="button"
          icon={<UserPlus size={18} />}
          onClick={handleAddUserClick}
        />
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-md shadow mb-6 flex items-center justify-between border border-gray-100">
        <div className="relative w-full md:w-1/3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-md shadow overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{user.id}</td>
                    <td className="py-4 px-6">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          user.isActive && !user.isDeleted
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {user.isDeleted ? "Deleted" : user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        title="Toggle Status"
                        onClick={() => handleToggleStatus(user.id)}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        {user.isActive ? <ToggleRight size={20} className="text-green-600 inline" /> : <ToggleLeft size={20} className="text-gray-400 inline" />}
                      </button>
                      <button
                        title="Edit User"
                        onClick={() => handleEditUserClick(user)}
                        className="text-gray-500 hover:text-indigo-600 transition-colors inline-block"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        title="Delete User"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-gray-500 hover:text-red-600 transition-colors inline-block"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagementList;