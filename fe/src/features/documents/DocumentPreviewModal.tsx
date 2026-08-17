"use client";

import React from "react";
import { X, ExternalLink, FileText, Download } from "lucide-react";
import type { DocumentItem } from "@/types/api";

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export function DocumentPreviewModal({
  document,
  onClose,
}: DocumentPreviewModalProps) {
  if (!document) return null;

  const isPdf =
    document.mimeType?.includes("pdf") ||
    document.fileUrl?.endsWith(".pdf") ||
    document.fileUrl?.startsWith("data:application/pdf");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full lg:max-w-4xl h-full lg:h-auto lg:max-h-[90vh] lg:rounded-2xl shadow-2xl border border-outline-variant flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 px-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-on-surface line-clamp-1">{document.title}</h3>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  {document.type}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Đã nạp ngày {new Date(document.createdAt).toLocaleDateString("vi-VN")}
                {document.fileSize ? ` • ${(document.fileSize / 1024 / 1024).toFixed(2)} MB` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {document.fileUrl && (
              <a
                href={document.fileUrl}
                target="_blank"
                rel="noreferrer"
                download={document.title}
                className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                title="Mở tab mới / Tải về"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-4 bg-surface-container-low overflow-auto flex items-center justify-center min-h-[400px]">
          {document.fileUrl ? (
            isPdf ? (
              <iframe
                src={document.fileUrl}
                className="w-full h-full min-h-[500px] rounded-lg border border-outline-variant bg-white shadow-xs"
                title={document.title}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={document.fileUrl}
                alt={document.title}
                className="max-h-[600px] max-w-full object-contain rounded-lg shadow-sm border border-outline-variant bg-white"
              />
            )
          ) : (
            <div className="text-center p-8 text-on-surface-variant">
              <FileText className="w-12 h-12 mx-auto mb-2 text-outline" />
              <p className="text-sm">Không tìm thấy đường dẫn tệp tin để xem trước.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 px-6 border-t border-outline-variant flex items-center justify-between bg-white text-xs text-on-surface-variant">
          <span>Khóa tuân thủ số hóa Themis LexiGuard</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-outline-variant hover:bg-surface-container rounded-lg font-semibold text-on-surface transition-colors cursor-pointer"
          >
            Đóng xem trước
          </button>
        </div>
      </div>
    </div>
  );
}
