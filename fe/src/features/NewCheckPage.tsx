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
    initialBatch ? `${initialProduct} (Lô ${initialBatch})` : "Sầu riêng Tươi Ri6 (Lô DURIAN-2026-CN088)"
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (initialProduct && initialBatch) {
      return [
        {
          id: 1,
          sender: 'ai',
          text: `Xin chào! Tôi đã kích hoạt hồ sơ lô hàng [${initialProduct} - Lô: ${initialBatch}]. Dựa trên Nghị định thư Hải quan Trung Quốc (GACC), bạn cần tôi kiểm tra dư lượng MRL Cadmium (GB 2762-2022), Dithiocarbamates hay hồ sơ Phytosanitary PSC cho lô sầu riêng này?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    }
    return [
      {
        id: 1,
        sender: 'ai',
        text: 'Xin chào, tôi là AI Themis LexiGuard. Tôi phụ trách thẩm định tuân thủ pháp lý Hải quan Trung Quốc (GACC Protocol) cho Lô Sầu riêng xuất khẩu (Mã HS: 0810.60.00). Tôi có thể giúp gì cho bạn hôm nay?',
        time: '10:30 AM'
      },
      {
        id: 2,
        sender: 'user',
        text: 'Tôi cần quét kiểm tra toàn bộ hồ sơ Lô sầu riêng DURIAN-2026-CN088 bao gồm Phiếu thử nghiệm Eurofins MRL và Giấy Phytosanitary.',
        attachment: 'Phytosanitary_PSC_VN_2026_9912.pdf',
        time: '10:31 AM'
      },
      {
        id: 3,
        sender: 'ai',
        text: 'Tôi đã hoàn tất phân tích đối soát Lô sầu riêng DURIAN-2026-CN088 theo Nghị định thư GACC 2022 và Tiêu chuẩn GB 2762/2763. Dưới đây là báo cáo đánh giá:',
        time: '10:32 AM',
        report: {
          title: 'Báo cáo Thẩm định Sầu riêng GACC — Lô DURIAN-2026-CN088',
          items: [
            { status: 'success', text: 'Chỉ số Cadmium (Cd) = 0.02 mg/kg <= 0.05 mg/kg (Đạt chuẩn GB 2762-2022).' },
            { status: 'success', text: 'Mã số Vùng trồng VN-WBPH-0125 & Cơ sở đóng gói VN-DBPH-088 hợp lệ trên cổng GACC.' },
            { status: 'warning', text: 'Yêu cầu dán bổ sung tem nhãn phụ Tiếng Trung (输往中华人民共和国) lên 925 thùng sầu riêng trước khi kẹp chì container.' }
          ],
          pdfName: 'Bao_Cao_Tham_Dinh_Tuan_Thu_GACC_Sau_Rieng.pdf'
        }
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<ChatHistoryItem[]>([
    { id: '1', title: 'Thẩm định Lô DURIAN-2026-CN088', time: '10:32 AM', active: true },
    { id: '2', title: 'Đối soát MRL Cadmium Sầu riêng Dona', time: 'Hôm qua' },
    { id: '3', title: 'Kiểm tra mã PUC Krông Pắc GACC', time: 'Thứ 2' },
    { id: '4', title: 'Rà soát tem nhãn Tiếng Trung Lệnh 248', time: '08/08' },
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

    setTimeout(() => {
      setIsTyping(false);
      const aiReply: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Tôi đã đối soát yêu cầu "${text.slice(0, 40)}..." với CSDL Nghị định thư Hải quan GACC Sầu riêng 2022. Dưới đây là kết quả tư vấn:`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        report: {
          title: 'Kết quả rà soát tự động GACC AI Engine',
          items: [
            { status: 'success', text: 'Thông tin phù hợp với Tiêu chuẩn An toàn Thực phẩm Nhập khẩu Trung Quốc.' },
            { status: 'success', text: 'Thời hạn hiệu lực Giấy chứng nhận Phytosanitary hợp lệ.' }
          ],
          pdfName: 'Bao_Cao_Tham_Dinh_Tuan_Thu_GACC_Sau_Rieng.pdf'
        }
      };
      setMessages(prev => [...prev, aiReply]);
    }, 1200);
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFileName(file.name);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] gap-4 animate-fadeIn">
      {/* Left Chat History Panel */}
      <div className="w-72 bg-white rounded-xl border border-[#c3c6d5]/60 flex flex-col shadow-xs hidden md:flex">
        <div className="p-4 border-b border-[#c3c6d5]/60 flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-[#191c1e]">Lịch sử tư vấn GACC</h3>
          <button 
            onClick={() => {
              setMessages([
                {
                  id: Date.now(),
                  sender: 'ai',
                  text: 'Xin chào! Tôi đã sẵn sàng hỗ trợ thẩm định phiên kiểm tra Lô sầu riêng GACC mới.',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]);
            }}
            className="p-1.5 hover:bg-[#eceef0] rounded-lg text-[#00327d] transition-colors cursor-pointer" 
            title="Phiên làm việc mới"
          >
            <span className="material-symbols-outlined text-xl">add</span>
          </button>
        </div>

        {/* Selected Context Badge */}
        <div className="p-3 bg-[#d2e0fe]/40 border-b border-[#c3c6d5]/60">
          <p className="text-[10px] font-bold text-[#00327d] uppercase tracking-wider mb-1">Ngữ cảnh Lô Sầu Riêng</p>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#191c1e]">
            <span className="material-symbols-outlined text-sm text-[#00327d]">eco</span>
            <span className="truncate">{selectedBatch || "Chưa chọn lô hàng"}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {history.map(item => (
            <div 
              key={item.id}
              onClick={() => {
                setHistory(prev => prev.map(h => ({ ...h, active: h.id === item.id })));
              }}
              className={`p-3 rounded-lg text-xs cursor-pointer transition-colors flex items-center justify-between ${
                item.active 
                  ? 'bg-[#00327d]/10 text-[#00327d] font-bold border border-[#00327d]/20' 
                  : 'hover:bg-[#f7f9fb] text-[#434653]'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-base">chat_bubble_outline</span>
                <span className="truncate">{item.title}</span>
              </div>
              <span className="text-[10px] text-[#737784] flex-shrink-0 ml-1">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-white rounded-xl border border-[#c3c6d5]/60 flex flex-col shadow-xs overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#c3c6d5]/60 flex items-center justify-between bg-[#f7f9fb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00327d] text-white flex items-center justify-center font-serif font-bold text-lg shadow-xs">
              TL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold text-[#191c1e]">Trợ lý Thẩm định AI GACC Sầu riêng</h3>
                <span className="px-2 py-0.5 bg-[#b5f1bf] text-[#18512c] text-[10px] font-bold rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#18512c] animate-pulse"></span> GACC Protocol 2022
                </span>
              </div>
              <p className="text-xs text-[#434653]">Nông sản: Sầu riêng Tươi Ri6 / Dona (Mã HS: 0810.60.00) — Thị trường: Trung Quốc</p>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f7f9fb]/50">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.sender === 'ai' ? 'bg-[#00327d] text-white' : 'bg-[#eceef0] text-[#191c1e]'
              }`}>
                {msg.sender === 'ai' ? 'AI' : 'Bạn'}
              </div>

              <div className="space-y-2">
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  msg.sender === 'user' 
                    ? 'bg-[#00327d] text-white rounded-tr-none' 
                    : 'bg-white text-[#191c1e] border border-[#c3c6d5]/60 rounded-tl-none'
                }`}>
                  <p>{msg.text}</p>

                  {/* Attached File Display */}
                  {msg.attachment && (
                    <div className="mt-3 p-2.5 bg-black/10 rounded-lg flex items-center gap-2 text-xs">
                      <span className="material-symbols-outlined text-base">description</span>
                      <span className="font-semibold truncate">{msg.attachment}</span>
                    </div>
                  )}

                  {/* Embedded Structured Compliance Report */}
                  {msg.report && (
                    <div className="mt-4 p-4 bg-[#f7f9fb] text-[#191c1e] rounded-xl border border-[#c3c6d5] space-y-3">
                      <div className="flex items-center justify-between border-b border-[#c3c6d5] pb-2">
                        <span className="font-serif font-bold text-xs text-[#00327d] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">verified</span>
                          {msg.report.title}
                        </span>
                        <span className="text-[10px] font-bold text-[#854d0e] bg-[#fef9c3] px-2 py-0.5 rounded border border-[#fde047]">
                          ACTION REQUIRED
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        {msg.report.items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            {item.status === 'error' && <span className="material-symbols-outlined text-sm text-[#93000a] mt-0.5">error</span>}
                            {item.status === 'warning' && <span className="material-symbols-outlined text-sm text-[#854d0e] mt-0.5">warning</span>}
                            {item.status === 'success' && <span className="material-symbols-outlined text-sm text-[#18512c] mt-0.5">check_circle</span>}
                            <span className="flex-1 text-[#434653]">{item.text}</span>
                          </div>
                        ))}
                      </div>

                      {msg.report.pdfName && (
                        <div className="pt-2 border-t border-[#c3c6d5] flex justify-end">
                          <button 
                            onClick={() => window.open("/Bao_Cao_Tham_Dinh_Tuan_Thu_GACC_Sau_Rieng.pdf", "_blank")}
                            className="px-3 py-1.5 bg-[#00327d] hover:bg-[#0047ab] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                            Xem Báo cáo PDF GACC
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <span className={`text-[10px] text-[#737784] block ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-3xl">
              <div className="w-8 h-8 rounded-full bg-[#00327d] text-white flex items-center justify-center text-xs font-bold">
                AI
              </div>
              <div className="p-4 bg-white border border-[#c3c6d5]/60 rounded-2xl rounded-tl-none text-xs text-[#737784] flex items-center gap-2">
                <span className="material-symbols-outlined text-base animate-spin">sync</span>
                Đang đối soát quy định Nghị định thư GACC &amp; MRL Cadmium...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Pills */}
        <div className="p-3 bg-white border-t border-[#c3c6d5]/60 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-[#737784] uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">lightbulb</span> Gợi ý câu hỏi:
          </span>
          <button 
            onClick={() => handleQuickPrompt("Kiểm tra chỉ số dư lượng Cadmium và Dithiocarbamates lô sầu riêng này.")}
            className="px-3 py-1 bg-[#f7f9fb] hover:bg-[#d2e0fe]/60 text-[#00327d] border border-[#c3c6d5] rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
          >
            🔍 Kiểm tra Cadmium &amp; Dithiocarbamates
          </button>
          <button 
            onClick={() => handleQuickPrompt("Mã PUC VN-WBPH-0125 và PHC VN-DBPH-088 đã có trên danh sách GACC chưa?")}
            className="px-3 py-1 bg-[#f7f9fb] hover:bg-[#d2e0fe]/60 text-[#00327d] border border-[#c3c6d5] rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
          >
            📋 Đối soát mã PUC/PHC GACC
          </button>
          <button 
            onClick={() => handleQuickPrompt("Quy định tem nhãn tiếng Trung Lệnh 248 cho 925 thùng sầu riêng?")}
            className="px-3 py-1 bg-[#f7f9fb] hover:bg-[#d2e0fe]/60 text-[#00327d] border border-[#c3c6d5] rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
          >
            🏷️ Tem nhãn Tiếng Trung Lệnh 248
          </button>
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-white border-t border-[#c3c6d5]/60">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <label className="p-2 hover:bg-[#eceef0] text-[#434653] rounded-lg cursor-pointer transition-colors" title="Đính kèm file chứng từ">
              <span className="material-symbols-outlined text-xl">attach_file</span>
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>

            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder={attachedFileName ? `File đính kèm: ${attachedFileName}` : "Nhập thắc mắc pháp lý GACC hoặc yêu cầu thẩm định sầu riêng..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-[#f7f9fb] border border-[#c3c6d5] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#00327d] text-[#191c1e]"
              />
              {attachedFileName && (
                <button 
                  type="button" 
                  onClick={() => setAttachedFileName(null)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737784] hover:text-[#93000a]"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            <button 
              type="submit"
              disabled={!inputText.trim() && !attachedFileName}
              className="px-5 py-3 bg-[#00327d] hover:bg-[#0047ab] disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Gửi</span>
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
