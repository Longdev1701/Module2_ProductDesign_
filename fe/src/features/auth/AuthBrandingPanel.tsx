import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export function AuthBrandingPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-[#001946] flex-col items-center justify-center p-10 text-center relative overflow-hidden">
      {/* Pattern Background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
      ></div>
      
      <div className="z-10 flex flex-col items-center max-w-md">
        <div className="p-2 rounded-2xl bg-amber-400/10 border border-amber-400/30 mb-8 shadow-xl">
          <img 
            src="/themis_logo.png" 
            alt="Themis LexiGuard Logo" 
            className="w-48 h-auto object-contain rounded-xl drop-shadow-md"
            onError={(e) => {
              // Fallback text logo if image missing
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <h1 className="font-serif text-4xl font-bold text-white mb-4">Precision in Law.</h1>
        <p className="font-sans text-[#a5bdff] text-sm leading-relaxed">
          Hệ thống Phân tích AI Pháp lý & Giám sát Tuân thủ Xuất khẩu Nông sản Tiêu chuẩn Cao cấp.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4 text-xs text-[#a5bdff]/90 font-medium">
          <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Nghị định thư GACC & EUDR
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Bảo mật Dữ liệu
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Phân tích AI Gemini
          </span>
        </div>
      </div>
    </div>
  );
}
