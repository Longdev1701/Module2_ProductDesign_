import { ExternalLink, FileText } from "lucide-react";

import { isSafeHttpUrl } from "@/lib/safe-url";

import type { LegalUpdateDetail } from "../types";

function formatDate(value: string | null): string | null {
  if (!value) return null;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function DetailList({ items }: { items: string[] | undefined }) {
  if (!items || items.length === 0) return null;
  return <ul className="mt-2 list-disc space-y-1 pl-5">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function LegalUpdateDetailContent({ update }: { update: LegalUpdateDetail }) {
  const sourceUrl = isSafeHttpUrl(update.sourceUrl) ? update.sourceUrl : null;
  const documentUrl = isSafeHttpUrl(update.documentUrl) ? update.documentUrl : null;
  const detailedSections = update.detailedSummaryVi
    ? [["Mục đích", update.detailedSummaryVi.purpose], ["Phạm vi", update.detailedSummaryVi.scope]] as const
    : [];

  return (
    <div className="space-y-6 text-sm text-on-surface-variant">
      {update.titleOriginal && <p><span className="font-semibold text-on-surface">Tiêu đề gốc: </span>{update.titleOriginal}</p>}
      <section><h3 className="font-semibold text-on-surface">Tóm tắt</h3><p className="mt-1 leading-relaxed">{update.summaryVi}</p></section>
      {detailedSections.map(([label, content]) => content && <section key={label}><h3 className="font-semibold text-on-surface">{label}</h3><p className="mt-1 leading-relaxed">{content}</p></section>)}
      {update.businessImpactVi && <section><h3 className="font-semibold text-on-surface">Tác động tới doanh nghiệp</h3><p className="mt-1 leading-relaxed">{update.businessImpactVi}</p></section>}
      {update.detailedSummaryVi && (
        <>
          <section><h3 className="font-semibold text-on-surface">Yêu cầu chính</h3><DetailList items={update.detailedSummaryVi.keyRequirements} /></section>
          <section><h3 className="font-semibold text-on-surface">Kiểm tra và chứng nhận</h3><DetailList items={update.detailedSummaryVi.inspectionAndCertification} /></section>
          <section><h3 className="font-semibold text-on-surface">Hệ quả hoặc xử lý</h3><DetailList items={update.detailedSummaryVi.penaltiesOrConsequences} /></section>
          <section><h3 className="font-semibold text-on-surface">Thông tin cần làm rõ</h3><DetailList items={update.detailedSummaryVi.unknowns} /></section>
        </>
      )}
      {update.recommendedActions.length > 0 && (
        <section>
          <h3 className="font-semibold text-on-surface">Hành động đề xuất</h3>
          <ul className="mt-2 space-y-2">
            {update.recommendedActions.map((action) => (
              <li key={`${action.actionVi}-${action.basis}`} className="rounded border border-outline-variant p-3">
                <p className="font-medium text-on-surface">{action.actionVi}</p>
                <p className="mt-1">Căn cứ: {action.basis}</p>
                <p className="mt-1">Ưu tiên: {action.priority}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="grid gap-2 rounded-lg bg-surface-container-low p-4 sm:grid-cols-2">
        <p><span className="font-semibold text-on-surface">Thị trường: </span>{update.market}</p>
        <p><span className="font-semibold text-on-surface">Cơ quan: </span>{update.sourceAgency ?? "Chưa có"}</p>
        <p><span className="font-semibold text-on-surface">Công bố: </span>{formatDate(update.publishedAt) ?? "Chưa có"}</p>
        <p><span className="font-semibold text-on-surface">Hiệu lực: </span>{formatDate(update.effectiveAt) ?? "Chưa có"}</p>
        {update.affectedGroups.length > 0 && <p><span className="font-semibold text-on-surface">Nhóm hàng: </span>{update.affectedGroups.join(", ")}</p>}
        {update.hsCodes.length > 0 && <p><span className="font-semibold text-on-surface">Mã HS: </span>{update.hsCodes.join(", ")}</p>}
      </section>
      {update.affectedProducts.length > 0 && (
        <section>
          <h3 className="font-semibold text-on-surface">Sản phẩm bị ảnh hưởng</h3>
          <ul className="mt-2 space-y-2">
            {update.affectedProducts.map((product) => (
              <li key={`${product.nameVi}-${product.hsCode ?? "no-hs"}`} className="rounded border border-outline-variant p-3">
                <p className="font-medium text-on-surface">{product.nameVi}</p>
                {product.nameOriginal && <p className="mt-1">Tên gốc: {product.nameOriginal}</p>}
                {product.hsCode && <p className="mt-1">Mã HS: {product.hsCode}</p>}
                <p className="mt-1">Phạm vi: {product.scope}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      {update.citations.length > 0 && (
        <section>
          <h3 className="font-semibold text-on-surface">Trích dẫn</h3>
          <ul className="mt-2 space-y-2">
            {update.citations.map((citation) => (
              <li key={`${citation.sourceReference}-${citation.section}-${citation.quoteVi}`} className="rounded border border-outline-variant p-3">
                <p>{citation.quoteVi}</p>
                {(citation.sourceReference || citation.section) && <p className="mt-2 text-xs">{[citation.sourceReference, citation.section].filter(Boolean).join(" • ")}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="flex flex-wrap gap-4 font-semibold text-primary">
        {sourceUrl && <a href={sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">Nguồn chính thức <ExternalLink className="h-4 w-4" aria-hidden="true" /></a>}
        {documentUrl && <a href={documentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">Tài liệu pháp lý <FileText className="h-4 w-4" aria-hidden="true" /></a>}
      </div>
    </div>
  );
}
