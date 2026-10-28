import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";
import { useSnackbar } from "../../../Context/SnackbarContext";
import {
  addAdminUser,
  editAdminUser,
} from "../Services/AdminUsermanagementService";
import UserForm from "./UserForm";
import type { AdminUserPayload, AdminUserUpdatePayload } from "../Services/AdminUsermanagementModel";

const roleList: Record<string, number> = {
  Admin: 1,
  User: 2,
};

const roleCatalog = [
  { label: "User", value: 2 },
  { label: "Admin", value: 1 },
];

interface UserFormData {
  email: string;
  roleId: number;
  password?: string;
  name: string;
  confirmPassword?: string;
}

const AddUser: React.FC = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();

  const user = location.state?.user;
  const mode = id ? "edit" : "add";

  const defaultRoleId = Number(location.state?.defaultRoleId) || 2;
  const lockRole = Boolean(location.state?.lockRole);
  const returnTab = location.state?.returnTab || "users";
  const returnPage = Number(location.state?.returnPage) || 1;

  const backPath =
    location.state?.from ||
    `/user-management?tab=${returnTab}&page=${returnPage}`;

  const {
    control,
    handleSubmit,
    watch,
    reset,
  } = useForm<UserFormData>({
    defaultValues: {
      email: "",
      roleId: defaultRoleId,
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const passwordsMatch =
    Boolean(confirmPassword) && password === confirmPassword;

  useEffect(() => {
    if (mode === "edit" && user) {
      reset({
        email: user.email ?? "",
        roleId: Number(roleList[user.role]) || defaultRoleId,
        password: "",
        name: user.name ?? "",
        confirmPassword: "",
      });
    } else if (mode === "add") {
      reset({
        email: "",
        roleId: defaultRoleId,
        password: "",
        name: "",
        confirmPassword: "",
      });
    }
  }, [mode, user, id, reset, defaultRoleId]);

  const onSubmit = async (data: UserFormData) => {
    if (isSubmitting) return;

    const finalRoleId = lockRole ? defaultRoleId : Number(data.roleId);

    if (mode === "add") {
      if (data.password !== data.confirmPassword) {
        showSnackbar("Password and confirm password do not match.", {
          type: "error",
          duration: 3000,
        });
        return;
      }

      const payload: AdminUserPayload = {
        email: data.email,
        password: data.password || "",
        roleId: finalRoleId,
        name: data.name,
      };

      setIsSubmitting(true);
      try {
        const response = await addAdminUser(payload);
        showSnackbar(
          response.data.message || "User added successfully",
          { type: "success", duration: 3000 }
        );
        navigate(backPath);
      } catch (error: any) {
        showSnackbar(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong. Please try again.",
          { type: "error", duration: 3000 }
        );
      } finally {
        setIsSubmitting(false);
      }
    } else if (mode === "edit" && id) {
      const payload: AdminUserUpdatePayload = {
        email: data.email,
        roleId: finalRoleId,
        name: data.name,
      };

      setIsSubmitting(true);
      try {
        const response = await editAdminUser(payload, parseInt(id, 10));
        showSnackbar(
          response.data.message || "User details updated successfully",
          { type: "success", duration: 3000 }
        );
        navigate(backPath);
      } catch (error: any) {
        showSnackbar(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong. Please try again.",
          { type: "error", duration: 3000 }
        );
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
      roleOptions={roleCatalog}
      mode={mode}
      password={password}
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