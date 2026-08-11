import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
from reportlab.pdfgen import canvas

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
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#737784"))
        
        # Top Header line (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 802, "THEMIS LEXIGUARD — GACC CHINA DURIAN EXPORT COMPLIANCE VERIFICATION")
            self.drawRightString(541, 802, "REF: TLG-RPT-GACC-2026-0888")
            self.setStrokeColor(colors.HexColor("#C3C6D5"))
            self.setLineWidth(0.5)
            self.line(54, 794, 541, 794)

        # Bottom Footer line (all pages)
        self.setStrokeColor(colors.HexColor("#C3C6D5"))
        self.setLineWidth(0.5)
        self.line(54, 45, 541, 45)

        footer_left = "Digital Integrity Hash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        footer_right = f"Page {self._pageNumber} of {page_count}"
        self.drawString(54, 32, footer_left)
        self.drawRightString(541, 32, footer_right)
        self.restoreState()

def create_gacc_compliance_pdf(pdf_path):
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

    # Typography
    style_header_title = ParagraphStyle(
        'DocHeaderTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=17,
        textColor=COLOR_NAVY
    )

    style_header_sub = ParagraphStyle(
        'DocHeaderSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=COLOR_TEXT_MUTED
    )

    style_h2 = ParagraphStyle(
        'SectionHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=COLOR_NAVY,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    style_body = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=COLOR_TEXT_MAIN
    )

    style_body_muted = ParagraphStyle(
        'BodyMuted',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=COLOR_TEXT_MUTED
    )

    style_th = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white
    )

    style_td = ParagraphStyle(
        'TD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=COLOR_TEXT_MAIN
    )

    style_td_bold = ParagraphStyle(
        'TDBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=COLOR_TEXT_MAIN
    )

    story = []

    # 1. HEADER SECTION & BRANDING
    header_data = [
        [
            Paragraph("<b>THEMIS LEXIGUARD</b><br/><font size=7 color='#434653'>AI Compliance Navigator for Agricultural Export</font>", style_header_title),
            Paragraph("<b>GACC DURIAN COMPLIANCE VERIFICATION</b><br/>"
                      "<font size=8 color='#0047AB'><b>REF: TLG-RPT-GACC-2026-0888</b></font><br/>"
                      "<font size=7 color='#737784'>Date: 11/08/2026 10:30 (GMT+7)</font>", ParagraphStyle('RHead', parent=style_header_sub, alignment=2))
        ]
    ]
    header_table = Table(header_data, colWidths=[250, 237])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=COLOR_NAVY, spaceBefore=0, spaceAfter=10))

    # 2. EXECUTIVE VERDICT BANNER & SPECIFICATION CARD
    summary_box_data = [
        [
            Paragraph("<b>Verdict Status:</b> <font color='#854D0E'><b>CONDITIONALLY COMPLIANT (TUAN THU CO DIEU KIEN)</b></font>", style_body),
            Paragraph("<b>AI Confidence Score:</b> <font color='#18512C'><b>96.8% High</b></font>", style_body)
        ],
        [
            Paragraph("<b>Target Market:</b> CHINA (GACC Protocol - General Administration of Customs)", style_body),
            Paragraph("<b>HS Code:</b> 0810.60.00 (Fresh Durian / 鲜榴莲)", style_body)
        ],
        [
            Paragraph("<b>Exporter Enterprise:</b> Công ty CP Xuất Nhập Khẩu Nông Sản Tây Nguyên", style_body),
            Paragraph("<b>Enterprise Tax ID:</b> 0108991234", style_body)
        ],
        [
            Paragraph("<b>Audit Summary:</b> Batch <b>DURIAN-2026-CN088</b> passed all 5/5 Deterministic Rule Engine checks (Cadmium heavy metal, Dithiocarbamates, Chlorpyrifos, Phytosanitary PSC validity, PUC/PHC GACC active list). 1 action item required prior to container sealing: Affix supplementary GACC Chinese labeling.", style_body_muted),
            Paragraph("<b>Regulatory Framework:</b><br/>• China GACC Durian Protocol 2022<br/>• GB 2762-2022 (Heavy Metals)<br/>• GB 2763-2021 (Pesticide MRLs)<br/>• GACC Decree No. 248 & 249", style_body_muted)
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

    story.append(Paragraph("<b>I. EXECUTIVE SUMMARY & COMPLIANCE VERDICT</b>", style_h2))
    story.append(summary_table)
    story.append(Spacer(1, 10))

    # 3. GACC AUTHORIZATION & DOCUMENTATION MAPPING
    story.append(Paragraph("<b>II. GACC AUTHORIZATION & SHIPMENT MAPPING</b>", style_h2))
    
    gacc_map_data = [
        [Paragraph("Control Parameter", style_th), Paragraph("Registration & Document Specification Details", style_th), Paragraph("GACC Verification Status", style_th)],
        [Paragraph("Batch Code", style_td_bold), Paragraph("DURIAN-2026-CN088 (Volume: 18.5 Tons / 925 Crates)", style_td), Paragraph("<font color='#18512C'><b>VERIFIED</b></font>", style_td)],
        [Paragraph("Plantation Unit Code (PUC)", style_td_bold), Paragraph("VN-WBPH-0125 (Krông Pắc, Đắk Lắk Registered Area)", style_td), Paragraph("<font color='#18512C'><b>GACC APPROVED</b></font>", style_td)],
        [Paragraph("Packing Facility Code (PHC)", style_td_bold), Paragraph("VN-DBPH-088 (Approved Packhouse Facility)", style_td), Paragraph("<font color='#18512C'><b>GACC APPROVED</b></font>", style_td)],
        [Paragraph("Phytosanitary Certificate (PSC)", style_td_bold), Paragraph("No. PSC-VN-2026-9912 (Issued by MARD Plant Protection Dept)", style_td), Paragraph("<font color='#18512C'><b>VALID (Exp: 23/08)</b></font>", style_td)],
        [Paragraph("Lab MRL Test Report", style_td_bold), Paragraph("No. LAB-EUROFINS-2026-8812 (Eurofins Agroscience Lab)", style_td), Paragraph("<font color='#18512C'><b>PASSED 54 MRLs</b></font>", style_td)]
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
    story.append(Paragraph("<b>III. DETERMINISTIC RULE ENGINE MATRIX (HEAVY METALS & PESTICIDES)</b>", style_h2))

    mrl_matrix_data = [
        [
            Paragraph("Tested Chemical / Substance", style_th),
            Paragraph("GACC Max Limit (GB Standard)", style_th),
            Paragraph("Lab Tested Value", style_th),
            Paragraph("Engine Verdict", style_th)
        ],
        [
            Paragraph("Cadmium (Cd) - Heavy Metal", style_td_bold),
            Paragraph("<= 0.05 mg/kg (GB 2762-2022)", style_td),
            Paragraph("<b>0.02 mg/kg</b>", style_td),
            Paragraph("<font color='#18512C'><b>PASS</b></font>", style_td)
        ],
        [
            Paragraph("Dithiocarbamates (Mancozeb)", style_td_bold),
            Paragraph("<= 2.00 mg/kg (GB 2763-2021)", style_td),
            Paragraph("<b>0.72 mg/kg</b>", style_td),
            Paragraph("<font color='#18512C'><b>PASS</b></font>", style_td)
        ],
        [
            Paragraph("Chlorpyrifos (Organophosphate)", style_td_bold),
            Paragraph("<= 0.01 mg/kg (Banned in VN)", style_td),
            Paragraph("<b>0.003 mg/kg</b>", style_td),
            Paragraph("<font color='#18512C'><b>PASS</b></font>", style_td)
        ],
        [
            Paragraph("Permethrin (Pyrethroid)", style_td_bold),
            Paragraph("<= 0.05 mg/kg (GB 2763-2021)", style_td),
            Paragraph("<b>< 0.01 mg/kg (ND)</b>", style_td),
            Paragraph("<font color='#18512C'><b>PASS</b></font>", style_td)
        ],
        [
            Paragraph("Phytosanitary PSC Additional Declaration", style_td_bold),
            Paragraph("Includes GACC 2022 Protocol Text", style_td),
            Paragraph("Declaration Text Matched", style_td),
            Paragraph("<font color='#18512C'><b>PASS</b></font>", style_td)
        ]
    ]

    mrl_table = Table(mrl_matrix_data, colWidths=[150, 120, 110, 107])
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
    story.append(Paragraph("<b>IV. AI GEMINI DEEP ANALYSIS & MANDATORY LEGAL CITATIONS</b>", style_h2))

    findings_box_data = [
        [
            Paragraph("<b>Finding #1 (Severity: Informational) — Inspection Interval Compliant</b><br/>"
                      "Interval between Lab Sample collection (05/08/2026) and Phytosanitary Certificate issuance (08/08/2026) is 3 days, strictly within the GACC compliant boundary (< 7 days).<br/>"
                      "<b>Legal Citation:</b> <i>Section 4, Protocol on Phytosanitary Requirements for Export of Fresh Durians from Vietnam to China (MARD/GACC 2022).</i>", style_body)
        ],
        [
            Paragraph("<b>Finding #2 (Severity: Medium) — Mandatory GACC Chinese Labeling Action Required</b><br/>"
                      "Outer crates currently lack the required supplementary Chinese text containing the approved PUC & PHC codes.<br/>"
                      "<b>Legal Citation:</b> <i>Article 8, GACC Decree No. 248/2021/GACC & MARD Circular No. 24/2022/TT-BNNPTNT.</i><br/>"
                      "<b>Mandatory Remediation Action:</b> Affix supplementary Chinese sticker: <b>“输往中华人民共和国 — PUC: VN-WBPH-0125, PHC: VN-DBPH-088”</b> to all 925 crates prior to customs seal.", style_body)
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
    story.append(Paragraph("<b>V. AUTHORIZATION & DIGITAL AUDIT STAMP</b>", style_h2))

    sig_data = [
        [
            Paragraph("<b>Compliance Lead Officer</b><br/><br/><br/>_______________________<br/><b>Nguyễn Văn Hải</b><br/>Cán bộ Phụ trách Pháp chế", style_body),
            Paragraph("<b>Quality & Operations Director</b><br/><br/><br/>_______________________<br/><b>Trần Thị Mai</b><br/>Giám đốc Chất lượng", style_body),
            Paragraph("<b>System Verification Stamp</b><br/><br/><b>[ THEMIS LEXIGUARD ]</b><br/><font size=7 color='#18512C'><b>GACC PROTOCOL VERIFIED</b></font><br/><font size=6 color='#737784'>Hash: e3b0c44298fc1c14</font>", ParagraphStyle('CStamp', parent=style_body, alignment=1))
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
    print(f"Successfully generated GACC Durian PDF report at: {pdf_path}")

if __name__ == '__main__':
    pdf_out = r'e:\Projects\Project_ca_nhan\Module2\docs\Themis_LexiGuard_Bao_Cao_GACC_Sau_Rieng.pdf'
    create_gacc_compliance_pdf(pdf_out)
