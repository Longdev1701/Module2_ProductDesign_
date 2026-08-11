import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register TrueType Fonts for 100% Flawless Vietnamese Unicode Support
pdfmetrics.registerFont(TTFont('Arial', r'C:\Windows\Fonts\arial.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold', r'C:\Windows\Fonts\arialbd.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Italic', r'C:\Windows\Fonts\ariali.ttf'))
pdfmetrics.registerFont(TTFont('Arial-BoldItalic', r'C:\Windows\Fonts\arialbi.ttf'))

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Arial", 8)
        self.setFillColor(colors.HexColor("#737784"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 802, "THEMIS LEXIGUARD — BÁO CÁO THẨM ĐỊNH TUÂN THỦ PHÁP LÝ SẦU RIÊNG GACC")
            self.drawRightString(541, 802, "MÃ SỐ: TLG-RPT-GACC-2026-0888")
            self.setStrokeColor(colors.HexColor("#C3C6D5"))
            self.setLineWidth(0.5)
            self.line(54, 794, 541, 794)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#C3C6D5"))
        self.setLineWidth(0.5)
        self.line(54, 45, 541, 45)

        footer_left = "Mã Hash Bảo mật Bất biến: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        footer_right = f"Trang {self._pageNumber} / {page_count}"
        self.drawString(54, 32, footer_left)
        self.drawRightString(541, 32, footer_right)
        self.restoreState()

def create_vietnamese_gacc_pdf(pdf_path):
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Color Palette
    COLOR_NAVY = colors.HexColor("#00236F")       # Main Theme
    COLOR_BLUE = colors.HexColor("#0047AB")       # Accent Blue
    COLOR_SUCCESS_TEXT = colors.HexColor("#18512C")# Green Status
    COLOR_SUCCESS_BG = colors.HexColor("#E8F5E9")  # Green Light
    COLOR_WARN_TEXT = colors.HexColor("#854D0E")   # Amber Text
    COLOR_WARN_BG = colors.HexColor("#FEF9C3")    # Amber Light
    COLOR_TEXT_MAIN = colors.HexColor("#191C1E")   # Dark Neutral
    COLOR_TEXT_MUTED = colors.HexColor("#434653")  # Muted Neutral
    COLOR_BORDER = colors.HexColor("#C3C6D5")      # Light Border
    COLOR_BG_CARD = colors.HexColor("#F7F9FB")     # Light Card BG

    # Typography Styles using Unicode Arial
    style_header_title = ParagraphStyle(
        'DocHeaderTitle',
        parent=styles['Normal'],
        fontName='Arial-Bold',
        fontSize=13,
        leading=16,
        textColor=COLOR_NAVY
    )

    style_header_sub = ParagraphStyle(
        'DocHeaderSub',
        parent=styles['Normal'],
        fontName='Arial',
        fontSize=8,
        leading=11,
        textColor=COLOR_TEXT_MUTED
    )

    style_h2 = ParagraphStyle(
        'SectionHeader',
        parent=styles['Normal'],
        fontName='Arial-Bold',
        fontSize=10.5,
        leading=14,
        textColor=COLOR_NAVY,
        spaceBefore=11,
        spaceAfter=5,
        keepWithNext=True
    )

    style_body = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName='Arial',
        fontSize=8.5,
        leading=12,
        textColor=COLOR_TEXT_MAIN
    )

    style_body_muted = ParagraphStyle(
        'BodyMuted',
        parent=styles['Normal'],
        fontName='Arial',
        fontSize=8,
        leading=11,
        textColor=COLOR_TEXT_MUTED
    )

    style_th = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Arial-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white
    )

    style_td = ParagraphStyle(
        'TD',
        parent=styles['Normal'],
        fontName='Arial',
        fontSize=8,
        leading=11,
        textColor=COLOR_TEXT_MAIN
    )

    style_td_bold = ParagraphStyle(
        'TDBold',
        parent=styles['Normal'],
        fontName='Arial-Bold',
        fontSize=8,
        leading=11,
        textColor=COLOR_TEXT_MAIN
    )

    story = []

    # 1. HEADER SECTION & BRANDING
    header_data = [
        [
            Paragraph("<b>THEMIS LEXIGUARD</b><br/><font size=7 color='#434653'>Hệ thống Thẩm định Tuân thủ Pháp lý Xuất khẩu Nông sản AI</font>", style_header_title),
            Paragraph("<b>BÁO CÁO THẨM ĐỊNH TUÂN THỦ GACC</b><br/>"
                      "<font size=8 color='#0047AB'><b>MÃ SỐ: TLG-RPT-GACC-2026-0888</b></font><br/>"
                      "<font size=7 color='#737784'>Ngày cấp: 11/08/2026 10:30 (GMT+7)</font>", ParagraphStyle('RHead', parent=style_header_sub, alignment=2))
        ]
    ]
    header_table = Table(header_data, colWidths=[250, 237])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=COLOR_NAVY, spaceBefore=0, spaceAfter=10))

    # 2. EXECUTIVE SUMMARY & COMPLIANCE VERDICT CARD
    summary_box_data = [
        [
            Paragraph("<b>Kết luận Thẩm định:</b> <font color='#854D0E'><b>TUÂN THỦ CÓ ĐIỀU KIỆN (CONDITIONALLY COMPLIANT)</b></font>", style_body),
            Paragraph("<b>Độ tin cậy AI:</b> <font color='#18512C'><b>96.8% (Mức độ Cao)</b></font>", style_body)
        ],
        [
            Paragraph("<b>Thị trường Mục tiêu:</b> TRUNG QUỐC (Nghị định thư Hải quan GACC)", style_body),
            Paragraph("<b>Mã HS Nông sản:</b> 0810.60.00 (Sầu riêng Tươi Ri6)", style_body)
        ],
        [
            Paragraph("<b>Doanh nghiệp Xuất khẩu:</b> Công ty CP Xuất Nhập Khẩu Nông Sản Tây Nguyên", style_body),
            Paragraph("<b>Mã số thuế:</b> 0108991234", style_body)
        ],
        [
            Paragraph("<b>Tóm tắt Kết quả Thẩm định:</b> Lô sầu riêng <b>DURIAN-2026-CN088</b> đạt 5/5 tiêu chí kiểm tra Quy tắc cứng (MRL Kim loại nặng Cadmium, Dithiocarbamates, Chlorpyrifos, Thời hạn Giấy Phytosanitary PSC, Mã PUC/PHC trên hệ thống GACC). Yêu cầu bổ sung 01 hành động khắc phục nhãn phụ Tiếng Trung trước khi kẹp chì niêm phong Container.", style_body_muted),
            Paragraph("<b>Căn cứ Pháp lý Áp dụng:</b><br/>• Nghị định thư Hải quan GACC Sầu riêng 2022<br/>• Tiêu chuẩn GB 2762-2022 (Kim loại nặng)<br/>• Tiêu chuẩn GB 2763-2021 (Dư lượng MRL)<br/>• Lệnh số 248 & 249/2021 của Hải quan Trung Quốc", style_body_muted)
        ]
    ]
    summary_table = Table(summary_box_data, colWidths=[260, 227])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_BG_CARD),
        ('BOX', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))

    story.append(Paragraph("<b>I. TÓM TẮT KẾT LUẬN THẨM ĐỊNH TUÂN THỦ</b>", style_h2))
    story.append(summary_table)
    story.append(Spacer(1, 10))

    # 3. GACC AUTHORIZATION & SHIPMENT MAPPING
    story.append(Paragraph("<b>II. ĐỐI SOÁT HỒ SƠ LÔ HÀNG & MÃ SỐ GACC PHÊ DUYỆT</b>", style_h2))
    
    gacc_map_data = [
        [Paragraph("Chỉ tiêu Kiểm soát", style_th), Paragraph("Thông tin Chi tiết Hồ sơ & Mã số Đăng ký", style_th), Paragraph("Trạng thái Xác thực GACC", style_th)],
        [Paragraph("Mã Lô hàng Xuất khẩu", style_td_bold), Paragraph("DURIAN-2026-CN088 (Sản lượng: 18.5 Tấn / 925 Thùng)", style_td), Paragraph("<font color='#18512C'><b>ĐÃ XÁC THỰC</b></font>", style_td)],
        [Paragraph("Mã số Vùng trồng (PUC)", style_td_bold), Paragraph("VN-WBPH-0125 (Vùng trồng Krông Pắc, Đắk Lắk)", style_td), Paragraph("<font color='#18512C'><b>GACC DUYỆT</b></font>", style_td)],
        [Paragraph("Mã số Cơ sở Đóng gói (PHC)", style_td_bold), Paragraph("VN-DBPH-088 (Cơ sở Đóng gói Đắk Lắk)", style_td), Paragraph("<font color='#18512C'><b>GACC DUYỆT</b></font>", style_td)],
        [Paragraph("Giấy Kiểm dịch Thực vật (PSC)", style_td_bold), Paragraph("Số PSC-VN-2026-9912 (Chi cục KDTV Cục Trồng trọt cấp)", style_td), Paragraph("<font color='#18512C'><b>HỢP LỆ (Hạn 23/08)</b></font>", style_td)],
        [Paragraph("Phiếu Kết quả Thử nghiệm MRL", style_td_bold), Paragraph("Số LAB-EUROFINS-2026-8812 (Eurofins Agroscience)", style_td), Paragraph("<font color='#18512C'><b>ĐẠT 54 CHỈ SỐ</b></font>", style_td)]
    ]

    gacc_map_table = Table(gacc_map_data, colWidths=[130, 240, 117])
    gacc_map_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_NAVY),
        ('BOX', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(gacc_map_table)
    story.append(Spacer(1, 10))

    # 4. DETERMINISTIC RULE ENGINE MATRIX (GB 2762 & GB 2763)
    story.append(Paragraph("<b>III. KẾT QUẢ ĐỐI SOÁT NGƯỠNG MRL & KIM LOẠI NẶNG (RULE ENGINE)</b>", style_h2))

    mrl_matrix_data = [
        [
            Paragraph("Hoạt chất / Chỉ tiêu Kiểm nghiệm", style_th),
            Paragraph("Ngưỡng Tối đa GACC (Tiêu chuẩn GB)", style_th),
            Paragraph("Kết quả Thử nghiệm Thực tế", style_th),
            Paragraph("Kết luận Rule Engine", style_th)
        ],
        [
            Paragraph("Cadmium (Cd) - Kim loại nặng", style_td_bold),
            Paragraph("<= 0.05 mg/kg (GB 2762-2022)", style_td),
            Paragraph("<b>0.02 mg/kg</b>", style_td),
            Paragraph("<font color='#18512C'><b>ĐẠT (PASS)</b></font>", style_td)
        ],
        [
            Paragraph("Dithiocarbamates (Thuốc BVTV)", style_td_bold),
            Paragraph("<= 2.00 mg/kg (GB 2763-2021)", style_td),
            Paragraph("<b>0.72 mg/kg</b>", style_td),
            Paragraph("<font color='#18512C'><b>ĐẠT (PASS)</b></font>", style_td)
        ],
        [
            Paragraph("Chlorpyrifos (Gốc phốt pho)", style_td_bold),
            Paragraph("<= 0.01 mg/kg (Cấm sử dụng)", style_td),
            Paragraph("<b>0.003 mg/kg</b>", style_td),
            Paragraph("<font color='#18512C'><b>ĐẠT (PASS)</b></font>", style_td)
        ],
        [
            Paragraph("Permethrin (Thuốc trừ sâu)", style_td_bold),
            Paragraph("<= 0.05 mg/kg (GB 2763-2021)", style_td),
            Paragraph("<b>< 0.01 mg/kg (KPH)</b>", style_td),
            Paragraph("<font color='#18512C'><b>ĐẠT (PASS)</b></font>", style_td)
        ],
        [
            Paragraph("Khai báo Bổ sung Phytosanitary PSC", style_td_bold),
            Paragraph("Bắt buộc theo Nghị định thư 2022", style_td),
            Paragraph("Khớp 100% mẫu câu quy định", style_td),
            Paragraph("<font color='#18512C'><b>ĐẠT (PASS)</b></font>", style_td)
        ]
    ]

    mrl_table = Table(mrl_matrix_data, colWidths=[150, 125, 105, 107])
    mrl_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_NAVY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, COLOR_BG_CARD]),
        ('BOX', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(mrl_table)
    story.append(Spacer(1, 10))

    # 5. AI GEMINI DEEP ANALYSIS & LEGAL CITATIONS
    story.append(Paragraph("<b>IV. PHÂN TÍCH CHUYÊN SÂU AI GEMINI & TRÍCH DẪN NGUỒN LUẬT</b>", style_h2))

    findings_box_data = [
        [
            Paragraph("<b>Phát hiện #1 (Mức độ: Thông tin) — Khoảng thời gian Kiểm nghiệm Hợp lệ</b><br/>"
                      "Khoảng thời gian từ ngày lấy mẫu kiểm nghiệm Lab (05/08/2026) đến ngày cấp Giấy Phytosanitary (08/08/2026) là 3 ngày, nằm trong hạn định cho phép (< 7 ngày).<br/>"
                      "<b>Trích dẫn Nguồn luật:</b> <i>Điều 4, Nghị định thư về Yêu cầu Kiểm dịch Thực vật đối với Sầu riêng Tươi xuất khẩu từ Việt Nam sang Trung Quốc (MARD/GACC 2022).</i>", style_body)
        ],
        [
            Paragraph("<b>Phát hiện #2 (Mức độ: Trung bình) — Yêu cầu Bổ sung Tem Nhãn phụ Tiếng Trung GACC</b><br/>"
                      "Thùng hàng ngoại quan hiện chưa dán tem nhãn phụ bằng chữ Tiếng Trung chứa Mã số PUC và PHC theo quy định.<br/>"
                      "<b>Trích dẫn Nguồn luật:</b> <i>Điều 8, Lệnh số 248/2021/GACC về Quản lý Đăng ký Doanh nghiệp Thực phẩm Nhập khẩu & Thông tư số 24/2022/TT-BNNPTNT.</i><br/>"
                      "<b>Hành động Khắc phục Bắt buộc:</b> Dán bổ sung tem nhãn phụ Tiếng Trung: <b>“输往中华人民共和国 — PUC: VN-WBPH-0125, PHC: VN-DBPH-088”</b> lên toàn bộ 925 thùng sầu riêng trước khi kẹp chì niêm phong Container.", style_body)
        ]
    ]
    findings_table = Table(findings_box_data, colWidths=[487])
    findings_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor("#F0F9FF")),
        ('BACKGROUND', (0,1), (0,1), colors.HexColor("#FEF9C3")),
        ('BOX', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(findings_table)
    story.append(Spacer(1, 14))

    # 6. SIGNATURES & AUDIT STAMP
    story.append(Paragraph("<b>V. XÁC NHẬN BẢO MẬT & CHỮ KÝ ĐIỆN TỬ BẤT BIẾN</b>", style_h2))

    sig_data = [
        [
            Paragraph("<b>Cán bộ Phụ trách Pháp chế</b><br/><br/><br/>_______________________<br/><b>Nguyễn Văn Hải</b><br/>Chuyên viên Phụ trách Tuân thủ", style_body),
            Paragraph("<b>Giám đốc Chất lượng & Vận hành</b><br/><br/><br/>_______________________<br/><b>Trần Thị Mai</b><br/>Giám đốc Chất lượng", style_body),
            Paragraph("<b>Con dấu Xác thực Hệ thống</b><br/><br/><b>[ THEMIS LEXIGUARD ]</b><br/><font size=7 color='#18512C'><b>XÁC THỰC CHUẨN GACC</b></font><br/><font size=6 color='#737784'>Hash: e3b0c44298fc1c14</font>", ParagraphStyle('CStamp', parent=style_body, alignment=1))
        ]
    ]
    sig_table = Table(sig_data, colWidths=[160, 160, 167])
    sig_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(sig_table)

    # Build PDF with custom NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated 100% Vietnamese GACC PDF report at: {pdf_path}")

if __name__ == '__main__':
    pdf_out = r'e:\Projects\Project_ca_nhan\Module2\docs\Themis_LexiGuard_Bao_Cao_GACC_Sau_Rieng_Tieng_Viet.pdf'
    create_vietnamese_gacc_pdf(pdf_out)
