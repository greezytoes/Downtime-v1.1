import { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  const { glassColor } = useTheme();
  const backgroundColor = `${glassColor}66`; // 40% opacity

  return (
    <div 
      className={`backdrop-blur-md border border-slate-700/50 rounded-xl shadow-xl ${className}`}
      style={{ backgroundColor }}
    >
      {children}
    </div>
  );
}