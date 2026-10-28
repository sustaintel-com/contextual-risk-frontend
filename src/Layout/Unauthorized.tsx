import React from "react";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router";

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();


    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center rounded-2xl bg-white shadow-lg p-8">
                <div className="flex justify-center mb-4">
                    <ShieldAlert className="h-16 w-16 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Unauthorized Access
                </h1>
                <p className="text-gray-600 mb-6">
                    Sorry, you don’t have permission to view this page.
                    If you think this is a mistake, please contact your administrator.
                </p>
                <button
                    onClick={() => {
      
                        navigate("/")
                    }}
                    className="px-6 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
