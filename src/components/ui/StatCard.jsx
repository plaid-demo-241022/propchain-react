import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const trendColors = { up: 'text-emerald-400', down: 'text-red-400', neutral: 'text-white/40' };
const TrendIcon = { up: TrendingUp, down: TrendingDown, neutral: Minus };

export function StatCard({ value, label, trend, trendValue, icon: Icon, variant = 'default', className }) {
  const TIcon = trend ? TrendIcon[trend] : null;
  return (
    <div className={cn(
      'rounded-2xl p-6',
      variant === 'dark'    && 'bg-obsidian-900 border border-white/8',
      variant === 'gold'    && 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20',
      variant === 'default' && 'bg-white/5 border border-white/8',
      className,
    )}>
      {Icon && <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4"><Icon className="w-5 h-5 text-indigo-400" /></div>}
      <p className="font-outfit font-black text-3xl text-white stat-value mb-1">{value}</p>
      <p className="text-white/50 text-sm font-outfit">{label}</p>
      {trend && trendValue && (
        <div className={cn('flex items-center gap-1 mt-2 text-xs font-semibold', trendColors[trend])}>
          {TIcon && <TIcon className="w-3.5 h-3.5" />}
          {trendValue}
        </div>
      )}
    </div>
  );
}
export default StatCard;
