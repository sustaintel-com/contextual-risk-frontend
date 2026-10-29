
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useTranslation } from "react-i18next";
// import { useLocation, useNavigate, useParams } from "react-router";

// import { useSnackbar } from "../../../Context/SnackbarContext";

// import {
//   addAdminUser,
//   editAdminUser,
//   getAllRoles,
// } from "../Services/AdminUsermanagementService";

// import type {
//   AdminUserPayload,
//   AdminUserUpdatePayload,
//   IdType,
//   Role,
//   RoleOption,
// } from "../Services/AdminUsermanagementModel";

// import UserForm from "./UserForm";

// interface UserFormData {
//   fullName: string;
//   username: string;
//   email: string;
//   roleId: IdType | "";
//   password: string;
//   confirmPassword: string;
// }

// const AddUser: React.FC = () => {
//   const { t } = useTranslation();
//   const { showSnackbar } = useSnackbar();
//   const navigate = useNavigate();
//   const { id } = useParams<{ id?: string }>();
//   const location = useLocation();

//   const user = location.state?.user;
//   const mode: "add" | "edit" = id ? "edit" : "add";

//   const defaultRoleId = location.state?.defaultRoleId as
//     | IdType
//     | undefined;

//   const lockRole = Boolean(location.state?.lockRole);
//   const returnTab = location.state?.returnTab || "users";
//   const returnPage = Number(location.state?.returnPage) || 1;

//   const backPath =
//     location.state?.from ||
//     `/user-management?tab=${returnTab}&page=${returnPage}`;

//   const [roles, setRoles] = useState<Role[]>([]);
//   const [rolesLoading, setRolesLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     watch,
//     reset,
//   } = useForm<UserFormData>({
//     defaultValues: {
//       fullName: "",
//       username: "",
//       email: "",
//       roleId: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const password = watch("password", "");
//   const confirmPassword = watch("confirmPassword", "");

//   const passwordsMatch =
//     Boolean(confirmPassword) && password === confirmPassword;

//   const roleOptions: RoleOption[] = roles.map((role) => ({
//     label: role.name,
//     value: role.roleId,
//   }));

//   // Load roles from GET /Role.
//   useEffect(() => {
//     let isMounted = true;

//     const loadRoles = async () => {
//       setRolesLoading(true);

//       try {
//         const response = await getAllRoles();

//         if (!isMounted) return;

//         const data = response.data;

//         setRoles(
//           Array.isArray(data)
//             ? data.map((role) => ({
//                 roleId: role.roleId,
//                 name: role.name,
//               }))
//             : []
//         );
//       } catch (error: any) {
//         if (!isMounted) return;

//         showSnackbar(
//           error?.response?.data?.message ||
//             error?.response?.data?.Message ||
//             "Failed to load roles.",
//           { type: "error", duration: 3000 }
//         );
//       } finally {
//         if (isMounted) {
//           setRolesLoading(false);
//         }
//       }
//     };

//     void loadRoles();

//     return () => {
//       isMounted = false;
//     };
//   }, [showSnackbar]);

//   // Set the form values once the roles are loaded.
//   useEffect(() => {
//     if (rolesLoading) return;

//     if (mode === "edit" && user) {
//       const matchingRole = roles.find(
//         (role) =>
//           String(role.roleId) === String(user.roleId) ||
//           role.name.toLowerCase() ===
//             String(user.role ?? "").toLowerCase()
//       );

//       const selectedRoleId =
//         user.roleId ??
//         matchingRole?.roleId ??
//         defaultRoleId ??
//         "";

//       reset({
//         fullName: user.fullName ?? "",
//         username: user.username ?? "",
//         email: user.email ?? "",
//         roleId: selectedRoleId,
//         password: "",
//         confirmPassword: "",
//       });

//       return;
//     }

//     if (mode === "add") {
//       const matchingDefaultRole = roles.find(
//         (role) => String(role.roleId) === String(defaultRoleId)
//       );

//       reset({
//         fullName: "",
//         username: "",
//         email: "",
//         roleId: matchingDefaultRole?.roleId ?? "",
//         password: "",
//         confirmPassword: "",
//       });
//     }
//   }, [
//     mode,
//     user,
//     id,
//     roles,
//     rolesLoading,
//     reset,
//     defaultRoleId,
//   ]);

//   const onSubmit = async (data: UserFormData) => {
//     if (isSubmitting) return;

//     if (data.roleId === "") {
//       showSnackbar("Please select a role.", {
//         type: "error",
//         duration: 3000,
//       });
//       return;
//     }

//     const finalRoleId =
//       lockRole && defaultRoleId !== undefined
//         ? defaultRoleId
//         : data.roleId;

//     if (mode === "add") {
//       if (data.password !== data.confirmPassword) {
//         showSnackbar("Password and confirm password do not match.", {
//           type: "error",
//           duration: 3000,
//         });
//         return;
//       }

//       const payload: AdminUserPayload = {
//         fullName: data.fullName.trim(),
//         username: data.username.trim(),
//         email: data.email.trim(),
//         password: data.password,
//          roleId: [String(finalRoleId)],
//       };

