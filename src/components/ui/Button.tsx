import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ArrowRightLeft, Loader2, LucideIcon } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<"button"> {
    isLoading?: boolean;
    icon?: LucideIcon;
    children?: React.ReactNode;
}

export const Button = ({ isLoading, className, children, icon: Icon = ArrowRightLeft, ...props }: ButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className={`relative group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all ${className}`}
            disabled={isLoading}
            {...props}
        >
            <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
                {children}
            </span>
        </motion.button>
    );
};
