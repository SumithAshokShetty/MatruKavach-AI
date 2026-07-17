"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {

        const variants = {
            primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-light border border-transparent",
            secondary: "bg-accent text-accent-foreground shadow-md hover:bg-accent-light border border-transparent",
            outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/5",
            ghost: "bg-transparent text-primary hover:bg-primary/5",
            danger: "bg-alert text-white shadow-lg shadow-alert/20 hover:bg-alert-dark",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm rounded-lg",
            md: "px-6 py-3 text-base rounded-xl",
            lg: "px-8 py-4 text-lg rounded-2xl",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "relative inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <span className="absolute inset-0 flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    </span>
                ) : null}
                <span className={cn(isLoading ? "opacity-0" : "opacity-100", "flex items-center gap-2")}>
                    {children as React.ReactNode}
                </span>
            </motion.button>
        );
    }
);
Button.displayName = "Button";
