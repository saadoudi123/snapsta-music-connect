
import React from 'react';
import { Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  size?: number;
  variant?: 'default' | 'light' | 'dark';
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 32, 
  variant = 'default',
  className
}) => {
  const colorClass = variant === 'light' 
    ? 'text-white' 
    : variant === 'dark' 
      ? 'text-black' 
      : 'text-primary';

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("rounded-full p-1.5 flex items-center justify-center", colorClass, {
        'bg-white/20': variant === 'light',
        'bg-black/10': variant === 'dark',
        'bg-primary/10': variant === 'default'
      })}>
        <Camera size={size} strokeWidth={1.5} />
      </div>
      <span className={cn("font-bold text-lg", colorClass)}>Snapsta</span>
    </div>
  );
};

export default BrandLogo;
