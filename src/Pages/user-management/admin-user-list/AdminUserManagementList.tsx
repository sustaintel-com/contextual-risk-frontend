// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useNavigate, useSearchParams } from "react-router";
// import {
//   UserPlus,
//   Pencil,
//   Trash2,
//   Search,
// } from "lucide-react";

// import { useSnackbar } from "../../../Context/SnackbarContext";
// import {
//   getAllAdminUser,
//   updateAdminUserStatus,
//   deleteAdminUser,
// } from "../Services/AdminUsermanagementService";
// import type { AdminUser, IdType } from "../Services/AdminUsermanagementModel";
// import Button from "../../../components/buttons/Button";
// import Switch from "../../../components/buttons/SwitchButton";

// const getErrorMessage = (error: unknown): string => {
//   const err = error as {
//     response?: { data?: { message?: string; title?: string } };
//     message?: string;
//   };

//   return (
//     err?.response?.data?.message ||
//     err?.response?.data?.title ||
//     err?.message ||
//     "An unexpected error occurred."
//   );
// };

// const getRoleNames = (user: AdminUser): string => {
//   if (user.roleNames?.length) {
//     return user.roleNames.join(", ");
//   }

//   if (user.roles?.length) {
//     return user.roles
//       .map((role) => role.name)
//       .filter(Boolean)
//       .join(", ");
//   }

//   return user.roleIds?.length
//     ? user.roleIds.join(", ")
//     : "No role assigned";
// };

// const AdminUserManagementList: React.FC = () => {
//   const { t } = useTranslation();
//   const { showSnackbar } = useSnackbar();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const currentTab = searchParams.get("tab") || "users";
//   const currentPage = Number(searchParams.get("page")) || 1;

//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [updatingUserId, setUpdatingUserId] = useState<IdType | null>(null);
//   const [deletingUserId, setDeletingUserId] = useState<IdType | null>(null);

//   const fetchUsers = useCallback(async () => {
//     setIsLoading(true);

//     try {
//       const response = await getAllAdminUser();
//       const responseData = response.data as unknown;

//       // Supports either an array or a response wrapped in data/result.
//       let userList: AdminUser[] = [];

//       if (Array.isArray(responseData)) {
//         userList = responseData as AdminUser[];
//       } else if (
//         responseData &&
//         typeof responseData === "object" &&
//         "data" in responseData &&
//         Array.isArray((responseData as { data: unknown }).data)
//       ) {
//         userList = (responseData as { data: AdminUser[] }).data;
//       } else if (
//         responseData &&
//         typeof responseData === "object" &&
//         "result" in responseData &&
//         Array.isArray((responseData as { result: unknown }).result)
//       ) {
//         userList = (responseData as { result: AdminUser[] }).result;
//       }

//       setUsers(userList);
//     } catch (error: unknown) {
//       setUsers([]);
//       showSnackbar(getErrorMessage(error), {
//         type: "error",
//         duration: 3000,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [showSnackbar]);

//   useEffect(() => {
//     void fetchUsers();
//   }, [fetchUsers]);

//   const returnPath = `/user-management?tab=${encodeURIComponent(
//     currentTab
//   )}&page=${currentPage}`;

//   const handleAddUserClick = () => {
//     navigate("/user-management/add-user", {
//       state: {
//         from: returnPath,
//         returnTab: currentTab,
//         returnPage: currentPage,
//       },
//     });
//   };

//   const handleEditUserClick = (user: AdminUser) => {
//     navigate(`/user-management/add-user/${user.id}`, {
//       state: {
//         user,
//         from: returnPath,
//         returnTab: currentTab,
//         returnPage: currentPage,
//       },
//     });
//   };

//   const handleToggleStatus = async (user: AdminUser) => {
//     const nextActiveStatus = user.active !== true;

//     setUpdatingUserId(user.id);

//     try {
//       const response = await updateAdminUserStatus(
//         user.id,
//         nextActiveStatus
//       );

