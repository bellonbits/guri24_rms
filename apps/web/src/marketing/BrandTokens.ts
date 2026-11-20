/**
 * Guri24 RMS - Authoritative Brand Tokens
 * Formatted and governed by the Landing Page Design & UI Styling System (apps/SKILL1.md).
 *
 * Official Assets:
 * - Full Horizontal: /Guri24 RMS Property Logo.png
 * - Square Emblem:   /logo.png
 */

export const BRAND_TOKENS = {
  name: 'Guri24 RMS',
  legalName: 'Guri24 Rental Management Ltd',
  tagline: 'Property management without the complexity.',
  domain: 'guri24.com',
  supportEmail: 'support@guri24.com',
  salesEmail: 'sales@guri24.com',
  phone: '+254 700 000 000',
  country: 'Kenya',
  currency: 'KES',

  // Extracted Brand Colors (Flat surfaces, strict zero background gradients per B4)
  colors: {
    // Primary Vibrant Logo Blue (#0057FC / #005CF4)
    primary: '#0057FC',
    primaryBlue: '#0057FC',
    primaryHover: '#0048D9',
    primaryLight: '#EFF5FF',
    primaryTint: '#EFF5FF',
    primaryGlow: 'rgba(0, 87, 252, 0.25)',

    // Secondary Mint / Cyan Accent from emblem (#03D8BF / #08EA95)
    secondary: '#03D8BF',
    secondaryCyan: '#03D8BF',
    secondaryGreen: '#08EA95',
    secondaryHover: '#02B8A2',
    secondaryLight: '#E8FBF8',

    // Deep Wordmark Midnight Navy (#021429) & Dark theme flats per B4
    darkNavy: '#021429',
    darkSurface: '#0B192C',
    darkBase1: '#181818',
    darkBase2: '#1F1F1F',
    darkBase3: '#272727',

    slateDark: '#0F172A',
    slateMuted: '#334155',
    slateSubtle: '#64748B',
    slateBorder: '#E2E8F0',

    // Clean Flat Surfaces per B4 (never use gradients in backgrounds)
    bgLight: '#FFFFFF',
    bgCanvas: '#F8FAFC',
    bgAlt: '#F1F5F9',
    cardLight: '#FFFFFF',

    // Status Accents
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#0284C7',
  },

  // Logos & Assets
  assets: {
    fullLogo: '/Guri24 RMS Property Logo.png',
    emblem: '/logo.png',
    favicon: '/favicon.png',
    heroAppPreview: '/featured_nairobi_apartment.webp',
  },

  // Single Approved Typeface per B1: Geist (with Geist Mono for data/numbers)
  fonts: {
    sans: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'Geist Mono', Menlo, Monaco, Consolas, monospace",
  },

  // B2. Spacing Scale: Only these values. Nothing between them, nothing outside them.
  spacing: {
    0: '0px',
    25: '2px',
    50: '4px',
    75: '8px',
    100: '12px',
    200: '16px',
    300: '24px',
    400: '32px',
    500: '40px',
    600: '48px',
    700: '64px',
    800: '80px',
    900: '96px',
  },

  // B1. Tailwind Type Scale & Line Heights
  typeScale: {
    xs: { fontSize: '12px', lineHeight: '16px' },
    sm: { fontSize: '14px', lineHeight: '20px' },
    base: { fontSize: '16px', lineHeight: '24px' },
    lg: { fontSize: '18px', lineHeight: '28px' },
    xl: { fontSize: '20px', lineHeight: '28px' },
    '2xl': { fontSize: '24px', lineHeight: '32px' },
    '3xl': { fontSize: '30px', lineHeight: '36px' },
    '4xl': { fontSize: '36px', lineHeight: '40px' },
    '5xl': { fontSize: '48px', lineHeight: '48px' },
    '6xl': { fontSize: '60px', lineHeight: '60px' },
  },

  // B1. Named Text Styles
  textStyles: {
    heading1: { fontSize: '60px', lineHeight: '60px', fontWeight: 600 },
    heading2: { fontSize: '48px', lineHeight: '48px', fontWeight: 600 },
    heading3: { fontSize: '36px', lineHeight: '40px', fontWeight: 600 },
    heading4: { fontSize: '30px', lineHeight: '36px', fontWeight: 600 },
    heading5: { fontSize: '24px', lineHeight: '32px', fontWeight: 600 },
    heading6: { fontSize: '20px', lineHeight: '28px', fontWeight: 600 },
    title1: { fontSize: '20px', lineHeight: '28px', fontWeight: 500 },
    title2: { fontSize: '18px', lineHeight: '28px', fontWeight: 500 },
    title3: { fontSize: '16px', lineHeight: '24px', fontWeight: 500 },
    title4: { fontSize: '14px', lineHeight: '20px', fontWeight: 500 },
    title5: { fontSize: '12px', lineHeight: '16px', fontWeight: 500 },
    body1: { fontSize: '16px', lineHeight: '24px', fontWeight: 600 },
    body2: { fontSize: '16px', lineHeight: '24px', fontWeight: 500 },
    body3: { fontSize: '16px', lineHeight: '24px', fontWeight: 400 },
    body4: { fontSize: '14px', lineHeight: '20px', fontWeight: 600 },
    body5: { fontSize: '14px', lineHeight: '20px', fontWeight: 500 },
    body6: { fontSize: '14px', lineHeight: '20px', fontWeight: 400 },
    buttonLg: { fontSize: '18px', lineHeight: '28px', fontWeight: 600 },
    buttonMd: { fontSize: '16px', lineHeight: '24px', fontWeight: 600 },
    buttonSm: { fontSize: '14px', lineHeight: '20px', fontWeight: 600 },
    buttonXsm: { fontSize: '12px', lineHeight: '16px', fontWeight: 600 },
    caption1: { fontSize: '14px', lineHeight: '20px', fontWeight: 500 },
    caption2: { fontSize: '14px', lineHeight: '20px', fontWeight: 400 },
    caption3: { fontSize: '12px', lineHeight: '16px', fontWeight: 600 },
    caption4: { fontSize: '12px', lineHeight: '16px', fontWeight: 500 },
    caption5: { fontSize: '12px', lineHeight: '16px', fontWeight: 400 },
  },

  // B7. Motion & Curves: ease-[cubic-bezier(0.22,1,0.36,1)]
  motion: {
    baseCurve: 'cubic-bezier(0.22, 1, 0.36, 1)',
    durationLayout: '500ms',
    durationShift: '300ms',
    transitionBase: 'all 500ms cubic-bezier(0.22, 1, 0.36, 1)',
    transitionHover: 'background-color 300ms cubic-bezier(0.22, 1, 0.36, 1), transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
  },

  // B3. Corner Radius Scale & Nested Formula Helper
  radius: {
    none: '0px',
    sm: '2px',
    DEFAULT: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px',
    // Helper: inner = outer - gap (when gap < 32 and result > 2)
    nested: (outerPx: number, gapPx: number): number => {
      if (gapPx < 32 && outerPx - gapPx > 2) {
        return outerPx - gapPx;
      }
      return 0;
    },
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(2, 20, 41, 0.05)',
    md: '0 4px 6px -1px rgba(2, 20, 41, 0.08), 0 2px 4px -2px rgba(2, 20, 41, 0.06)',
    lg: '0 10px 15px -3px rgba(2, 20, 41, 0.08), 0 4px 6px -4px rgba(2, 20, 41, 0.04)',
    xl: '0 20px 25px -5px rgba(2, 20, 41, 0.1), 0 8px 10px -6px rgba(2, 20, 41, 0.05)',
    brand: '0 12px 30px -4px rgba(0, 87, 252, 0.22)',
  },
} as const;
