import React, { useState } from "react";
import { Eye, EyeOff, SendHorizontal } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { useSnackbar } from "../../Context/SnackbarContext";
import { useAppDispatch } from "../../redux-store/hooks";

import type { LoginFormInputs } from "./Services/AuthModel";
import { forgotPassword, userLogin } from "./Services/AuthService";

import { login } from "../../redux-store/Slises/authSlice";

import backgroundImage from "../../assets/Contextual Risk Radar Dashboard.png";
import logoImage from "../../assets/icons/Contextual Risk Radar Logo.png";
import companyLogoImage from "../../assets/logo_comp.png";

const LoginPage: React.FC = () => {
    const { showPromiseSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>();

    const [showPassword, setShowPassword] = useState(false);

    const [isForgotPasswordOpen, setIsForgotPasswordOpen] =
        useState(false);

    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotEmailError, setForgotEmailError] = useState("");
    const [isResetLinkSent, setIsResetLinkSent] = useState(false);
    const [isSendingResetLink, setIsSendingResetLink] = useState(false);

    // Toggle password visibility.
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    // Open forgot password popover.
    const openForgotPassword = () => {
        setForgotEmailError("");
        setIsResetLinkSent(false);
        setIsForgotPasswordOpen(true);
    };


    // Send forgot password link.
    const sendResetPasswordLink = async () => {
        const email = forgotEmail.trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setForgotEmailError("Email is not valid");
            return;
        }

        if (isSendingResetLink) return;

        try {
            setForgotEmailError("");
            setIsSendingResetLink(true);

            await showPromiseSnackbar(
                forgotPassword(email),
                {
                    loading: "Sending reset password link...",
                    success: "Reset password link sent successfully!",
                    error: "Unable to send reset password link. Please try again.",
                }
            );

            setIsResetLinkSent(true);
        } catch (error) {
            console.error("Forgot password error:", error);
        } finally {
            setIsSendingResetLink(false);
        }
    };

    // Login using cookie authentication.
    const onSubmit: SubmitHandler<LoginFormInputs> = async (userData) => {
        try {
            const response = await showPromiseSnackbar(
                userLogin(userData),
                {
                    loading: "Logging in...",
                    success: "Login successful!",
                    error: "Login failed! Please check your credentials.",
                }
            );

            // Backend returns { user: User }.
            if (response.data?.user) {
                dispatch(login(response.data.user));
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <div
            className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center md:justify-end"
            style={{
                backgroundImage: `url(${backgroundImage})`,
            }}
        >
            <div className="bg-white/75 rounded-xl shadow-lg p-8 w-full max-w-[350px] md:mr-20">

                {/* Logo */}
                <div className="flex items-center gap-2 mb-4 justify-center">
                    <img
                        src={logoImage}
                        alt="Contextual Risk Logo"
                        className="h-15 w-30 rounded-r-full"
                    />
                </div>

                {/* Login Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-2"
                >
                    {/* Username / Email */}
                    <div>
                        <input
                            type="text"
                            id="username"
                            autoComplete="username"
                            className="w-full px-4 py-3 outline-none focus:border-l-4 focus:border-l-[#A06E58] transition duration-200 bg-white text-gray-800 text-xs font-semibold"
                            placeholder="Email"
                            {...register("username", {
                                required: "Email is required",
                            })}
                        />

                        {errors.username && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                autoComplete="current-password"
                                className="w-full px-4 py-3 outline-none focus:border-l-4 focus:border-l-[#A06E58] transition duration-200 pr-10 bg-white text-gray-800 text-xs font-semibold"
                                placeholder="Password"
                                {...register("password", {
                                    required: "Password is required",
                                })}
                            />

                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#A06E58] text-white font-semibold py-1.5 shadow hover:bg-[#8e5f4c] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>

                    {/* Forgot Password */}
                    <div className="relative flex items-center justify-between text-[.7rem] text-gray-700 mt-2">

                        <button
                            type="button"
                            onClick={openForgotPassword}
                            className="text-sky-900 hover:underline"
                        >
                            Forgot Password?
                        </button>

                        {isForgotPasswordOpen && (
                            <div className="absolute left-0 bottom-7 z-10 w-72 rounded-md bg-white p-4 text-left shadow-lg ring-1 ring-gray-200">

                                {/* Popover Arrow */}
                                <div className="absolute -bottom-2 left-4 h-4 w-4 rotate-45 bg-white" />

                                {/* Popover Header */}
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-sm font-semibold text-gray-800">
                                        Reset password
                                    </h2>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsForgotPasswordOpen(false)
                                        }
                                        className="text-lg leading-none text-gray-500 hover:text-gray-800"
                                        aria-label="Close reset password popover"
                                    >
                                        &times;
                                    </button>
                                </div>

                                <p className="mb-3 text-[.65rem] text-gray-600">
                                    Enter your registered email to receive a reset password link.
                                </p>

                                {/* Email Input */}
                                <input
                                    type="email"
                                    value={forgotEmail}
                                    onChange={(event) => {
                                        setForgotEmail(event.target.value);
                                        setForgotEmailError("");
                                        setIsResetLinkSent(false);
                                    }}
                                    placeholder="Registered email"
                                    aria-label="Registered email"
                                    aria-invalid={Boolean(forgotEmailError)}
                                    className="w-full border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#A06E58]"
                                />

                                {forgotEmailError && (
                                    <p className="mt-1 text-[.65rem] text-red-600">
                                        {forgotEmailError}
                                    </p>
                                )}

                                {isResetLinkSent && (
                                    <p className="mt-2 text-[.65rem] text-green-700">
                                        Reset password link sent successfully.
                                    </p>
                                )}

                                {/* Request Reset Link */}
                                <button
                                    type="button"
                                    onClick={sendResetPasswordLink}
                                    disabled={isSendingResetLink}
                                    className="flex items-center justify-center mt-3 w-full bg-[#A06E58] py-2 px-2 text-xs font-semibold text-white shadow hover:bg-[#8e5f4c] disabled:opacity-60"
                                >
                                    <SendHorizontal
                                        size={15}
                                        className="me-1"
                                    />

                                    {isSendingResetLink
                                        ? "Sending..."
                                        : "Request reset password link"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Company Footer */}
                    <div className="flex flex-col items-end text-right text-[.5rem] mt-6 text-[#99553a] font-semibold">
                        <span>
                            Developed and maintained by:
                        </span>

                        <img
                            src={companyLogoImage}
                            alt="Sustain Intelligence Logo"
                            className="h-4 mt-1"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;