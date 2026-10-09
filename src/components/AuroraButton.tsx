import React from 'react';

interface AuroraButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  glowIntensity?: 'normal' | 'high';
}

export const AuroraButton: React.FC<AuroraButtonProps> = ({
  children,
  icon,
  loading = false,
  loadingText = "Thinking...",
  size = 'md',
  variant = 'primary',
  glowIntensity = 'normal',
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs py-1.5 px-3.5 min-h-[34px]',
    md: 'text-sm py-2 px-5 min-h-[42px]',
    lg: 'text-base py-3 px-7 min-h-[50px]',
  };

  const isPrimary = variant === 'primary';

  return (
    <button
      disabled={disabled || loading}
      className={`
        group relative inline-flex items-center justify-center rounded-full
        transition-all duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none
        ${isPrimary ? 'aurora-pill-btn' : 'bg-[#193153]/60 hover:bg-[#193153] border border-[#EB96FF]/20 rounded-full'}
        ${className}
      `}
      {...props}
    >
      {/* Liquid Aurora Shimmer Ribbon inside capsule (Image 2 style) */}
      {isPrimary && (
        <span 
          className={`aurora-liquid-ribbon pointer-events-none transition-opacity duration-500 ${
            loading ? 'opacity-100 scale-110' : 'opacity-80 group-hover:opacity-100'
          }`} 
        />
      )}

      {/* Glass Inner Capsule Mask */}
      <span
        className={`
          relative z-10 inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide text-white
          backdrop-blur-md transition-all duration-200
          ${isPrimary ? 'bg-[#0e1626]/60 group-hover:bg-[#0e1626]/40' : 'bg-transparent'}
          ${sizeStyles[size]}
        `}
      >
        {loading ? (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EB96FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F9D4E0]"></span>
            </span>
            <span className="bg-gradient-to-r from-white via-[#F9D4E0] to-[#EB96FF] bg-clip-text text-transparent font-semibold">
              {loadingText}
            </span>
          </>
        ) : (
          <>
            {icon && <span className="text-[#EB96FF] group-hover:scale-110 transition-transform duration-200">{icon}</span>}
            <span className="drop-shadow-sm">{children}</span>
          </>
        )}
      </span>
    </button>
  );
};