//       showSnackbar(
//         response.data?.message ||
//           `User ${nextActiveStatus ? "activated" : "deactivated"} successfully.`,
//         {
//           type: "success",
//           duration: 3000,
//         }
//       );

//       await fetchUsers();
//     } catch (error: unknown) {
//       showSnackbar(getErrorMessage(error), {
//         type: "error",
//         duration: 3000,
//       });
//     } finally {
//       setUpdatingUserId(null);
//     }
//   };

//   const handleDeleteUser = async (userId: IdType) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) {
//       return;
//     }

//     setDeletingUserId(userId);

//     try {
//       const response = await deleteAdminUser(userId);

//       showSnackbar(response.data?.message || "User deleted successfully.", {
//         type: "success",
//         duration: 3000,
//       });

//       await fetchUsers();
//     } catch (error: unknown) {
//       showSnackbar(getErrorMessage(error), {
//         type: "error",
//         duration: 3000,
//       });
//     } finally {
//       setDeletingUserId(null);
//     }
//   };

//   const filteredUsers = useMemo(() => {
//     const search = searchTerm.trim().toLowerCase();

//     if (!search) {
//       return users;
//     }

//     return users.filter((user) => {
//       const searchableValues = [
//         user.fullName,
//         user.username,
//         user.email,
//         getRoleNames(user),
//       ];

//       return searchableValues.some((value) =>
//         (value || "").toLowerCase().includes(search)
//       );
//     });
//   }, [users, searchTerm]);

//   return (
//     <div className="p-6 font-sans">
//       {/* Header */}
//       <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">
//             {t("pages.userManagement.title", "User Management")}
//           </h2>

//           <p className="mt-1 text-gray-500">
//             {t(
//               "pages.userManagement.subtitle",
//               "Manage system users and their roles."
//             )}
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

//       {/* Search */}
//       <div className="mb-6 flex items-center justify-between rounded-md border border-gray-100 bg-white p-4 shadow">
//         <div className="relative w-full md:w-1/3">
//           <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
//             <Search size={18} />
//           </span>

//           <input
//             type="text"
//             placeholder="Search by name, username, email, or role..."
//             value={searchTerm}
//             onChange={(event) => setSearchTerm(event.target.value)}
//             className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Users table */}
//       <div className="overflow-hidden rounded-md border border-gray-100 bg-white shadow">
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse text-left">
//             <thead>
//               <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
//                 <th className="px-6 py-3">Full Name</th>
//                 <th className="px-6 py-3">Username</th>
//                 <th className="px-6 py-3">Email</th>
//                 <th className="px-6 py-3">Role</th>
//                 <th className="px-6 py-3">Status</th>
//                 <th className="px-6 py-3 text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
//               {isLoading ? (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="px-6 py-8 text-center text-gray-500"
//                   >
//                     Loading users...
//                   </td>
//                 </tr>
//               ) : filteredUsers.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="px-6 py-8 text-center text-gray-500"
//                   >
//                     {searchTerm.trim()
//                       ? "No users match your search."
//                       : "No users found."}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredUsers.map((user) => {
//                   const isActive = user.active === true;
//                   const isUpdating = updatingUserId === user.id;
//                   const isDeleting = deletingUserId === user.id;

//                   return (
//                     <tr
//                       key={user.id}
//                       className="transition-colors hover:bg-gray-50"
//                     >
//                       <td className="px-6 py-4 font-medium text-gray-900">
//                         {user.fullName || "—"}
//                       </td>

//                       <td className="px-6 py-4">
//                         {user.username || "—"}
//                       </td>

