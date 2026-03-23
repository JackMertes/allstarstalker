import { useState, useEffect, useRef } from 'react';

/**
 * Counts from 0 to `target` over `duration` ms using requestAnimationFrame.
 * Starts only once the returned `ref` element scrolls into view.
 * For non-numeric targets (e.g. "Live"), returns the value immediately.
 */
export function useCountUp(target, duration = 1200) {
  const numeric = typeof target === 'number' || /^\d+$/.test(String(target));
  const end = numeric ? Number(target) : null;

  const [count, setCount] = useState(numeric ? 0 : target);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  // Observe when the element enters the viewport
  useEffect(() => {
    if (!numeric) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [numeric]);

  // Run the animation once `started` flips
  useEffect(() => {
    if (!started || !numeric) return;

    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) ** 2;
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [started, end, duration, numeric]);

  return { value: numeric ? count : target, ref };
}
