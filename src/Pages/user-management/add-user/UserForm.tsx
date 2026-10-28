import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Check, CheckCheck, Eye, EyeOff, Key, Mail, Save, Undo2, X } from "lucide-react";

import FormInput from "../../../components/inputs/FormInput";
import SelectionInput from "../../../components/inputs/SelectInput";
import { getPasswordStrength, getStrengthLabel, getStrengthWidth } from "../../../helper/passwordStrengthChecker";
import Button from "../../../components/buttons/Button";

interface UserRoleOption {
    label: string;
    value: number;
}

interface UserFormProps {
    title: string;
    subtitle: string;
    control: any;
    handleSubmit: any;
    onSubmit: (data: any) => void;
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

const UserForm: React.FC<UserFormProps> = ({
    title,
    subtitle,
    control,
    handleSubmit,
    onSubmit,
    roleOptions,
    mode,
    password,
    passwordsMatch,
    showPassword,
    onShowPasswordChange,
    onBack,
    submitLabel,
    backLabel,
}) => {
    return (
        <div className="flex flex-col items-center p-4 font-sans">
            <div className="w-full bg-white p-8 rounded-md shadow border border-gray-100">
                <div className="mb-6 text-left">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <p className="text-gray-500 mt-1">{subtitle}</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <Controller
                            name="name"
                            control={control}
                            rules={{
                                required: "Name is required",
                                minLength: {
                                    value: 3,
                                    message: "Name must be at least 3 characters",
                                },
                                maxLength: {
                                    value: 20,
                                    message: "Name cannot exceed 20 characters",
                                },
                                pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message: "Name can contain only letters and spaces",
                                },
                            }}
                            render={({ field, fieldState }) => (
                                <FormInput
                                    label="Name"
                                    placeholder="Enter full name"
                                    {...field}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        {/* Email Field */}
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address",
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

                        {/* Role Field */}
                        <Controller
                            name="roleId"
                            control={control}
                            rules={{ required: "Role is required" }}
                            render={({ field, fieldState }) => (
                                <SelectionInput
                                    label="Role"
                                    placeholder="Select Role"
                                    options={roleOptions}
                                    value={field.value}
                                    onChange={(value) => field.onChange(Number(value))}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        {/* Password Field (Add mode only) */}
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
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
                                        message: "Must include uppercase, lowercase, number, and special character",
                                    },
                                }}
                                render={({ field, fieldState }) => {
                                    const currentPassword = field.value || "";
                                    const [showPopover, setShowPopover] = useState(false);

                                    const strength = getPasswordStrength(currentPassword);
                                    const strengthLabel = getStrengthLabel(strength);
                                    const strengthWidth = getStrengthWidth(strength);

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
                                                error={fieldState.error?.message}
                                                onFocus={() => setShowPopover(true)}
                                                onBlur={() => setTimeout(() => setShowPopover(false), 150)}
                                            />

                                            {/* Strength Popover */}
                                            {showPopover && (
                                                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                                                    <ul className="text-xs space-y-1 mb-3">
                                                        <li className={`flex items-center gap-1 ${checks.length ? "text-green-600" : "text-red-600"}`}>
                                                            {checks.length ? <CheckCheck size={15} /> : <X size={15} />} At least 6 characters
                                                        </li>
                                                        <li className={`flex items-center gap-1 ${checks.lowercase ? "text-green-600" : "text-red-600"}`}>
                                                            {checks.lowercase ? <CheckCheck size={15} /> : <X size={15} />} Lowercase letter
                                                        </li>
                                                        <li className={`flex items-center gap-1 ${checks.uppercase ? "text-green-600" : "text-red-600"}`}>
                                                            {checks.uppercase ? <CheckCheck size={15} /> : <X size={15} />} Uppercase letter
                                                        </li>
                                                        <li className={`flex items-center gap-1 ${checks.number ? "text-green-600" : "text-red-600"}`}>
                                                            {checks.number ? <CheckCheck size={15} /> : <X size={15} />} Number
                                                        </li>
                                                        <li className={`flex items-center gap-1 ${checks.special ? "text-green-600" : "text-red-600"}`}>
                                                            {checks.special ? <CheckCheck size={15} /> : <X size={15} />} Special character
                                                        </li>
                                                    </ul>

                                                    {currentPassword && (
                                                        <>
                                                            <div className="h-2 w-full bg-gray-200 rounded">
                                                                <div
                                                                    className={`h-2 rounded transition-all duration-300 ${
                                                                        strength <= 2
                                                                            ? "bg-red-500"
                                                                            : strength <= 4
                                                                            ? "bg-yellow-500"
                                                                            : "bg-green-500"
                                                                    } ${strengthWidth}`}
                                                                />
                                                            </div>
                                                            <p
                                                                className={`text-[.6rem] mt-1 ${
                                                                    strength <= 2
                                                                        ? "text-red-500"
                                                                        : strength <= 4
                                                                        ? "text-yellow-500"
                                                                        : "text-green-500"
                                                                }`}
                                                            >
                                                                {strengthLabel}
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }}
                            />
                        )}

                        {/* Confirm Password Field (Add mode only) */}
                        {mode === "add" && (
                            <Controller
                                name="confirmPassword"
                                control={control}
                                rules={{
                                    required: "Confirm password is required",
                                    validate: (value) => value === password || "Passwords do not match",
                                }}
                                render={({ field, fieldState }) => (
                                    <FormInput
                                        label="Confirm Password"
                                        type="password"
                                        placeholder="Confirm password"
                                        leftIcon={
                                            <Check
                                                size={18}
                                                className={passwordsMatch ? "text-green-500" : "text-red-500"}
                                            />
                                        }
                                        {...field}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                        )}
                    </div>

                    {/* Action Buttons */}
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