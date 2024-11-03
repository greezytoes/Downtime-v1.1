import { ReactNode } from 'react';
import { GlassCard } from './GlassCard';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  trendIsGood?: boolean;
  valueSize?: 'normal' | 'large';
}

export function MetricsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendIsGood = false,
  valueSize = 'normal' 
}: MetricsCardProps) {
  return (
    <GlassCard className="p-3 md:p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs md:text-sm text-slate-400">{title}</p>
          <p className={`font-semibold text-white mt-1 ${valueSize === 'large' ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
            {value}
          </p>
        </div>
        <div className="text-blue-400">{icon}</div>
      </div>
      {trend !== undefined && (
        <div className={`mt-1 md:mt-2 text-xs md:text-sm ${trend < 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend < 0 ? '↓' : '↑'} {Math.abs(trend)}% from yesterday
        </div>
      )}
    </GlassCard>
  );
}