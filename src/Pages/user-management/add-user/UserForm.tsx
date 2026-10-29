
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Check,
  CheckCheck,
  Eye,
  EyeOff,
  Key,
  Mail,
  Save,
  Undo2,
  User as UserIcon,
  X,
} from "lucide-react";

import FormInput from "../../../components/inputs/FormInput";
import SelectionInput from "../../../components/inputs/SelectInput";
import {
  getPasswordStrength,
  getStrengthLabel,
  getStrengthWidth,
} from "../../../helper/passwordStrengthChecker";
import Button from "../../../components/buttons/Button";

interface UserRoleOption {
  label: string;
  value: number;
}

interface UserFormData {
  fullName: string;
  username: string;
  email: string;
  roleId: number;
  password?: string;
  confirmPassword?: string;
}

interface UserFormProps {
  title: string;
  subtitle: string;
  control: any;
  handleSubmit: any;
  onSubmit: (data: UserFormData) => void;
  roleOptions: UserRoleOption[];
  mode: "add" | "edit";
  password?: string;
  passwordsMatch: boolean;
  showPassword: boolean;
  onShowPasswordChange: (show: boolean) => void;
  onBack: () => void;
  submitLabel: string;
  backLabel: string;
}

interface PasswordFieldProps {
  field: any;
  error?: string;
  showPassword: boolean;
  onShowPasswordChange: (show: boolean) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  field,
  error,
  showPassword,
  onShowPasswordChange,
}) => {
  const [showPopover, setShowPopover] = useState(false);

  const currentPassword = field.value || "";
  const strength = getPasswordStrength(currentPassword);

  const checks = {
    length: currentPassword.length >= 6,
    lowercase: /[a-z]/.test(currentPassword),
    uppercase: /[A-Z]/.test(currentPassword),
    number: /\d/.test(currentPassword),
    special: /[^A-Za-z0-9]/.test(currentPassword),
  };

  return (
    <div className="relative">
      <FormInput
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter password"
        leftIcon={<Key size={18} />}
        rightIcon={
          showPassword ? (
            <EyeOff
              size={18}
              onClick={() => onShowPasswordChange(false)}
              className="cursor-pointer text-gray-500"
            />
          ) : (
            <Eye
              size={18}
              onClick={() => onShowPasswordChange(true)}
              className="cursor-pointer text-gray-500"
            />
          )
        }
        {...field}
        error={error}
        onFocus={() => setShowPopover(true)}
        onBlur={() => {
          field.onBlur();
          setShowPopover(false);
        }}
      />

      {showPopover && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <ul className="mb-3 space-y-1 text-xs">
            {Object.entries(checks).map(([key, passed]) => {
              const labels: Record<string, string> = {
                length: "At least 6 characters",
                lowercase: "Lowercase letter",
                uppercase: "Uppercase letter",
                number: "Number",
                special: "Special character",
              };

              return (
                <li
                  key={key}
                  className={`flex items-center gap-1 ${
                    passed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {passed ? <CheckCheck size={15} /> : <X size={15} />}
                  {labels[key]}
                </li>
              );
            })}
          </ul>

          {currentPassword && (
            <>
              <div className="h-2 w-full rounded bg-gray-200">
                <div
                  className={`h-2 rounded transition-all duration-300 ${
                    strength <= 2
                      ? "bg-red-500"
                      : strength <= 4
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  } ${getStrengthWidth(strength)}`}
                />
              </div>
              <p className="mt-1 text-xs">
                {getStrengthLabel(strength)}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const UserForm: React.FC<UserFormProps> = ({
  title,
  subtitle,
  control,
  handleSubmit,
  onSubmit,
  roleOptions,
  mode,
  passwordsMatch,
  showPassword,
  onShowPasswordChange,
  onBack,
  submitLabel,
  backLabel,
}) => {
  return (
    <div className="flex flex-col items-center p-4 font-sans">
      <div className="w-full rounded-md border border-gray-100 bg-white p-8 shadow">
        <div className="mb-6 text-left">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="mt-1 text-gray-500">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Full Name */}
            <Controller
              name="fullName"
              control={control}
              rules={{
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Full name must be at least 3 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Full name cannot exceed 100 characters",
                },
                pattern: {
                  value: /^[A-Za-z\s.'-]+$/,
                  message:
                    "Full name can contain letters, spaces, apostrophes, periods and hyphens",
                },
              }}
              render={({ field, fieldState }) => (
                <FormInput
                  label="Full Name"
                  placeholder="Enter full name"
                  leftIcon={<UserIcon size={18} />}
                  {...field}
                  error={fieldState.error?.message}
                />
              )}
            />

            {/* Username: directly after Full Name */}
            <Controller
              name="username"
              control={control}
              rules={{
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Username cannot exceed 50 characters",
                },
                pattern: {
                  value: /^[A-Za-z0-9._-]+$/,
                  message:
                    "Username can contain letters, numbers, dots, underscores and hyphens",
                },
              }}
              render={({ field, fieldState }) => (
                <FormInput
                  label="Username"
                  placeholder="Enter username"
                  leftIcon={<UserIcon size={18} />}
                  {...field}
                  error={fieldState.error?.message}
                />
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              }}
              render={({ field, fieldState }) => (
                <FormInput
                  label="Email"
                  placeholder="john.doe@example.com"
                  leftIcon={<Mail size={18} />}
                  {...field}
                  error={fieldState.error?.message}
                />
              )}
            />

            {/* Role */}
            <Controller
              name="roleId"
              control={control}
              rules={{
                required: "Role is required",
                validate: (value) =>
                  Number(value) > 0 || "Please select a role",
              }}
              render={({ field, fieldState }) => (
                <SelectionInput
                  label="Role"
                  placeholder="Select Role"
                  options={roleOptions}
                  value={field.value}
                  onChange={(value: number | string) =>
                    field.onChange(Number(value))
                  }
                  error={fieldState.error?.message}
                />
              )}
            />

            {/* Password: only when adding */}
            {mode === "add" && (
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
                    message:
                      "Must include uppercase, lowercase, number and special character",
                  },
                }}
                render={({ field, fieldState }) => (
                  <PasswordField
                    field={field}
                    error={fieldState.error?.message}
                    showPassword={showPassword}
                    onShowPasswordChange={onShowPasswordChange}
                  />
                )}
              />
            )}

            {/* Confirm Password: only when adding */}
            {mode === "add" && (
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Confirm password is required",
                  validate: (value, formValues) =>
                    value === formValues.password ||
                    "Passwords do not match",
                }}
                render={({ field, fieldState }) => (
                  <FormInput
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm password"
                    leftIcon={
                      <Check
                        size={18}
                        className={
                          passwordsMatch
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      />
                    }
                    {...field}
                    error={fieldState.error?.message}
                  />
                )}
              />
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              label={backLabel}
              size="sm"
              variant="danger"
              type="button"
              icon={<Undo2 size={18} />}
              onClick={onBack}
            />

            <Button
              label={submitLabel}
              size="sm"
              variant="success"
              type="submit"
              icon={<Save size={18} />}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
