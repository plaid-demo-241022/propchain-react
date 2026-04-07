import { cn } from '@/lib/utils/cn';

const variants = {
  gold:    'bg-yellow-500/15 text-yellow-600 border border-yellow-500/30',
  teal:    'bg-teal-500/15 text-teal-600 border border-teal-500/30',
  navy:    'bg-blue-900/10 text-blue-900 border border-blue-900/20',
  success: 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-700 border border-amber-500/30',
  danger:  'bg-red-500/15 text-red-700 border border-red-500/30',
  gray:    'bg-gray-100 text-gray-600 border border-gray-200',
  indigo:  'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
};
const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-xs' };

export function Badge({ variant = 'gold', size = 'md', className, children }) {
  return (
    <span className={cn('inline-flex items-center font-semibold rounded-full font-outfit tracking-wide uppercase', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
export default Badge;
