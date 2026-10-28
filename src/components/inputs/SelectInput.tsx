

import { useState, useRef, useEffect } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";


export interface SelectOption {
    label: string;
    value: string | number;
}

interface SelectBoxProps {
    label?: string;
    required?: boolean;
    placeholder?: string;
    options: SelectOption[];
    multiple?: boolean;
    disabled?: boolean;
    readOnly?: boolean;

    value: (string | number)[] | string | number | null;
    onChange: (value: any) => void;

    error?: string | FieldError;
    registration?: UseFormRegisterReturn;

    className?: string;

    bare?: boolean;
}

export default function SelectionInput({
    label,
    required,
    placeholder = "Select",
    options,
    multiple = false,
    disabled = false,
    readOnly = false,
    value,
    onChange,
    registration,
    error,
    className = "",
    bare = false,
}: SelectBoxProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [openUp, setOpenUp] = useState(false);

    const isMulti = multiple;

    const selectedValues: (string | number)[] = (() => {
        if (multiple) {
            if (Array.isArray(value)) return value;
            if (value === null || value === undefined || value === "") return [];
            return [value as string | number];
        }

        if (value === null || value === undefined || value === "") return [];
        return [value as string | number];
    })();

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                registration?.onBlur?.({ target: {} } as any);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [registration]);

    const toggleOption = (val: string | number) => {
        if (isMulti) {
            const updated = selectedValues.includes(val)
                ? selectedValues.filter((x) => x !== val)
                : [...selectedValues, val];

            onChange(updated);
            registration?.onChange?.({ target: { value: updated } });
        } else {
            onChange(val);
            registration?.onChange?.({ target: { value: val } });
            setOpen(false);
        }
    };

    const selectedLabels = selectedValues
        .map((v) => options.find((o) => o.value === v)?.label)
        .filter(Boolean);

    return (
        <div className={`w-full relative ${className}`} ref={ref}>
            {!bare && label && (
                <label className="block mb-1 text-md font-medium text-(--input-top-level-text-color)">
                    {label} {required && <span>*</span>}
                </label>
            )}

            <input
                type="hidden"
                {...registration}
                value={
                    isMulti
                        ? JSON.stringify(selectedValues)
                        : selectedValues[0] ?? ""
                }
                readOnly
            />

            {/* SELECT BOX */}
            <div
                onClick={() => {
                    if (disabled || readOnly) return;
                    if (!open && ref.current) {
                        const rect = ref.current.getBoundingClientRect();
                        const spaceBelow = window.innerHeight - rect.bottom;
                        const DROPDOWN_HEIGHT = 240;
                        setOpenUp(spaceBelow < DROPDOWN_HEIGHT);
                    }
                    setOpen(!open);
                }}
                className={`
                    w-full flex items-center justify-between
                    ${
                        bare
                            ? "h-full px-3 py-3 bg-transparent"
                            : "bg-gray-50 rounded-md px-3 h-12"
                    }
                    ${disabled || readOnly
                        ? "cursor-not-allowed opacity-70"
                        : "cursor-pointer"
                    }
                    ${!bare && error ? "border-red-500" : ""}
                `}
            >
                <div className="flex-1 min-w-0 text-sm">
                    {selectedValues.length === 0 ? (
                        <span className="text-gray-400">{placeholder}</span>
                    ) : isMulti ? (
                        <div className="flex gap-1 overflow-hidden">
                            {selectedLabels.map((lbl, i) => (
                                <span
                                    key={i}
                                    className="text-gray-700 px-2 py-0.5 rounded text-xs bg-white max-w-30 truncate"
                                >
                                    {lbl}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className="truncate block">
                            {selectedLabels[0]}
                        </span>
                    )}
                </div>

                {/* DROPDOWN ICON */}
                <svg
                    width="16"
                    height="16"
                    className={`ml-2 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                >
                    <path
                        d="M4 6l4 4 4-4"
                        stroke="gray"
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>
            </div>

            {/* DROPDOWN */}
            {open && (
                <div
                    className={`
                        absolute left-0 right-0
                        ${openUp ? "bottom-full mb-1" : "top-full mt-1"}
                        bg-gray-50 rounded-md
                        w-full max-h-60 overflow-y-auto
                        z-50 shadow-md
                    `}
                >
                    {options.map((opt) => {
                        const selected = selectedValues.includes(opt.value);
                        return (
                            <div
                                key={opt.value}
                                onClick={() => toggleOption(opt.value)}
                                className={`
                                    px-3 py-3 text-sm flex items-center justify-between gap-2
                                    hover:bg-gray-100 cursor-pointer
                                    ${selected ? "bg-gray-100" : ""}
                                `}
                            >
                                <span title={opt.label} className="flex-1 min-w-0 truncate">
                                    {opt.label}
                                </span>

                                {selected && (
                                    <svg
                                        width="16"
                                        height="16"
                                        stroke="green"
                                        fill="none"
                                        className="shrink-0"
                                    >
                                        <path
                                            d="M3 8l3 3 7-7"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {!bare && error && (
                <p className="text-xs text-red-500 mt-1">
                    * {typeof error === "string" ? error : error.message}
                </p>
            )}
        </div>
    );
}