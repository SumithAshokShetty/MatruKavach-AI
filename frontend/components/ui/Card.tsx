"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: "glass" | "solid" | "outlined";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "glass", children, ...props }, ref) => {

        const variants = {
            glass: "bg-white/70 backdrop-blur-md border border-white/20 shadow-xl",
            solid: "bg-white border border-gray-100 shadow-md",
            outlined: "bg-transparent border border-primary/20",
        };

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn(
                    "rounded-2xl overflow-hidden",
                    variants[variant],
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
Card.displayName = "Card";
