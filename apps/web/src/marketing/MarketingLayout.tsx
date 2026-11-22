import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MarketingNavbar } from './MarketingNavbar';
import { MarketingFooter } from './MarketingFooter';
import { CookieConsentBanner } from './CookieConsent';
import { BRAND_TOKENS } from './BrandTokens';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/' || pathname === '/home';

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        color: BRAND_TOKENS.colors.darkNavy,
        fontFamily: BRAND_TOKENS.fonts.sans,
        overflowX: 'hidden',
      }}
    >
      {!isHomePage && <MarketingNavbar />}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', margin: 0, padding: 0 }}>
        {children}
      </main>
      {!isHomePage && <MarketingFooter />}
      <CookieConsentBanner />
    </div>
  );
};
