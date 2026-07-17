import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label className="text-sm font-semibold text-primary/80 ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "px-4 py-3 rounded-xl bg-white/50 border border-primary/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400 text-foreground font-medium",
                        error && "border-alert ring-alert/20",
                        className
                    )}
                    {...props}
                />
                {error && <span className="text-xs text-alert font-medium ml-1">{error}</span>}
            </div>
        );
    }
);
Input.displayName = "Input";
