import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface TextAreaProps extends HTMLMotionProps<"textarea"> {
    label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className, ...props }) => {
    return (
        <div className="flex flex-col gap-2 w-full h-full group">
            <label className="text-xs font-medium text-muted uppercase tracking-wider pl-1 group-focus-within:text-primary transition-colors">
                {label}
            </label>
            <motion.textarea
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`glass-input w-full h-full min-h-[200px] resize-none rounded-2xl p-6 text-lg text-main placeholder-muted outline-none ${className}`}
                {...props}
            />
        </div>
    );
};
