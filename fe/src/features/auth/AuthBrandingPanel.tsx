import React from 'react';

export function AuthBrandingPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-[#020813] items-center justify-center p-8 overflow-hidden">
      <img 
        src="/hero_branding.png" 
        alt="Themis LexiGuard Branding" 
        className="w-full h-auto max-h-[85vh] object-contain object-center drop-shadow-2xl"
      />
    </div>
  );
}
