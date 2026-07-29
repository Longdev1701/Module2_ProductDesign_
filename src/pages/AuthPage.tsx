import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'otp'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased">
      {/* Left Side - Brand Context */}
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
            />
          </div>
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Precision in Law.</h1>
          <p className="font-sans text-[#a5bdff] text-base leading-relaxed">
            Nền tảng Phân tích AI Pháp lý & Giám sát Tuân thủ Tiêu chuẩn Cao cấp dành cho Doanh nghiệp & Chuyên gia Pháp chế.
          </p>

          <div className="mt-12 flex gap-6 text-xs text-[#a5bdff]/80 font-medium">
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-amber-400 text-sm">verified</span> Tiêu chuẩn EUDR</span>
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-amber-400 text-sm">security</span> Bảo mật Dữ liệu</span>
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-amber-400 text-sm">auto_awesome</span> Phân tích AI</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-6">

          {/* Mobile Branding */}
          <div className="lg:hidden flex flex-col items-center justify-center mb-6">
            <img src="/themis_logo.png" alt="Themis Logo" className="h-20 w-auto object-contain mb-2" />
            <h1 className="font-serif text-2xl font-bold text-[#00327d]">Themis LexiGuard</h1>
            <p className="text-xs text-[#434653]">Hệ thống Giám sát Liêm chính & Pháp lý</p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-[#c3c6d5]/60 mb-6">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${mode === 'login' ? 'border-[#00327d] text-[#00327d]' : 'border-transparent text-[#434653] hover:text-[#191c1e]'}`}
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => setMode('register')}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${mode === 'register' ? 'border-[#00327d] text-[#00327d]' : 'border-transparent text-[#434653] hover:text-[#191c1e]'}`}
            >
              Đăng ký
            </button>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#191c1e] mb-1">Chào mừng trở lại</h2>
                <p className="text-xs text-[#434653]">Nhập thông tin tài khoản của bạn để truy cập hệ thống.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#191c1e]" htmlFor="login-email">Email đăng nhập</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#434653] text-sm">mail</span>
                  <input 
                    id="login-email" 
                    type="email" 
                    required 
                    placeholder="name@company.com" 
                    className="w-full h-11 pl-10 pr-4 bg-[#f7f9fb] border border-[#c3c6d5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00327d] focus:border-transparent text-[#191c1e]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-[#191c1e]" htmlFor="login-pass">Mật khẩu</label>
                  <button 
                    type="button" 
                    onClick={() => setMode('forgot')}
                    className="text-xs font-semibold text-[#00327d] hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#434653] text-sm">lock</span>
                  <input 
                    id="login-pass" 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    placeholder="••••••••" 
                    className="w-full h-11 pl-10 pr-10 bg-[#f7f9fb] border border-[#c3c6d5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00327d] focus:border-transparent text-[#191c1e]"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#434653] hover:text-[#00327d]"
                  >
                    <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full h-11 mt-4 bg-[#00327d] hover:bg-[#0047ab] text-white font-semibold text-sm rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">login</span> Đăng nhập
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-[#c3c6d5]/50"></div>
                <span className="flex-shrink-0 mx-4 text-[11px] font-semibold text-[#434653] uppercase">Hoặc đăng nhập với</span>
                <div className="flex-grow border-t border-[#c3c6d5]/50"></div>
              </div>

              <div className="flex gap-3">
                <button type="button" className="flex-1 h-10 bg-white border border-[#c3c6d5] rounded-lg text-xs font-semibold text-[#191c1e] hover:bg-[#f2f4f6] transition-colors flex items-center justify-center gap-2">
                  <span className="font-bold text-[#00327d]">G</span> Google
                </button>
                <button type="button" className="flex-1 h-10 bg-white border border-[#c3c6d5] rounded-lg text-xs font-semibold text-[#191c1e] hover:bg-[#f2f4f6] transition-colors flex items-center justify-center gap-2">
                  <span className="font-bold text-[#1877F2]">f</span> Facebook
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={() => setMode('otp')} className="space-y-4 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#191c1e] mb-1">Tạo tài khoản mới</h2>
                <p className="text-xs text-[#434653]">Đăng ký để trải nghiệm công cụ phân tích pháp lý AI.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#191c1e]" htmlFor="reg-name">Họ và tên</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#434653] text-sm">person</span>
                  <input 
                    id="reg-name" 
                    type="text" 
                    required 
                    placeholder="Nguyễn Văn A" 
                    className="w-full h-11 pl-10 pr-4 bg-[#f7f9fb] border border-[#c3c6d5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00327d] text-[#191c1e]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#191c1e]" htmlFor="reg-email">Email doanh nghiệp</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#434653] text-sm">mail</span>
                  <input 
                    id="reg-email" 
                    type="email" 
                    required 
                    placeholder="name@company.com" 
                    className="w-full h-11 pl-10 pr-4 bg-[#f7f9fb] border border-[#c3c6d5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00327d] text-[#191c1e]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#191c1e]" htmlFor="reg-pass">Mật khẩu</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#434653] text-sm">lock</span>
                  <input 
                    id="reg-pass" 
                    type="password" 
                    required 
                    placeholder="Tối thiểu 8 ký tự" 
                    className="w-full h-11 pl-10 pr-4 bg-[#f7f9fb] border border-[#c3c6d5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00327d] text-[#191c1e]"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full h-11 mt-4 bg-[#00327d] hover:bg-[#0047ab] text-white font-semibold text-sm rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Tiếp tục xác thực OTP <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={(e) => { e.preventDefault(); setMode('otp'); }} className="space-y-4 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#191c1e] mb-1">Khôi phục mật khẩu</h2>
                <p className="text-xs text-[#434653]">Nhập email đã đăng ký để nhận mã xác thực OTP.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#191c1e]" htmlFor="forgot-email">Email khôi phục</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#434653] text-sm">mail</span>
                  <input 
                    id="forgot-email" 
                    type="email" 
                    required 
                    placeholder="name@company.com" 
                    className="w-full h-11 pl-10 pr-4 bg-[#f7f9fb] border border-[#c3c6d5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00327d] text-[#191c1e]"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full h-11 mt-4 bg-[#00327d] hover:bg-[#0047ab] text-white font-semibold text-sm rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Gửi mã OTP <span className="material-symbols-outlined text-sm">send</span>
              </button>

              <button 
                type="button" 
                onClick={() => setMode('login')}
                className="w-full text-xs font-semibold text-[#434653] hover:text-[#00327d] text-center pt-2 block"
              >
                ← Quay lại đăng nhập
              </button>
            </form>
          )}

          {/* OTP VERIFICATION FORM */}
          {mode === 'otp' && (
            <form onSubmit={handleLogin} className="space-y-6 animate-fadeIn text-center">
              <div>
                <div className="w-12 h-12 bg-[#0047ab]/20 text-[#00327d] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-xl">mark_email_read</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#191c1e] mb-1">Xác thực mã OTP</h2>
                <p className="text-xs text-[#434653]">Chúng tôi đã gửi mã xác thực 6 chữ số tới email của bạn.</p>
              </div>

              <div className="flex justify-center gap-2">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-bold bg-[#f7f9fb] border border-[#c3c6d5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00327d] text-[#191c1e]"
                  />
                ))}
              </div>

              <button 
                type="submit" 
                className="w-full h-11 bg-[#00327d] hover:bg-[#0047ab] text-white font-semibold text-sm rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Xác nhận &amp; Đăng nhập <span className="material-symbols-outlined text-sm">check_circle</span>
              </button>

              <p className="text-xs text-[#434653]">
                Không nhận được mã? <button type="button" className="text-[#00327d] font-semibold hover:underline">Gửi lại mã</button>
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
