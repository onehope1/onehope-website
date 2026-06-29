'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: number;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 36, light = false }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon Graphic Container */}
      <div 
        className={`relative flex items-center justify-center rounded-xl overflow-hidden ${light ? 'bg-transparent border-none shadow-none' : 'shadow-md shadow-blue-500/5 bg-slate-50 border border-slate-100'}`}
        style={{ width: size, height: size }}
      >
        <Image 
          src="/logo.png" 
          alt="OneHope Logo Icon" 
          fill 
          className="object-cover"
        />
      </div>
      
      {/* Brand Text styling */}
      <div className="flex flex-col">
        <span className={`text-base font-extrabold tracking-tight leading-none font-poppins ${light ? 'text-white' : 'text-slate-900'}`}>
          OneHope
        </span>
        <span className={`text-[9px] font-bold tracking-wider uppercase leading-none mt-1 ${light ? 'text-[#CBD5E1]/80' : 'text-slate-450'}`}>
          Hope Starts With One
        </span>
      </div>
    </div>
  );
};
export default Logo;
