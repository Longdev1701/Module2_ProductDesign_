"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface ChatMessage {
  id: string | number;
  sender: 'ai' | 'user';
  text: string;
  attachment?: string;
  report?: {
    title: string;
    items: { status: 'error' | 'success' | 'warning'; text: string }[];
    pdfName?: string;
    pdfUrl?: string;
  };
  time: string;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  time: string;
  active?: boolean;
}

export default function NewCheckPage() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get('product');
  const initialBatch = searchParams.get('batch');

  const [selectedBatch, setSelectedBatch] = useState<string | null>(
    initialBatch ? `${initialProduct} (Lô ${initialBatch})` : null
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (initialProduct && initialBatch) {
      return [
        {
          id: 1,
          sender: 'ai',
          text: `Hello, tôi đã kích hoạt hồ sơ lô hàng [${initialProduct} - Lô: ${initialBatch}]. Bạn cần tôi kiểm tra tiêu chuẩn EUDR, dư lượng MRL hay hồ sơ CO/CQ nào cho lô hàng này?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    }
    return [
      {
        id: 1,
        sender: 'ai',
        text: 'Hello, tôi là AI Themis. Tôi có thể giúp gì cho bạn trong việc phân tích pháp lý và kiểm tra tuân thủ hôm nay?',
        time: '10:30 AM'
      },
      {
        id: 2,
        sender: 'user',
        text: 'Tôi cần thẩm định hồ sơ xuất khẩu Lô sầu riêng DURIAN-2025-0889 sang Trung Quốc theo Nghị định thư GACC mới nhất.',
        attachment: 'Phieu_dong_goi_DURIAN_2025_0889.pdf',
        time: '10:31 AM'
      },
      {
        id: 3,
        sender: 'ai',
        text: 'Tôi đã phân tích xong hồ sơ Phiếu đóng gói & Hóa đơn thương mại Lô DURIAN-2025-0889. Dưới đây là kết quả thẩm định tuân thủ chi tiết:',
        time: '10:32 AM',
        report: {
          title: 'Báo cáo Thẩm định Tuân thủ — Lô DURIAN-2025-0889',
          items: [
            { status: 'error', text: 'Chỉ tiêu Cadmium (0.07 mg/kg) vượt mức tối đa GB 2762-2022 của GACC (≤ 0.05 mg/kg). Cần xét nghiệm lại.' },
            { status: 'success', text: 'Mã số vùng trồng PUC: VN-TGOR-0095 & PHC: VN-TGPH-0012 trùng khớp 100% trên hệ thống CIFER GACC.' },
            { status: 'success', text: 'Chứng nhận Kiểm dịch Thực vật số 25-TG-0889 còn hiệu lực (còn 11 ngày).' },
            { status: 'warning', text: 'Chỉ tiêu Chlorpyrifos (0.018 mg/kg) gần ngưỡng tối đa GB 2763 (≤ 0.02). Biên an toàn chỉ còn 10%.' },
            { status: 'success', text: 'C/O Form E (ACFTA) hợp lệ — thuế suất ưu đãi 0% tại cửa khẩu Bằng Tường.' }
          ],
          pdfName: 'Bao_cao_tham_dinh_sau_rieng_GACC_2025.pdf',
          pdfUrl: '/samples/Bao_cao_tham_dinh_sau_rieng_GACC_2025.pdf'
        }
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<ChatHistoryItem[]>([
    { id: '1', title: 'Review hợp đồng phân phối', time: '10:32 AM', active: true },
    { id: '2', title: 'Tư vấn luật lao động 2024', time: 'Thứ 3' },
    { id: '3', title: 'So sánh NDA mẫu A & B', time: 'Thứ 2' },
    { id: '4', title: 'Kiểm tra quy định MRL Đức', time: '20/10' },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() && !attachedFileName) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      attachment: attachedFileName || undefined,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAttachedFileName(null);
    setIsTyping(true);

    // Simulate AI multi-step response
    setTimeout(() => {
      setIsTyping(false);
      const aiReply: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Tôi đã tiếp nhận và phân tích yêu cầu "${text.slice(0, 50)}...". Dựa trên đối chiếu với Nghị định thư GACC 2024 và tiêu chuẩn GB 2762-2022, dưới đây là kết quả thẩm định:`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        report: {
          title: 'Báo cáo Thẩm định Tuân thủ — Themis AI',
          items: [
            { status: 'success', text: 'Mã số PUC/PHC trùng khớp hệ thống CIFER GACC. Vùng trồng đã được phê duyệt.' },
            { status: 'success', text: 'Giấy chứng nhận Kiểm dịch Thực vật còn hiệu lực, đủ cửa sổ vận chuyển.' },
            { status: 'warning', text: 'Khuyến nghị bổ sung xét nghiệm kim loại nặng Cadmium (GB 2762-2022) cho lô hàng mới.' },
            { status: 'success', text: 'C/O Form E (ACFTA) hợp lệ — thuế suất ưu đãi 0%.' }
          ],
          pdfName: 'Bao_cao_tham_dinh_sau_rieng_GACC_2025.pdf',
          pdfUrl: '/samples/Bao_cao_tham_dinh_sau_rieng_GACC_2025.pdf'
        }
      };
      setMessages(prev => [...prev, aiReply]);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: 'Hello, tôi là AI Themis. Bạn cần tư vấn điều khoản hay kiểm tra hồ sơ pháp lý nào mới?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleDeleteChat = (id: string) => {
    const deletedItem = history.find(h => h.id === id);
    setHistory(prev => {
      const remaining = prev.filter(h => h.id !== id);
      // If deleted item was active and there are remaining items, activate the first one
      if (deletedItem?.active && remaining.length > 0) {
        remaining[0].active = true;
      }
      return remaining;
    });
    // If the deleted item was the active chat, reset messages
    if (deletedItem?.active) {
      handleNewChat();
    }
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    setShowClearConfirm(false);
    handleNewChat();
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row bg-white rounded-2xl border border-[#c3c6d5]/60 shadow-sm overflow-hidden -mt-2">
      
      {/* Main Chat Center Section */}
      <div className="flex-1 flex flex-col h-full relative bg-[#f7f9fb]/40">
        
        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 pb-36 space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              {msg.sender === 'ai' ? (
                <div className="w-10 h-10 rounded-xl bg-[#00327d] flex-shrink-0 flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-white text-xl">smart_toy</span>
                </div>
              ) : (
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcRsI47L64XKqkZPYgVHCgsoPQCxLnyp7LGytq6byi01HEQthYrmb6j37qfgs1EIzbKLswYPw9s7A3EpEiAZTNkwKi-_J0XgEIIDyZLX78THSixQ5Atmfzdo7hhcALoL35gWvQusyVUfk9IYwGn-zFFO5EM1d10CVvxlKa59EnCpkmAMSpqu99iSpOz1bxh1UEyrvUvzP5LeIeel272ztO5b87mbcCXtUIdM3qfg5g_MJJCAU4oRhLS3iNrc9EnAPn4DnbYdMi_fAK" 
                  alt="User Avatar" 
                  className="w-10 h-10 rounded-full object-cover border border-[#c3c6d5] shadow-xs flex-shrink-0"
                />
              )}

              {/* Message Content */}
              <div className={`space-y-2 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-[#00327d] text-white rounded-tr-none shadow-xs' 
                    : 'bg-white text-[#191c1e] border border-[#c3c6d5]/60 rounded-tl-none shadow-xs'
                }`}>
                  <p>{msg.text}</p>

                  {/* User File Attachment */}
                  {msg.attachment && (
                    <div className="mt-3 inline-flex items-center gap-2 bg-white/10 p-2 rounded-lg border border-white/20 text-xs">
                      <span className="material-symbols-outlined text-amber-300 text-base">description</span>
                      <span className="font-semibold">{msg.attachment}</span>
                    </div>
                  )}
                </div>

                {/* AI Structured Report Card */}
                {msg.report && (
                  <div className="bg-white border-l-4 border-[#00327d] border-y border-r border-[#c3c6d5]/60 rounded-r-xl p-5 shadow-sm space-y-3 text-left max-w-xl">
                    <h3 className="font-serif text-base font-bold text-[#00327d]">{msg.report.title}</h3>
                    <ul className="space-y-2">
                      {msg.report.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#191c1e]">
                          {item.status === 'error' && (
                            <span className="material-symbols-outlined text-[#ba1a1a] text-sm mt-0.5">error</span>
                          )}
                          {item.status === 'success' && (
                            <span className="material-symbols-outlined text-[#01401e] text-sm mt-0.5">check_circle</span>
                          )}
                          {item.status === 'warning' && (
                            <span className="material-symbols-outlined text-amber-600 text-sm mt-0.5">warning</span>
                          )}
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                    {msg.report.pdfName && (
                      <div className="pt-2 border-t border-[#c3c6d5]/40 flex items-center justify-between">
                        <span className="text-xs text-[#434653] font-semibold">{msg.report.pdfName}</span>
                        <a
                          href={msg.report.pdfUrl || `/samples/${msg.report.pdfName}`}
                          download={msg.report.pdfName}
                          className="px-3 py-1.5 bg-[#00327d] text-white text-xs font-semibold rounded hover:bg-[#0047ab] transition-colors flex items-center gap-1.5 cursor-pointer no-underline"
                        >
                          <span className="material-symbols-outlined text-xs">download</span> Download PDF
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-[10px] text-[#737784] font-medium px-1">{msg.time}</div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 max-w-xl items-center">
              <div className="w-10 h-10 rounded-xl bg-[#00327d] flex-shrink-0 flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-white text-xl animate-spin">auto_awesome</span>
              </div>
              <div className="bg-white border border-[#c3c6d5]/60 px-4 py-3 rounded-2xl rounded-tl-none shadow-xs text-xs text-[#434653] flex items-center gap-2">
                <span>Themis AI đang phân tích dữ liệu pháp lý...</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#00327d] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#00327d] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#00327d] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#c3c6d5]/60 space-y-3">
          
          {/* Quick Action Chips & Linked Batch Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto">
              {/* Batch Selector Dropdown */}
              <select 
                value={selectedBatch || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedBatch(val || null);
                  if (val) {
                    handleSendMessage(`Yêu cầu AI quét tuân thủ pháp lý & tiêu chuẩn MRL cho [${val}]`);
                  }
                }}
                className="px-3 py-1.5 bg-[#d2e0fe]/50 border border-[#00327d]/30 text-[#00327d] font-bold rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="">📦 Chọn Lô Sầu riêng để phân tích...</option>
                <option value="Sầu riêng Ri6 (Lô DURIAN-2024-889)">🍈 Sầu riêng Ri6 (Lô DURIAN-2024-889)</option>
                <option value="Sầu riêng Monthong Dona (Lô DURIAN-2024-912)">🍈 Sầu riêng Monthong Dona (Lô DURIAN-2024-912)</option>
                <option value="Sầu riêng Ri6 Cắt Già (Lô DURIAN-2024-301)">🍈 Sầu riêng Ri6 Cắt Già (Lô DURIAN-2024-301)</option>
                <option value="Sầu riêng Musang King (Lô DURIAN-2024-104)">🍈 Sầu riêng Musang King (Lô DURIAN-2024-104)</option>
              </select>

              <button 
                onClick={() => handleSendMessage('Kiểm tra tuân thủ tiêu chuẩn GACC & mức Cadmium mới nhất')}
                className="px-3 py-1.5 bg-[#eceef0] hover:bg-[#e6e8ea] text-[#191c1e] font-semibold rounded-lg border border-[#c3c6d5]/60 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-sm text-[#00327d]">fact_check</span> Check GACC
              </button>
              <button 
                onClick={() => handleSendMessage('So sánh điều khoản hợp đồng phân phối mẫu A & B')}
                className="px-3 py-1.5 bg-[#eceef0] hover:bg-[#e6e8ea] text-[#191c1e] font-semibold rounded-lg border border-[#c3c6d5]/60 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-sm text-[#00327d]">compare_arrows</span> So sánh hợp đồng
              </button>
            </div>

            {selectedBatch && (
              <span className="px-2.5 py-1 bg-amber-400/15 border border-amber-500/30 text-amber-900 font-semibold text-[11px] rounded-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-amber-600">verified</span> Đã liên kết: {selectedBatch}
              </span>
            )}
          </div>

          {/* Active File Attachment Chip */}
          {attachedFileName && (
            <div className="flex items-center gap-2 bg-[#d2e0fe]/40 border border-[#00327d]/30 px-3 py-1.5 rounded-lg text-xs w-fit">
              <span className="material-symbols-outlined text-[#00327d] text-sm">description</span>
              <span className="font-semibold text-[#00327d]">{attachedFileName}</span>
              <button onClick={() => setAttachedFileName(null)} className="text-[#ba1a1a] hover:text-red-700 ml-1">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {/* Main Textarea Bar */}
          <div className="relative flex items-center bg-white border-2 border-[#00327d]/40 rounded-xl focus-within:border-[#00327d] shadow-sm">
            <button 
              onClick={() => setAttachedFileName('Phieu_dong_goi_DURIAN_2025_0889.pdf')}
              className="p-3 text-[#434653] hover:text-[#00327d] transition-colors cursor-pointer"
              title="Đính kèm tệp PDF"
            >
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Nhập yêu cầu tư vấn hoặc phân tích hợp đồng pháp lý... (Nhấn Enter để gửi)" 
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 py-3.5 px-2 text-sm text-[#191c1e] placeholder:text-[#737784] resize-none"
            />

            <button 
              onClick={() => handleSendMessage()}
              className="p-2.5 m-1.5 bg-[#00327d] hover:bg-[#0047ab] text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              title="Gửi câu hỏi"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>

      </div>

      {/* Right Sidebar - Lịch sử trò chuyện (Chat History) */}
      <div className="w-full lg:w-[300px] bg-[#f7f9fb] border-t lg:border-t-0 lg:border-l border-[#c3c6d5]/60 flex flex-col h-auto lg:h-full">
        <div className="p-4 border-b border-[#c3c6d5]/60 bg-white flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-[#191c1e] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00327d]">history</span> Lịch sử trò chuyện
          </h2>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button 
                onClick={() => setShowClearConfirm(true)}
                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                title="Xóa tất cả lịch sử"
              >
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
              </button>
            )}
            <button 
              onClick={handleNewChat}
              className="p-1.5 bg-[#00327d]/10 hover:bg-[#00327d]/20 text-[#00327d] rounded-lg transition-colors cursor-pointer"
              title="Tạo cuộc hội thoại mới"
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </div>

        {/* Clear All Confirmation */}
        {showClearConfirm && (
          <div className="p-3 bg-red-50 border-b border-red-200 space-y-2">
            <p className="text-xs text-red-800 font-semibold">Xóa toàn bộ lịch sử trò chuyện?</p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearAllHistory}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Xóa tất cả
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border border-gray-300 transition-colors cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#c3c6d5]">forum</span>
              <p className="text-xs text-[#737784]">Chưa có lịch sử trò chuyện</p>
              <button
                onClick={handleNewChat}
                className="px-3 py-1.5 bg-[#00327d] text-white text-xs font-semibold rounded-lg hover:bg-[#0047ab] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">add</span> Bắt đầu trò chuyện
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-[#737784] uppercase tracking-wider">Hôm nay</p>
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`group w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    item.active 
                      ? 'bg-[#d2e0fe]/40 border-[#00327d]/40 shadow-xs' 
                      : 'bg-white hover:bg-[#eceef0] border-[#c3c6d5]/40 text-[#434653]'
                  }`}
                  onClick={() => {
                    setHistory(prev => prev.map(h => ({ ...h, active: h.id === item.id })));
                  }}
                >
                  <span className={`material-symbols-outlined text-sm mt-0.5 ${item.active ? 'text-[#00327d]' : 'text-[#737784]'}`}>
                    chat_bubble
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${item.active ? 'text-[#00327d]' : 'text-[#191c1e]'}`}>
                      {item.title}
                    </p>
                    <p className="text-[10px] text-[#737784] mt-0.5">{item.time}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(item.id);
                    }}
                    className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-100 text-[#737784] hover:text-red-600 transition-all cursor-pointer flex-shrink-0"
                    title="Xóa cuộc trò chuyện này"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
