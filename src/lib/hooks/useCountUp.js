import { useEffect, useRef, useState } from 'react';

export function useCountUp({ target, duration = 2000, prefix = '', suffix = '', decimals = 0 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  const display = decimals > 0
    ? `${prefix}${value.toFixed(decimals)}${suffix}`
    : `${prefix}${Math.round(value).toLocaleString('en-AE')}${suffix}`;

  return { display, ref };
}
