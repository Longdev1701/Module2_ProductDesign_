import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialProduct = queryParams.get('product');
  const initialBatch = queryParams.get('batch');

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
        text: 'Tôi cần kiểm tra hợp đồng phân phối độc quyền này theo luật thương mại mới nhất.',
        attachment: 'hop_dong_phan_phoi_v2.pdf',
        time: '10:31 AM'
      },
      {
        id: 3,
        sender: 'ai',
        text: 'Tôi đã phân tích xong hợp đồng. Dưới đây là kết quả đánh giá rủi ro pháp lý chi tiết:',
        time: '10:32 AM',
        report: {
          title: 'Báo cáo Rủi ro Phân phối - Nghị định EUDR & Thương mại 2024',
          items: [
            { status: 'error', text: 'Điều khoản bồi thường (Mục 4.2) không tuân thủ Nghị định mới về giới hạn trách nhiệm.' },
            { status: 'success', text: 'Quy định về giải quyết tranh chấp trọng tài hợp lệ.' },
            { status: 'warning', text: 'Cần bổ sung phụ lục kê khai minh bạch nguồn gốc vùng trồng cà phê.' }
          ],
          pdfName: 'Bao_cao_danh_gia_rui_ro_hop_dong.pdf'
        }
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
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

    // Simulate AI response after 1.2 seconds
    setTimeout(() => {
      setIsTyping(false);
      const aiReply: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Tôi đã tiếp nhận yêu cầu "${text.slice(0, 40)}...". Dựa trên cơ sở dữ liệu pháp lý mới nhất, tôi xin phản hồi như sau:`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        report: {
          title: 'Kết quả rà soát tự động Themis AI',
          items: [
            { status: 'success', text: 'Nội dung phù hợp với Khung pháp lý xuất khẩu EUDR 2024.' },
            { status: 'warning', text: 'Khuyến nghị rà soát lại mốc thời gian áp dụng trước ngày 15/11/2024.' }
          ],
          pdfName: 'Ket_qua_tu_van_Themis.pdf'
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
                        <button className="px-3 py-1.5 bg-[#00327d] text-white text-xs font-semibold rounded hover:bg-[#0047ab] transition-colors flex items-center gap-1.5 cursor-pointer">
                          <span className="material-symbols-outlined text-xs">download</span> Download PDF
                        </button>
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
                <option value="">📦 Chọn Lô hàng để phân tích...</option>
                <option value="Cà phê Robusta (Lô COFFEE-2024-889)">☕ Cà phê Robusta (Lô COFFEE-2024-889)</option>
                <option value="Cà phê Arabica Cầu Đất (Lô COFFEE-2024-912)">☕ Cà phê Arabica Cầu Đất (Lô COFFEE-2024-912)</option>
                <option value="Gạo ST25 Hữu cơ (Lô RICE-2024-301)">🌾 Gạo ST25 Hữu cơ (Lô RICE-2024-301)</option>
                <option value="Hạt tiêu đen Chư Sê (Lô PEPPER-2024-104)">🌱 Hạt tiêu đen Chư Sê (Lô PEPPER-2024-104)</option>
              </select>

              <button 
                onClick={() => handleSendMessage('Kiểm tra tuân thủ tiêu chuẩn EUDR mới nhất')}
                className="px-3 py-1.5 bg-[#eceef0] hover:bg-[#e6e8ea] text-[#191c1e] font-semibold rounded-lg border border-[#c3c6d5]/60 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-sm text-[#00327d]">fact_check</span> Check EUDR
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
              onClick={() => setAttachedFileName('hop_dong_tu_van.pdf')}
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
          <button 
            onClick={handleNewChat}
            className="p-1.5 bg-[#00327d]/10 hover:bg-[#00327d]/20 text-[#00327d] rounded-lg transition-colors cursor-pointer"
            title="Tạo cuộc hội thoại mới"
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-[#737784] uppercase tracking-wider">Hôm nay</p>
            {history.map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setHistory(prev => prev.map(h => ({ ...h, active: h.id === item.id })));
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                  item.active 
                    ? 'bg-[#d2e0fe]/40 border-[#00327d]/40 shadow-xs' 
                    : 'bg-white hover:bg-[#eceef0] border-[#c3c6d5]/40 text-[#434653]'
                }`}
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
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
