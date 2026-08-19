import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function AuthBrandingPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-[#001946] bg-gradient-to-b from-[#001946] via-[#002255] to-[#001233] text-white flex-col justify-between items-center p-12 xl:p-16 select-none overflow-hidden border-r border-[#c3c6d5]/20">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Protocol Tag */}
      <div className="relative z-10 w-full flex justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-amber-200 font-medium backdrop-blur-md shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Hải quan Trung Quốc (GACC) — Sầu riêng tươi (HS: 0810.60.00)</span>
        </div>
      </div>

      {/* Center Hero: Golden Themis Logo + Title */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 my-auto">
        <div className="w-48 xl:w-56 p-3.5 rounded-3xl bg-gradient-to-b from-amber-400/20 via-amber-400/5 to-transparent border border-amber-400/40 shadow-2xl backdrop-blur-xs flex items-center justify-center">
          <img
            alt="Themis LexiGuard"
            src="/themis_logo.png"
            className="w-full h-auto object-contain rounded-2xl drop-shadow-2xl"
          />
        </div>

        <div className="space-y-2 max-w-sm">
          <span className="text-[11px] font-mono tracking-widest text-amber-300 font-bold uppercase block">
            AI COMPLIANCE NAVIGATOR
          </span>
          <h1 className="text-3xl xl:text-4xl font-serif font-bold tracking-tight text-white">
            Themis LexiGuard
          </h1>
          <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
            Hệ thống Thẩm định Tuân thủ Pháp lý &amp; Hộp Đen Xuất Khẩu Nông Sản
          </p>
        </div>
      </div>

      {/* Bottom Minimal Trust Badges */}
      <div className="relative z-10 w-full flex items-center justify-center gap-4 text-[11px] text-slate-400 font-mono border-t border-white/10 pt-5">
        <span className="flex items-center gap-1.5 text-amber-200/80">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Nghị định thư GACC 2024
        </span>
        <span>•</span>
        <span>Lệnh 248/249 CIFER</span>
        <span>•</span>
        <span>GB 2762-2022</span>
      </div>
    </div>
  );
}
