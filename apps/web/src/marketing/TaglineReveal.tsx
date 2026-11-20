import React, { useEffect, useRef, useState } from 'react';
import { BRAND_TOKENS } from './BrandTokens';
import { usePrefersReducedMotion } from './MotionUtils';

interface TaglineRevealProps {
  lines?: string[];
  theme?: 'light' | 'dark';
}

/**
 * Mandatory Tagline Reveal Section (B11 per apps/SKILL1.md)
 * Large type section stating core benefit.
 * Words start at 25-35% opacity and activate one-by-one as user scrolls into view.
 */
export const TaglineReveal: React.FC<TaglineRevealProps> = ({
  lines = [
    'Every shilling accounted for,',
    'from M-Pesa to audited general ledger.',
  ],
  theme = 'light',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Flatten lines into individual words with their word indices
  const allWords = lines.flatMap((line, lineIdx) =>
    line.split(' ').map((word) => ({ word, lineIdx }))
  );

  const [activeWordCount, setActiveWordCount] = useState<number>(
    reducedMotion ? allWords.length : 0
  );

  useEffect(() => {
    if (reducedMotion) {
      setActiveWordCount(allWords.length);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!container) return;
          const rect = container.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Progress calculation: starts when top is at 80% of window, completes when top is at 35%
          const start = windowHeight * 0.82;
          const end = windowHeight * 0.35;
          const rawProgress = (start - rect.top) / (start - end);
          const progress = Math.min(Math.max(rawProgress, 0), 1);

          const count = Math.round(progress * allWords.length);
          setActiveWordCount(count);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [allWords.length, reducedMotion]);

  const isDark = theme === 'dark';
  const baseMutedColor = isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(2, 20, 41, 0.28)';
  const activeColor = isDark ? '#FFFFFF' : BRAND_TOKENS.colors.darkNavy;

  return (
    <section
      ref={containerRef}
      style={{
        width: '100%',
        backgroundColor: isDark ? BRAND_TOKENS.colors.darkNavy : BRAND_TOKENS.colors.bgCanvas,
        padding: '96px 24px', // Spacing-900 per B2
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '680px', // B5 & B11 cap at 680px
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            lineHeight: '16px',
            fontWeight: 600,
            color: BRAND_TOKENS.colors.primaryBlue,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '16px',
          }}
        >
          Authoritative Real Estate Standard
        </div>

        <h2
          style={{
            fontSize: 'clamp(30px, 4vw, 48px)', // Heading 2 (48/48) per B1
            lineHeight: 1.15,
            fontWeight: 600, // Semibold per B1 (no ultra bold)
            letterSpacing: '-0.02em',
            textWrap: 'balance', // B1 rule: text-wrap balance for headings
            margin: 0,
          }}
        >
          {lines.map((line, lineIdx) => {
            const lineWords = line.split(' ');
            // Calculate previous words offset
            const previousWordsCount = lines
              .slice(0, lineIdx)
              .reduce((sum, l) => sum + l.split(' ').length, 0);

            return (
              <span key={lineIdx} style={{ display: 'block', marginBottom: '8px' }}>
                {lineWords.map((word, wordIdx) => {
                  const globalIdx = previousWordsCount + wordIdx;
                  const isActive = globalIdx < activeWordCount;

                  return (
                    <span
                      key={wordIdx}
                      style={{
                        display: 'inline-block',
                        marginRight: '0.28em',
                        color: isActive ? activeColor : baseMutedColor,
                        transition: reducedMotion
                          ? 'none'
                          : `color 400ms ${BRAND_TOKENS.motion.baseCurve}`, // B7 base curve
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </h2>

        <p
          style={{
            fontSize: '16px', // Body 3 (16/24 regular)
            lineHeight: '24px',
            color: isDark ? 'rgba(255, 255, 255, 0.65)' : BRAND_TOKENS.colors.slateSubtle,
            marginTop: '24px', // Spacing-300
            textWrap: 'pretty', // B1 rule: text-wrap pretty for body copy
            maxWidth: '560px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Built for property firms that refuse to tolerate reconciliation gaps, missing vouchers, or guesswork accounting.
        </p>
      </div>
    </section>
  );
};
