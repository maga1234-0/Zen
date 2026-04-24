import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-seafoam-400 hover:bg-seafoam-500 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-greybrown-400 hover:bg-greybrown-500 text-white shadow-md hover:shadow-lg',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
    outline: 'bg-transparent border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
