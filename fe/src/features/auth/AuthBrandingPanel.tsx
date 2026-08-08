import React from 'react';

export function AuthBrandingPanel() {
  return (
    <div className="hidden lg:block lg:w-1/2 relative bg-black overflow-hidden">
      <img 
        src="/hero_branding.png" 
        alt="Themis LexiGuard Branding" 
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
}
