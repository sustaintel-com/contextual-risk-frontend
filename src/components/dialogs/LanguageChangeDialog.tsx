import React from "react";
import { useTranslation } from "react-i18next";

interface LanguageDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const LanguageDialog: React.FC<LanguageDialogProps> = ({ isOpen, onClose }) => {
    const { i18n } = useTranslation();

    const languages = [
        { code: "en", label: "English" },
        { code: "hi", label: "हिन्दी" },
        { code: "bn", label: "বাংলা" },
        { code: "fr", label: "Français" },
    ];

    if (!isOpen) return null;

    const handleChange = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
            <div className="bg-white rounded-xl p-6 w-80 shadow-lg flex flex-col">
                <h2 className="text-lg font-semibold mb-4 text-center">Select Language</h2>

                <div className="flex flex-col gap-3 mb-6">
                    {languages.map((lang) => (
                        <label key={lang.code} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="language"
                                value={lang.code}
                                checked={i18n.language === lang.code}
                                onChange={() => handleChange(lang.code)}
                                className="form-radio h-4 w-4 text-blue-600"
                            />
                            <span>{lang.label}</span>
                        </label>
                    ))}
                </div>

                <button
                    className="mt-auto w-full px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default LanguageDialog;
