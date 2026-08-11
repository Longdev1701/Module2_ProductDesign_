import os
import sys
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, HRFlowable
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
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 800, "THEMIS LEXIGUARD — AGRICULTURAL EXPORT COMPLIANCE REPORT")
            self.drawRightString(541, 800, "REF: TLG-RPT-2026-0811-0088")
            self.setStrokeColor(colors.HexColor("#E5E7EB"))
            self.setLineWidth(0.5)
            self.line(54, 792, 541, 792)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#E5E7EB"))
        self.setLineWidth(0.5)
        self.line(54, 45, 541, 45)

        footer_text = "Integrity Hash: sha256:8f9b2c4e1a0d88f... | Verification: https://lexiguard.themis.vn/verify/TLG-RPT-2026-0811-0088"
        self.drawString(54, 32, footer_text)
        self.drawRightString(541, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def create_compliance_pdf(pdf_path):
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Palette
    COLOR_PRIMARY = colors.HexColor("#00236F")     # Navy Theme
    COLOR_SECONDARY = colors.HexColor("#0047AB")   # Accent Blue
    COLOR_SUCCESS = colors.HexColor("#18512C")     # Green Text
    COLOR_SUCCESS_BG = colors.HexColor("#E8F5E9")  # Green Badge BG
    COLOR_WARNING = colors.HexColor("#854D0E")     # Amber Text
    COLOR_WARNING_BG = colors.HexColor("#FEF9C3")  # Amber Badge BG
    COLOR_TEXT_MAIN = colors.HexColor("#191C1E")   # Dark Neutral
    COLOR_TEXT_MUTED = colors.HexColor("#434653")  # Grey Neutral
    COLOR_BORDER = colors.HexColor("#C3C6D5")      # Light Border
    COLOR_BG_LIGHT = colors.HexColor("#F7F9FB")    # Card Light BG

    # Typography Styles
    style_title = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=COLOR_PRIMARY,
        alignment=0, # Left
        spaceAfter=4
    )

    style_subtitle = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=COLOR_TEXT_MUTED,
        alignment=0,
        spaceAfter=12
    )

    style_h2 = ParagraphStyle(
        'SectionHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=COLOR_PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    style_body = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=COLOR_TEXT_MAIN,
        spaceAfter=4
    )

    style_table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=0
    )

    style_table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=COLOR_TEXT_MAIN
    )

    style_table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=COLOR_TEXT_MAIN
    )

    story = []

    # 1. HEADER SECTION WITH BANNER & VERIFICATION METADATA
    header_data = [
        [
            Paragraph("<b>THEMIS LEXIGUARD</b><br/><font size=7 color='#434653'>AI Compliance Navigator for Agricultural Export</font>", style_body),
            Paragraph("<b>COMPLIANCE REPORT</b><br/><font size=8 color='#0047AB'><b>REF: TLG-RPT-2026-0811-0088</b></font><br/><font size=7 color='#737784'>Issued: 11/08/2026 10:30 (GMT+7)</font>", ParagraphStyle('RHeader', parent=style_body, alignment=2))
        ]
    ]
    header_table = Table(header_data, colWidths=[240, 247])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=COLOR_PRIMARY, spaceBefore=0, spaceAfter=12))

    # 2. EXECUTIVE VERDICT BANNER (SUMMARY CARD)
    verdict_html = """
    <table width="100%" border="0" cellspacing="0" cellpadding="8">
        <tr>
            <td bgcolor="#FEF9C3" style="border: 1px solid #FDE047; border-radius: 6px;">
                <font size="11" color="#854D0E"><b>VERDICT: CONDITIONALLY COMPLIANT (TUAN THU CO DIEU KIEN)</b></font><br/>
                <font size="8.5" color="#434653">
                Batch code <b>DURIAN-2026-CN088</b> passes all 5/5 Deterministic Rule Checks (MRL & Phytosanitary limits). AI analysis identified 1 action item required regarding GACC Chinese labeling prior to customs clearance.
                </font>
            </td>
        </tr>
    </table>
    """
    
    # Executive Summary Card Table
    summary_box_data = [
        [
            Paragraph("<b>Target Market:</b> CHINA CUSTOMS (GACC Protocol)", style_body),
            Paragraph("<b>AI Confidence Score:</b> <font color='#18512C'><b>96.8% High</b></font>", style_body)
        ],
        [
            Paragraph("<b>Product:</b> Sầu riêng Tươi Ri6 (Fresh Durian)", style_body),
            Paragraph("<b>HS Code:</b> 0810.60.00", style_body)
        ],
        [
            Paragraph("<b>Organization:</b> Công ty CP XNK Nông Sản Tây Nguyên", style_body),
            Paragraph("<b>Tax Code:</b> 0108991234", style_body)
        ]
    ]
    summary_table = Table(summary_box_data, colWidths=[250, 237])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))

    story.append(Paragraph("<b>I. EXECUTIVE SUMMARY & VERDICT</b>", style_h2))
    story.append(summary_table)
    story.append(Spacer(1, 10))

    # 3. SHIPMENT & DOCUMENT MAPPING SPECIFICATIONS
    story.append(Paragraph("<b>II. SHIPMENT & DOCUMENTATION SPECIFICATIONS</b>", style_h2))
    
    shipment_data = [
        [Paragraph("Parameter", style_table_header), Paragraph("Specification Details", style_table_header), Paragraph("Verification Status", style_table_header)],
        [Paragraph("Batch Code", style_table_cell_bold), Paragraph("DURIAN-2026-CN088 (Volume: 18.5 Tons / 925 Crates)", style_table_cell), Paragraph("<font color='#18512C'><b>VERIFIED</b></font>", style_table_cell)],
        [Paragraph("Plantation Unit Code (PUC)", style_table_cell_bold), Paragraph("VN-WBPH-0125 (Đắk Lắk Registered PUC)", style_table_cell), Paragraph("<font color='#18512C'><b>GACC ACTIVE</b></font>", style_table_cell)],
        [Paragraph("Packing Facility Code (PHC)", style_table_cell_bold), Paragraph("VN-DBPH-088 (Approved Packhouse)", style_table_cell), Paragraph("<font color='#18512C'><b>GACC ACTIVE</b></font>", style_table_cell)],
        [Paragraph("Phytosanitary Certificate", style_table_cell_bold), Paragraph("PSC-VN-2026-9912 (Issued: 08/08/2026)", style_table_cell), Paragraph("<font color='#18512C'><b>VALID (Exp: 23/08)</b></font>", style_table_cell)],
        [Paragraph("Lab MRL Test Report", style_table_cell_bold), Paragraph("LAB-EUROFINS-2026-8812 (Eurofins Agroscience)", style_table_cell), Paragraph("<font color='#18512C'><b>PASSED 54 MRLs</b></font>", style_table_cell)]
    ]

    shipment_table = Table(shipment_data, colWidths=[130, 240, 117])
    shipment_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY),
        ('BOX', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(shipment_table)
    story.append(Spacer(1, 10))

    # 4. DETERMINISTIC RULE ENGINE TEST MATRIX
    story.append(Paragraph("<b>III. DETERMINISTIC RULE ENGINE TEST MATRIX (MRL & PHYTO)</b>", style_h2))

    rule_data = [
        [
            Paragraph("Tested Parameter / Chemical", style_table_header),
            Paragraph("GACC Max Limit", style_table_header),
            Paragraph("Measured Value", style_table_header),
            Paragraph("Rule Result", style_table_header)
        ],
        [
            Paragraph("Cadmium (Heavy Metal)", style_table_cell_bold),
            Paragraph("<= 0.05 mg/kg", style_table_cell),
            Paragraph("<b>0.02 mg/kg</b>", style_table_cell),
            Paragraph("<font color='#18512C'><b>PASS</b></font>", style_table_cell)
        ],
        [
            Paragraph("Dithiocarbamates (Pesticide)", style_table_cell_bold),
            Paragraph("<= 2.00 mg/kg", style_table_cell),
            Paragraph("<b>0.72 mg/kg</b>", style_table_cell),
            Paragraph("<font color='#18512C'><b>PASS</b></font>", style_table_cell)
        ],
        [
            Paragraph("Chlorpyrifos (Organophosphate)", style_table_cell_bold),
            Paragraph("<= 0.01 mg/kg", style_table_cell),
            Paragraph("<b>0.003 mg/kg</b>", style_table_cell),
            Paragraph("<font color='#18512C'><b>PASS</b></font>", style_table_cell)
        ],
        [
            Paragraph("Phytosanitary Validity Period", style_table_cell_bold),
            Paragraph("Valid on Inspection", style_table_cell),
            Paragraph("Valid (12 days left)", style_table_cell),
            Paragraph("<font color='#18512C'><b>PASS</b></font>", style_table_cell)
        ],
        [
            Paragraph("PUC / PHC GACC Authorization", style_table_cell_bold),
            Paragraph("Listed on GACC List", style_table_cell),
            Paragraph("Active & Matched", style_table_cell),
            Paragraph("<font color='#18512C'><b>PASS</b></font>", style_table_cell)
        ]
    ]

    rule_table = Table(rule_data, colWidths=[150, 110, 120, 107])
    rule_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, COLOR_BG_LIGHT]),
        ('BOX', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(rule_table)
    story.append(Spacer(1, 10))

    # 5. AI GEMINI DEEP RISK FINDINGS & LEGAL CITATIONS
    story.append(Paragraph("<b>IV. AI GEMINI DEEP ANALYSIS & LEGAL CITATIONS</b>", style_h2))

    findings_box = [
        [
            Paragraph("<b>Finding #1 (Severity: Informational)</b><br/>"
                      "Interval between Lab Sample collection and Container loading is 3 days (Within compliant boundary < 7 days).<br/>"
                      "<b>Legal Citation:</b> <i>Section 4, China GACC - Vietnam MARD Protocol on Durian Export (Ref: GACC-PROT-2022-DURIAN).</i>", style_body)
        ],
        [
            Paragraph("<b>Finding #2 (Severity: Medium - Action Required)</b><br/>"
                      "Outer carton labels require supplementary Chinese text containing PUC Code prior to sealing.<br/>"
                      "<b>Legal Citation:</b> <i>Decree No. 248/2021/GACC - Administration of Import & Export Food Safety Labeling.</i><br/>"
                      "<b>Remediation Action:</b> Affix supplementary Chinese PUC sticker to 925 crates before container seal.", style_body)
        ]
    ]
    findings_table = Table(findings_box, colWidths=[487])
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

    # 6. SIGNATURES & AUDIT LOG IMMUTABILITY STAMP
    story.append(Paragraph("<b>V. AUTHORIZATION & AUDIT IMMUTABILITY</b>", style_h2))

    sig_data = [
        [
            Paragraph("<b>Compliance Lead Officer</b><br/><br/><br/>_______________________<br/><b>Nguyễn Văn Hải</b><br/>Cán bộ Phụ trách Pháp chế", style_body),
            Paragraph("<b>Quality & Operations Director</b><br/><br/><br/>_______________________<br/><b>Trần Thị Mai</b><br/>Giám đốc Chất lượng", style_body),
            Paragraph("<b>System Verification Stamp</b><br/><br/><b>[ THEMIS LEXIGUARD ]</b><br/><font size=7 color='#18512C'><b>VERIFIED DIGITAL STAMP</b></font><br/><font size=6 color='#737784'>Hash: 8f9b2c4e1a0d88f</font>", ParagraphStyle('CStamp', parent=style_body, alignment=1))
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
    print(f"Successfully generated PDF report at: {pdf_path}")

if __name__ == '__main__':
    pdf_out = r'e:\Projects\Project_ca_nhan\Module2\docs\Bao_Cao_Tham_Dinh_Tuan_Thu_Themis_LexiGuard.pdf'
    create_compliance_pdf(pdf_out)
