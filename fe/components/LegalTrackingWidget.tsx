import React from 'react';

export interface LegalTrackingItem {
  id: string | number;
  status: 'MỚI NHẤT' | 'CẢNH BÁO' | 'DỰ THẢO' | string;
  statusType: 'primary' | 'error' | 'neutral';
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

const defaultTrackingItems: LegalTrackingItem[] = [
  {
    id: 1,
    status: 'MỚI NHẤT',
    statusType: 'primary',
    title: 'EU: Thay đổi MRL Trái cây khô',
    description: 'Vừa cập nhật 2 giờ trước. Ảnh hưởng đến 14 sản phẩm của bạn.',
    actionText: 'Xem chi tiết',
  },
  {
    id: 2,
    status: 'CẢNH BÁO',
    statusType: 'error',
    title: 'FDA: Kiểm tra nhãn mác mới',
    description: 'Quy định có hiệu lực trong 45 ngày tới. Cần rà soát bao bì.',
    actionText: 'Bắt đầu rà soát',
  },
  {
    id: 3,
    status: 'DỰ THẢO',
    statusType: 'neutral',
    title: 'Trung Quốc: Luật BVTV 2025',
    description: 'Đang trong quá trình lấy ý kiến phản hồi công khai.',
    actionText: 'Xem dự thảo',
  },
];

export function LegalTrackingWidget({
  title = "Theo dõi pháp lý",
  items = defaultTrackingItems,
  className = ""
}: {
  title?: string;
  items?: LegalTrackingItem[];
  className?: string;
}) {
  return (
    <div className={`bg-white p-6 rounded-2xl border border-[#c3c6d5]/60 shadow-xs space-y-6 ${className}`}>
      {/* Title */}
      <h3 className="font-serif text-2xl font-bold text-[#191c1e]">{title}</h3>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-7 before:absolute before:left-2 before:top-2.5 before:bottom-2.5 before:w-[1.5px] before:bg-[#c3c6d5]/40">
        {items.map((item) => {
          let dotBg = "bg-[#00327d]";
          let tagColor = "text-[#00327d]";

          if (item.statusType === 'error') {
            dotBg = "bg-[#ba1a1a]";
            tagColor = "text-[#ba1a1a]";
          } else if (item.statusType === 'neutral') {
            dotBg = "bg-[#c3c6d5]";
            tagColor = "text-[#737784]";
          }

          return (
            <div key={item.id} className="relative group">
              {/* Timeline Indicator Dot */}
              <div 
                className={`absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full ${dotBg} ring-4 ring-white shadow-xs group-hover:scale-125 transition-transform duration-200`}
              />

              {/* Item Content */}
              <div className="space-y-1.5">
                {/* Status Tag */}
                <div className={`text-xs font-bold tracking-wider uppercase ${tagColor}`}>
                  {item.status}
                </div>

                {/* Item Title */}
                <h4 className="font-sans text-base font-bold text-[#191c1e] group-hover:text-[#00327d] transition-colors leading-snug">
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-[#434653] leading-relaxed">
                  {item.description}
                </p>

                {/* Action Link */}
                {item.actionText && (
                  <button 
                    onClick={item.onAction}
                    className="pt-1 text-sm font-semibold text-[#00327d] hover:text-[#0047ab] hover:underline flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {item.actionText}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LegalTrackingWidget;
