import React from 'react';
import { Loader2 } from 'lucide-react';

// --- Buttons ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid-green' | 'solid-blue' | 'ghost' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'solid-green', 
  size = 'md', 
  isLoading, 
  icon,
  className = '',
  ...props 
}) => {
  // Base styles
  const baseStyles = "inline-flex items-center justify-center rounded-[4px] font-medium transition-all duration-200 focus:outline-none active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed";
  
  // Variants
  const variants = {
    'solid-green': `bg-[#4CAF50] text-white hover:bg-[#43A047] shadow-sm`,
    'solid-blue': `bg-[#1976D2] text-white hover:bg-[#1565C0] shadow-sm`,
    'ghost': `bg-transparent border border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50]/5`,
    'text': `bg-transparent text-[#757575] hover:text-[#212121]`,
  };

  // Sizes
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-[40px] px-[16px] text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// --- Cards ---
interface CardProps {
  children: React.ReactNode;
  variant?: 'transparent' | 'solid' | 'interactive';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'solid', 
  className = '', 
  onClick 
}) => {
  const baseStyles = "bg-white overflow-hidden transition-all duration-300";
  
  const variants = {
    'transparent': "bg-transparent",
    'solid': "border-none shadow-none", // Basic container
    'interactive': "rounded-[8px] border border-transparent hover:border-[#E0E0E0] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer",
  };

  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// --- Section Title ---
export const SectionTitle: React.FC<{ title: string; subtitle?: string; align?: 'left' | 'center' }> = ({ 
  title, 
  subtitle, 
  align = 'left' 
}) => {
  return (
    <div className={`mb-8 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <h2 className="text-[24px] font-bold text-[#212121] mb-2 relative inline-block">
        {title}
        {/* Optional decorative underline for centered titles */}
        {align === 'center' && (
          <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-12 h-[3px] bg-[#4CAF50]"></span>
        )}
      </h2>
      {subtitle && <p className="text-[#757575] text-[14px] mt-2">{subtitle}</p>}
    </div>
  );
};

// --- Badges ---
export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'blue' | 'orange' | 'gray' | 'red' }> = ({ children, color = 'green' }) => {
  const colors = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
    gray: 'bg-gray-100 text-gray-800',
    red: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};