import { cn } from '@/lib/utils/cn';

const variantClasses = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  indigo:    'btn-indigo',
  outline:   'inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full border border-white/20 text-white/80 hover:border-white/40 hover:text-white transition-all duration-300',
  ghost:     'inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white/60 hover:text-white transition-colors',
  danger:    'inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-full bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all',
};
const sizeClasses = {
  sm: '!px-5 !py-2.5 text-sm',
  md: '',
  lg: '!px-10 !py-5 text-lg',
  xl: '!px-12 !py-6 text-xl',
};

export function Button({
  variant = 'primary', size = 'md', loading = false,
  leftIcon, rightIcon, fullWidth = false,
  href, className, children, disabled, ...props
}) {
  const cls = cn(
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    (disabled || loading) && 'opacity-60 cursor-not-allowed pointer-events-none',
    className,
  );

  const content = (
    <>
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </>
  );

  if (href) return <a href={href} className={cls}>{content}</a>;
  return <button className={cls} disabled={disabled || loading} {...props}>{content}</button>;
}
export default Button;
