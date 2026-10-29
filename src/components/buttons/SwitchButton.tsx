import React from "react";

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only peer"
            />
            <div
                className="relative w-7 h-4 bg-gray-200 rounded-full peer dark:bg-gray-700
  peer-focus:ring-2 peer-focus:ring-green-300 dark:peer-focus:ring-green-800
  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
  peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px]
  after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full
  after:h-3 after:w-3 after:transition-all dark:border-gray-600
  peer-checked:bg-green-600 dark:peer-checked:bg-green-600"
            />

            {label && (
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {label}
                </span>
            )}
        </label>
    );
};

export default Switch;
