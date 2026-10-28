
import React from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string | FieldError;
  registration?: UseFormRegisterReturn;

  as?: "input" | "textarea";
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;


  bare?: boolean;
}

export default function FormInput({
  label,
  required,
  error,
  registration,
  className = "",
  as = "input",
  textareaProps,
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,
  bare = false,
  ...props
}: FormInputProps) {
  return (
    <div className={bare ? "w-full" : "w-full mb-4"}>
      {/* LABEL */}
      {!bare && label && (
        <label className="block mb-1 text-md font-medium text-(--input-top-level-text-color)">
          {label}
          {required && <span>*</span>}
        </label>
      )}

      <div className="relative w-full">
        {leftIcon && (
          <span
            onClick={onLeftIconClick}
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {leftIcon}
          </span>
        )}

        {/* INPUT */}
        {as === "input" && (
          <input
            {...registration}
            {...props}
            className={`
              w-full outline-none
              ${
                bare
                  ? "bg-transparent px-3 py-3"
                  : `px-4 py-3 rounded-lg bg-(--input-bg-color) ${
                      error
                        ? "border-b-3 border-b-red-500 text-red-600"
                        : "focus:border-b-3 focus:border-b-(--primary)"
                    }`
              }
              ${leftIcon ? "pl-11" : ""}
              ${rightIcon ? "pr-11" : ""}
              ${className}
            `}
          />
        )}

        {/* TEXTAREA */}
        {as === "textarea" && (
          <textarea
            {...(props as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} 
            {...textareaProps}
            className={`
              w-full outline-none resize-none min-h-25
              ${
                bare
                  ? "bg-transparent px-3 py-3"
                  : `px-4 py-3 rounded-lg bg-(--input-bg-color) ${
                      error
                        ? "border-b-3 border-b-red-500 text-red-600"
                        : "focus:border-b-3 focus:border-b-(--primary)"
                    }`
              }
              ${leftIcon ? "pl-11" : ""}
              ${rightIcon ? "pr-11" : ""}
              ${className}
            `}
          />
        )}

        {rightIcon && (
          <span
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {rightIcon}
          </span>
        )}
      </div>

      {!bare && error && (
        <p className="text-xs text-red-500 mt-1">
          * {typeof error === "string" ? error : error.message}
        </p>
      )}
    </div>
  );
}