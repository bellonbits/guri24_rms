import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';

/**
 * Check if the user has requested reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Decorative Anime.js SVG Path Animation component for architectural grid lines
 */
export const AnimeDecorativeGrid: React.FC<{ color?: string }> = ({ color = '#0057FC' }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !svgRef.current) return;

    try {
      const anim = animate(svgRef.current.querySelectorAll('.grid-line'), {
        opacity: [0.1, 0.45],
        duration: 1800,
        ease: 'inOutSine',
        alternate: true,
        loop: true,
      });

      return () => {
        if (anim && typeof (anim as any).pause === 'function') {
          (anim as any).pause();
        }
      };
    } catch {
      // Graceful animation teardown
    }
  }, [reducedMotion]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 240"
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '1200px',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.12,
        zIndex: 0,
      }}
      fill="none"
      aria-hidden="true"
    >
      <line className="grid-line" x1="0" y1="40" x2="800" y2="40" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
      <line className="grid-line" x1="0" y1="100" x2="800" y2="100" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
      <line className="grid-line" x1="0" y1="160" x2="800" y2="160" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
      <line className="grid-line" x1="200" y1="0" x2="200" y2="240" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
      <line className="grid-line" x1="400" y1="0" x2="400" y2="240" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
      <line className="grid-line" x1="600" y1="0" x2="600" y2="240" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );
};
