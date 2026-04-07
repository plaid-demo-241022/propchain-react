import { useState, useEffect } from 'react';

export function useScrolled(threshold = 80) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > threshold);
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, [threshold]);
  return scrolled;
}
