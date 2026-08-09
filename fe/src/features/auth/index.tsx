"use client";

import React, { useState } from 'react';
import { AuthBrandingPanel } from './AuthBrandingPanel';
import { LoginView } from './LoginView';
import { RegisterView } from './RegisterView';
import { ForgotPasswordView } from './ForgotPasswordView';

export default function AuthFeature() {
  const [view, setView] = useState<'login' | 'register' | 'forgot-password'>('login');

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Left Panel - Dark Branding */}
      <AuthBrandingPanel />

      {/* Right Panel - Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 overflow-y-auto">
        <div className="w-full max-w-md">
          {view === 'login' && (
            <LoginView 
              onSwitchView={() => setView('register')} 
              onSwitchToForgot={() => setView('forgot-password')} 
            />
          )}
          {view === 'register' && (
            <RegisterView onSwitchView={() => setView('login')} />
          )}
          {view === 'forgot-password' && (
            <ForgotPasswordView onSwitchView={(targetView) => setView(targetView)} />
          )}
        </div>
      </div>
    </div>
  );
}
