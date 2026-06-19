import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck } from 'lucide-react';

export default function Footer({ navigate }) {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border mt-auto" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand/Summary column */}
          <div className="space-y-4 xl:col-span-1">
            <div className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent cursor-pointer" onClick={() => navigate('#/')}>
              <ShieldCheck className="h-6 w-6 text-primary" />
              {t('footerTitle')}
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t('footerSubtitle')}
            </p>
          </div>
          
          {/* Links columns */}
          <div className="mt-8 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <button onClick={() => navigate('#/')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t('navHome')}
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('#/courses')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t('navCourses')}
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('#/simulator')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t('navSimulator')}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Analytics & Safety</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <button onClick={() => navigate('#/impact')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t('navImpact')}
                  </button>
                </li>
                <li>
                  <a href="https://www.cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    National Cyber Crime Portal (India)
                  </a>
                </li>
                <li>
                  <a href="https://www.sancharsaathi.gov.in" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Sanchar Saathi Portal
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Attribution Row */}
        <div className="mt-8 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            {t('footerCopyright')}
          </p>
          <div className="flex space-x-6 text-xs text-muted-foreground">
            <span>Accessibility Compliant (WCAG 2.1)</span>
            <span>Made for Digital Literacy Impact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
