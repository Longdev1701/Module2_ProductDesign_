"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ChatMessage {
  id: string | number;
  sender: 'ai' | 'user';
  text: string;
  attachment?: string;
  report?: {
    title: string;
    items: { status: 'error' | 'success' | 'warning'; text: string; citation?: string }[];
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

  const [deepResearchMode, setDeepResearchMode] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(
    initialBatch ? `${initialProduct} (Lô ${initialBatch})` : "Sầu riêng Tươi Ri6 (Lô DURIAN-2026-CN088)"
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (initialProduct && initialBatch) {
      return [
        {
          id: 1,
          sender: 'ai',
          text: `Xin chào! Tôi đã nạp ngữ cảnh lô hàng [${initialProduct} - Lô: ${initialBatch}]. Dựa trên Nghị định thư Hải quan Trung Quốc (GACC Protocol), bạn cần tôi đối soát chỉ số MRL Cadmium (GB 2762-2022), Dithiocarbamates hay quy định tem nhãn phụ Tiếng Trung Lệnh 248?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    }
    return [
      {
        id: 1,
        sender: 'ai',
        text: 'Xin chào, tôi là Trợ lý AI Thẩm định Tuân thủ Themis LexiGuard. Tôi được huấn luyện chuyên sâu về Nghị định thư Hải quan Trung Quốc (GACC) đối với Sầu riêng Tươi & Cấp đông (Mã HS: 0810.60.00 / 0811.90.00). Tôi có thể hỗ trợ gì cho phiên thẩm định hôm nay?',
        time: '10:30 AM'
      },
      {
        id: 2,
        sender: 'user',
        text: 'Tôi cần kiểm tra toàn bộ chứng từ Lô sầu riêng DURIAN-2026-CN088 bao gồm Phiếu thử nghiệm Eurofins MRL và Giấy Phytosanitary PSC.',
        attachment: 'Phytosanitary_PSC_VN_2026_9912.pdf',
        time: '10:31 AM'
      },
      {
        id: 3,
        sender: 'ai',
        text: 'Tôi đã hoàn tất phân tích đối soát Lô sầu riêng DURIAN-2026-CN088 theo Nghị định thư GACC 2022 và Tiêu chuẩn An toàn Thực phẩm Trung Quốc GB 2762/2763. Dưới đây là kết quả rà soát chi tiết:',
        time: '10:32 AM',
        report: {
          title: 'Báo cáo Thẩm định Sầu riêng GACC — Lô DURIAN-2026-CN088',
          items: [
            { 
              status: 'success', 
              text: 'Chỉ số Cadmium (Cd) = 0.02 mg/kg <= 0.05 mg/kg (Đạt chuẩn GB 2762-2022).',
              citation: 'Điều 3, Tiêu chuẩn Quốc gia GB 2762-2022'
            },
            { 
              status: 'success', 
              text: 'Mã số Vùng trồng VN-WBPH-0125 & Cơ sở đóng gói VN-DBPH-088 hợp lệ trên cổng GACC.',
              citation: 'Điều 2, Nghị định thư Hải quan GACC Sầu riêng Tươi 2022'
            },
            { 
              status: 'warning', 
              text: 'Yêu cầu in dán bổ sung tem nhãn phụ Tiếng Trung (输往中华人民共和国) lên 925 thùng hàng trước khi niêm phong container.',
              citation: 'Điều 8, Lệnh số 248/2021/GACC & Lệnh 249/GACC'
            }
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
        text: `Tôi đã tiếp nhận và đối soát yêu cầu "${text.slice(0, 40)}..." với CSDL Nghị định thư Hải quan GACC Sầu riêng 2022. Dưới đây là căn cứ pháp lý:`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        report: {
          title: 'Kết quả rà soát tự động Themis AI Engine',
          items: [
            { 
              status: 'success', 
              text: 'Dữ liệu kiểm nghiệm phù hợp với Tiêu chuẩn An toàn Thực phẩm Nhập khẩu Trung Quốc.',
              citation: 'Tiêu chuẩn Quốc gia GB 2763-2021 & GB 2762-2022'
            },
            { 
              status: 'success', 
              text: 'Thời hạn hiệu lực Giấy chứng nhận Phytosanitary hợp lệ (< 14 ngày).',
              citation: 'Điều 4, Nghị định thư GACC Sầu riêng 2022'
            }
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
    <div className="flex h-[calc(100vh-6.5rem)] gap-4 animate-fadeIn text-[#131b2e]">
      {/* Left Chat History Panel */}
      <div className="w-72 bg-white rounded-2xl border border-[#c5c5d3]/60 flex flex-col shadow-2xs hidden md:flex">
        <div className="p-4 border-b border-[#c5c5d3]/50 flex items-center justify-between bg-[#f2f3ff]">
          <h3 className="font-serif text-base font-bold text-[#00236f]">Lịch sử tư vấn GACC</h3>
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
            className="p-1.5 hover:bg-[#e2e7ff] rounded-lg text-[#00236f] transition-colors cursor-pointer" 
            title="Phiên làm việc mới"
          >
            <span className="material-symbols-outlined text-xl">add</span>
          </button>
        </div>

        {/* Selected Context Badge */}
        <div className="p-3 bg-[#e2e7ff]/60 border-b border-[#c5c5d3]/50 space-y-1">
          <p className="text-[10px] font-bold text-[#00236f] uppercase tracking-wider">NGỮ CẢNH HỒ SƠ LÔ HÀNG</p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#131b2e]">
            <span className="material-symbols-outlined text-sm text-[#00236f]">eco</span>
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
              className={`p-3 rounded-xl text-xs cursor-pointer transition-all flex items-center justify-between ${
                item.active 
                  ? 'bg-[#00236f] text-white font-bold shadow-2xs' 
                  : 'hover:bg-[#f2f3ff] text-[#444651]'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-base">chat_bubble_outline</span>
                <span className="truncate">{item.title}</span>
              </div>
              <span className={`text-[10px] flex-shrink-0 ml-1 ${item.active ? 'text-white/80' : 'text-[#757682]'}`}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-white rounded-2xl border border-[#c5c5d3]/60 flex flex-col shadow-2xs overflow-hidden">
        
        {/* Chat Header / Context Bar */}
        <div className="p-4 border-b border-[#c5c5d3]/50 flex flex-wrap items-center justify-between bg-[#f2f3ff] gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00236f] text-white flex items-center justify-center font-serif font-bold text-lg shadow-2xs">
              TL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold text-[#131b2e]">Trợ lý Thẩm định AI GACC Sầu riêng</h3>
                <span className="px-2 py-0.5 bg-[#e8f5e9] text-[#15803d] text-[10px] font-bold rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803d] animate-pulse"></span> GACC Active Engine
                </span>
              </div>
              <p className="text-xs text-[#444651]">Nông sản: Sầu riêng Tươi Ri6 / Dona (Mã HS: 0810.60.00) — Thị trường: Trung Quốc</p>
            </div>
          </div>

          {/* Deep Research Mode Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#c5c5d3] text-xs font-bold text-[#00236f]">
              <span>DEEP RESEARCH MODE</span>
              <button 
                onClick={() => setDeepResearchMode(!deepResearchMode)}
                className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${deepResearchMode ? 'bg-[#00236f]' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${deepResearchMode ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            <button 
              onClick={() => window.open("/Bao_Cao_Tham_Dinh_Tuan_Thu_GACC_Sau_Rieng.pdf", "_blank")}
              className="px-3 py-1.5 bg-white hover:bg-[#f2f3ff] text-[#00236f] font-bold text-xs rounded-xl border border-[#00236f] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">picture_as_pdf</span> Xuất Báo Cáo PDF
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#faf8ff]">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-2xs ${
                msg.sender === 'ai' ? 'bg-[#00236f] text-white' : 'bg-[#e2e7ff] text-[#131b2e]'
              }`}>
                {msg.sender === 'ai' ? 'AI' : 'Bạn'}
              </div>

              <div className="space-y-2">
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  msg.sender === 'user' 
                    ? 'bg-[#00236f] text-white rounded-tr-none' 
                    : 'bg-white text-[#131b2e] border border-[#c5c5d3]/60 rounded-tl-none'
                }`}>
                  <p>{msg.text}</p>

                  {/* Attached File Display */}
                  {msg.attachment && (
                    <div className="mt-3 p-2.5 bg-black/10 rounded-lg flex items-center gap-2 text-xs font-mono">
                      <span className="material-symbols-outlined text-base">description</span>
                      <span className="font-semibold truncate">{msg.attachment}</span>
                    </div>
                  )}

                  {/* Embedded Structured Compliance Report */}
                  {msg.report && (
                    <div className="mt-4 p-4 bg-[#f2f3ff] text-[#131b2e] rounded-xl border border-[#c5c5d3] space-y-3">
                      <div className="flex items-center justify-between border-b border-[#c5c5d3] pb-2">
                        <span className="font-serif font-bold text-xs text-[#00236f] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">verified</span>
                          {msg.report.title}
                        </span>
                        <span className="text-[10px] font-bold text-[#854d0e] bg-[#fef9c3] px-2 py-0.5 rounded border border-[#fde047]">
                          ACTION REQUIRED
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        {msg.report.items.map((item, idx) => (
                          <div key={idx} className="space-y-1 bg-white p-3 rounded-lg border border-[#c5c5d3]/50">
                            <div className="flex items-start gap-2">
                              {item.status === 'error' && <span className="material-symbols-outlined text-sm text-[#93000a] mt-0.5">error</span>}
                              {item.status === 'warning' && <span className="material-symbols-outlined text-sm text-[#854d0e] mt-0.5">warning</span>}
                              {item.status === 'success' && <span className="material-symbols-outlined text-sm text-[#15803d] mt-0.5">check_circle</span>}
                              <span className="flex-1 text-[#131b2e] font-semibold">{item.text}</span>
                            </div>
                            {item.citation && (
                              <p className="text-[11px] font-bold text-[#00236f] bg-[#e2e7ff]/60 px-2 py-0.5 rounded inline-block">
                                Trích dẫn: {item.citation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {msg.report.pdfName && (
                        <div className="pt-2 border-t border-[#c5c5d3] flex justify-end">
                          <button 
                            onClick={() => window.open("/Bao_Cao_Tham_Dinh_Tuan_Thu_GACC_Sau_Rieng.pdf", "_blank")}
                            className="px-3 py-1.5 bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                            Xem Báo cáo PDF GACC
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <span className={`text-[10px] text-[#757682] block ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-3xl">
              <div className="w-8 h-8 rounded-xl bg-[#00236f] text-white flex items-center justify-center text-xs font-bold">
                AI
              </div>
              <div className="p-4 bg-white border border-[#c5c5d3]/60 rounded-2xl rounded-tl-none text-xs text-[#757682] flex items-center gap-2">
                <span className="material-symbols-outlined text-base animate-spin">sync</span>
                Đang đối soát quy định Nghị định thư GACC &amp; MRL Cadmium...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Pills */}
        <div className="p-3 bg-white border-t border-[#c5c5d3]/60 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-[#757682] uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">lightbulb</span> Gợi ý câu hỏi GACC:
          </span>
          <button 
            onClick={() => handleQuickPrompt("Kiểm tra chỉ số dư lượng Cadmium và Dithiocarbamates lô sầu riêng này.")}
            className="px-3 py-1 bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#00236f] border border-[#c5c5d3] rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer"
          >
            Kiểm tra Cadmium &amp; Dithiocarbamates
          </button>
          <button 
            onClick={() => handleQuickPrompt("Mã PUC VN-WBPH-0125 và PHC VN-DBPH-088 đã có trên danh sách GACC chưa?")}
            className="px-3 py-1 bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#00236f] border border-[#c5c5d3] rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer"
          >
            Đối soát mã PUC/PHC GACC
          </button>
          <button 
            onClick={() => handleQuickPrompt("Quy định tem nhãn tiếng Trung Lệnh 248 cho 925 thùng sầu riêng?")}
            className="px-3 py-1 bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#00236f] border border-[#c5c5d3] rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer"
          >
            Tem nhãn Tiếng Trung Lệnh 248
          </button>
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-white border-t border-[#c5c5d3]/60">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <label className="p-2 hover:bg-[#f2f3ff] text-[#444651] rounded-xl cursor-pointer transition-colors" title="Đính kèm file chứng từ">
              <span className="material-symbols-outlined text-xl">attach_file</span>
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>

            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder={attachedFileName ? `File đính kèm: ${attachedFileName}` : "Nhập thắc mắc pháp lý GACC hoặc yêu cầu thẩm định sầu riêng..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-[#faf8ff] border border-[#c5c5d3] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#00236f] text-[#131b2e]"
              />
              {attachedFileName && (
                <button 
                  type="button" 
                  onClick={() => setAttachedFileName(null)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757682] hover:text-[#ba1a1a]"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            <button 
              type="submit"
              disabled={!inputText.trim() && !attachedFileName}
              className="px-5 py-3 bg-[#00236f] hover:bg-[#1e3a8a] disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
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
