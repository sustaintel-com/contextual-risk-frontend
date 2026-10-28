import React, { useState } from 'react';
import { Eye, EyeOff, SendHorizontal } from 'lucide-react';
import { useSnackbar } from '../../Context/SnackbarContext';
import { useAppDispatch } from '../../redux-store/hooks';
import type { LoginFormInputs } from './Services/AuthModel';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { forgotPassword, userLogin } from './Services/AuthService';
import { login } from '../../redux-store/Slises/authSlice';
import backgroundImage from '../../assets/Contextual Risk Radar Interface.png';
import logoImage from '../../assets/risk-assessment.png';
import companyLogoImage from '../../assets/logo_comp.png';



const LoginPage: React.FC = () => {
    const { showPromiseSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        getValues,
        formState: { },
    } = useForm<LoginFormInputs>();
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotEmailError, setForgotEmailError] = useState('');
    const [isResetLinkSent, setIsResetLinkSent] = useState(false);


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const openForgotPassword = () => {
        setForgotEmailError('');
        setIsResetLinkSent(false);
        setForgotEmail(getValues('email') || '');
        setIsForgotPasswordOpen(true);
    };

    const sendResetPasswordLink = () => {
        const email = forgotEmail.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setForgotEmailError('Email is not valid');
            return;
        }

        setForgotEmailError('');
        showPromiseSnackbar(
            forgotPassword(email),
            {
                loading: 'Sending reset password link...',
                success: 'Reset password link sent successfully!',
                error: 'Unable to send reset password link. Please try again.',
            }
        )
            .then(() => setIsResetLinkSent(true))
            .catch(() => undefined);
    };

    

    const onSubmit: SubmitHandler<LoginFormInputs> = (userData) => {
        showPromiseSnackbar(
            userLogin(userData),
            {
                loading: "Logging in...",
                success: "Login successful!",
                error: "Login failed! Please check your credentials.",
            }
        )
            .then((response) => {
                dispatch(login(response.data));
               
            })
        
    };


    return (
        <div
            className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center md:justify-end"
            style={{
                backgroundImage: `url(${backgroundImage})`,
            }}
        >


            <div className="bg-white/75 rounded-xl shadow-lg p-8 w-full max-w-[350px] md:mr-20">
                <div className="flex items-center gap-2 mb-4">
                    <img src={logoImage} alt="Logo" className="h-8 bg-[#EEE1DD] p-1 rounded-r-full" />
                    {/* <h1 className="text-lg font-bold tracking-wide text-gray-800">E&amp;S SCREEN</h1> */}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <div>
                        <input
                            type="text"
                            id="email"
                            className="w-full px-4 py-3 outline-none focus:border-l-4 focus:border-l-[#A06E58]  transition duration-200 bg-white text-gray-800 text-xs font-semibold" // Added bg-white and text-gray-800 for input fields
                            placeholder="Email"
                            {...register('email', { required: 'Email is required' })}
                            required
                        />
                    </div>

                    <div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="w-full px-4 py-3 outline-none  focus:border-l-4 focus:border-l-[#A06E58] transition duration-200 pr-10 bg-white text-gray-800 text-xs font-semibold" // Added bg-white and text-gray-800 for input fields
                                placeholder="Password"
                                {...register('password', { required: 'Password is required' })}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-[#A06E58] text-white font-semibold py-1.5 shadow hover:bg-[#8e5f4c]"
                    >
                        Login
                    </button>

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
                                {/* Arrow/marker pointing down to the Forgot Password button */}
                                <div className="absolute -bottom-2 left-4 h-4 w-4 rotate-45 bg-white " />

                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-sm font-semibold text-gray-800">Reset password</h2>
                                    <button
                                        type="button"
                                        onClick={() => setIsForgotPasswordOpen(false)}
                                        className="text-lg leading-none text-gray-500 hover:text-gray-800"
                                        aria-label="Close reset password popover"
                                    >
                                        &times;
                                    </button>
                                </div>
                                <p className="mb-3 text-[.65rem] text-gray-600">
                                    Enter your registered email to receive a reset password link.
                                </p>
                                <input
                                    type="email"
                                    value={forgotEmail}
                                    onChange={(event) => {
                                        setForgotEmail(event.target.value);
                                        setForgotEmailError('');
                                        setIsResetLinkSent(false);
                                    }}
                                    placeholder="Registered email"
                                    aria-label="Registered email"
                                    aria-invalid={Boolean(forgotEmailError)}
                                    className="w-full border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#A06E58]"
                                />
                                {forgotEmailError && (
                                    <p className="mt-1 text-[.65rem] text-red-600">{forgotEmailError}</p>
                                )}
                                {isResetLinkSent && (
                                    <p className="mt-2 text-[.65rem] text-green-700">
                                        Reset password link sent successfully.
                                    </p>
                                )}
                                <button
                                    type="button"
                                    onClick={sendResetPasswordLink}
                                    className="flex items-center mt-3 w-full bg-[#A06E58] py-2 px-2 text-xs font-semibold text-white shadow hover:bg-[#8e5f4c]"
                                >
                                  <SendHorizontal size={15} className='me-1'/>  Request reset password link
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-end text-right text-[.5rem] mt-6 text-[#99553a] font-semibold">
                        <span>Developed and maintained by:</span>
                        <img
                            src={companyLogoImage} // ✅ Replace with your image path or import
                            alt="sustaintelligence logo"
                            className="h-4 mt-1"
                        />
                    </div>

                </form>
            </div>
        </div>
    );
}
export default LoginPage