//                       <td className="px-6 py-4">
//                         {user.email || "—"}
//                       </td>

                      
//                       <td className="px-6 py-4">
//                         <div className="flex flex-wrap gap-1">
//                           {user.roleNames?.length ? (
//                             user.roleNames.map((roleName, index) => (
//                               <span
//                                 key={`${user.id}-${roleName}-${index}`}
//                                 className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600"
//                               >
//                                 {roleName}
//                               </span>
//                             ))
//                           ) : (
//                             <span className="text-gray-500">{getRoleNames(user)}</span>
//                           )}
//                         </div>
//                       </td>


//                       <td className="px-6 py-4">
//                         <span
//                           className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
//                             isActive
//                               ? "bg-green-50 text-green-600"
//                               : "bg-red-50 text-red-600"
//                           }`}
//                         >
//                           {isActive ? "Active" : "Inactive"}
//                         </span>
//                       </td>

//                       <td className="space-x-3 whitespace-nowrap px-6 py-4 text-right">
                       
//                       <Switch
//                                       key="status"
//                                       checked={user.active as boolean}
//                                       onChange={() =>
//                                           void handleToggleStatus(user)
//                                       }
//                                   />,
//                         <button
//                           type="button"
//                           title="Edit User"
//                           aria-label="Edit user"
//                           disabled={isUpdating || isDeleting}
//                           onClick={() => handleEditUserClick(user)}
//                           className="inline-block text-gray-500 transition-colors hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
//                         >
//                           <Pencil size={18} />
//                         </button>

//                         <button
//                           type="button"
//                           title="Delete User"
//                           aria-label="Delete user"
//                           disabled={isUpdating || isDeleting}
//                           onClick={() => void handleDeleteUser(user.id)}
//                           className="inline-block text-gray-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminUserManagementList;


import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { UserPlus, Pencil, Trash2, Search } from "lucide-react";

import { useSnackbar } from "../../../Context/SnackbarContext";

import {
  getAllAdminUser,
  updateAdminUserStatus,
  deleteAdminUser,
} from "../Services/AdminUsermanagementService";

import type {
  AdminUser,
  IdType,
} from "../Services/AdminUsermanagementModel";

import Button from "../../../components/buttons/Button";
import Switch from "../../../components/buttons/SwitchButton";

const getErrorMessage = (error: unknown): string => {
  const err = error as {
    response?: {
      data?: {
        message?: string;
        Message?: string;
        title?: string;
      };
    };
    message?: string;
  };

  return (
    err.response?.data?.message ||
    err.response?.data?.Message ||
    err.response?.data?.title ||
    err.message ||
    "An unexpected error occurred."
  );
};

const getRoleNames = (user: AdminUser): string => {
  if (user.roleNames?.length) {
    return user.roleNames.join(", ");
  }

  if (user.roles?.length) {
    return user.roles
      .map((role) => role.name)
      .filter(Boolean)
      .join(", ");
  }

  return "No role assigned";
};

