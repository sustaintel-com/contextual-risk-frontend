import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  type:"submit" | "reset" | "button"
  hidden?:boolean
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  type="button",
  hidden=false
}) => {
  const baseStyles =
    "inline-flex items-center gap-2 rounded-sm font-medium transition focus:outline-none cursor-pointer";

  const variants: Record<string, string> = {
    primary:
      "bg-[#0B234A] hover:bg-[#123264] text-white focus:ring-2 focus:ring-[#123264] cursor-pointer",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 cursor-pointer",
      success:
      "bg-green-700 text-white hover:bg-green-400 focus:ring-2 focus:ring-green-400 shadow-sm cursor-pointer",
    danger:
      "bg-red-700 text-white hover:bg-red-400 focus:ring-2 focus:ring-red-400 shadow-sm cursor-pointer",
  };

  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg",
  };

  return (
    <button
      onClick={onClick}
      hidden={hidden}
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} shadow-sm`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
};

export default Button;
