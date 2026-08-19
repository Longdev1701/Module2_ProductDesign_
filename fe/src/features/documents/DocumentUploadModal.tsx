"use client";

import React, { useState, useRef } from "react";
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DocumentType, UploadDocumentPayload } from "@/types/api";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: DocumentType;
  batchCode?: string;
  onUpload: (payload: UploadDocumentPayload) => Promise<void>;
}

const DOCUMENT_TYPE_LABELS: Record<DocumentType, { label: string; desc: string }> = {
  PHYTO: {
    label: "Giấy Chứng nhận Kiểm dịch Thực vật (Phytosanitary)",
    desc: "Do Chi cục KDTV cấp, xác nhận không nhiễm rệp sáp / dịch hại.",
  },
  LAB_REPORT: {
    label: "Phiếu Kiểm nghiệm Dư lượng & Cadmium (Lab Report)",
    desc: "Eurofins / SGS xác nhận chỉ tiêu Cadmium ≤ 0.05 mg/kg.",
  },
  CO: {
    label: "Chứng nhận Xuất xứ Hàng hóa (C/O Form E / Form B)",
    desc: "Xác nhận nguồn gốc xuất xứ thuần túy Việt Nam (ACFTA).",
  },
  PACKING_LIST: {
    label: "Bảng kê Đóng gói & Mã PHC (Packing List)",
    desc: "Quy cách đóng thùng 15kg/18kg, số container, mã cơ sở đóng gói.",
  },
  GPS_MAP: {
    label: "Bản đồ Tọa độ GPS Vùng trồng (PUC / EUDR)",
    desc: "Tọa độ đa giác vườn trồng đối soát mã PUC và tiêu chuẩn EUDR.",
  },
  CQ: {
    label: "Chứng chỉ Chất lượng Hàng hóa (C/Q)",
    desc: "Chứng chỉ chất lượng VietGAP, GlobalGAP, Organic.",
  },
  INVOICE: {
    label: "Hóa đơn Thương mại (Commercial Invoice)",
    desc: "Hóa đơn xuất khẩu chính ngạch sang thị trường đích.",
  },
  CONTRACT: {
    label: "Hợp đồng Ngoại thương (Sales Contract)",
    desc: "Hợp đồng mua bán nông sản ký kết với nhà nhập khẩu.",
  },
  OTHER: {
    label: "Chứng từ / Tài liệu Phụ trợ Khác",
    desc: "Các văn bản, biên bản kiểm tra hoặc chứng chỉ khác.",
  },
};

export function DocumentUploadModal({
  isOpen,
  onClose,
  defaultType = "PHYTO",
  batchCode,
  onUpload,
}: DocumentUploadModalProps) {
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState<DocumentType>(defaultType);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync defaultType when changed
  React.useEffect(() => {
    setDocType(defaultType);
  }, [defaultType]);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    setError(null);
    if (file.size > 15 * 1024 * 1024) {
      setError("Kích thước tệp vượt quá giới hạn 15MB. Vui lòng chọn tệp nhỏ hơn.");
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type || "application/octet-stream");

    // Auto set title if empty
    if (!title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      setTitle(cleanName);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFileDataUrl(e.target.result as string);
      }
    };
    reader.onerror = () => {
      setError("Không thể đọc tệp tin. Vui lòng thử lại.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileDataUrl) {
      setError("Vui lòng tải lên tệp tin chứng từ.");
      return;
    }
    if (!title.trim()) {
      setError("Vui lòng nhập tên chứng từ.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      await onUpload({
        title: title.trim(),
        type: docType,
        fileUrl: fileDataUrl,
        fileSize: fileSize || undefined,
        mimeType: mimeType || undefined,
      });
      handleClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Tải lên chứng từ thất bại.");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setFileDataUrl(null);
    setFileName(null);
    setFileSize(null);
    setMimeType(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-outline-variant flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 px-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
          <div>
            <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary" />
              Nạp Chứng từ Xuất khẩu (1-Chạm)
            </h3>
            <p className="text-xs text-on-surface-variant">
              {batchCode ? `Đính kèm trực tiếp vào Lô hàng: ${batchCode}` : "Nạp hồ sơ pháp lý vào hệ thống"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-primary bg-primary/5"
                : fileDataUrl
                ? "border-emerald-500 bg-emerald-50/50"
                : "border-outline hover:border-primary hover:bg-surface-container-lowest"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
              }}
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
            />

            {fileDataUrl ? (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="font-semibold text-sm text-on-surface">{fileName}</p>
                <p className="text-xs text-on-surface-variant">
                  {(fileSize! / 1024 / 1024).toFixed(2)} MB • Bấm vào đây để đổi tệp khác
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="font-semibold text-sm text-on-surface">
                  Kéo thả file PDF / Ảnh chụp chứng từ vào đây
                </p>
                <p className="text-xs text-on-surface-variant">
                  Hỗ trợ PDF, JPG, PNG, WEBP tối đa 15MB
                </p>
              </div>
            )}
          </div>

          {/* Document Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold uppercase text-on-surface-variant">
              Phân loại Chứng thư / Văn bản
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentType)}
              className="w-full h-10 px-3 border border-outline-variant rounded-xl bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            >
              {(Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[]).map((typeKey) => (
                <option key={typeKey} value={typeKey}>
                  {DOCUMENT_TYPE_LABELS[typeKey].label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-on-surface-variant">
              {DOCUMENT_TYPE_LABELS[docType]?.desc}
            </p>
          </div>

          {/* Document Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold uppercase text-on-surface-variant">
              Tên / Tiêu đề Văn bản
            </label>
            <Input
              required
              placeholder="VD: Chứng thư Kiểm dịch TV - Lô DURIAN-2024-889"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={uploading}
              className="px-4 py-2 border border-outline-variant hover:bg-surface-container text-on-surface font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <Button
              type="submit"
              disabled={uploading || !fileDataUrl}
              className="px-5 py-2 font-semibold text-sm rounded-xl gap-2"
            >
              {uploading ? "Đang nạp..." : "Xác nhận Nạp Chứng từ"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
