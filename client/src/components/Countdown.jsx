import { useEffect, useState } from "react";

export default function Countdown({ initialCount = 3, onComplete }) {
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger the scale animation on mount/tick
    setIsAnimating(true);
    const animationTimeout = setTimeout(() => setIsAnimating(false), 900);

    if (count === 0) {
      if (onComplete) {
        // Short delay so the user briefly registers '0' or jumps straight in
        const completeTimeout = setTimeout(() => {
          onComplete();
        }, 300);
        return () => {
          clearTimeout(animationTimeout);
          clearTimeout(completeTimeout);
        };
      }
      return () => clearTimeout(animationTimeout);
    }

    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(animationTimeout);
    };
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm select-none">
      {/* Immersive Background Arena Text Effect */}
      <div className="absolute text-gray-800/10 font-black text-9xl tracking-widest pointer-events-none uppercase">
        Prepare
      </div>

      {/* Main Countdown Display */}
      <div
        className={`text-center font-black transition-all duration-300 ease-out transform ${
          isAnimating 
            ? "scale-125 opacity-100 text-red-500 text-[12rem]" 
            : "scale-90 opacity-40 text-red-700 text-[10rem]"
        }`}
        style={{ textShadow: "0 0 40px rgba(239, 68, 68, 0.4)" }}
      >
        {count > 0 ? count : "GO!"}
      </div>

      {/* Subtext warning indicator */}
      <p className="mt-4 text-xs font-semibold tracking-widest text-red-400/60 uppercase animate-pulse">
        System Calibrating... Stay Alert
      </p>
    </div>
  );
}