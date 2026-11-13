import { useEffect, useState } from "react";

// Mirrors the original dashboard.js / script.js number-count animations:
// increments by `step` every `speed` ms until it reaches `target`.
export default function useCountUp(target, speed = 20, step = 1) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    if (!target || target <= 0) return;

    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [target, speed, step]);

  return count;
}