const AdminUserManagementList: React.FC = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentTab = searchParams.get("tab") || "users";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<IdType | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<IdType | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getAllAdminUser();
      const responseData = response.data as unknown;

      let userList: AdminUser[] = [];

      if (Array.isArray(responseData)) {
        userList = responseData as AdminUser[];
      } else if (
        responseData &&
        typeof responseData === "object" &&
        "data" in responseData &&
        Array.isArray((responseData as { data: unknown }).data)
      ) {
        userList = (responseData as { data: AdminUser[] }).data;
      } else if (
        responseData &&
        typeof responseData === "object" &&
        "result" in responseData &&
        Array.isArray((responseData as { result: unknown }).result)
      ) {
        userList = (responseData as { result: AdminUser[] }).result;
      }

      // Normalize the API's role fields for consistent rendering.
      const normalizedUsers = userList.map((user) => ({
        ...user,
        roleIds: Array.isArray(user.roleIds)
          ? user.roleIds
          : Array.isArray(user.roleId)
            ? user.roleId
            : user.roleId
              ? [user.roleId]
              : [],
        roleNames: Array.isArray(user.roleNames)
          ? user.roleNames
          : user.roles?.map((role) => role.name).filter(Boolean) ?? [],
      }));

      setUsers(normalizedUsers);
    } catch (error: unknown) {
      setUsers([]);

      showSnackbar(getErrorMessage(error), {
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const returnPath = `/user-management?tab=${encodeURIComponent(
    currentTab
  )}&page=${currentPage}`;

  const handleAddUserClick = () => {
    navigate("/user-management/add-user", {
      state: {
        from: returnPath,
        returnTab: currentTab,
        returnPage: currentPage,
      },
    });
  };

  const handleEditUserClick = (user: AdminUser) => {
    navigate(`/user-management/add-user/${user.id}`, {
      state: {
        user,
        from: returnPath,
        returnTab: currentTab,
        returnPage: currentPage,
      },
    });
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const nextActiveStatus = user.active !== true;

    setUpdatingUserId(user.id);

    try {
      const response = await updateAdminUserStatus(
        user.id,
        nextActiveStatus
      );

      showSnackbar(
        response.data?.message ||
          response.data?.Message ||
          `User ${nextActiveStatus ? "activated" : "deactivated"} successfully.`,
        {
          type: "success",
          duration: 3000,
        }
      );

      await fetchUsers();
    } catch (error: unknown) {
      showSnackbar(getErrorMessage(error), {
        type: "error",
        duration: 3000,
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: IdType) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setDeletingUserId(userId);

    try {
      const response = await deleteAdminUser(userId);

      showSnackbar(
        response.data?.message ||
          response.data?.Message ||
          "User deleted successfully.",
        {
          type: "success",
          duration: 3000,
        }
      );

      await fetchUsers();
    } catch (error: unknown) {
      showSnackbar(getErrorMessage(error), {
        type: "error",
        duration: 3000,
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return users;
    }

    return users.filter((user) => {
      const searchableValues = [
        user.fullName,
        user.username,
        user.email,
        getRoleNames(user),
      ];

      return searchableValues.some((value) =>
        String(value ?? "").toLowerCase().includes(search)
      );
    });
  }, [users, searchTerm]);

  return (
    <div className="p-6 font-sans">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("pages.userManagement.title", "User Management")}
          </h2>

          <p className="mt-1 text-gray-500">
            {t(
              "pages.userManagement.subtitle",
              "Manage system users and their roles."
            )}
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

      {/* Search */}
      <div className="mb-6 flex items-center justify-between rounded-md border border-gray-100 bg-white p-4 shadow">
        <div className="relative w-full md:w-1/3">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={18} />
          </span>

          <input
            type="text"
            placeholder="Search by name, username, email, or role..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* User table */}
      <div className="overflow-hidden rounded-md border border-gray-100 bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-6 py-3">Full Name</th>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm.trim()
                      ? "No users match your search."
                      : "No users found."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isActive = user.active === true;
                  const isUpdating = updatingUserId === user.id;
                  const isDeleting = deletingUserId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {user.fullName || "—"}
                      </td>

                      <td className="px-6 py-4">
                        {user.username || "—"}
                      </td>

                      <td className="px-6 py-4">
                        {user.email || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roleNames.length > 0 ? (
                            user.roleNames.map((roleName, index) => (
                              <span
                                key={`${user.id}-${roleName}-${index}`}
                                className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600"
                              >
                                {roleName}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">
                              {getRoleNames(user)}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isActive
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Switch
                            key={user.id}
                            checked={isActive}
                            onChange={() => void handleToggleStatus(user)}
                          />

                          <button
                            type="button"
                            title="Edit User"
                            aria-label="Edit user"
                            disabled={isUpdating || isDeleting}
                            onClick={() => handleEditUserClick(user)}
                            className="text-gray-500 transition-colors hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            type="button"
                            title="Delete User"
                            aria-label="Delete user"
                            disabled={isUpdating || isDeleting}
                            onClick={() => void handleDeleteUser(user.id)}
                            className="text-gray-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagementList;
