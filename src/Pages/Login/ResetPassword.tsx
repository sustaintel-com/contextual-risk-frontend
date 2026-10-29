import { useNavigate, useSearchParams } from "react-router";
import { useSnackbar } from "../../Context/SnackbarContext";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { resetPassword } from "./Services/AuthService";
import backgroundImage from '../../assets/Contextual Risk Radar Dashboard.png';
import logoImage from '../../assets/icons/Contextual Risk Radar Logo.png';
import { KeyRound, ShieldCheck, XCircle , Lock, EyeOff, Eye, CheckCircle2} from "lucide-react";
import FormInput from "../../components/inputs/FormInput";
import companyLogoImage from '../../assets/logo_comp.png';


interface ResetPasswordFormValues {
    newPassword: string;
    confirmPassword: string;
}

const PASSWORD_RULES = [
    { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
    { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
    { label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
    { label: "One number", test: (v: string) => /[0-9]/.test(v) },
    { label: "One special character", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const REDIRECT_DELAY_MS = 3000;
const LOGIN_PATH = "/login";

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showPromiseSnackbar } = useSnackbar();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isResetSuccessful, setIsResetSuccessful] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(REDIRECT_DELAY_MS / 1000);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({ mode: "onChange" });

    const token = searchParams.get("token") || "";
    const newPassword = watch("newPassword", "");
    const confirmPassword = watch("confirmPassword", "");

    const passedRules = PASSWORD_RULES.filter((rule) => rule.test(newPassword));
    const isPasswordStrong = passedRules.length === PASSWORD_RULES.length;
    const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

    const strengthScore = passedRules.length; // 0-5
    const strengthLabel =
        strengthScore <= 2 ? "Weak" : strengthScore <= 4 ? "Medium" : "Strong";
    const strengthColor =
        strengthScore <= 2 ? "bg-red-500" : strengthScore <= 4 ? "bg-amber-500" : "bg-green-600";

    const onSubmit: SubmitHandler<ResetPasswordFormValues> = (data) => {
        if (!token || !isPasswordStrong || data.newPassword !== data.confirmPassword) return;

        showPromiseSnackbar(
            resetPassword({ token, newPassword: data.newPassword }),
            {
                loading: "Resetting password...",
                success: "Password reset successfully!",
                error: "Unable to reset password. The link may be invalid or expired.",
            }
        )
            .then(() => setIsResetSuccessful(true))
            .catch(() => undefined);
    };

    // Auto-redirect to login after success, with a live countdown
    useEffect(() => {
        if (!isResetSuccessful) return;

        setSecondsLeft(REDIRECT_DELAY_MS / 1000);

        const countdownInterval = setInterval(() => {
            setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 0));
        }, 1000);

        const redirectTimeout = setTimeout(() => {
            navigate(LOGIN_PATH, { replace: true });
        }, REDIRECT_DELAY_MS);

        return () => {
            clearInterval(countdownInterval);
            clearTimeout(redirectTimeout);
        };
    }, [isResetSuccessful, navigate]);

    return (
        <div
            className="flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat p-4"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="w-full max-w-[380px] rounded-xl bg-white/80 p-8 shadow-xl backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-2">
                    <img src={logoImage} alt="Logo" className="h-8 rounded-r-full bg-[#EEE1DD] p-1" />
                </div>

                <div className="mb-6 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEE1DD] text-[#A06E58]">
                        <KeyRound size={18} />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-sky-900 leading-tight">Reset password</h1>
                        <p className="text-xs text-gray-600">Create a new password for your account</p>
                    </div>
                </div>

                {!token ? (
                    <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-red-700 ring-1 ring-red-200">
                        <XCircle size={16} className="mt-0.5 shrink-0" />
                        <p className="text-sm">This password reset link is invalid or has expired.</p>
                    </div>
                ) : isResetSuccessful ? (
                    <div className="space-y-3">
                        <div className="flex items-start gap-2 rounded-md bg-green-50 p-3 text-green-700 ring-1 ring-green-200">
                            <ShieldCheck size={18} className="mt-0.5 shrink-0" />
                            <p className="text-sm">Your password has been reset successfully.</p>
                        </div>
                        <p className="text-center text-[.7rem] text-gray-500">
                            Redirecting to login in {secondsLeft}s...
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate(LOGIN_PATH, { replace: true })}
                            className="flex w-full items-center justify-center gap-2 bg-[#A06E58] py-2 text-sm font-semibold text-white shadow transition hover:bg-[#8e5f4c]"
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <FormInput
                            label="New Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            required
                            error={errors.newPassword}
                            leftIcon={<Lock size={16} className="text-gray-400" />}
                            rightIcon={
                                showPassword ? (
                                    <EyeOff size={18} onClick={() => setShowPassword(false)} className="cursor-pointer text-gray-500" />
                                ) : (
                                    <Eye size={18} onClick={() => setShowPassword(true)} className="cursor-pointer text-gray-500" />
                                )
                            }
                            registration={register("newPassword", {
                                required: "New password is required",
                                validate: (value) =>
                                    PASSWORD_RULES.every((rule) => rule.test(value)) ||
                                    "Password does not meet all requirements",
                            })}
                        />

                        {newPassword.length > 0 && (
                            <div>
                                <div className="flex gap-1">
                                    {PASSWORD_RULES.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 flex-1 rounded-full ${
                                                idx < strengthScore ? strengthColor : "bg-gray-200"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p
                                    className={`mt-1 text-[.65rem] font-medium ${
                                        strengthScore <= 2
                                            ? "text-red-600"
                                            : strengthScore <= 4
                                            ? "text-amber-600"
                                            : "text-green-700"
                                    }`}
                                >
                                    {strengthLabel} password
                                </p>
                            </div>
                        )}

                        <ul className="grid grid-cols-1 gap-1 rounded-md bg-gray-50 p-3 ring-1 ring-gray-100">
                            {PASSWORD_RULES.map((rule) => {
                                const passed = rule.test(newPassword);
                                return (
                                    <li
                                        key={rule.label}
                                        className={`flex items-center gap-1.5 text-[.65rem] ${
                                            passed ? "text-green-700" : "text-gray-500"
                                        }`}
                                    >
                                        {passed ? (
                                            <CheckCircle2 size={13} className="shrink-0" />
                                        ) : (
                                            <XCircle size={13} className="shrink-0 text-gray-300" />
                                        )}
                                        {rule.label}
                                    </li>
                                );
                            })}
                        </ul>

                        <FormInput
                            label="Confirm New Password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            required
                            error={errors.confirmPassword}
                            leftIcon={<Lock size={16} className="text-gray-400" />}
                            rightIcon={
                                showConfirmPassword ? (
                                    <EyeOff size={18} onClick={() => setShowConfirmPassword(false)} className="cursor-pointer text-gray-500" />
                                ) : (
                                    <Eye size={18} onClick={() => setShowConfirmPassword(true)} className="cursor-pointer text-gray-500" />
                                )
                            }
                            registration={register("confirmPassword", {
                                required: "Confirm password is required",
                                validate: (value) => value === newPassword || "Passwords do not match",
                            })}
                        />

                        {confirmPassword.length > 0 && (
                            <p
                                className={`flex items-center gap-1 text-[.65rem] ${
                                    passwordsMatch ? "text-green-700" : "text-red-600"
                                }`}
                            >
                                {passwordsMatch ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={!isPasswordStrong || !passwordsMatch}
                            className="mt-3 flex w-full items-center justify-center gap-2 bg-[#A06E58] py-2 text-sm font-semibold text-white shadow transition hover:bg-[#8e5f4c] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                        >
                            <ShieldCheck size={16} />
                            Reset Password
                        </button>
                    </form>
                )}

                <div className="mt-8 flex flex-col items-end text-right text-[.5rem] font-semibold text-[#99553a]">
                    <span>Developed and maintained by:</span>
                    <img src={companyLogoImage} alt="sustaintelligence logo" className="mt-1 h-4" />
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;