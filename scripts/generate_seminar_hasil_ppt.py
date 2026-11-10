import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    base_dir = r"c:\Users\Ztzrk\Documents\fieldmax"
    img_dir = os.path.join(base_dir, "obsidian", "Fieldmax", "images")
    output_pptx = os.path.join(base_dir, "obsidian", "Fieldmax", "exports", "Presentasi_Seminar_Hasil_FieldMax.pptx")

    # =========================================================================
    # REFINED COLOR PALETTE (Agency-Grade Executive Tech & Academic)
    # =========================================================================
    BG_LIGHT = RGBColor(248, 250, 252)       # Slate 50 (#F8FAFC)
    BG_DARK = RGBColor(11, 19, 43)           # Midnight Navy (#0B132B)
    CARD_BG = RGBColor(255, 255, 255)        # Pure White Card (#FFFFFF)
    CARD_MUTED = RGBColor(241, 245, 249)     # Soft Slate 100 (#F1F5F9)
    CARD_DARK = RGBColor(21, 32, 66)         # Deep Midnight Navy Card (#152042)

    TEXT_MAIN = RGBColor(15, 23, 42)         # Slate 900 (#0F172A)
    TEXT_MUTED = RGBColor(71, 85, 105)       # Slate 600 (#475569)
    TEXT_LIGHT = RGBColor(148, 163, 184)     # Slate 400 (#94A3B8)
    TEXT_WHITE = RGBColor(255, 255, 255)
    TEXT_CYAN = RGBColor(56, 189, 248)       # Sky 400 (#38BDF8)

    PRIMARY_BLUE = RGBColor(29, 78, 216)     # Royal Blue 700 (#1D4ED8)
    ROYAL_BLUE = RGBColor(37, 99, 235)       # Blue 600 (#2563EB)
    SKY_BLUE = RGBColor(2, 132, 199)         # Sky 600 (#0284C7)
    ACCENT_GREEN = RGBColor(5, 150, 105)     # Emerald 600 (#059669)
    ACCENT_AMBER = RGBColor(217, 119, 6)     # Amber 600 (#D97706)
    ACCENT_RED = RGBColor(220, 38, 38)       # Red 600 (#DC2626)
    ACCENT_PURPLE = RGBColor(124, 58, 237)   # Violet 600 (#7C3AED)

    BORDER_SUBTLE = RGBColor(226, 232, 240)  # Slate 200 (#E2E8F0)
    BORDER_DARK = RGBColor(37, 49, 82)       # Slate 700 (#253152)

    # =========================================================================
    # REUSABLE COMPONENT BUILDERS
    # =========================================================================
    def set_canvas_bg(slide, is_dark=False):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK if is_dark else BG_LIGHT
        bg.line.fill.background()
        if hasattr(bg, 'shadow'):
            bg.shadow.inherit = False
        return bg

    def add_header(slide, title, chapter_tag="BAB I • PENDAHULUAN", subtitle=None, is_dark=False):
        # Eyebrow Pill / Tag
        tb_c = slide.shapes.add_textbox(Inches(0.9), Inches(0.40), Inches(11.533), Inches(0.28))
        tf_c = tb_c.text_frame
        tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0
        p_c = tf_c.paragraphs[0]
        p_c.text = chapter_tag.upper()
        p_c.font.name = "Arial"
        p_c.font.size = Pt(10)
        p_c.font.bold = True
        p_c.font.color.rgb = TEXT_CYAN if is_dark else PRIMARY_BLUE

        # Title
        tb = slide.shapes.add_textbox(Inches(0.9), Inches(0.68), Inches(11.533), Inches(0.48))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE if is_dark else TEXT_MAIN

        # Subtitle
        if subtitle:
            tb_s = slide.shapes.add_textbox(Inches(0.9), Inches(1.18), Inches(11.533), Inches(0.3))
            tf_s = tb_s.text_frame
            tf_s.word_wrap = True
            tf_s.margin_left = tf_s.margin_top = tf_s.margin_right = tf_s.margin_bottom = 0
            ps = tf_s.paragraphs[0]
            ps.text = subtitle
            ps.font.name = "Arial"
            ps.font.size = Pt(12)
            ps.font.color.rgb = TEXT_LIGHT if is_dark else TEXT_MUTED

        # Hairline divider
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.9), Inches(1.52), Inches(11.533), Pt(1))
        line.fill.solid()
        line.fill.fore_color.rgb = BORDER_DARK if is_dark else BORDER_SUBTLE
        line.line.fill.background()
        if hasattr(line, 'shadow'):
            line.shadow.inherit = False

    def add_slide_footer(slide, current_num, total_num=31, is_dark=False):
        # Left text
        tb = slide.shapes.add_textbox(Inches(0.9), Inches(7.04), Inches(8.5), Inches(0.35))
        tf = tb.text_frame
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = "FieldMax • Rancang Bangun Sistem Informasi Reservasi Fasilitas Olahraga • Seminar Hasil"
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = RGBColor(90, 105, 140) if is_dark else TEXT_LIGHT

        # Right slide counter pill
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(11.85), Inches(6.96), Inches(0.95), Inches(0.32))
        badge.adjustments[0] = 0.2
        badge.fill.solid()
        badge.fill.fore_color.rgb = CARD_DARK if is_dark else CARD_BG
        badge.line.color.rgb = BORDER_DARK if is_dark else BORDER_SUBTLE
        badge.line.width = Pt(1)
        if hasattr(badge, 'shadow'):
            badge.shadow.inherit = False
        tf_b = badge.text_frame
        tf_b.margin_left = tf_b.margin_top = tf_b.margin_right = tf_b.margin_bottom = 0
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        p_b.text = f"{current_num} / {total_num}"
        p_b.font.name = "Arial"
        p_b.font.size = Pt(10)
        p_b.font.bold = True
        p_b.font.color.rgb = TEXT_CYAN if is_dark else TEXT_MAIN

    def add_card(slide, x, y, w, h, bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=None):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.adjustments[0] = radius
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1)
        else:
            card.line.fill.background()
        if hasattr(card, 'shadow'):
            card.shadow.inherit = False

        if accent_left:
            bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y + Inches(0.04), Inches(0.06), h - Inches(0.08))
            bar.fill.solid()
            bar.fill.fore_color.rgb = accent_left
            bar.line.fill.background()
            if hasattr(bar, 'shadow'):
                bar.shadow.inherit = False

        return card

    def add_badge(slide, x, y, text, bg_color, text_color, w=None, h=None, font_size=10, bold=True):
        if w is None:
            w = Inches(len(text) * 0.085 + 0.3)
        if h is None:
            h = Inches(0.32)
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        badge.adjustments[0] = 0.25
        badge.fill.solid()
        badge.fill.fore_color.rgb = bg_color
        badge.line.fill.background()
        if hasattr(badge, 'shadow'):
            badge.shadow.inherit = False
        tf = badge.text_frame
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = text
        p.font.name = "Arial"
        p.font.size = Pt(font_size)
        p.font.bold = bold
        p.font.color.rgb = text_color
        return badge

    def add_kpi_card(slide, x, y, w, h, stat_str, label_str, subtext=None, accent_color=PRIMARY_BLUE):
        add_card(slide, x, y, w, h, bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=accent_color)
        tb = slide.shapes.add_textbox(x + Inches(0.22), y + Inches(0.18), w - Inches(0.4), h - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p1 = tf.paragraphs[0]
        p1.text = stat_str
        p1.font.name = "Arial"
        p1.font.size = Pt(32)
        p1.font.bold = True
        p1.font.color.rgb = accent_color
        
        p2 = tf.add_paragraph()
        p2.space_before = Pt(3)
        p2.text = label_str
        p2.font.name = "Arial"
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_MAIN

        if subtext:
            p3 = tf.add_paragraph()
            p3.space_before = Pt(2)
            p3.text = subtext
            p3.font.name = "Arial"
            p3.font.size = Pt(10.5)
            p3.font.color.rgb = TEXT_MUTED

    def set_notes(slide, notes_text):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = notes_text

    print("Building 31 executive slides...")

    # =========================================================================
    # SLIDE 1: COVER SLIDE (Executive Midnight Navy)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s1, is_dark=True)

    unhas_logo = os.path.join(img_dir, "image001.png")
    if os.path.exists(unhas_logo):
        s1.shapes.add_picture(unhas_logo, Inches(0.9), Inches(0.7), width=Inches(0.95), height=Inches(1.15))

    tb_inst = s1.shapes.add_textbox(Inches(2.1), Inches(0.75), Inches(8.5), Inches(0.6))
    tf_i = tb_inst.text_frame
    tf_i.margin_left = tf_i.margin_top = tf_i.margin_right = tf_i.margin_bottom = 0
    p1 = tf_i.paragraphs[0]
    p1.text = "UNIVERSITAS HASANUDDIN • FAKULTAS MIPA"
    p1.font.name = "Arial"
    p1.font.size = Pt(11)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_CYAN

    p2 = tf_i.add_paragraph()
    p2.space_before = Pt(2)
    p2.text = "PROGRAM STUDI SISTEM INFORMASI • DEPARTEMEN MATEMATIKA"
    p2.font.name = "Arial"
    p2.font.size = Pt(10)
    p2.font.color.rgb = TEXT_LIGHT

    # Seminar Pill Tag
    pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.1), Inches(0.75), Inches(2.333), Inches(0.38))
    pill.adjustments[0] = 0.2
    pill.fill.solid()
    pill.fill.fore_color.rgb = ROYAL_BLUE
    pill.line.fill.background()
    if hasattr(pill, 'shadow'):
        pill.shadow.inherit = False
    tf_p = pill.text_frame
    tf_p.margin_left = tf_p.margin_top = tf_p.margin_right = tf_p.margin_bottom = 0
    pp = tf_p.paragraphs[0]
    pp.alignment = PP_ALIGN.CENTER
    pp.text = "SEMINAR HASIL SKRIPSI"
    pp.font.name = "Arial"
    pp.font.size = Pt(10)
    pp.font.bold = True
    pp.font.color.rgb = TEXT_WHITE

    # Main Hero Card
    add_card(s1, Inches(0.9), Inches(2.15), Inches(11.533), Inches(3.2), bg_color=CARD_DARK, border_color=BORDER_DARK, radius=0.03, accent_left=ROYAL_BLUE)
    tb_title = s1.shapes.add_textbox(Inches(1.25), Inches(2.45), Inches(10.8), Inches(2.6))
    tf_t = tb_title.text_frame
    tf_t.word_wrap = True
    tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0

    p_t1 = tf_t.paragraphs[0]
    p_t1.text = "RANCANG BANGUN SISTEM INFORMASI RESERVASI FASILITAS OLAHRAGA MULTI-TENANT BERBASIS WEB"
    p_t1.font.name = "Arial"
    p_t1.font.size = Pt(24)
    p_t1.font.bold = True
    p_t1.font.color.rgb = TEXT_WHITE

    p_t2 = tf_t.add_paragraph()
    p_t2.space_before = Pt(8)
    p_t2.text = "STUDI KASUS: PLATFORM FIELDMAX"
    p_t2.font.name = "Arial"
    p_t2.font.size = Pt(19)
    p_t2.font.bold = True
    p_t2.font.color.rgb = TEXT_CYAN

    p_t3 = tf_t.add_paragraph()
    p_t3.space_before = Pt(10)
    p_t3.text = "Implementasi Full-Stack TypeScript Monorepo & Pembuktian Empiris Eliminasi Double Booking"
    p_t3.font.name = "Arial"
    p_t3.font.size = Pt(13)
    p_t3.font.color.rgb = RGBColor(203, 213, 225)

    # Author Card
    add_card(s1, Inches(0.9), Inches(5.55), Inches(5.65), Inches(1.2), bg_color=CARD_DARK, border_color=BORDER_DARK, radius=0.03)
    tb_a = s1.shapes.add_textbox(Inches(1.15), Inches(5.7), Inches(5.15), Inches(0.9))
    tf_a = tb_a.text_frame
    tf_a.margin_left = tf_a.margin_top = tf_a.margin_right = tf_a.margin_bottom = 0
    pa1 = tf_a.paragraphs[0]
    pa1.text = "PENELITI / MAHASISWA"
    pa1.font.name = "Arial"
    pa1.font.size = Pt(9.5)
    pa1.font.bold = True
    pa1.font.color.rgb = TEXT_CYAN

    pa2 = tf_a.add_paragraph()
    pa2.space_before = Pt(4)
    pa2.text = "Aflah Alifu Na Mappatajang Rahman"
    pa2.font.name = "Arial"
    pa2.font.size = Pt(15)
    pa2.font.bold = True
    pa2.font.color.rgb = TEXT_WHITE

    pa3 = tf_a.add_paragraph()
    pa3.space_before = Pt(2)
    pa3.text = "NIM: H071211021 • Peminatan Rekayasa Perangkat Lunak"
    pa3.font.name = "Arial"
    pa3.font.size = Pt(11)
    pa3.font.color.rgb = TEXT_LIGHT

    # Advisor / Location Card
    add_card(s1, Inches(6.783), Inches(5.55), Inches(5.65), Inches(1.2), bg_color=CARD_DARK, border_color=BORDER_DARK, radius=0.03)
    tb_adv = s1.shapes.add_textbox(Inches(7.033), Inches(5.7), Inches(5.15), Inches(0.9))
    tf_adv = tb_adv.text_frame
    tf_adv.margin_left = tf_adv.margin_top = tf_adv.margin_right = tf_adv.margin_bottom = 0
    padv1 = tf_adv.paragraphs[0]
    padv1.text = "KOMISI PEMBIMBING & LOKASI"
    padv1.font.name = "Arial"
    padv1.font.size = Pt(9.5)
    padv1.font.bold = True
    padv1.font.color.rgb = TEXT_CYAN

    padv2 = tf_adv.add_paragraph()
    padv2.space_before = Pt(4)
    padv2.text = "Universitas Hasanuddin, Makassar"
    padv2.font.name = "Arial"
    padv2.font.size = Pt(14)
    padv2.font.bold = True
    padv2.font.color.rgb = TEXT_WHITE

    padv3 = tf_adv.add_paragraph()
    padv3.space_before = Pt(2)
    padv3.text = "Sidang Seminar Hasil Skripsi • Tahun 2026"
    padv3.font.name = "Arial"
    padv3.font.size = Pt(11)
    padv3.font.color.rgb = TEXT_LIGHT

    add_slide_footer(s1, 1, is_dark=True)
    set_notes(s1, "Selamat pagi bapak/ibu dosen penguji dan pembimbing. Pada kesempatan ini saya akan mempresentasikan hasil penelitian tugas akhir skripsi saya mengenai rancang bangun platform reservasi lapangan olahraga FieldMax.")

    # =========================================================================
    # SLIDE 2: BAB I • LATAR BELAKANG: TREN & FRAGMENTASI
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s2)
    add_header(s2, "Latar Belakang: Tren Olahraga & Fragmentasi Lapangan", "BAB I • PENDAHULUAN", "Peningkatan minat gaya hidup sehat masyarakat perkotaan berbanding terbalik dengan efisiensi tata kelola sarana")

    # Left Column: Macro Trend
    add_card(s2, Inches(0.9), Inches(1.75), Inches(5.6), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=PRIMARY_BLUE)
    tb2_l = s2.shapes.add_textbox(Inches(1.15), Inches(1.95), Inches(5.1), Inches(4.5))
    tf2_l = tb2_l.text_frame
    tf2_l.word_wrap = True
    
    p = tf2_l.paragraphs[0]
    p.text = "1. Ledakan Partisipasi & Fragmentasi Sarana"
    p.font.name = "Arial"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE

    points_l = [
        ("Lonjakan Olahraga Urban", "Aktivitas fisik (badminton, futsal, soccer) jadi tren gaya hidup utama."),
        ("Fragmentasi Ekosistem", "Informasi tarif, slot, dan kontak pengelola tersebar tanpa direktori terpusat."),
        ("Isolasi Pengelola Sarana", "Mitra pemilik venue beroperasi manual tanpa infrastruktur digital bersama.")
    ]
    for title, desc in points_l:
        pb = tf2_l.add_paragraph()
        pb.space_before = Pt(22)
        pb.text = f"•  {title}: {desc}"
        pb.font.name = "Arial"
        pb.font.size = Pt(13.5)
        pb.font.color.rgb = TEXT_MAIN

    add_badge(s2, Inches(1.15), Inches(6.12), "Tantangan: Asimetri Informasi & Frustrasi Pelanggan", CARD_MUTED, PRIMARY_BLUE, w=Inches(5.1), h=Inches(0.35), font_size=10, bold=True)

    # Right Column: Digital Shift
    add_card(s2, Inches(6.8), Inches(1.75), Inches(5.633), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=SKY_BLUE)
    tb2_r = s2.shapes.add_textbox(Inches(7.05), Inches(1.95), Inches(5.1), Inches(4.5))
    tf2_r = tb2_r.text_frame
    tf2_r.word_wrap = True
    
    p = tf2_r.paragraphs[0]
    p.text = "2. Pergeseran Perilaku Konsumen Digital"
    p.font.name = "Arial"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = SKY_BLUE

    points_r = [
        ("Ekspektasi On-Demand", "Tuntutan reservasi mandiri secara instan dan real-time 24/7 langsung dari peramban."),
        ("Bottleneck Chat Manual", "Konfirmasi lambat, pesan chat tertimbun, dan ketiadaan kalender slot terbuka."),
        ("Transformasi Berbasis Web", "Kebutuhan platform terpadu: katalog terpusat, jadwal real-time, dan pembayaran.")
    ]
    for title, desc in points_r:
        pb = tf2_r.add_paragraph()
        pb.space_before = Pt(22)
        pb.text = f"•  {title}: {desc}"
        pb.font.name = "Arial"
        pb.font.size = Pt(13.5)
        pb.font.color.rgb = TEXT_MAIN

    add_badge(s2, Inches(7.05), Inches(6.12), "Peluang: Efisiensi Operasional & Akses Mandiri 24/7", CARD_MUTED, SKY_BLUE, w=Inches(5.1), h=Inches(0.35), font_size=10, bold=True)

    add_slide_footer(s2, 2)
    set_notes(s2, "Latar belakang penelitian berakar dari meningkatnya partisipasi olahraga urban yang belum diimbangi modernisasi sistem reservasi. Terjadi disparitas antara kebutuhan pelanggan akan akses instan dengan keterbatasan alur manual.")

    # =========================================================================
    # SLIDE 3: BAB I • 4 MASALAH KRUSIAL KONVENSIONAL (2x2 Balanced Grid)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s3)
    add_header(s3, "4 Masalah Kritis Sistem Konvensional", "BAB I • PENDAHULUAN", "Kendala operasional kritis pada proses pemesanan manual via WhatsApp dan buku agenda")

    problems_data = [
        ("01", "Bentrok Jadwal (Double Booking)", 
         "Pencatatan ganda pada slot jam sama akibat pemesanan serentak tanpa kontrol konkurensi.",
         "Dampak: Pembatalan Sepihak & Kekecewaan Konsumen", ACCENT_RED),
        ("02", "Manipulasi Bukti Transfer Bank", 
         "Verifikasi manual via chat rentan manipulasi gambar bukti transfer palsu hasil rekayasa grafis.",
         "Dampak: Kerugian Finansial Langsung bagi Mitra Sarana", ACCENT_AMBER),
        ("03", "Asimetri Ketersediaan Jadwal", 
         "Pelanggan tidak memiliki akses kalender terbuka, harus menunggu balasan admin 1–3 jam.",
         "Dampak: Tingginya Drop-off & Kehilangan Calon Pelanggan", PRIMARY_BLUE),
        ("04", "Inefisiensi Rekapitulasi Pembukuan", 
         "Mitra kesulitan merekap omzet harian dan riwayat sewa tanpa sistem pelaporan terpusat.",
         "Dampak: Ketiadaan Transparansi Finansial & Risiko Data Hilang", ACCENT_PURPLE),
    ]

    for idx, (badge_num, p_title, p_desc, impact_str, col) in enumerate(problems_data):
        rx = idx % 2
        ry = idx // 2
        cx = Inches(0.9 + rx * 5.9)
        cy = Inches(1.75 + ry * 2.5)
        
        # Card with left accent line
        add_card(s3, cx, cy, Inches(5.633), Inches(2.32), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        # Badge on top line
        add_badge(s3, cx + Inches(0.22), cy + Inches(0.18), f"MASALAH {badge_num}", CARD_MUTED, col, font_size=9.5)
        
        # Title below badge
        tb = s3.shapes.add_textbox(cx + Inches(0.22), cy + Inches(0.55), Inches(5.15), Inches(0.38))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = p_title
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = TEXT_MAIN
        
        # Description
        tb_d = s3.shapes.add_textbox(cx + Inches(0.22), cy + Inches(0.96), Inches(5.15), Inches(0.85))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        tf_d.margin_left = tf_d.margin_top = tf_d.margin_right = tf_d.margin_bottom = 0
        pd = tf_d.paragraphs[0]
        pd.text = p_desc
        pd.font.name = "Arial"
        pd.font.size = Pt(11.5)
        pd.font.color.rgb = TEXT_MUTED

        # Impact pill at bottom of card
        add_badge(s3, cx + Inches(0.22), cy + Inches(1.85), impact_str, CARD_MUTED, col, w=Inches(5.15), h=Inches(0.32), font_size=9.5, bold=True)

    add_slide_footer(s3, 3)
    set_notes(s3, "Empat masalah fatal ini terbukti saling berkaitan: bentrok jadwal mencoreng reputasi, struk palsu merugikan finansial, asimetri jadwal membuang waktu, dan ketiadaan rekapitulasi menghambat perkembangan bisnis mitra.")

    # =========================================================================
    # SLIDE 4: BAB I • DIAGRAM ANALISIS MASALAH & SOLUSI
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s4)
    add_header(s4, "Pemetaan Masalah Sistem vs Solusi FieldMax", "BAB I • PENDAHULUAN", "Transformasi alur manual rentan galat menuju ekosistem reservasi web terintegrasi (Gambar 1 Skripsi)")

    # Left Side: Framed Diagram
    add_card(s4, Inches(0.9), Inches(1.75), Inches(6.8), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035)
    diag_img = os.path.join(img_dir, "gambar-analisis-masalah-tight.png")
    if not os.path.exists(diag_img):
        diag_img = os.path.join(img_dir, "gambar-analisis-masalah.png")
    if os.path.exists(diag_img):
        s4.shapes.add_picture(diag_img, Inches(1.05), Inches(1.9), width=Inches(6.5), height=Inches(4.3))

    tb_cap4 = s4.shapes.add_textbox(Inches(1.05), Inches(6.25), Inches(6.5), Inches(0.35))
    p_cap4 = tb_cap4.text_frame.paragraphs[0]
    p_cap4.alignment = PP_ALIGN.CENTER
    p_cap4.text = "Gambar 1. Diagram Analisis Masalah Konvensional vs Solusi Platform FieldMax"
    p_cap4.font.name = "Arial"
    p_cap4.font.size = Pt(10)
    p_cap4.font.bold = True
    p_cap4.font.color.rgb = TEXT_MUTED

    # Right Side: 3 Transformation Cards
    trans_cards = [
        ("Input Manual & Tersebar", "Reservasi Mandiri Real-Time 24/7", 
         "Katalog terpusat & filter cabor — cek slot kosong real-time tanpa antre chat.", PRIMARY_BLUE),
        ("Bentrok Slot (Konkurensi)", "Algoritma Overlap & Two-Phase Locking", 
         "Formulasi irisan waktu & lock 15 menit — eliminasi 100% bentrok jadwal.", ACCENT_GREEN),
        ("Struk Bukti Transfer Fiktif", "Payment Gateway Midtrans Otomatis", 
         "Payment gateway QRIS & VA — verifikasi webhook otomatis tanpa struk fiktif.", SKY_BLUE)
    ]

    for idx, (old_t, new_t, desc_t, col) in enumerate(trans_cards):
        y = Inches(1.75 + idx * 1.65)
        add_card(s4, Inches(7.9), y, Inches(4.533), Inches(1.5), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        tb = s4.shapes.add_textbox(Inches(8.1), y + Inches(0.12), Inches(4.15), Inches(1.25))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = new_t
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = col
        
        pb = tf.add_paragraph()
        pb.space_before = Pt(3)
        pb.text = f"Menggantikan: {old_t}"
        pb.font.name = "Arial"
        pb.font.size = Pt(10)
        pb.font.bold = True
        pb.font.color.rgb = TEXT_MUTED
        
        pc = tf.add_paragraph()
        pc.space_before = Pt(3)
        pc.text = desc_t
        pc.font.name = "Arial"
        pc.font.size = Pt(10.5)
        pc.font.color.rgb = TEXT_MAIN

    add_slide_footer(s4, 4)
    set_notes(s4, "Gambar 1 memetakan secara runut bagaimana akar masalah manual, dampaknya bagi bisnis, dan solusi konkret yang dihadirkan oleh arsitektur FieldMax.")

    # =========================================================================
    # SLIDE 5: BAB I • ANALISIS KEBUTUHAN EMPIRIS & KERANGKA PIECES
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s5)
    add_header(s5, "Analisis Kebutuhan Empiris (Kerangka PIECES)", "BAB I • PENDAHULUAN", "Hasil survei empiris 105 responden penyewa sarana olahraga beserta pengujian validitas instrumen")

    # Top Row: 3 KPI Cards
    add_kpi_card(s5, Inches(0.9), Inches(1.75), Inches(3.64), Inches(1.6), "N = 105", "Responden Valid Nasional", "84,7% Usia Produktif (18–29 Th) • 86,7% Komunitas", PRIMARY_BLUE)
    add_kpi_card(s5, Inches(4.84), Inches(1.75), Inches(3.64), Inches(1.6), "100% VALID", "Uji Pearson Product Moment", "21 Butir r_hitung ≥ 0,232 > r_tabel = 0,192 (p < 0,05)", ACCENT_GREEN)
    add_kpi_card(s5, Inches(8.78), Inches(1.75), Inches(3.64), Inches(1.6), "α = 0,70", "Reliabilitas Cronbach's Alpha", "Kategori Reliabel Tinggi & Konsistensi Internal Stabil", ACCENT_AMBER)

    # Bottom Row: 2 Balanced Structural Cards
    add_card(s5, Inches(0.9), Inches(3.55), Inches(5.6), Inches(3.1), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=PRIMARY_BLUE)
    tb_b1 = s5.shapes.add_textbox(Inches(1.15), Inches(3.7), Inches(5.1), Inches(2.8))
    tf_b1 = tb_b1.text_frame
    tf_b1.word_wrap = True
    
    p = tf_b1.paragraphs[0]
    p.text = "Temuan Masalah Operasional Lapangan (PIECES)"
    p.font.name = "Arial"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE

    p_items = [
        ("78,1% Butuh Jadwal Real-Time", "Kebutuhan utama mencegah bentrok & asimetri slot (Skor Control 3,90/5,00)."),
        ("68,6% Terkendala WhatsApp", "Friksi komunikasi akibat ketiadaan direktori informasi ketersediaan slot."),
        ("Konfirmasi Lambat (> 1-3 Jam)", "Waktu tunggu balasan admin manual menurunkan efisiensi pemesanan.")
    ]
    for title, desc in p_items:
        pb = tf_b1.add_paragraph()
        pb.space_before = Pt(8)
        pb.text = f"•  {title}: {desc}"
        pb.font.name = "Arial"
        pb.font.size = Pt(12)
        pb.font.color.rgb = TEXT_MAIN

    add_card(s5, Inches(6.8), Inches(3.55), Inches(5.633), Inches(3.1), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=ACCENT_GREEN)
    tb_b2 = s5.shapes.add_textbox(Inches(7.05), Inches(3.7), Inches(5.1), Inches(2.8))
    tf_b2 = tb_b2.text_frame
    tf_b2.word_wrap = True
    
    p = tf_b2.paragraphs[0]
    p.text = "Profil Komunitas & Cabor Dominan"
    p.font.name = "Arial"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN

    c_items = [
        ("4 Cabor Dominan", "Bulutangkis (57,1%), Futsal (51,4%), Bola Basket (41,9%), Tenis (14,3%)."),
        ("Frekuensi Bermain Rutin", "68,6% responden menyewa sarana rutin mingguan bersama komunitas."),
        ("Validasi Kebutuhan Nyata", "Bukti empiris urgensi transformasi sistem reservasi berbasis web modern.")
    ]
    for title, desc in c_items:
        pb = tf_b2.add_paragraph()
        pb.space_before = Pt(8)
        pb.text = f"•  {title}: {desc}"
        pb.font.name = "Arial"
        pb.font.size = Pt(12)
        pb.font.color.rgb = TEXT_MAIN

    add_slide_footer(s5, 5)
    set_notes(s5, "Analisis kebutuhan PIECES terhadap 105 responden valid secara statistik dengan r_hitung di atas r_tabel dan Cronbach's Alpha 0,70. Sebanyak 78,1% responden menuntut visibilitas jadwal real-time untuk mencegah double booking.")

    # =========================================================================
    # SLIDE 6: BAB I • RUMUSAN MASALAH (2 Balanced Pillars)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s6)
    add_header(s6, "Rumusan Masalah Penelitian", "BAB I • PENDAHULUAN", "Dua pilar investigasi ilmiah: rancang bangun artefak sistem dan evaluasi empiris efektivitas")

    rm_cards = [
        ("01", "Pilar I: Rancang Bangun Sistem Multi-Tenant",
         "Bagaimana merancang dan membangun arsitektur sistem informasi reservasi web multi-tenant yang mengintegrasikan penyewa, mitra renter, administrator, dan pembayaran otomatis?",
         ["Arsitektur Full-Stack TypeScript Monorepo terpadu", "Dukungan 22 Use Cases fungsional 3 peran pengguna", "Sistem autentikasi aman berbasis sesi cookie di database"],
         PRIMARY_BLUE),
        ("02", "Pilar II: Evaluasi Fungsional & Eliminasi Bentrok",
         "Bagaimana efektivitas algoritma kueri irisan waktu (time-overlap) dalam mengeliminasi bentrok jadwal (double booking) reservasi secara real-time pada kondisi akses konkuren?",
         ["Pengujian Black Box skema pencegahan double booking (Tabel 30)", "Validasi matematis formula irisan waktu pada 7 skenario bentrok", "Mekanisme Two-Phase Locking & auto-release transaksi pending"],
         ACCENT_GREEN),
    ]

    for idx, (num, title_rm, q_text, bullets, col) in enumerate(rm_cards):
        cx = Inches(0.9 + idx * 5.9)
        add_card(s6, cx, Inches(1.75), Inches(5.633), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        add_badge(s6, cx + Inches(0.25), Inches(1.95), f"FOKUS PENELITIAN {num}", CARD_MUTED, col, font_size=10)
        
        tb = s6.shapes.add_textbox(cx + Inches(0.25), Inches(2.35), Inches(5.1), Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title_rm
        p.font.name = "Arial"
        p.font.size = Pt(15.5)
        p.font.bold = True
        p.font.color.rgb = col
        
        add_card(s6, cx + Inches(0.25), Inches(2.95), Inches(5.1), Inches(1.7), bg_color=CARD_MUTED, border_color=None, radius=0.025)
        tb_q = s6.shapes.add_textbox(cx + Inches(0.4), Inches(3.05), Inches(4.8), Inches(1.5))
        tf_q = tb_q.text_frame
        tf_q.word_wrap = True
        tf_q.margin_left = tf_q.margin_top = tf_q.margin_right = tf_q.margin_bottom = 0
        pq = tf_q.paragraphs[0]
        pq.text = f'"{q_text}"'
        pq.font.name = "Arial"
        pq.font.size = Pt(11.5)
        pq.font.color.rgb = TEXT_MAIN

        tb_b = s6.shapes.add_textbox(cx + Inches(0.25), Inches(4.8), Inches(5.1), Inches(1.7))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        tf_b.margin_left = tf_b.margin_top = tf_b.margin_right = tf_b.margin_bottom = 0
        
        pb0 = tf_b.paragraphs[0]
        pb0.text = "Target Capaian & Luaran Artefak:"
        pb0.font.name = "Arial"
        pb0.font.size = Pt(11)
        pb0.font.bold = True
        pb0.font.color.rgb = TEXT_MUTED

        for b_item in bullets:
            pb = tf_b.add_paragraph()
            pb.space_before = Pt(6)
            pb.text = f"✓  {b_item}"
            pb.font.name = "Arial"
            pb.font.size = Pt(12)
            pb.font.color.rgb = TEXT_MAIN

        b_tag = "Luaran Artefak: Full-Stack Web App Siap Produksi" if idx == 0 else "Bukti Empiris: 100% Bebas Bentrok pada 7 Skenario"
        add_badge(s6, cx + Inches(0.25), Inches(6.15), b_tag, CARD_MUTED, col, w=Inches(5.1), h=Inches(0.32), font_size=9.5, bold=True)

    add_slide_footer(s6, 6)
    set_notes(s6, "Rumusan masalah dirancang selaras dengan metodologi DSR Hevner: pilar pertama berfokus pada fase Build (rekayasa perangkat lunak), dan pilar kedua berfokus pada fase Evaluate (pengujian fungsional dan eliminasi bentrok).")

    # =========================================================================
    # SLIDE 7: BAB I • TUJUAN PENELITIAN
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s7)
    add_header(s7, "Tujuan Penelitian", "BAB I • PENDAHULUAN", "Sasaran capaian penelitian yang menjawab rumusan masalah secara sistematis dan terukur")

    tujuan_cards = [
        ("01", "Tujuan I: Pengembangan Platform Web Multi-Tenant",
         "Membangun platform sistem informasi reservasi web multi-tenant modular yang mengintegrasikan pengguna, mitra renter, administrator, dan pembayaran otomatis Midtrans Snap.",
         [
             "Membangun katalog venue interaktif dengan filter cabor & lokasi",
             "Menyediakan dashboard mandiri bagi operasional mitra pengelola",
             "Mengintegrasikan payment gateway otomatis (QRIS, VA Bank, E-wallet)",
             "Menyediakan konsol moderasi verifikasi sarana bagi administrator"
         ], PRIMARY_BLUE),
        ("02", "Tujuan II: Evaluasi Kelayakan & Validasi Logika Anti-Bentrok",
         "Mengevaluasi keandalan fungsional sistem melalui Black Box Testing dan memvalidasi keakuratan formulasi algoritma irisan waktu dalam mengeliminasi bentrok jadwal secara real-time.",
         [
             "Membuktikan secara empiris keandalan eliminasi double booking",
             "Membuktikan eliminasi bentrok jadwal pada 7 skenario irisan waktu",
             "Menerapkan penguncian sementara 15 menit (Two-Phase Locking)",
             "Menyusun dokumentasi akademik sistematis berbasis DSR & SDLC"
         ], ACCENT_GREEN),
    ]

    for idx, (num, title_t, desc_t, bullets, col) in enumerate(tujuan_cards):
        cx = Inches(0.9 + idx * 5.9)
        add_card(s7, cx, Inches(1.75), Inches(5.633), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        add_badge(s7, cx + Inches(0.25), Inches(1.95), f"SASARAN STRATEGIS {num}", CARD_MUTED, col, font_size=10)
        
        tb = s7.shapes.add_textbox(cx + Inches(0.25), Inches(2.35), Inches(5.1), Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title_t
        p.font.name = "Arial"
        p.font.size = Pt(15.5)
        p.font.bold = True
        p.font.color.rgb = col
        
        add_card(s7, cx + Inches(0.25), Inches(2.95), Inches(5.1), Inches(1.35), bg_color=CARD_MUTED, border_color=None, radius=0.025)
        tb_d = s7.shapes.add_textbox(cx + Inches(0.4), Inches(3.05), Inches(4.8), Inches(1.15))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        tf_d.margin_left = tf_d.margin_top = tf_d.margin_right = tf_d.margin_bottom = 0
        pd = tf_d.paragraphs[0]
        pd.text = desc_t
        pd.font.name = "Arial"
        pd.font.size = Pt(12)
        pd.font.color.rgb = TEXT_MAIN

        tb_b = s7.shapes.add_textbox(cx + Inches(0.25), Inches(4.5), Inches(5.1), Inches(1.55))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        tf_b.margin_left = tf_b.margin_top = tf_b.margin_right = tf_b.margin_bottom = 0
        
        pb0 = tf_b.paragraphs[0]
        pb0.text = "Rincian Sasaran Terukur:"
        pb0.font.name = "Arial"
        pb0.font.size = Pt(11.5)
        pb0.font.bold = True
        pb0.font.color.rgb = TEXT_MUTED

        for b_item in bullets:
            pb = tf_b.add_paragraph()
            pb.space_before = Pt(5)
            pb.text = f"•  {b_item}"
            pb.font.name = "Arial"
            pb.font.size = Pt(12)
            pb.font.color.rgb = TEXT_MAIN

        b_tag = "Capaian: Integrasi 3 Peran & Otomasi Midtrans" if idx == 0 else "Capaian: Pembuktian 100% Valid pada 7 Skenario Uji"
        add_badge(s7, cx + Inches(0.25), Inches(6.15), b_tag, CARD_MUTED, col, w=Inches(5.1), h=Inches(0.32), font_size=9.5, bold=True)

    add_slide_footer(s7, 7)
    set_notes(s7, "Tujuan penelitian secara langsung menjawab rumusan masalah dengan sasaran konkrit: menghasilkan platform multi-tenant produksi dan memvalidasi keandalannya lewat pengujian matematis serta Black Box.")

    # =========================================================================
    # SLIDE 8: BAB I • BATASAN MASALAH (2x2 Balanced Cards)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s8)
    add_header(s8, "Batasan Masalah Penelitian", "BAB I • PENDAHULUAN", "Ruang lingkup arsitektur, teknologi, dan batasan fungsional artefak perangkat lunak")

    limits_data = [
        ("01", "Arsitektur Web & Ruang Lingkup", 
         "Web responsif Next.js 16 & Express 5 dengan 3 peran pengguna (User, Renter, Admin).", PRIMARY_BLUE),
        ("02", "Basis Data & Kontrol Konkurensi", 
         "PostgreSQL 16 via Prisma ORM dengan kunci UUID & kontrol bentrok Two-Phase Locking.", ROYAL_BLUE),
        ("03", "Integrasi Layanan Pihak Ketiga", 
         "Integrasi Midtrans Snap (QRIS, VA, E-Wallet), CDN ImageKit, & Nodemailer SMTP.", SKY_BLUE),
        ("04", "Cakupan Evaluasi Pengujian", 
         "Evaluasi sistem difokuskan pada pengujian Black Box pencegahan bentrok jadwal (Tabel 30).", ACCENT_PURPLE),
    ]

    for idx, (badge_num, l_title, l_desc, col) in enumerate(limits_data):
        rx = idx % 2
        ry = idx // 2
        cx = Inches(0.9 + rx * 5.9)
        cy = Inches(1.75 + ry * 2.5)
        
        add_card(s8, cx, cy, Inches(5.633), Inches(2.32), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        # Badge on top line
        add_badge(s8, cx + Inches(0.22), cy + Inches(0.18), f"BATASAN {badge_num}", CARD_MUTED, col, font_size=9.5)
        
        # Title below badge
        tb = s8.shapes.add_textbox(cx + Inches(0.22), cy + Inches(0.55), Inches(5.15), Inches(0.38))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = l_title
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = TEXT_MAIN
        
        # Description
        tb_d = s8.shapes.add_textbox(cx + Inches(0.22), cy + Inches(0.96), Inches(5.15), Inches(1.2))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        tf_d.margin_left = tf_d.margin_top = tf_d.margin_right = tf_d.margin_bottom = 0
        pd = tf_d.paragraphs[0]
        pd.text = l_desc
        pd.font.name = "Arial"
        pd.font.size = Pt(11.5)
        pd.font.color.rgb = TEXT_MUTED

    add_slide_footer(s8, 8)
    set_notes(s8, "Batasan masalah menjaga fokus penelitian agar tepat sasaran: arsitektur monorepo web modern TypeScript, basis data PostgreSQL dengan kontrol konkurensi, Midtrans Snap, serta evaluasi berbasis Black Box.")

    # =========================================================================
    # SLIDE 9: BAB I • MANFAAT PENELITIAN (4 Stakeholders)
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s9)
    add_header(s9, "Manfaat Penelitian", "BAB I • PENDAHULUAN", "Kontribusi aplikatif bagi pengguna, mitra pengelola sarana, administrator, dan akademik")

    benefits_data = [
        ("01", "Bagi Pelanggan (User)", 
         "Kepastian slot real-time, kemudahan filter multi-cabor, & transaksi mandiri 24/7.", PRIMARY_BLUE),
        ("02", "Bagi Mitra Sarana (Renter)", 
         "Otonomi kelola tarif & jadwal, bebas bentrok 100%, serta rekap omzet otomatis.", ACCENT_GREEN),
        ("03", "Bagi Administrator", 
         "Pengawasan terpusat, verifikasi legalitas mitra, & resolusi tiket komplain transparan.", SKY_BLUE),
        ("04", "Bagi Ranah Akademik", 
         "Rujukan ilmiah implementasi DSR & Waterfall SDLC pada sistem web multi-tenant.", ACCENT_PURPLE),
    ]

    for idx, (badge_num, b_title, b_desc, col) in enumerate(benefits_data):
        rx = idx % 2
        ry = idx // 2
        cx = Inches(0.9 + rx * 5.9)
        cy = Inches(1.75 + ry * 2.5)
        
        add_card(s9, cx, cy, Inches(5.633), Inches(2.32), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        # Badge on top line
        add_badge(s9, cx + Inches(0.22), cy + Inches(0.18), f"MANFAAT {badge_num}", CARD_MUTED, col, font_size=9.5)
        
        # Title below badge
        tb = s9.shapes.add_textbox(cx + Inches(0.22), cy + Inches(0.55), Inches(5.15), Inches(0.38))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = b_title
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = TEXT_MAIN
        
        # Description
        tb_d = s9.shapes.add_textbox(cx + Inches(0.22), cy + Inches(0.96), Inches(5.15), Inches(1.2))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        tf_d.margin_left = tf_d.margin_top = tf_d.margin_right = tf_d.margin_bottom = 0
        pd = tf_d.paragraphs[0]
        pd.text = b_desc
        pd.font.name = "Arial"
        pd.font.size = Pt(11.5)
        pd.font.color.rgb = TEXT_MUTED
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        tf_d.margin_left = tf_d.margin_top = tf_d.margin_right = tf_d.margin_bottom = 0
        pd = tf_d.paragraphs[0]
        pd.text = b_desc
        pd.font.name = "Arial"
        pd.font.size = Pt(12)
        pd.font.color.rgb = TEXT_MUTED

    add_slide_footer(s9, 9)
    set_notes(s9, "Manfaat penelitian memberikan dampak langsung pada empat pilar: kenyamanan penyewa, efisiensi operasional mitra, kontrol bagi administrator, serta sumbangsih ilmiah di bidang rekayasa perangkat lunak.")

    # =========================================================================
    # SLIDE 10: BAB II • WAKTU DAN LOKASI PENELITIAN (Tabel 4 Gantt)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s10)
    add_header(s10, "Waktu dan Lokasi Penelitian", "BAB II • METODE PENELITIAN", "Pelaksanaan penelitian Juli 2025 s.d. November 2026 di Universitas Hasanuddin (Tabel 4 Skripsi)")

    # Top Location Card
    add_card(s10, Inches(0.9), Inches(1.75), Inches(11.533), Inches(0.85), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.03, accent_left=PRIMARY_BLUE)
    tb_loc = s10.shapes.add_textbox(Inches(1.15), Inches(1.85), Inches(11.0), Inches(0.65))
    tf_l = tb_loc.text_frame
    tf_l.word_wrap = True
    p = tf_l.paragraphs[0]
    p.text = "Lokasi Penelitian: Program Studi Sistem Informasi, Universitas Hasanuddin, Makassar"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN

    p_sub = tf_l.add_paragraph()
    p_sub.space_before = Pt(2)
    p_sub.text = "Survei kebutuhan empiris PIECES disebarkan secara daring kepada 105 komunitas penyewa sarana olahraga di berbagai wilayah perkotaan."
    p_sub.font.name = "Arial"
    p_sub.font.size = Pt(10.5)
    p_sub.font.color.rgb = TEXT_MUTED

    # Table: Gantt Chart
    t_shape = s10.shapes.add_table(7, 7, Inches(0.9), Inches(2.75), Inches(11.533), Inches(3.9))
    table = t_shape.table
    table.columns[0].width = Inches(0.7)
    table.columns[1].width = Inches(4.433)
    for c_i in range(2, 7):
        table.columns[c_i].width = Inches(1.28)

    headers = ["No", "Tahapan Kegiatan Penelitian (Tabel 4 Skripsi)", "Juli–Des 2025", "Jan–Jun 2026", "Juli–Sep 2026", "Okt 2026", "Nov 2026"]
    for idx, h_text in enumerate(headers):
        cell = table.cell(0, idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = PRIMARY_BLUE
        tf = cell.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = h_text
        p.alignment = PP_ALIGN.CENTER if idx != 1 else PP_ALIGN.LEFT
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE

    gantt_rows = [
        ("1", "Studi Literatur Ilmiah & Identifikasi Masalah", [True, True, True, False, False]),
        ("2", "Analisis Kebutuhan Sistem & Survei PIECES (N=105)", [True, False, True, True, False]),
        ("3", "Desain Sistem: UML, ERD 16 Tabel, & Mockup Figma", [True, True, True, False, False]),
        ("4", "Implementasi Monorepo (Next.js 16, Express 5, Prisma)", [True, True, True, True, False]),
        ("5", "Pengujian Sistem (Pencegahan Double Booking)", [False, False, False, True, True]),
        ("6", "Evaluasi Akhir, Dokumentasi, & Publikasi Laporan", [False, False, False, False, True]),
    ]

    for r_idx, (num, task, filled) in enumerate(gantt_rows, start=1):
        row_bg = CARD_BG if r_idx % 2 == 1 else CARD_MUTED
        
        c0 = table.cell(r_idx, 0)
        c0.fill.solid()
        c0.fill.fore_color.rgb = row_bg
        c0.text_frame.paragraphs[0].text = num
        c0.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
        c0.text_frame.paragraphs[0].font.size = Pt(11)
        
        c1 = table.cell(r_idx, 1)
        c1.fill.solid()
        c1.fill.fore_color.rgb = row_bg
        c1.text_frame.paragraphs[0].text = task
        c1.text_frame.paragraphs[0].font.size = Pt(11.5)
        c1.text_frame.paragraphs[0].font.bold = True
        
        for col_idx, is_filled in enumerate(filled, start=2):
            cell = table.cell(r_idx, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGBColor(236, 253, 245) if is_filled else row_bg
            p_cell = cell.text_frame.paragraphs[0]
            if is_filled:
                p_cell.text = "✓ Selesai"
                p_cell.alignment = PP_ALIGN.CENTER
                p_cell.font.bold = True
                p_cell.font.size = Pt(10)
                p_cell.font.color.rgb = ACCENT_GREEN
            else:
                p_cell.text = "-"
                p_cell.alignment = PP_ALIGN.CENTER
                p_cell.font.size = Pt(11)
                p_cell.font.color.rgb = TEXT_LIGHT

    add_slide_footer(s10, 10)
    set_notes(s10, "Penelitian ini berlangsung di Universitas Hasanuddin dari bulan Juli 2025 sampai November 2026. Tabel 4 memperlihatkan alokasi waktu mulai dari studi literatur, elisitasi kebutuhan survei PIECES, perancangan sistem, pengkodean monorepo, hingga evaluasi Black Box dan penyusunan laporan.")

    # =========================================================================
    # SLIDE 11: BAB II • KERANGKA DSR (HEVNER ET AL., 2004)
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s11)
    add_header(s11, "Kerangka Design Science Research (DSR)", "BAB II • METODE PENELITIAN", "Penerapan metodologi Hevner et al. (2004) yang mengintegrasikan Environment, IS Research, & Knowledge Base")

    dsr_img = os.path.join(img_dir, "gambar-dsr-fieldmax-tight.png")
    if not os.path.exists(dsr_img):
        dsr_img = os.path.join(img_dir, "gambar-dsr-fieldmax.png")

    if os.path.exists(dsr_img):
        add_card(s11, Inches(0.9), Inches(1.75), Inches(11.533), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035)
        s11.shapes.add_picture(dsr_img, Inches(1.15), Inches(1.85), width=Inches(11.033), height=Inches(4.7))

    add_slide_footer(s11, 11)
    set_notes(s11, "Metodologi penelitian mengadopsi Design Science Research Hevner. Hubungan terjalin antara Environment (masalah nyata sewa lapangan), IS Research (siklus Build and Evaluate artefak FieldMax), serta Knowledge Base (fondasi teori RPL dan standar web modern).")

    # =========================================================================
    # SLIDE 12: BAB II • METODE PENGUMPULAN DATA
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s12)
    add_header(s12, "Metode Pengumpulan Data", "BAB II • METODE PENELITIAN", "Kombinasi telaah pustaka ilmiah dan survei kuesioner empiris kerangka PIECES")

    # Card 1: Literatur
    add_card(s12, Inches(0.9), Inches(1.75), Inches(5.6), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=PRIMARY_BLUE)
    tb1 = s12.shapes.add_textbox(Inches(1.15), Inches(1.95), Inches(5.1), Inches(4.4))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    
    p = tf1.paragraphs[0]
    p.text = "1. Studi Literatur Ilmiah"
    p.font.name = "Arial"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE
    
    lit_items = [
        ("Jurnal Bereputasi", "Rujukan isu konkurensi, arsitektur multi-tenant, & payment gateway."),
        ("Buku Teks RPL", "Fondasi UML (Pressman), Waterfall SDLC, & metodologi DSR (Hevner)."),
        ("Dokumentasi Industri", "Spesifikasi resmi Next.js 16, Express 5, & PostgreSQL 16 MVCC.")
    ]
    for title, desc in lit_items:
        pb = tf1.add_paragraph()
        pb.space_before = Pt(18)
        pb.text = f"•  {title}: {desc}"
        pb.font.name = "Arial"
        pb.font.size = Pt(12.5)
        pb.font.color.rgb = TEXT_MAIN

    # Card 2: Kuesioner PIECES
    add_card(s12, Inches(6.8), Inches(1.75), Inches(5.633), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=ACCENT_GREEN)
    tb2 = s12.shapes.add_textbox(Inches(7.05), Inches(1.95), Inches(5.1), Inches(4.4))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    
    p = tf2.paragraphs[0]
    p.text = "2. Survei Kuesioner Empiris (PIECES)"
    p.font.name = "Arial"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN
    
    surv_items = [
        ("Sampel Responden", "105 penyewa sarana olahraga aktif di wilayah perkotaan secara nasional."),
        ("Enam Dimensi PIECES", "Evaluasi aspek performa, informasi, kontrol, efisiensi, hingga layanan."),
        ("Uji Validitas Pearson", "Seluruh 21 butir valid secara statistik (r_hitung ≥ 0,232 > r_tabel = 0,192)."),
        ("Uji Reliabilitas Alpha", "Skor koefisien α = 0,70 (kategori reliabel tinggi & konsistensi stabil).")
    ]
    for title, desc in surv_items:
        pb = tf2.add_paragraph()
        pb.space_before = Pt(12)
        pb.text = f"•  {title}: {desc}"
        pb.font.name = "Arial"
        pb.font.size = Pt(12.5)
        pb.font.color.rgb = TEXT_MAIN

    add_slide_footer(s12, 12)
    set_notes(s12, "Pengumpulan data memadukan dua pendekatan: studi literatur ilmiah untuk standardisasi arsitektur perangkat lunak, serta kuesioner empiris PIECES kepada 105 responden yang telah teruji validitas dan reliabilitasnya.")

    # =========================================================================
    # SLIDE 13: BAB II • WATERFALL SDLC (REDESIGNED: SPLIT VIEW + MILESTONES)
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s13)
    add_header(s13, "Metode Pengembangan: Waterfall SDLC", "BAB II • METODE PENELITIAN", "Penerapan 5 tahapan sekuensial terstruktur Pfleeger & Atlee (Gambar 5 Skripsi)")

    # Left Side: Framed Diagram Card
    add_card(s13, Inches(0.9), Inches(1.75), Inches(5.5), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035)

    pill_diag = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.15), Inches(1.92), Inches(2.2), Inches(0.3))
    pill_diag.adjustments[0] = 0.2
    pill_diag.fill.solid()
    pill_diag.fill.fore_color.rgb = CARD_MUTED
    pill_diag.line.fill.background()
    if hasattr(pill_diag, 'shadow'):
        pill_diag.shadow.inherit = False
    tf_pd = pill_diag.text_frame
    tf_pd.margin_left = tf_pd.margin_top = tf_pd.margin_right = tf_pd.margin_bottom = 0
    ppd = tf_pd.paragraphs[0]
    ppd.alignment = PP_ALIGN.CENTER
    ppd.text = "ARTEFAK METODOLOGI"
    ppd.font.name = "Arial"
    ppd.font.size = Pt(9.5)
    ppd.font.bold = True
    ppd.font.color.rgb = PRIMARY_BLUE

    wf_img = os.path.join(img_dir, "gambar-waterfall-sdlc.png")
    if os.path.exists(wf_img):
        s13.shapes.add_picture(wf_img, Inches(1.15), Inches(2.32), width=Inches(5.0), height=Inches(2.8))

    add_card(s13, Inches(1.15), Inches(5.25), Inches(5.0), Inches(1.2), bg_color=CARD_MUTED, border_color=None, radius=0.03)
    tb_cap = s13.shapes.add_textbox(Inches(1.3), Inches(5.35), Inches(4.7), Inches(1.0))
    tf_cap = tb_cap.text_frame
    tf_cap.word_wrap = True
    tf_cap.margin_left = tf_cap.margin_top = tf_cap.margin_right = tf_cap.margin_bottom = 0
    pc1 = tf_cap.paragraphs[0]
    pc1.text = "Gambar 5. Model Waterfall SDLC (Pfleeger & Atlee, 2010)"
    pc1.font.name = "Arial"
    pc1.font.size = Pt(11)
    pc1.font.bold = True
    pc1.font.color.rgb = TEXT_MAIN

    pc2 = tf_cap.add_paragraph()
    pc2.space_before = Pt(3)
    pc2.text = "Sifat sekuensial berjenjang: Setiap fase wajib menyelesaikan seluruh deliverable & verifikasi sebelum berpindah ke tahap berikutnya."
    pc2.font.name = "Arial"
    pc2.font.size = Pt(10)
    pc2.font.color.rgb = TEXT_MUTED

    # Right Side: 5 Horizontal Milestone Rows
    wf_stages = [
        ("01", "Requirements Analysis", "Elisitasi 22 use cases & survei kebutuhan empiris PIECES (N=105)", "22 Use Cases", PRIMARY_BLUE),
        ("02", "System & DB Design", "Pemodelan Use Case, Activity Diagram, ERD 16 tabel, & UI Figma", "ERD 16 Tabel", ROYAL_BLUE),
        ("03", "Monorepo Coding", "Pengkodean Full-Stack TypeScript: Next.js 16, Express.js 5, Prisma", "Full-Stack TS", SKY_BLUE),
        ("04", "Testing & Verification", "Pengujian Black Box 7 skenario pencegahan bentrok jadwal (Tabel 30)", "100% Valid", ACCENT_GREEN),
        ("05", "Maintenance & Operations", "Optimasi kueri basis data, CDN ImageKit, & tiket pengaduan", "Operasional", ACCENT_PURPLE),
    ]

    for idx, (num, name, desc, badge_tag, col) in enumerate(wf_stages):
        y = Inches(1.75 + idx * 0.98)
        
        add_card(s13, Inches(6.65), y, Inches(5.783), Inches(0.88), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.03, accent_left=col)
        
        chip = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.82), y + Inches(0.14), Inches(0.48), Inches(0.60))
        chip.adjustments[0] = 0.15
        chip.fill.solid()
        chip.fill.fore_color.rgb = col
        chip.line.fill.background()
        if hasattr(chip, 'shadow'):
            chip.shadow.inherit = False
        tf_chip = chip.text_frame
        tf_chip.margin_left = tf_chip.margin_top = tf_chip.margin_right = tf_chip.margin_bottom = 0
        p_chip = tf_chip.paragraphs[0]
        p_chip.alignment = PP_ALIGN.CENTER
        p_chip.text = num
        p_chip.font.name = "Arial"
        p_chip.font.size = Pt(12)
        p_chip.font.bold = True
        p_chip.font.color.rgb = TEXT_WHITE
        
        tb_row = s13.shapes.add_textbox(Inches(7.42), y + Inches(0.12), Inches(3.6), Inches(0.64))
        tf_row = tb_row.text_frame
        tf_row.word_wrap = True
        tf_row.margin_left = tf_row.margin_top = tf_row.margin_right = tf_row.margin_bottom = 0
        
        pr1 = tf_row.paragraphs[0]
        pr1.text = name
        pr1.font.name = "Arial"
        pr1.font.size = Pt(13.5)
        pr1.font.bold = True
        pr1.font.color.rgb = TEXT_MAIN
        
        pr2 = tf_row.add_paragraph()
        pr2.space_before = Pt(2)
        pr2.text = desc
        pr2.font.name = "Arial"
        pr2.font.size = Pt(10.5)
        pr2.font.color.rgb = TEXT_MUTED
        
        tag_pill = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(11.1), y + Inches(0.24), Inches(1.2), Inches(0.38))
        tag_pill.adjustments[0] = 0.2
        tag_pill.fill.solid()
        tag_pill.fill.fore_color.rgb = CARD_MUTED
        tag_pill.line.color.rgb = BORDER_SUBTLE
        tag_pill.line.width = Pt(1)
        if hasattr(tag_pill, 'shadow'):
            tag_pill.shadow.inherit = False
        tf_tp = tag_pill.text_frame
        tf_tp.margin_left = tf_tp.margin_top = tf_tp.margin_right = tf_tp.margin_bottom = 0
        ptp = tf_tp.paragraphs[0]
        ptp.alignment = PP_ALIGN.CENTER
        ptp.text = badge_tag
        ptp.font.name = "Arial"
        ptp.font.size = Pt(9.5)
        ptp.font.bold = True
        ptp.font.color.rgb = col

    add_slide_footer(s13, 13)
    set_notes(s13, "Model Waterfall Pfleeger & Atlee diterapkan secara disiplin: diagram alur di sebelah kiri menunjukkan hubungan sekuensial antar fase, sementara rincian di kanan mendeskripsikan aktivitas dan artefak konkrit yang dihasilkan di setiap tahapan.")

    # =========================================================================
    # SLIDE 14: BAB II • TAHAPAN PENELITIAN (Alur Gambar 4)
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s14)
    add_header(s14, "Tahapan Penelitian (Alur Sistematis)", "BAB II • METODE PENELITIAN", "Integrasi terpadu antara siklus DSR dan fase pengembangan Waterfall SDLC (Gambar 4 Skripsi)")

    # Left Side: Framed Flowchart
    add_card(s14, Inches(0.9), Inches(1.75), Inches(4.5), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035)
    flow_img = os.path.join(img_dir, "gambar-4-alur-penelitian-clean.png")
    if not os.path.exists(flow_img):
        flow_img = os.path.join(img_dir, "gambar-4-alur-penelitian.png")
    if os.path.exists(flow_img):
        s14.shapes.add_picture(flow_img, Inches(1.05), Inches(1.9), width=Inches(4.2), height=Inches(4.6))

    # Right Side: 6 Milestones
    add_card(s14, Inches(5.65), Inches(1.75), Inches(6.783), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=PRIMARY_BLUE)
    tb_m = s14.shapes.add_textbox(Inches(5.9), Inches(1.95), Inches(6.3), Inches(4.5))
    tf_m = tb_m.text_frame
    tf_m.word_wrap = True
    
    milestones = [
        ("1. Identifikasi Masalah & Literatur", "Sintesis survei PIECES & kajian standar arsitektur web modern."),
        ("2. Analisis Kebutuhan Sistem", "Elisitasi 22 use cases fungsional untuk tiga aktor sistem utama."),
        ("3. Perancangan Sistem & Arsitektur", "Pemodelan UML, purwarupa Figma responsif, & ERD 16 tabel relasional."),
        ("4. Implementasi Monorepo Full-Stack", "Pengkodean Next.js 16, Express.js 5 Three-Tier, Prisma, & Midtrans Snap."),
        ("5. Pengujian & Evaluasi Empiris", "Pengujian Black Box 7 skenario eliminasi bentrok jadwal (Tabel 30)."),
        ("6. Dokumentasi & Publikasi", "Penyusunan naskah skripsi terstruktur standar Pedoman Unhas 2023.")
    ]

    p = tf_m.paragraphs[0]
    p.text = milestones[0][0]
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE
    
    p_desc = tf_m.add_paragraph()
    p_desc.space_before = Pt(2)
    p_desc.text = milestones[0][1]
    p_desc.font.name = "Arial"
    p_desc.font.size = Pt(11)
    p_desc.font.color.rgb = TEXT_MUTED

    for title, desc in milestones[1:]:
        pt = tf_m.add_paragraph()
        pt.space_before = Pt(9)
        pt.text = title
        pt.font.name = "Arial"
        pt.font.size = Pt(13)
        pt.font.bold = True
        pt.font.color.rgb = PRIMARY_BLUE
        
        pd = tf_m.add_paragraph()
        pd.space_before = Pt(2)
        pd.text = desc
        pd.font.name = "Arial"
        pd.font.size = Pt(11)
        pd.font.color.rgb = TEXT_MUTED

    add_slide_footer(s14, 14)
    set_notes(s14, "Gambar 4 memperlihatkan alur penelitian terstruktur dengan mekanisme evaluasi berulang. Jika kriteria pengujian Black Box tidak terpenuhi, dilakukan iterasi revisi kode sebelum lanjut ke penyusunan laporan.")

    # =========================================================================
    # SLIDE 15: BAB II • PERANCANGAN SISTEM (22 USE CASES)
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s15)
    add_header(s15, "Perancangan Sistem: 22 Use Cases Fungsional", "BAB II • METODE PENELITIAN", "Distribusi hak akses dan pemetaan use case pada tiga aktor sistem utama (Gambar 6 Skripsi)")

    uc_groups = [
        ("Aktor Pelanggan (User)", "8 Fitur Utama", PRIMARY_BLUE, "Fokus: Mandiri & Bebas Antre", [
            "Pencarian & filter katalog lapangan",
            "Melihat detail & ketersediaan venue",
            "Memilih slot jadwal interaktif",
            "Pembayaran digital Midtrans Snap",
            "Melihat e-tiket & riwayat sewa",
            "Pembatalan reservasi mandiri",
            "Memberikan rating & ulasan",
            "Pengajuan tiket komplain pengaduan"
        ]),
        ("Aktor Mitra (Renter)", "7 Fitur Utama", ACCENT_GREEN, "Fokus: Otonomi & Rekap Otomatis", [
            "Manajemen profil & operasional venue",
            "Pengelolaan data sarana & tarif sewa",
            "Pengaturan jam operasional dinamis",
            "Pemantauan kalender jadwal sewa",
            "Rekapitulasi pendapatan berkala",
            "Pemberian respon tiket komplain",
            "Konfirmasi pesanan sewa manual"
        ]),
        ("Aktor Administrator", "7 Fitur Utama", SKY_BLUE, "Fokus: Moderasi & Integritas Legal", [
            "Moderasi pendaftaran akun renter",
            "Verifikasi berkas legalitas venue",
            "Pengelolaan master tipe cabor",
            "Monitoring transaksi pembayaran",
            "Moderasi & penonaktifan venue/lapangan",
            "Penyelesaian tiket sengketa pengguna",
            "Audit log & statistik ekosistem"
        ]),
    ]

    for idx, (role_name, badge_str, col, b_focus, ucs) in enumerate(uc_groups):
        cx = Inches(0.9 + idx * 3.9)
        add_card(s15, cx, Inches(1.75), Inches(3.733), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        # Header Badge
        add_badge(s15, cx + Inches(0.22), Inches(1.95), badge_str, CARD_MUTED, col, font_size=9.5)
        
        tb = s15.shapes.add_textbox(cx + Inches(0.22), Inches(2.35), Inches(3.3), Inches(0.45))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = role_name
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col
        
        tb_list = s15.shapes.add_textbox(cx + Inches(0.22), Inches(2.85), Inches(3.3), Inches(3.2))
        tf_list = tb_list.text_frame
        tf_list.word_wrap = True
        tf_list.margin_left = tf_list.margin_top = tf_list.margin_right = tf_list.margin_bottom = 0
        
        for uc_idx, uc in enumerate(ucs):
            p_uc = tf_list.paragraphs[0] if uc_idx == 0 else tf_list.add_paragraph()
            if uc_idx > 0:
                p_uc.space_before = Pt(6)
            p_uc.text = f"•  {uc}"
            p_uc.font.name = "Arial"
            p_uc.font.size = Pt(11)
            p_uc.font.color.rgb = TEXT_MAIN

        # Bottom Focus Pill
        add_badge(s15, cx + Inches(0.22), Inches(6.18), b_focus, CARD_MUTED, col, w=Inches(3.3), h=Inches(0.32), font_size=9.5, bold=True)

    add_slide_footer(s15, 15)
    set_notes(s15, "Perancangan sistem memetakan 22 Use Cases fungsional ke dalam tiga peran: 8 use cases untuk pelanggan publik, 7 use cases untuk mitra pemilik sarana, dan 7 use cases untuk administrator platform.")

    # =========================================================================
    # SLIDE 16: BAB III • IMPLEMENTASI FRONT-END
    # =========================================================================
    s16 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s16)
    add_header(s16, "Arsitektur Front-End: Next.js 16 App Router", "BAB III • HASIL DAN PEMBAHASAN", "Pengembangan antarmuka responsif performa tinggi dengan React 19, Tailwind CSS v4, dan TanStack Query")

    fe_cards = [
        ("Next.js 16 App Router (SSR)", "Render Cepat & SEO Ramah", PRIMARY_BLUE, [
            ("Pemuatan Instan", "Server Components mempercepat first contentful paint."),
            ("Nested Routing", "Pemisahan rute publik, renter, & admin terstruktur."),
            ("Dinamis SEO", "Indeksasi metadata katalog venue secara otomatis.")
        ]),
        ("Tailwind CSS v4 & shadcn/ui", "Desain Sistem Modern & Aksesibel", SKY_BLUE, [
            ("Bundel Ringkas", "Engine v4 kompilasi instan & minim CSS overhead."),
            ("Desain Aksesibel", "Berbasis Radix UI berstandar aksesibilitas tinggi."),
            ("Layout Adaptif", "Tampilan responsif optimal di ponsel & desktop.")
        ]),
        ("TanStack React Query v5", "Manajemen State & Smart Caching", ACCENT_GREEN, [
            ("Smart Caching", "Mengurangi panggilan API & beban jaringan klien."),
            ("Sinkronisasi Otomatis", "Auto-refresh ketersediaan slot jadwal seketika."),
            ("Optimistic Updates", "Transisi antarmuka halus tanpa kedipan layar.")
        ]),
    ]

    for idx, (title_tech, sub_tech, col, points) in enumerate(fe_cards):
        cx = Inches(0.9 + idx * 3.9)
        add_card(s16, cx, Inches(1.75), Inches(3.733), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        tb = s16.shapes.add_textbox(cx + Inches(0.22), Inches(1.95), Inches(3.3), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = title_tech
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col
        
        ps = tf.add_paragraph()
        ps.space_before = Pt(2)
        ps.text = sub_tech
        ps.font.name = "Arial"
        ps.font.size = Pt(11)
        ps.font.color.rgb = TEXT_MUTED

        tb_pts = s16.shapes.add_textbox(cx + Inches(0.22), Inches(2.85), Inches(3.3), Inches(3.6))
        tf_pts = tb_pts.text_frame
        tf_pts.word_wrap = True
        tf_pts.margin_left = tf_pts.margin_top = tf_pts.margin_right = tf_pts.margin_bottom = 0
        
        for p_idx, (p_t, p_d) in enumerate(points):
            pb = tf_pts.paragraphs[0] if p_idx == 0 else tf_pts.add_paragraph()
            if p_idx > 0:
                pb.space_before = Pt(18)
            pb.text = f"•  {p_t}: {p_d}"
            pb.font.name = "Arial"
            pb.font.size = Pt(12)
            pb.font.color.rgb = TEXT_MAIN

        fe_tags = ["Performa: Server-Side Rendering (SSR)", "Standar: WAI-ARIA & Mobile First", "State: Smart Caching & Revalidasi"]
        add_badge(s16, cx + Inches(0.22), Inches(6.15), fe_tags[idx], CARD_MUTED, col, w=Inches(3.3), h=Inches(0.32), font_size=9.5, bold=True)

    add_slide_footer(s16, 16)
    set_notes(s16, "Front-end dibangun dengan Next.js 16 dan React 19. Kombinasi Server Components untuk halaman publik dan Client Components dengan React Query menjamin performa rendering yang sangat cepat dan interaktif.")

    # =========================================================================
    # SLIDE 17: BAB III • IMPLEMENTASI BACK-END
    # =========================================================================
    s17 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s17)
    add_header(s17, "Arsitektur Back-End: Express.js 5 Three-Tier", "BAB III • HASIL DAN PEMBAHASAN", "Struktur modular decoupling Controller → Service → Route dengan validasi Zod dan Session Cookie")

    be_cards = [
        ("Pola Tiga Lapisan (Three-Tier)", "Pemisahan Tanggung Jawab Kode", PRIMARY_BLUE, [
            ("Route Layer", "Definisi endpoint & binding middleware pengaman."),
            ("Controller Layer", "Validasi input HTTP & standardisasi respons JSON."),
            ("Service Layer", "Logika bisnis reservasi, kueri database, & transaksi.")
        ]),
        ("Keamanan Autentikasi Sesi", "Proteksi Berlapis Tanpa Token JWT", SKY_BLUE, [
            ("Cookie HttpOnly", "Kebal terhadap serangan XSS & kebocoran token."),
            ("Stateful di Database", "Validasi sesi aktif & pencabutan instan."),
            ("Otorisasi RBAC", "Proteksi ketat endpoint khusus Renter & Admin.")
        ]),
        ("Validasi Ketat Berbasis Zod", "Integritas Data Permintaan Masuk", ACCENT_GREEN, [
            ("Strict Typing", "Menolak payload korup sebelum mencapai database."),
            ("Pesan Terstruktur", "Respon galat informatif berbahasa Indonesia."),
            ("Shared Schemas", "Skema Zod sinkron antara klien dan server.")
        ]),
    ]

    for idx, (title_tech, sub_tech, col, points) in enumerate(be_cards):
        cx = Inches(0.9 + idx * 3.9)
        add_card(s17, cx, Inches(1.75), Inches(3.733), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        tb = s17.shapes.add_textbox(cx + Inches(0.22), Inches(1.95), Inches(3.3), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = title_tech
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col
        
        ps = tf.add_paragraph()
        ps.space_before = Pt(2)
        ps.text = sub_tech
        ps.font.name = "Arial"
        ps.font.size = Pt(11)
        ps.font.color.rgb = TEXT_MUTED

        tb_pts = s17.shapes.add_textbox(cx + Inches(0.22), Inches(2.85), Inches(3.3), Inches(3.6))
        tf_pts = tb_pts.text_frame
        tf_pts.word_wrap = True
        tf_pts.margin_left = tf_pts.margin_top = tf_pts.margin_right = tf_pts.margin_bottom = 0
        
        for p_idx, (p_t, p_d) in enumerate(points):
            pb = tf_pts.paragraphs[0] if p_idx == 0 else tf_pts.add_paragraph()
            if p_idx > 0:
                pb.space_before = Pt(18)
            pb.text = f"•  {p_t}: {p_d}"
            pb.font.name = "Arial"
            pb.font.size = Pt(12)
            pb.font.color.rgb = TEXT_MAIN

        be_tags = ["Pola: Controller → Service → Route", "Sesi: Cookie HttpOnly di Database", "Validasi: Strict Typing & Shared Schema"]
        add_badge(s17, cx + Inches(0.22), Inches(6.15), be_tags[idx], CARD_MUTED, col, w=Inches(3.3), h=Inches(0.32), font_size=9.5, bold=True)

    add_slide_footer(s17, 17)
    set_notes(s17, "Back-end menerapkan pola Three-Tier pada Express.js 5. Penggunaan sesi berbasis database cookie HttpOnly memberikan keamanan superior dibanding JWT tanpa risiko kebocoran di local storage.")

    # =========================================================================
    # SLIDE 18: BAB III • IMPLEMENTASI BASIS DATA
    # =========================================================================
    s18 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s18)
    add_header(s18, "Arsitektur Basis Data: PostgreSQL 16 & Prisma ORM", "BAB III • HASIL DAN PEMBAHASAN", "Model data relasional dengan UUID primary keys, transaksi ACID, dan proteksi integritas referensial")

    db_cards = [
        ("PostgreSQL 16 MVCC", "Keandalan Transaksi Finansial", PRIMARY_BLUE, [
            ("Transaksi ACID", "Konsistensi penuh pemesanan tiket & pembayaran."),
            ("Konkurensi MVCC", "Kueri data cepat tanpa risiko saling mengunci."),
            ("Integritas Relasional", "Foreign key bertingkat menjaga keabsahan data.")
        ]),
        ("Prisma ORM (Type-Safe)", "Sinkronisasi Tipe Data End-to-End", SKY_BLUE, [
            ("Type-Safe End-to-End", "Pencegahan galat tipe data saat kompilasi."),
            ("Anti SQL Injection", "Seluruh kueri dieksekusi secara terparameterisasi."),
            ("Migrasi Deklaratif", "Pelacakan evolusi skema tabel secara versioned.")
        ]),
        ("Standardisasi Kunci UUID", "Keamanan Identitas Entitas", ACCENT_GREEN, [
            ("Primary Key UUID v4", "ID unik, aman, & kebal tebakan ID numerik."),
            ("Integritas Nilai Enum", "Standardisasi status verifikasi, peran, & transaksi."),
            ("Normalisasi Data 3NF", "Struktur tabel bebas anomali & redundansi data.")
        ]),
    ]

    for idx, (title_tech, sub_tech, col, points) in enumerate(db_cards):
        cx = Inches(0.9 + idx * 3.9)
        add_card(s18, cx, Inches(1.75), Inches(3.733), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        tb = s18.shapes.add_textbox(cx + Inches(0.22), Inches(1.95), Inches(3.3), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = title_tech
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col
        
        ps = tf.add_paragraph()
        ps.space_before = Pt(2)
        ps.text = sub_tech
        ps.font.name = "Arial"
        ps.font.size = Pt(11)
        ps.font.color.rgb = TEXT_MUTED

        tb_pts = s18.shapes.add_textbox(cx + Inches(0.22), Inches(2.85), Inches(3.3), Inches(3.6))
        tf_pts = tb_pts.text_frame
        tf_pts.word_wrap = True
        tf_pts.margin_left = tf_pts.margin_top = tf_pts.margin_right = tf_pts.margin_bottom = 0
        
        for p_idx, (p_t, p_d) in enumerate(points):
            pb = tf_pts.paragraphs[0] if p_idx == 0 else tf_pts.add_paragraph()
            if p_idx > 0:
                pb.space_before = Pt(18)
            pb.text = f"•  {p_t}: {p_d}"
            pb.font.name = "Arial"
            pb.font.size = Pt(12)
            pb.font.color.rgb = TEXT_MAIN

        db_tags = ["Mesin: Transaksi Finansial ACID", "Kueri: Type-Safe & Anti SQL Injection", "Skema: Primary Key UUID v4 & 8 Enum"]
        add_badge(s18, cx + Inches(0.22), Inches(6.15), db_tags[idx], CARD_MUTED, col, w=Inches(3.3), h=Inches(0.32), font_size=9.5, bold=True)

    add_slide_footer(s18, 18)
    set_notes(s18, "Basis data PostgreSQL 16 dipadukan dengan Prisma ORM. Kunci UUID v4 diterapkan pada 16 tabel relasional untuk mencegah enumerasi ID dan menjamin keamanan transaksi reservasi multi-tenant.")

    # =========================================================================
    # SLIDE 19: BAB III • INTEGRASI LAYANAN PIHAK KETIGA
    # =========================================================================
    s19 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s19)
    add_header(s19, "Integrasi Layanan Pihak Ketiga (Third-Party)", "BAB III • HASIL DAN PEMBAHASAN", "Integrasi payment gateway Midtrans Snap, CDN ImageKit, dan layanan notifikasi email SMTP")

    tp_cards = [
        ("Midtrans Snap Payment", "Otomatisasi Transaksi Finansial", PRIMARY_BLUE, [
            ("Multi-Metode Bayar", "Mendukung QRIS, Virtual Account Bank, & E-Wallet."),
            ("Webhook Otomatis", "Sinkronisasi status bayar instan tanpa perantara."),
            ("Anti Struk Fiktif", "Mengeliminasi total penipuan bukti transfer palsu.")
        ]),
        ("ImageKit Image CDN", "Manajemen Media Berperforma Tinggi", SKY_BLUE, [
            ("Optimasi Format", "Konversi otomatis ke WebP/AVIF hemat bandwidth."),
            ("Penyimpanan Terpusat", "Menampung foto galeri venue, lapangan, & berkas."),
            ("Pengiriman Cepat", "Latensi rendah melalui Content Delivery Network.")
        ]),
        ("Nodemailer SMTP Gateway", "Layanan Notifikasi Terotomasi", ACCENT_GREEN, [
            ("Notifikasi Otomatis", "Pengiriman email konfirmasi & e-tiket instan."),
            ("Verifikasi Akun", "Pengiriman token aktivasi pendaftaran & reset sandi."),
            ("Template Responsif", "Desain email transaksi bersih & profesional.")
        ]),
    ]

    for idx, (title_tech, sub_tech, col, points) in enumerate(tp_cards):
        cx = Inches(0.9 + idx * 3.9)
        add_card(s19, cx, Inches(1.75), Inches(3.733), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        tb = s19.shapes.add_textbox(cx + Inches(0.22), Inches(1.95), Inches(3.3), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = title_tech
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col
        
        ps = tf.add_paragraph()
        ps.space_before = Pt(2)
        ps.text = sub_tech
        ps.font.name = "Arial"
        ps.font.size = Pt(11)
        ps.font.color.rgb = TEXT_MUTED

        tb_pts = s19.shapes.add_textbox(cx + Inches(0.22), Inches(2.85), Inches(3.3), Inches(3.6))
        tf_pts = tb_pts.text_frame
        tf_pts.word_wrap = True
        tf_pts.margin_left = tf_pts.margin_top = tf_pts.margin_right = tf_pts.margin_bottom = 0
        
        for p_idx, (p_t, p_d) in enumerate(points):
            pb = tf_pts.paragraphs[0] if p_idx == 0 else tf_pts.add_paragraph()
            if p_idx > 0:
                pb.space_before = Pt(18)
            pb.text = f"•  {p_t}: {p_d}"
            pb.font.name = "Arial"
            pb.font.size = Pt(12)
            pb.font.color.rgb = TEXT_MAIN

        tp_tags = ["Payment: QRIS, VA Bank, & E-Wallet", "CDN: Format WebP/AVIF Otomatis", "Email: Notifikasi E-Tiket & Verifikasi"]
        add_badge(s19, cx + Inches(0.22), Inches(6.15), tp_tags[idx], CARD_MUTED, col, w=Inches(3.3), h=Inches(0.32), font_size=9.5, bold=True)

    add_slide_footer(s19, 19)
    set_notes(s19, "Tiga pilar layanan pihak ketiga memperkuat ekosistem: Midtrans Snap mengotomasi verifikasi pembayaran digital, ImageKit mengoptimasi foto sarana, dan Nodemailer mengirimkan e-tiket resmi.")

    # =========================================================================
    # SLIDE 20: BAB III • BASIS DATA - ERD 16 TABEL (Gambar 45)
    # =========================================================================
    s20 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s20)
    add_header(s20, "Desain Basis Data: Relasi 16 Tabel (ERD)", "BAB III • HASIL DAN PEMBAHASAN", "Struktur arsitektur relasional entitas sistem reservasi multi-tenant FieldMax (Gambar 45 Skripsi)")

    # Left Side: Framed ERD Diagram
    add_card(s20, Inches(0.9), Inches(1.75), Inches(8.0), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035)
    erd_img = os.path.join(img_dir, "gambar-relasi-tabel.png")
    if os.path.exists(erd_img):
        s20.shapes.add_picture(erd_img, Inches(1.05), Inches(1.85), width=Inches(7.7), height=Inches(4.4))

    tb_cap20 = s20.shapes.add_textbox(Inches(1.05), Inches(6.3), Inches(7.7), Inches(0.3))
    p_c20 = tb_cap20.text_frame.paragraphs[0]
    p_c20.alignment = PP_ALIGN.CENTER
    p_c20.text = "Gambar 45. Skema Relasi Antar Tabel Basis Data FieldMax (16 Tabel Relasional)"
    p_c20.font.name = "Arial"
    p_c20.font.size = Pt(9.5)
    p_c20.font.bold = True
    p_c20.font.color.rgb = TEXT_MUTED

    # Right Side: Schema Highlights
    add_card(s20, Inches(9.1), Inches(1.75), Inches(3.333), Inches(4.9), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=PRIMARY_BLUE)
    tb_sh = s20.shapes.add_textbox(Inches(9.3), Inches(1.95), Inches(2.95), Inches(4.5))
    tf_sh = tb_sh.text_frame
    tf_sh.word_wrap = True
    
    p = tf_sh.paragraphs[0]
    p.text = "Arsitektur Skema Relasional"
    p.font.name = "Arial"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE

    schema_pts = [
        ("16 Tabel Relasional", "Entitas pengguna, venue, lapangan, booking, bayar, & ulasan."),
        ("8 Tipe Nilai Enum", "Standardisasi status verifikasi, peran pengguna, & transaksi."),
        ("Kunci Primer UUID v4", "Keamanan entitas data & kebal tebakan ID numerik."),
        ("Relasi Cascading & FK", "Integritas referensial ketat & proteksi jejak audit data.")
    ]
    for st, sd in schema_pts:
        pb = tf_sh.add_paragraph()
        pb.space_before = Pt(12)
        pb.text = f"•  {st}: {sd}"
        pb.font.name = "Arial"
        pb.font.size = Pt(11)
        pb.font.color.rgb = TEXT_MAIN

    add_slide_footer(s20, 20)
    set_notes(s20, "Gambar 45 memperlihatkan relasi 16 tabel yang menopang arsitektur multi-tenant FieldMax. Entitas inti bookings dan payments terhubung langsung ke venues, fields, dan users untuk menjamin konsistensi ACID.")

    # =========================================================================
    # SLIDE 21: BAB III • DAFTAR NILAI ENUM (Tabel 13 Skripsi)
    # =========================================================================
    s21 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s21)
    add_header(s21, "Kamus Data: Standarisasi Nilai Enum", "BAB III • HASIL DAN PEMBAHASAN", "Definisi 8 tipe data terenumerasi untuk integritas status sistem (Tabel 13 Skripsi)")

    t21_shape = s21.shapes.add_table(9, 4, Inches(0.9), Inches(1.75), Inches(11.533), Inches(4.9))
    table21 = t21_shape.table
    table21.columns[0].width = Inches(0.6)
    table21.columns[1].width = Inches(2.3)
    table21.columns[2].width = Inches(4.633)
    table21.columns[3].width = Inches(4.0)

    h21 = ["No", "Tipe Data Enum", "Nilai Terdaftar (Enum Values)", "Deskripsi Fungsi Bisnis"]
    for idx, h_text in enumerate(h21):
        cell = table21.cell(0, idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = PRIMARY_BLUE
        tf = cell.text_frame
        p = tf.paragraphs[0]
        p.text = h_text
        p.alignment = PP_ALIGN.CENTER if idx == 0 else PP_ALIGN.LEFT
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE

    enum_rows = [
        ("1", "UserRole", "USER, RENTER, ADMIN", "Tingkatan hak akses dan otorisasi pengguna"),
        ("2", "VerificationStatus", "PENDING, VERIFIED, REJECTED", "Status legalitas berkas KTP/usaha mitra renter"),
        ("3", "VenueStatus", "PENDING, APPROVED, REJECTED", "Status moderasi kelayakan operasional sarana"),
        ("4", "FieldStatus", "AVAILABLE, MAINTENANCE, INACTIVE", "Ketersediaan fisik lapangan untuk dipesan"),
        ("5", "BookingStatus", "PENDING, CONFIRMED, CANCELLED, EXPIRED", "Siklus hidup status pemesanan jadwal"),
        ("6", "PaymentStatus", "PENDING, PAID, FAILED, EXPIRED", "Status penyelesaian transaksi finansial Midtrans"),
        ("7", "ReportType", "VENUE, RENTER, USER, SYSTEM", "Kategori klasifikasi tiket pengaduan komplain"),
        ("8", "ReportStatus", "PENDING, IN_REVIEW, RESOLVED, DISMISSED", "Alur penanganan resolusi sengketa oleh admin")
    ]

    for r_idx, (num, e_name, e_vals, e_desc) in enumerate(enum_rows, start=1):
        row_bg = CARD_BG if r_idx % 2 == 1 else CARD_MUTED
        
        c0 = table21.cell(r_idx, 0)
        c0.fill.solid()
        c0.fill.fore_color.rgb = row_bg
        c0.text_frame.paragraphs[0].text = num
        c0.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
        c0.text_frame.paragraphs[0].font.size = Pt(10.5)
        
        c1 = table21.cell(r_idx, 1)
        c1.fill.solid()
        c1.fill.fore_color.rgb = row_bg
        c1.text_frame.paragraphs[0].text = e_name
        c1.text_frame.paragraphs[0].font.size = Pt(11)
        c1.text_frame.paragraphs[0].font.bold = True
        c1.text_frame.paragraphs[0].font.color.rgb = PRIMARY_BLUE
        
        c2 = table21.cell(r_idx, 2)
        c2.fill.solid()
        c2.fill.fore_color.rgb = row_bg
        c2.text_frame.paragraphs[0].text = e_vals
        c2.text_frame.paragraphs[0].font.size = Pt(10.5)
        c2.text_frame.paragraphs[0].font.bold = True
        
        c3 = table21.cell(r_idx, 3)
        c3.fill.solid()
        c3.fill.fore_color.rgb = row_bg
        c3.text_frame.paragraphs[0].text = e_desc
        c3.text_frame.paragraphs[0].font.size = Pt(10.5)
        c3.text_frame.paragraphs[0].font.color.rgb = TEXT_MUTED

    add_slide_footer(s21, 21)
    set_notes(s21, "Tabel 13 merangkum 8 Enum Types PostgreSQL yang diterapkan di level database. Penggunaan enum menjamin integritas data sehingga nilai status tidak dapat diisi dengan string acak.")

    # =========================================================================
    # SLIDE 22: BAB III • STRUKTUR TABEL USERS & SESSIONS (Tabel 14 & 27)
    # =========================================================================
    s22 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s22)
    add_header(s22, "Kamus Data: Tabel users & sessions", "BAB III • HASIL DAN PEMBAHASAN", "Struktur atribut akun pengguna dan autentikasi sesi sistem (Tabel 14 & Tabel 27 Skripsi)")

    # Left: users (Tabel 14)
    tb_u = s22.shapes.add_textbox(Inches(0.9), Inches(1.75), Inches(5.6), Inches(0.4))
    tb_u.text_frame.paragraphs[0].text = "Tabel users (Tabel 14 Skripsi)"
    tb_u.text_frame.paragraphs[0].font.bold = True
    tb_u.text_frame.paragraphs[0].font.size = Pt(13)
    tb_u.text_frame.paragraphs[0].font.color.rgb = PRIMARY_BLUE

    t_u_shape = s22.shapes.add_table(8, 3, Inches(0.9), Inches(2.15), Inches(5.6), Inches(4.5))
    tu = t_u_shape.table
    tu.columns[0].width = Inches(2.2)
    tu.columns[1].width = Inches(1.6)
    tu.columns[2].width = Inches(1.8)

    h_u = ["Nama Kolom", "Tipe Data", "Keterangan"]
    for idx, h in enumerate(h_u):
        c = tu.cell(0, idx)
        c.fill.solid()
        c.fill.fore_color.rgb = PRIMARY_BLUE
        c.text_frame.paragraphs[0].text = h
        c.text_frame.paragraphs[0].font.bold = True
        c.text_frame.paragraphs[0].font.size = Pt(10.5)
        c.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE

    users_fields = [
        ("id", "UUID", "Primary Key"),
        ("email", "VARCHAR(255)", "Unique, Akun"),
        ("full_name", "VARCHAR(255)", "Nama Lengkap"),
        ("phone_number", "VARCHAR(20)", "Kontak WA"),
        ("password_hash", "VARCHAR(255)", "Hash Argon2"),
        ("role", "UserRole", "USER/RENTER/ADMIN"),
        ("verification_status", "VerificationStatus", "Status KTP/Renter")
    ]
    for r_idx, (col_n, col_t, col_k) in enumerate(users_fields, start=1):
        bg = CARD_BG if r_idx % 2 == 1 else CARD_MUTED
        for c_idx, val in enumerate([col_n, col_t, col_k]):
            c = tu.cell(r_idx, c_idx)
            c.fill.solid()
            c.fill.fore_color.rgb = bg
            c.text_frame.paragraphs[0].text = val
            c.text_frame.paragraphs[0].font.size = Pt(10)
            if c_idx == 0:
                c.text_frame.paragraphs[0].font.bold = True

    # Right: sessions (Tabel 27)
    tb_s = s22.shapes.add_textbox(Inches(6.833), Inches(1.75), Inches(5.6), Inches(0.4))
    tb_s.text_frame.paragraphs[0].text = "Tabel sessions (Tabel 27 Skripsi)"
    tb_s.text_frame.paragraphs[0].font.bold = True
    tb_s.text_frame.paragraphs[0].font.size = Pt(13)
    tb_s.text_frame.paragraphs[0].font.color.rgb = PRIMARY_BLUE

    t_s_shape = s22.shapes.add_table(5, 3, Inches(6.833), Inches(2.15), Inches(5.6), Inches(2.6))
    ts = t_s_shape.table
    ts.columns[0].width = Inches(2.2)
    ts.columns[1].width = Inches(1.6)
    ts.columns[2].width = Inches(1.8)

    for idx, h in enumerate(h_u):
        c = ts.cell(0, idx)
        c.fill.solid()
        c.fill.fore_color.rgb = PRIMARY_BLUE
        c.text_frame.paragraphs[0].text = h
        c.text_frame.paragraphs[0].font.bold = True
        c.text_frame.paragraphs[0].font.size = Pt(10.5)
        c.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE

    sess_fields = [
        ("id", "VARCHAR(255)", "Primary Key (Token)"),
        ("user_id", "UUID", "FK -> users.id"),
        ("expires_at", "TIMESTAMPTZ", "Waktu Kedaluwarsa"),
        ("created_at", "TIMESTAMPTZ", "Waktu Terbuat")
    ]
    for r_idx, (col_n, col_t, col_k) in enumerate(sess_fields, start=1):
        bg = CARD_BG if r_idx % 2 == 1 else CARD_MUTED
        for c_idx, val in enumerate([col_n, col_t, col_k]):
            c = ts.cell(r_idx, c_idx)
            c.fill.solid()
            c.fill.fore_color.rgb = bg
            c.text_frame.paragraphs[0].text = val
            c.text_frame.paragraphs[0].font.size = Pt(10)
            if c_idx == 0:
                c.text_frame.paragraphs[0].font.bold = True

    # Security callout card on right bottom
    add_card(s22, Inches(6.833), Inches(5.0), Inches(5.6), Inches(1.65), bg_color=CARD_MUTED, border_color=BORDER_SUBTLE, radius=0.03, accent_left=ACCENT_GREEN)
    tb_sec = s22.shapes.add_textbox(Inches(7.05), Inches(5.15), Inches(5.2), Inches(1.3))
    tf_sec = tb_sec.text_frame
    tf_sec.word_wrap = True
    p = tf_sec.paragraphs[0]
    p.text = "Integritas Autentikasi Stateful Berbasis Sesi"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN

    p2 = tf_sec.add_paragraph()
    p2.space_before = Pt(4)
    p2.text = "Penggunaan session id tersimpan di database memungkinkan pencabutan sesi (session revocation) seketika saat terdeteksi aktivitas mencurigakan, dan token dilindungi cookie HttpOnly terenkripsi."
    p2.font.name = "Arial"
    p2.font.size = Pt(10.5)
    p2.font.color.rgb = TEXT_MAIN

    add_slide_footer(s22, 22)
    set_notes(s22, "Tabel users (Tabel 14) dan sessions (Tabel 27) mengatur autentikasi berbasis sesi stateful. Mekanisme ini jauh lebih aman dibandingkan JWT stateless karena sesi dapat dibatalkan sewaktu-waktu oleh administrator.")

    # =========================================================================
    # SLIDE 23: BAB III • STRUKTUR TABEL VENUES & BOOKINGS (Tabel 19 & 24)
    # =========================================================================
    s23 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s23)
    add_header(s23, "Kamus Data: Tabel venues & bookings", "BAB III • HASIL DAN PEMBAHASAN", "Struktur entitas fasilitas fisik venue dan transaksi reservasi (Tabel 19 & Tabel 24 Skripsi)")

    # Left: venues (Tabel 19)
    tb_v = s23.shapes.add_textbox(Inches(0.9), Inches(1.75), Inches(5.6), Inches(0.4))
    tb_v.text_frame.paragraphs[0].text = "Tabel venues (Tabel 19 Skripsi)"
    tb_v.text_frame.paragraphs[0].font.bold = True
    tb_v.text_frame.paragraphs[0].font.size = Pt(13)
    tb_v.text_frame.paragraphs[0].font.color.rgb = PRIMARY_BLUE

    t_v_shape = s23.shapes.add_table(8, 3, Inches(0.9), Inches(2.15), Inches(5.6), Inches(4.5))
    tv = t_v_shape.table
    tv.columns[0].width = Inches(2.2)
    tv.columns[1].width = Inches(1.6)
    tv.columns[2].width = Inches(1.8)

    for idx, h in enumerate(h_u):
        c = tv.cell(0, idx)
        c.fill.solid()
        c.fill.fore_color.rgb = PRIMARY_BLUE
        c.text_frame.paragraphs[0].text = h
        c.text_frame.paragraphs[0].font.bold = True
        c.text_frame.paragraphs[0].font.size = Pt(10.5)
        c.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE

    venues_fields = [
        ("id", "UUID", "Primary Key"),
        ("name", "VARCHAR(255)", "Nama Venue"),
        ("address", "TEXT", "Alamat Fisik"),
        ("city", "VARCHAR(100)", "Kota / Wilayah"),
        ("status", "VenueStatus", "APPROVED/PENDING"),
        ("renter_id", "UUID", "FK -> users.id"),
        ("description", "TEXT", "Deskripsi & Fasilitas")
    ]
    for r_idx, (col_n, col_t, col_k) in enumerate(venues_fields, start=1):
        bg = CARD_BG if r_idx % 2 == 1 else CARD_MUTED
        for c_idx, val in enumerate([col_n, col_t, col_k]):
            c = tv.cell(r_idx, c_idx)
            c.fill.solid()
            c.fill.fore_color.rgb = bg
            c.text_frame.paragraphs[0].text = val
            c.text_frame.paragraphs[0].font.size = Pt(10)
            if c_idx == 0:
                c.text_frame.paragraphs[0].font.bold = True

    # Right: bookings (Tabel 24)
    tb_b = s23.shapes.add_textbox(Inches(6.833), Inches(1.75), Inches(5.6), Inches(0.4))
    tb_b.text_frame.paragraphs[0].text = "Tabel bookings (Tabel 24 Skripsi)"
    tb_b.text_frame.paragraphs[0].font.bold = True
    tb_b.text_frame.paragraphs[0].font.size = Pt(13)
    tb_b.text_frame.paragraphs[0].font.color.rgb = PRIMARY_BLUE

    t_b_shape = s23.shapes.add_table(8, 3, Inches(6.833), Inches(2.15), Inches(5.6), Inches(4.5))
    tb_tab = t_b_shape.table
    tb_tab.columns[0].width = Inches(2.2)
    tb_tab.columns[1].width = Inches(1.6)
    tb_tab.columns[2].width = Inches(1.8)

    for idx, h in enumerate(h_u):
        c = tb_tab.cell(0, idx)
        c.fill.solid()
        c.fill.fore_color.rgb = PRIMARY_BLUE
        c.text_frame.paragraphs[0].text = h
        c.text_frame.paragraphs[0].font.bold = True
        c.text_frame.paragraphs[0].font.size = Pt(10.5)
        c.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE

    bookings_fields = [
        ("id", "UUID", "Primary Key"),
        ("field_id", "UUID", "FK -> fields.id"),
        ("user_id", "UUID", "FK -> users.id"),
        ("booking_date", "DATE", "Tanggal Jadwal"),
        ("start_time", "TIME", "Jam Mulai"),
        ("end_time", "TIME", "Jam Selesai"),
        ("status", "BookingStatus", "PENDING/CONFIRMED")
    ]
    for r_idx, (col_n, col_t, col_k) in enumerate(bookings_fields, start=1):
        bg = CARD_BG if r_idx % 2 == 1 else CARD_MUTED
        for c_idx, val in enumerate([col_n, col_t, col_k]):
            c = tb_tab.cell(r_idx, c_idx)
            c.fill.solid()
            c.fill.fore_color.rgb = bg
            c.text_frame.paragraphs[0].text = val
            c.text_frame.paragraphs[0].font.size = Pt(10)
            if c_idx == 0:
                c.text_frame.paragraphs[0].font.bold = True

    add_slide_footer(s23, 23)
    set_notes(s23, "Tabel venues (Tabel 19) dan bookings (Tabel 24) merupakan entitas operasional utama. Kolom start_time dan end_time pada tabel bookings menjadi dasar matematis deteksi irisan waktu.")

    # =========================================================================
    # SLIDE 24: BAB III • LOGIKA PENCEGAHAN BENTROK JADWAL (Algorithm)
    # =========================================================================
    s24 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s24)
    add_header(s24, "Logika Algoritma Pencegahan Bentrok Jadwal", "BAB III • HASIL DAN PEMBAHASAN", "Formulasi matematis kueri relasional irisan interval waktu dan mekanisme Two-Phase Locking")

    # Dark Tech Hero Card for Formula
    add_card(s24, Inches(0.9), Inches(1.75), Inches(11.533), Inches(1.85), bg_color=CARD_DARK, border_color=BORDER_DARK, radius=0.035, accent_left=ROYAL_BLUE)
    tb_f = s24.shapes.add_textbox(Inches(1.2), Inches(1.9), Inches(10.9), Inches(1.5))
    tf_f = tb_f.text_frame
    tf_f.word_wrap = True
    
    p = tf_f.paragraphs[0]
    p.text = "FORMULA DETEKSI IRISAN WAKTU (TIME OVERLAP QUERY):"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = TEXT_CYAN

    pf = tf_f.add_paragraph()
    pf.space_before = Pt(8)
    pf.text = "Kondisi Bentrok = (Start_req < End_db)  ∧  (End_req > Start_db)"
    pf.font.name = "Arial"
    pf.font.size = Pt(22)
    pf.font.bold = True
    pf.font.color.rgb = TEXT_WHITE

    p_sub = tf_f.add_paragraph()
    p_sub.space_before = Pt(6)
    p_sub.text = "Membuktikan secara matematis bahwa dua interval waktu [Start_req, End_req] dan [Start_db, End_db] bertabrakan jika dan hanya jika kedua kondisi pertidaksamaan terpenuhi secara simultan."
    p_sub.font.name = "Arial"
    p_sub.font.size = Pt(11.5)
    p_sub.font.color.rgb = RGBColor(203, 213, 225)

    # 3 Technical Explanation Cards Below
    algo_cards = [
        ("Filter Status Kueri Prisma", "Akurasi Pemeriksaan Slot Aktif", PRIMARY_BLUE, [
            ("Evaluasi Slot Aktif", "Hanya memeriksa slot berstatus PENDING dan CONFIRMED."),
            ("Abaikan Non-Aktif", "Status CANCELLED dan EXPIRED diabaikan otomatis oleh kueri.")
        ]),
        ("Presisi Batas Berdampingan", "Pencegahan Penolakan Salah", ACCENT_GREEN, [
            ("Operator Ketat '<' dan '>'", "Sesi bersebelahan (e.g. 08.00–10.00 & 10.00–12.00) diterima valid."),
            ("Bebas False Rejection", "Batas awal dan akhir yang berimpit tidak dianggap bertabrakan.")
        ]),
        ("Two-Phase Locking 15 Menit", "Kontrol Konkurensi Transaksi", SKY_BLUE, [
            ("Penguncian Sementara", "Slot dikunci status PENDING saat invoice Snap Midtrans aktif."),
            ("Pelepasan Otomatis", "Cron job membatalkan & membebaskan slot jika melewati 15 menit.")
        ]),
    ]

    for idx, (title_a, sub_a, col, pts) in enumerate(algo_cards):
        cx = Inches(0.9 + idx * 3.9)
        add_card(s24, cx, Inches(3.8), Inches(3.733), Inches(2.85), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        tb = s24.shapes.add_textbox(cx + Inches(0.22), Inches(3.95), Inches(3.3), Inches(0.6))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = title_a
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = col
        
        ps = tf.add_paragraph()
        ps.space_before = Pt(2)
        ps.text = sub_a
        ps.font.name = "Arial"
        ps.font.size = Pt(10.5)
        ps.font.color.rgb = TEXT_MUTED

        tb_p = s24.shapes.add_textbox(cx + Inches(0.22), Inches(4.65), Inches(3.3), Inches(1.8))
        tf_p = tb_p.text_frame
        tf_p.word_wrap = True
        
        for p_i, (pt_t, pt_d) in enumerate(pts):
            pb = tf_p.paragraphs[0] if p_i == 0 else tf_p.add_paragraph()
            if p_i > 0:
                pb.space_before = Pt(8)
            pb.text = f"•  {pt_t}: {pt_d}"
            pb.font.name = "Arial"
            pb.font.size = Pt(10.5)
            pb.font.color.rgb = TEXT_MAIN

    add_slide_footer(s24, 24)
    set_notes(s24, "Logika eliminasi bentrok jadwal menggunakan formulasi pertidaksamaan waktu relasional. Operator strictly less than dan greater than menjamin batas jam bersebelahan valid, didukung Two-Phase Locking 15 menit.")

    # =========================================================================
    # SLIDE 25: BAB III • MATRIKS PENGUJIAN PENCEGAHAN BENTROK JADWAL (Tabel 30 Skripsi)
    # =========================================================================
    s25 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s25)
    add_header(s25, "Matriks Uji Pencegahan Bentrok Jadwal (Tabel 30)", "BAB III • HASIL DAN PEMBAHASAN", "Evaluasi Black Box 7 skenario komputasi validasi ketersediaan jadwal (Tabel 30 Skripsi)")

    t25_shape = s25.shapes.add_table(8, 5, Inches(0.9), Inches(1.75), Inches(11.533), Inches(4.2))
    table25 = t25_shape.table
    table25.columns[0].width = Inches(0.6)
    table25.columns[1].width = Inches(2.6)
    table25.columns[2].width = Inches(3.2)
    table25.columns[3].width = Inches(3.333)
    table25.columns[4].width = Inches(1.8)

    h25 = ["No", "Skenario Uji Bentrok", "Kondisi Database vs Permintaan Baru", "Evaluasi Logika Komputasi", "Hasil Pengujian"]
    for idx, h_text in enumerate(h25):
        cell = table25.cell(0, idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = PRIMARY_BLUE
        tf = cell.text_frame
        p = tf.paragraphs[0]
        p.text = h_text
        p.alignment = PP_ALIGN.CENTER if idx in [0, 4] else PP_ALIGN.LEFT
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE

    # 7 Exact Scenarios from Tabel 30 in Skripsi
    scenarios = [
        ("1", "Exact Slot Match (Slot Sama Persis)", "Eksis: 08.00–10.00 (CONFIRMED)\nBaru: 08.00–10.00", "(08.00 < 10.00) ∧ (10.00 > 08.00) → True\nSistem menolak pesanan slot terisi", "100% Valid (Ditolak)"),
        ("2", "Start-Time Overlap (Tumpang Tindih Awal)", "Eksis: 08.00–10.00 (CONFIRMED)\nBaru: 07.00–09.00", "(07.00 < 10.00) ∧ (09.00 > 08.00) → True\nSistem mendeteksi tabrakan waktu", "100% Valid (Ditolak)"),
        ("3", "End-Time Overlap (Tumpang Tindih Akhir)", "Eksis: 08.00–10.00 (CONFIRMED)\nBaru: 09.00–11.00", "(09.00 < 10.00) ∧ (11.00 > 08.00) → True\nSistem mendeteksi tabrakan waktu", "100% Valid (Ditolak)"),
        ("4", "Enclosing Overlap (Tumpang di Dalam)", "Eksis: 08.00–12.00 (PENDING)\nBaru: 09.00–11.00", "(09.00 < 12.00) ∧ (11.00 > 08.00) → True\nStatus PENDING mengunci jadwal", "100% Valid (Ditolak)"),
        ("5", "Adjacent Boundary (Batas Berdampingan)", "Eksis: 08.00–10.00 (CONFIRMED)\nBaru: 10.00–12.00", "(10.00 < 10.00) ∧ (12.00 > 08.00) → False\nBatas waktu berdampingan sah diizinkan", "100% Valid (Diterima)"),
        ("6", "Simultaneous Booking (Pemesanan Serentak)", "Dua user mengirim sewa slot 14.00–16.00 serentak", "Transaksi atomik Prisma mengeksekusi bergantian:\n1 pesanan diproses, 1 pesanan bentrok", "100% Valid (1 Sukses, 1 Tolak)"),
        ("7", "Auto-Release Slot (Pelepasan Otomatis)", "Slot 16.00–18.00 PENDING batal/kedaluwarsa", "Kueri mengabaikan status CANCELLED,\nslot waktu otomatis terbebas kembali", "100% Valid (Slot Terbuka)")
    ]

    for r_idx, (num, sken, cond, logic, stat) in enumerate(scenarios, start=1):
        row_bg = CARD_BG if r_idx % 2 == 1 else CARD_MUTED
        
        c0 = table25.cell(r_idx, 0)
        c0.fill.solid()
        c0.fill.fore_color.rgb = row_bg
        c0.text_frame.paragraphs[0].text = num
        c0.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
        c0.text_frame.paragraphs[0].font.size = Pt(10)
        
        c1 = table25.cell(r_idx, 1)
        c1.fill.solid()
        c1.fill.fore_color.rgb = row_bg
        c1.text_frame.paragraphs[0].text = sken
        c1.text_frame.paragraphs[0].font.size = Pt(10)
        c1.text_frame.paragraphs[0].font.bold = True
        
        c2 = table25.cell(r_idx, 2)
        c2.fill.solid()
        c2.fill.fore_color.rgb = row_bg
        c2.text_frame.paragraphs[0].text = cond
        c2.text_frame.paragraphs[0].font.size = Pt(9.5)
        
        c3 = table25.cell(r_idx, 3)
        c3.fill.solid()
        c3.fill.fore_color.rgb = row_bg
        c3.text_frame.paragraphs[0].text = logic
        c3.text_frame.paragraphs[0].font.size = Pt(9.5)
        c3.text_frame.paragraphs[0].font.color.rgb = TEXT_MUTED
        
        c4 = table25.cell(r_idx, 4)
        c4.fill.solid()
        c4.fill.fore_color.rgb = RGBColor(236, 253, 245)
        p_stat = c4.text_frame.paragraphs[0]
        p_stat.text = stat
        p_stat.alignment = PP_ALIGN.CENTER
        p_stat.font.size = Pt(10)
        p_stat.font.bold = True
        p_stat.font.color.rgb = ACCENT_GREEN

    # Bottom Takeaway Card
    add_card(s25, Inches(0.9), Inches(6.05), Inches(11.533), Inches(0.8), bg_color=CARD_MUTED, border_color=BORDER_SUBTLE, radius=0.03, accent_left=ACCENT_GREEN)
    tb_t25 = s25.shapes.add_textbox(Inches(1.15), Inches(6.12), Inches(11.0), Inches(0.65))
    tf_t25 = tb_t25.text_frame
    tf_t25.word_wrap = True
    tf_t25.margin_left = tf_t25.margin_top = tf_t25.margin_right = tf_t25.margin_bottom = 0
    p_t25 = tf_t25.paragraphs[0]
    p_t25.text = "Hasil Evaluasi Tabel 30: Seluruh 7 skenario pengujian skema pencegahan double booking terbukti 100% valid sesuai spesifikasi perancangan sistem."
    p_t25.font.name = "Arial"
    p_t25.font.size = Pt(10.5)
    p_t25.font.bold = True
    p_t25.font.color.rgb = ACCENT_GREEN

    add_slide_footer(s25, 25)
    set_notes(s25, "Matriks pengujian pada Tabel 30 skripsi mengevaluasi secara tuntas 7 skenario pencegahan bentrok jadwal. Seluruh uji matematis dan transaksional berhasil 100% sesuai rancangan logika sistem.")

    # =========================================================================
    # SLIDE 26: BAB III • EVALUASI EMPIRIS PENCEGAHAN DOUBLE BOOKING (Subbab 3.5.2)
    # =========================================================================
    s26 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s26)
    add_header(s26, "Evaluasi Empiris: Skema Anti-Bentrok Jadwal", "BAB III • HASIL DAN PEMBAHASAN", "Analisis pembuktian empiris tiga pilar eliminasi double booking pada sistem FieldMax (Subbab 3.5.2)")

    eval_cards = [
        ("Presisi Formulasi Waktu", "Skenario 1–5: Uji Irisan Waktu", PRIMARY_BLUE, [
            ("Deteksi Seluruh Irisan", "Formula irisan mendeteksi seluruh tabrakan waktu (Start < End_db ∧ End > Start_db)."),
            ("Bebas False Rejection", "Operator ketat '<' dan '>' memastikan jam batas berdampingan diterima sah."),
            ("Proteksi Status Ganda", "Slot berstatus CONFIRMED maupun PENDING dilindungi dari pesanan baru.")
        ], "Validasi: Formulasi Matematika Relasional"),
        ("Kontrol Konkurensi Atomik", "Skenario 6: Balapan Transaksi", ACCENT_GREEN, [
            ("Uji Race Condition", "Dua pengguna mengirim pemesanan pada slot yang sama di detik bersamaan."),
            ("Prisma Transaction", "Eksekusi transaksi berurutan (serialized) menjamin konsistensi ACID."),
            ("Eliminasi Bentrok", "Tepat 1 pemesan tercepat yang diterima, pemesan kedua otomatis ditolak.")
        ], "Keamanan: Prisma Atomic Transaction"),
        ("Locking & Pelepasan Slot", "Skenario 7: Siklus Hidup Slot", SKY_BLUE, [
            ("Status Locking 15 Menit", "Slot dikunci PENDING saat pengguna membuka invoice Snap Midtrans."),
            ("Perlindungan Bayar", "Pengguna lain dicegah memesan slot yang sedang dalam proses pembayaran."),
            ("Auto-Release Cron", "Slot kedaluwarsa dibatalkan dan terbuka kembali tanpa intervensi manual.")
        ], "Otomasi: 15-Min TTL & Cron Service")
    ]

    for idx, (title_ev, sub_ev, col, points, tag_bot) in enumerate(eval_cards):
        cx = Inches(0.9 + idx * 3.9)
        add_card(s26, cx, Inches(1.75), Inches(3.733), Inches(4.1), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        tb = s26.shapes.add_textbox(cx + Inches(0.22), Inches(1.95), Inches(3.3), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = title_ev
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col
        
        ps = tf.add_paragraph()
        ps.space_before = Pt(2)
        ps.text = sub_ev
        ps.font.name = "Arial"
        ps.font.size = Pt(10.5)
        ps.font.color.rgb = TEXT_MUTED

        tb_pts = s26.shapes.add_textbox(cx + Inches(0.22), Inches(2.80), Inches(3.3), Inches(2.2))
        tf_pts = tb_pts.text_frame
        tf_pts.word_wrap = True
        tf_pts.margin_left = tf_pts.margin_top = tf_pts.margin_right = tf_pts.margin_bottom = 0
        
        for p_idx, (p_t, p_d) in enumerate(points):
            pb = tf_pts.paragraphs[0] if p_idx == 0 else tf_pts.add_paragraph()
            if p_idx > 0:
                pb.space_before = Pt(12)
            pb.text = f"•  {p_t}: {p_d}"
            pb.font.name = "Arial"
            pb.font.size = Pt(11)
            pb.font.color.rgb = TEXT_MAIN

        add_badge(s26, cx + Inches(0.22), Inches(5.35), tag_bot, CARD_MUTED, col, w=Inches(3.3), h=Inches(0.32), font_size=9.5, bold=True)

    # Bottom Takeaway Card
    add_card(s26, Inches(0.9), Inches(6.05), Inches(11.533), Inches(0.8), bg_color=CARD_MUTED, border_color=BORDER_SUBTLE, radius=0.03, accent_left=ACCENT_GREEN)
    tb_t26 = s26.shapes.add_textbox(Inches(1.15), Inches(6.12), Inches(11.0), Inches(0.65))
    tf_t26 = tb_t26.text_frame
    tf_t26.word_wrap = True
    tf_t26.margin_left = tf_t26.margin_top = tf_t26.margin_right = tf_t26.margin_bottom = 0
    p_t26 = tf_t26.paragraphs[0]
    p_t26.text = "Kesimpulan Evaluasi Empiris: Skema pencegahan double booking terbukti 100% efektif mengeliminasi risiko bentrok jadwal pada seluruh skenario sekuensial maupun akses konkuren."
    p_t26.font.name = "Arial"
    p_t26.font.size = Pt(10.5)
    p_t26.font.bold = True
    p_t26.font.color.rgb = ACCENT_GREEN

    add_slide_footer(s26, 26)
    set_notes(s26, "Evaluasi empiris Subbab 3.5.2 membuktikan efektivitas sistem FieldMax melalui tiga pilar: presisi formula irisan waktu matematis, kontrol konkurensi atomik Prisma, dan mekanisme Two-Phase Locking 15 menit dengan auto-release.")

    # =========================================================================
    # SLIDE 27: BAB III • UI SHOWCASE: GUEST & USER
    # =========================================================================
    s27 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s27)
    add_header(s27, "Implementasi Antarmuka: Guest & Pelanggan", "BAB III • HASIL DAN PEMBAHASAN", "Desain visual interaktif alur pencarian katalog, detail venue, dan tiket reservasi")

    ui_user_items = [
        ("halaman-utama.png", "Halaman Utama Publik (Landing Page)"),
        ("halaman-pencarian.png", "Katalog Pencarian & Filter Cabor"),
        ("halaman-detail-lapangan.png", "Detail Sarana & Pemilihan Slot"),
        ("halaman-riwayat-booking.png", "E-Tiket & Riwayat Transaksi")
    ]

    for idx, (img_name, cap_text) in enumerate(ui_user_items):
        rx = idx % 2
        ry = idx // 2
        cx = Inches(0.9 + rx * 5.9)
        cy = Inches(1.75 + ry * 2.5)
        
        add_card(s27, cx, cy, Inches(5.633), Inches(2.35), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035)
        
        img_p = os.path.join(img_dir, img_name)
        if os.path.exists(img_p):
            s27.shapes.add_picture(img_p, cx + Inches(0.15), cy + Inches(0.12), width=Inches(5.333), height=Inches(1.8))
        
        tb = s27.shapes.add_textbox(cx + Inches(0.15), cy + Inches(1.98), Inches(5.333), Inches(0.3))
        p = tb.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = cap_text
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_MAIN

    add_slide_footer(s27, 27)
    set_notes(s27, "Antarmuka sisi pengguna dirancang responsif dan intuitif: mulai dari landing page informatif, filter katalog lapangan multi-kategori, pemilihan slot interaktif, hingga penerbitan tiket digital.")

    # =========================================================================
    # SLIDE 28: BAB III • UI SHOWCASE: RENTER & ADMIN
    # =========================================================================
    s28 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s28)
    add_header(s28, "Implementasi Antarmuka: Renter & Administrator", "BAB III • HASIL DAN PEMBAHASAN", "Dashboard operasional mitra pengelola sarana dan konsol moderasi terpusat admin")

    ui_renter_items = [
        ("halaman-dashboard-renter.png", "Dashboard Operasional Mitra (Renter)"),
        ("halaman-kelola-lapangan-renter.png", "Manajemen Lapangan & Jadwal Mitra"),
        ("halaman-dashboard-admin.png", "Konsol Terpusat Administrator"),
        ("halaman-moderasi-venue-admin.png", "Moderasi & Verifikasi Sarana Admin")
    ]

    for idx, (img_name, cap_text) in enumerate(ui_renter_items):
        rx = idx % 2
        ry = idx // 2
        cx = Inches(0.9 + rx * 5.9)
        cy = Inches(1.75 + ry * 2.5)
        
        add_card(s28, cx, cy, Inches(5.633), Inches(2.35), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035)
        
        img_p = os.path.join(img_dir, img_name)
        if os.path.exists(img_p):
            s28.shapes.add_picture(img_p, cx + Inches(0.15), cy + Inches(0.12), width=Inches(5.333), height=Inches(1.8))
        
        tb = s28.shapes.add_textbox(cx + Inches(0.15), cy + Inches(1.98), Inches(5.333), Inches(0.3))
        p = tb.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = cap_text
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_MAIN

    add_slide_footer(s28, 28)
    set_notes(s28, "Dashboard mitra memberikan visibilitas penuh terhadap kalender pesanan dan grafik pendapatan harian. Di sisi admin, konsol terpusat mempermudah verifikasi izin sarana dan pemantauan transaksi ekosistem.")

    # =========================================================================
    # SLIDE 29: BAB IV • KESIMPULAN PENELITIAN (3 Bold Pillars)
    # =========================================================================
    s29 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s29)
    add_header(s29, "Kesimpulan Penelitian", "BAB IV • KESIMPULAN DAN SARAN", "Rangkuman capaian penelitian yang menjawab rumusan masalah secara lugas (Subbab 4.1 Skripsi)")

    conclusions = [
        ("01", "Rancang Bangun Sistem Multi-Tenant Berhasil Direalisasikan",
         "Platform FieldMax terwujud dalam arsitektur Full-Stack TypeScript Monorepo (Next.js 16, Express 5, Prisma), mendukung 22 use cases terintegrasi untuk 3 peran pengguna secara terpadu.",
         PRIMARY_BLUE),
        ("02", "Eliminasi 100% Bentrok Jadwal Terbukti Secara Empiris",
         "Kombinasi algoritma kueri irisan waktu relasional dan Two-Phase Locking 15 menit terbukti secara empiris 100% efektif mengeliminasi double booking pada seluruh 7 skenario uji konkuren.",
         ACCENT_GREEN),
        ("03", "Keandalan Transaksi Konkuren & Pelepasan Slot Otomatis",
         "Transaksi atomik Prisma berhasil mengatasi race condition pemesanan serentak, serta menjamin ketersediaan kembali slot sewa saat transaksi batal atau kedaluwarsa.",
         SKY_BLUE),
    ]

    for idx, (num, c_title, c_desc, col) in enumerate(conclusions):
        y = Inches(1.75 + idx * 1.65)
        add_card(s29, Inches(0.9), y, Inches(11.533), Inches(1.5), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        # Chip Number
        chip = s29.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.15), y + Inches(0.2), Inches(0.65), Inches(0.65))
        chip.adjustments[0] = 0.15
        chip.fill.solid()
        chip.fill.fore_color.rgb = col
        chip.line.fill.background()
        if hasattr(chip, 'shadow'):
            chip.shadow.inherit = False
        tf_c = chip.text_frame
        p_c = tf_c.paragraphs[0]
        p_c.alignment = PP_ALIGN.CENTER
        p_c.text = num
        p_c.font.name = "Arial"
        p_c.font.size = Pt(14)
        p_c.font.bold = True
        p_c.font.color.rgb = TEXT_WHITE
        
        tb = s29.shapes.add_textbox(Inches(2.0), y + Inches(0.15), Inches(8.8), Inches(1.2))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = c_title
        p.font.name = "Arial"
        p.font.size = Pt(15.5)
        p.font.bold = True
        p.font.color.rgb = col
        
        pd = tf.add_paragraph()
        pd.space_before = Pt(5)
        pd.text = c_desc
        pd.font.name = "Arial"
        pd.font.size = Pt(12.5)
        pd.font.color.rgb = TEXT_MAIN

        pills_29 = ["22 Use Cases Siap", "100% Bebas Bentrok", "Zero Data Anomaly"]
        add_badge(s29, Inches(10.9), y + Inches(0.48), pills_29[idx], CARD_MUTED, col, w=Inches(1.35), h=Inches(0.38), font_size=10, bold=True)

    add_slide_footer(s29, 29)
    set_notes(s29, "Tiga kesimpulan utama menjawab rumusan masalah secara tuntas: keberhasilan rancang bangun arsitektur multi-tenant, efektivitas mutlak algoritma pencegahan double booking, dan validitas 100% pengujian fungsional sistem.")

    # =========================================================================
    # SLIDE 30: BAB IV • SARAN & REKOMENDASI (REDESIGNED: 3 + 2 Symmetrical)
    # =========================================================================
    s30 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s30)
    add_header(s30, "Saran & Rekomendasi Masa Depan", "BAB IV • KESIMPULAN DAN SARAN", "Lima arah strategis pengembangan sistem untuk penelitian lanjutan dan industri (Subbab 4.2 Skripsi)")

    # Top Row: 3 Cards (Width 3.64" each)
    top_suggestions = [
        ("01", "Aplikasi Mobile (PWA / Native)", 
         "Pengembangan aplikasi bergerak (React Native/Flutter) dengan push notification jadwal sewa langsung ke ponsel pengguna.", PRIMARY_BLUE),
        ("02", "WhatsApp Business Gateway", 
         "Pengiriman kode booking, tiket elektronik, dan invoice PDF otomatis via pesan WhatsApp resmi pengelola.", SKY_BLUE),
        ("03", "Peta Interaktif GIS (Maps API)", 
         "Integrasi Google Maps / Leaflet API untuk visualisasi sarana terdekat berbasis GPS real-time.", ACCENT_GREEN),
    ]

    for idx, (num, s_title, s_desc, col) in enumerate(top_suggestions):
        cx = Inches(0.9 + idx * 3.94)
        add_card(s30, cx, Inches(1.75), Inches(3.64), Inches(2.35), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        add_badge(s30, cx + Inches(0.2), Inches(1.95), f"REKOMENDASI {num}", CARD_MUTED, col, font_size=9.5)
        
        tb = s30.shapes.add_textbox(cx + Inches(0.2), Inches(2.35), Inches(3.24), Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = s_title
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = col
        
        tb_d = s30.shapes.add_textbox(cx + Inches(0.2), Inches(2.80), Inches(3.24), Inches(0.70))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        pd = tf_d.paragraphs[0]
        pd.text = s_desc
        pd.font.name = "Arial"
        pd.font.size = Pt(11)
        pd.font.color.rgb = TEXT_MAIN

        top_focus = ["Fokus: Mobile-First & Push Alert", "Fokus: E-Tiket & Notifikasi H-1", "Fokus: Navigasi Radius Lokasi"]
        add_badge(s30, cx + Inches(0.2), Inches(3.70), top_focus[idx], CARD_MUTED, col, w=Inches(3.24), h=Inches(0.30), font_size=9.5, bold=True)

    # Bottom Row: 2 Wide Cards (Width 5.633" each)
    bottom_suggestions = [
        ("04", "Fitur Komunitas & Matchmaking Sparring", 
         "Modul pencarian lawan tanding (sparring matchmaking) dan fitur pembagian tagihan sewa bersama (split bill).", ACCENT_AMBER),
        ("05", "Pengujian Beban & Stress Testing Konkurensi", 
         "Pengujian daya tahan sistem pada volume transaksi masif saat jam sibuk (peak hours) dengan k6 / Apache JMeter.", ACCENT_PURPLE),
    ]

    for idx, (num, s_title, s_desc, col) in enumerate(bottom_suggestions):
        cx = Inches(0.9 + idx * 5.9)
        add_card(s30, cx, Inches(4.3), Inches(5.633), Inches(2.35), bg_color=CARD_BG, border_color=BORDER_SUBTLE, radius=0.035, accent_left=col)
        
        add_badge(s30, cx + Inches(0.25), Inches(4.5), f"REKOMENDASI {num}", CARD_MUTED, col, font_size=9.5)
        
        tb = s30.shapes.add_textbox(cx + Inches(0.25), Inches(4.9), Inches(5.1), Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = s_title
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col
        
        tb_d = s30.shapes.add_textbox(cx + Inches(0.25), Inches(5.4), Inches(5.1), Inches(0.65))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        pd = tf_d.paragraphs[0]
        pd.text = s_desc
        pd.font.name = "Arial"
        pd.font.size = Pt(12)
        pd.font.color.rgb = TEXT_MAIN

        bot_focus = ["Fokus: Matchmaking Komunitas & Split Bill", "Fokus: Uji Skalabilitas Beban Peak Hours"]
        add_badge(s30, cx + Inches(0.25), Inches(6.15), bot_focus[idx], CARD_MUTED, col, w=Inches(5.1), h=Inches(0.32), font_size=9.5, bold=True)

    add_slide_footer(s30, 30)
    set_notes(s30, "Saran penelitian mencakup ekspansi ke aplikasi mobile native, otomatisasi pesan WhatsApp, peta GIS interaktif, fitur komunitas sparring matchmaking, serta stress testing konkurensi skala masif.")

    # =========================================================================
    # SLIDE 31: PENUTUP / SESI TANYA JAWAB (Executive Midnight Navy)
    # =========================================================================
    s31 = prs.slides.add_slide(blank_layout)
    set_canvas_bg(s31, is_dark=True)

    # Center Logo
    if os.path.exists(unhas_logo):
        s31.shapes.add_picture(unhas_logo, Inches(6.19), Inches(0.55), width=Inches(0.95), height=Inches(1.15))

    # Center Hero Card for Q&A
    add_card(s31, Inches(1.5), Inches(1.95), Inches(10.333), Inches(4.7), bg_color=CARD_DARK, border_color=BORDER_DARK, radius=0.035, accent_left=ROYAL_BLUE)
    
    tb_end = s31.shapes.add_textbox(Inches(2.0), Inches(2.2), Inches(9.333), Inches(4.2))
    tf_e = tb_end.text_frame
    tf_e.word_wrap = True
    
    pe1 = tf_e.paragraphs[0]
    pe1.alignment = PP_ALIGN.CENTER
    pe1.text = "TERIMA KASIH"
    pe1.font.name = "Arial"
    pe1.font.size = Pt(36)
    pe1.font.bold = True
    pe1.font.color.rgb = TEXT_WHITE
    
    pe2 = tf_e.add_paragraph()
    pe2.space_before = Pt(8)
    pe2.alignment = PP_ALIGN.CENTER
    pe2.text = "SESI DISKUSI, KRITIK, DAN TANYA JAWAB"
    pe2.font.name = "Arial"
    pe2.font.size = Pt(18)
    pe2.font.bold = True
    pe2.font.color.rgb = TEXT_CYAN

    pe_line = tf_e.add_paragraph()
    pe_line.space_before = Pt(12)
    pe_line.alignment = PP_ALIGN.CENTER
    pe_line.text = "FieldMax • Rancang Bangun Sistem Informasi Reservasi Fasilitas Olahraga Multi-Tenant"
    pe_line.font.name = "Arial"
    pe_line.font.size = Pt(13)
    pe_line.font.color.rgb = RGBColor(203, 213, 225)

    pe3 = tf_e.add_paragraph()
    pe3.space_before = Pt(24)
    pe3.alignment = PP_ALIGN.CENTER
    pe3.text = "Aflah Alifu Na Mappatajang Rahman"
    pe3.font.name = "Arial"
    pe3.font.size = Pt(18)
    pe3.font.bold = True
    pe3.font.color.rgb = TEXT_WHITE

    pe4 = tf_e.add_paragraph()
    pe4.space_before = Pt(4)
    pe4.alignment = PP_ALIGN.CENTER
    pe4.text = "NIM: H071211021 • Program Studi Sistem Informasi • Universitas Hasanuddin"
    pe4.font.name = "Arial"
    pe4.font.size = Pt(12)
    pe4.font.color.rgb = TEXT_LIGHT

    add_slide_footer(s31, 31, is_dark=True)
    set_notes(s31, "Demikian presentasi seminar hasil skripsi ini saya sampaikan. Terima kasih banyak kepada bapak dan ibu dosen. Saya membuka sesi diskusi, tanya jawab, serta masukan demi kesempurnaan penelitian ini.")

    # Save Presentation
    prs.save(output_pptx)
    print(f"[SUCCESS] Presentation generated cleanly: {output_pptx}")
    return output_pptx

if __name__ == "__main__":
    build_presentation()