//       setIsSubmitting(true);

//       try {
//         const response = await addAdminUser(payload);

//         showSnackbar(
//           response.data?.message ||
//             response.data?.Message ||
//             "User added successfully.",
//           { type: "success", duration: 3000 }
//         );

//         navigate(backPath);
//       } catch (error: any) {
//         showSnackbar(
//           error?.response?.data?.message ||
//             error?.response?.data?.Message ||
//             error?.message ||
//             "Something went wrong. Please try again.",
//           { type: "error", duration: 3000 }
//         );
//       } finally {
//         setIsSubmitting(false);
//       }

//       return;
//     }

//     if (mode === "edit" && id) {
//       const payload: AdminUserUpdatePayload = {
//         id,
//         fullName: data.fullName.trim(),
//         username: data.username.trim(),
//         email: data.email.trim(),
//         roleId: [String(finalRoleId)],
//       };

//       setIsSubmitting(true);

//       try {
//         const response = await editAdminUser(payload, id);

//         showSnackbar(
//           response.data?.message ||
//             response.data?.Message ||
//             "User details updated successfully.",
//           { type: "success", duration: 3000 }
//         );

//         navigate(backPath);
//       } catch (error: any) {
//         showSnackbar(
//           error?.response?.data?.message ||
//             error?.response?.data?.Message ||
//             error?.message ||
//             "Something went wrong. Please try again.",
//           { type: "error", duration: 3000 }
//         );
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

//   return (
//     <UserForm
//       title={
//         mode === "add"
//           ? t("pages.userManagement.addUser")
//           : t("pages.userManagement.editUser")
//       }
//       subtitle="Enter the details."
//       control={control}
//       handleSubmit={handleSubmit}
//       onSubmit={onSubmit}
//       roleOptions={roleOptions}
//       rolesLoading={rolesLoading}
//       isSubmitting={isSubmitting}
//       mode={mode}
//       passwordsMatch={passwordsMatch}
//       showPassword={showPassword}
//       onShowPasswordChange={setShowPassword}
//       onBack={() => navigate(backPath)}
//       submitLabel={
//         mode === "add"
//           ? t("pages.userManagement.addUser")
//           : t("pages.userManagement.saveChanges")
//       }
//       backLabel={t("pages.userManagement.goBack")}
//     />
//   );
// };

// export default AddUser;


import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";

import { useSnackbar } from "../../../Context/SnackbarContext";

import {
  addAdminUser,
  editAdminUser,
  getAllRoles,
} from "../Services/AdminUsermanagementService";

import type {
  AdminUserPayload,
  AdminUserUpdatePayload,
  IdType,
  Role,
  RoleOption,
} from "../Services/AdminUsermanagementModel";

import UserForm from "./UserForm";

interface UserFormData {
  fullName: string;
  username: string;
  email: string;
  roleId: IdType | "";
  password: string;
  confirmPassword: string;
}

interface EditUserData {
  id?: IdType;
  fullName?: string;
  username?: string;
  email?: string;
  active?: boolean | null;
  roleId?: IdType | IdType[] | null;
  roleIds?: IdType[];
  roleNames?: string[];
  role?: string;
  roles?: Role[];
}

interface UserManagementLocationState {
  user?: EditUserData;
  from?: string;
  returnTab?: string;
  returnPage?: number;
  defaultRoleId?: IdType;
  lockRole?: boolean;
}

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
    "Something went wrong. Please try again."
  );
};

