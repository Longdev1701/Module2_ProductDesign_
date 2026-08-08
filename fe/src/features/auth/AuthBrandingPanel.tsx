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
      
      <div className="z-10 flex flex-col items-center max-w-lg w-full">
        {/* Branding Hero Image */}
        <div className="w-full mb-6 rounded-2xl overflow-hidden border border-amber-400/30 shadow-2xl bg-white/5 p-2">
          <img 
            src="/hero_branding.png" 
            alt="Themis LexiGuard Branding" 
            className="w-full h-auto max-h-[360px] object-cover rounded-xl shadow-md"
          />
        </div>

        <h1 className="font-serif text-3xl font-bold text-white mb-3">Precision in Law.</h1>
        <p className="font-sans text-[#a5bdff] text-sm leading-relaxed max-w-md">
          Hệ thống Phân tích AI Pháp lý & Giám sát Tuân thủ Xuất khẩu Nông sản Tiêu chuẩn Cao cấp.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-[#a5bdff]/90 font-medium">
          <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Nghị định thư GACC & EUDR
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Bảo mật Dữ liệu Doanh nghiệp
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Phân tích AI Gemini
          </span>
        </div>
      </div>
    </div>
  );
}