const AddUser: React.FC = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();

  const locationState =
    location.state as UserManagementLocationState | null;

  const user = locationState?.user;
  const mode: "add" | "edit" = id ? "edit" : "add";

  const defaultRoleId = locationState?.defaultRoleId;
  const lockRole = Boolean(locationState?.lockRole);

  const returnTab = locationState?.returnTab || "users";
  const returnPage = Number(locationState?.returnPage) || 1;

  const backPath =
    locationState?.from ||
    `/user-management?tab=${encodeURIComponent(returnTab)}&page=${returnPage}`;

  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
  } = useForm<UserFormData>({
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      roleId: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const passwordsMatch =
    Boolean(confirmPassword) && password === confirmPassword;

  const roleOptions: RoleOption[] = roles.map((role) => ({
    label: role.name,
    value: role.roleId,
  }));

  // Load dynamic roles from GET /Role.
  useEffect(() => {
    let isMounted = true;

    const loadRoles = async () => {
      setRolesLoading(true);

      try {
        const response = await getAllRoles();

        if (!isMounted) return;

        const responseData = response.data as unknown;

        let roleList: Role[] = [];

        if (Array.isArray(responseData)) {
          roleList = responseData as Role[];
        } else if (
          responseData &&
          typeof responseData === "object" &&
          "data" in responseData &&
          Array.isArray((responseData as { data: unknown }).data)
        ) {
          roleList = (responseData as { data: Role[] }).data;
        } else if (
          responseData &&
          typeof responseData === "object" &&
          "result" in responseData &&
          Array.isArray((responseData as { result: unknown }).result)
        ) {
          roleList = (responseData as { result: Role[] }).result;
        }

        setRoles(
          roleList.filter(
            (role) =>
              role.roleId !== undefined &&
              role.roleId !== null &&
              Boolean(role.name)
          )
        );
      } catch (error: unknown) {
        if (!isMounted) return;

        showSnackbar(getErrorMessage(error), {
          type: "error",
          duration: 3000,
        });
      } finally {
        if (isMounted) {
          setRolesLoading(false);
        }
      }
    };

    void loadRoles();

    return () => {
      isMounted = false;
    };
  }, [showSnackbar]);

  // Populate the form after roles have loaded.
  useEffect(() => {
    if (rolesLoading) return;

    if (mode === "edit" && user) {

      let userRoleIds: IdType[] = [];

      if (Array.isArray(user.roleIds)) {
        userRoleIds = user.roleIds.map(String);
      } else if (Array.isArray(user.roleId)) {
        userRoleIds = user.roleId.map(String);
      } else if (user.roleId) {
        userRoleIds = [String(user.roleId)];
      }

      const userRoleNames: string[] = Array.isArray(user.roleNames)
        ? user.roleNames.map(String)
        : user.roles?.map((role) => role.name).filter(Boolean) ?? [];

      // Match the role by ID first; fall back to the role name.
      const matchingRole = roles.find(
        (role) =>
          userRoleIds.some(
            (roleId) => String(role.roleId) === String(roleId)
          ) ||
          userRoleNames.some(
            (roleName) =>
              role.name.toLowerCase() === roleName.toLowerCase()
          ) ||
          role.name.toLowerCase() ===
            String(user.role ?? "").toLowerCase()
      );

      const selectedRoleId =
        matchingRole?.roleId ??
        userRoleIds[0] ??
        defaultRoleId ??
        "";

      reset({
        fullName: user.fullName ?? "",
        username: user.username ?? "",
        email: user.email ?? "",
        roleId: selectedRoleId,
        password: "",
        confirmPassword: "",
      });

      return;
    }

    if (mode === "add") {
      const matchingDefaultRole = roles.find(
        (role) => String(role.roleId) === String(defaultRoleId)
      );

      reset({
        fullName: "",
        username: "",
        email: "",
        roleId: matchingDefaultRole?.roleId ?? "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [mode, user, roles, rolesLoading, reset, defaultRoleId]);

  const onSubmit = async (data: UserFormData) => {
    if (isSubmitting) return;

    if (!data.roleId) {
      showSnackbar("Please select a role.", {
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (lockRole && !defaultRoleId) {
      showSnackbar("The default role could not be determined.", {
        type: "error",
        duration: 3000,
      });
      return;
    }

    const finalRoleId: IdType = lockRole
      ? String(defaultRoleId)
      : String(data.roleId);

    if (mode === "add") {
      if (!data.password) {
        showSnackbar("Please enter a password.", {
          type: "error",
          duration: 3000,
        });
        return;
      }

      if (data.password !== data.confirmPassword) {
        showSnackbar("Password and confirm password do not match.", {
          type: "error",
          duration: 3000,
        });
        return;
      }

      const payload: AdminUserPayload = {
        fullName: data.fullName.trim(),
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
        roleId: [finalRoleId],
      };

      setIsSubmitting(true);

      try {
        const response = await addAdminUser(payload);

        showSnackbar(
          response.data?.message ||
            response.data?.Message ||
            "User added successfully.",
          { type: "success", duration: 3000 }
        );

        navigate(backPath);
      } catch (error: unknown) {
        showSnackbar(getErrorMessage(error), {
          type: "error",
          duration: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    if (mode === "edit" && id) {
      const payload: AdminUserUpdatePayload = {
        id,
        fullName: data.fullName.trim(),
        username: data.username.trim(),
        email: data.email.trim(),
        roleId: [finalRoleId],
      };

      setIsSubmitting(true);

      try {
        const response = await editAdminUser(payload, id);

        showSnackbar(
          response.data?.message ||
            response.data?.Message ||
            "User details updated successfully.",
          { type: "success", duration: 3000 }
        );

        navigate(backPath);
      } catch (error: unknown) {
        showSnackbar(getErrorMessage(error), {
          type: "error",
          duration: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <UserForm
      title={
        mode === "add"
          ? t("pages.userManagement.addUser")
          : t("pages.userManagement.editUser")
      }
      subtitle="Enter the details."
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      roleOptions={roleOptions}
      rolesLoading={rolesLoading}
      isSubmitting={isSubmitting}
      mode={mode}
      passwordsMatch={passwordsMatch}
      showPassword={showPassword}
      onShowPasswordChange={setShowPassword}
      onBack={() => navigate(backPath)}
      submitLabel={
        mode === "add"
          ? t("pages.userManagement.addUser")
          : t("pages.userManagement.saveChanges")
      }
      backLabel={t("pages.userManagement.goBack")}
    />
  );
};

export default AddUser;

