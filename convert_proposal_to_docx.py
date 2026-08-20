"""
FieldMax - Unhas Thesis Proposal Markdown to DOCX Converter
Strictly complies with:
PEDOMAN PENULISAN TUGAS AKHIR MAHASISWA UNIVERSITAS HASANUDDIN 2023
(SK Rektor No: 10438/UN4.1/KEP/2023)

Features:
- Native Microsoft Word Dynamic References:
  * DAFTAR ISI -> Word Table of Contents field (TOC \\o "1-3" \\h \\z \\u)
  * DAFTAR GAMBAR -> Word Table of Figures field (TOC \\h \\z \\c "Gambar")
  * DAFTAR TABEL -> Word Table of Figures field (TOC \\h \\z \\c "Tabel")
- Native Caption styles with Word SEQ fields (SEQ Gambar, SEQ Tabel)
- Native Microsoft Word Heading Styles (Heading 1, 2, 3, 4) for Navigation Pane
- Paper Size: B5 (176 mm x 250 mm) format buku (Default) or A4 (optional)
- Margins: 2.25 cm (Top, Bottom, Left, Right)
- Font: Arial across all sections
- Line Spacing: 1.15 for body text, 1.0 (Single) for Abstract, Tables, Figures, TOC, and References
- Text Alignment: Justified, with 1.25 cm first-line indentation
- Table Captions: Placed ABOVE table, Arial 10 pt, single-spaced, no trailing period
- Figure Captions: Placed BELOW image, Arial 10 pt, single-spaced, no trailing period
"""

import os
import re
import sys
import argparse
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
from PIL import Image

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Set inner cell padding in dxa (1 pt = 20 dxa)."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table):
    """Apply academic table border style (Top, Header Bottom, Bottom)."""
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>\n'
        f'  <w:top w:val="single" w:sz="8" w:space="0" w:color="000000"/>\n'
        f'  <w:bottom w:val="single" w:sz="8" w:space="0" w:color="000000"/>\n'
        f'  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="D3D3D3"/>\n'
        f'  <w:insideV w:val="none"/>\n'
        f'  <w:left w:val="none"/>\n'
        f'  <w:right w:val="none"/>\n'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def format_run(run, bold=False, italic=False, font_name="Arial", font_size=10, color=RGBColor(0, 0, 0)):
    run.font.name = font_name
    run.font.size = Pt(font_size)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = color
    # Ensure EastAsian font is set as well
    rPr = run._r.get_or_add_rPr()
    rFonts = OxmlElement('w:rFonts')
    rFonts.set(qn('w:ascii'), font_name)
    rFonts.set(qn('w:hAnsi'), font_name)
    rFonts.set(qn('w:cs'), font_name)
    rPr.append(rFonts)

def add_formatted_text(paragraph, text, base_bold=False, base_italic=False, font_size=10, font_name="Arial"):
    """Parse inline markdown (bold, italic, code) and add runs to paragraph."""
    # Remove Obsidian block anchors like ^bab-1, ^gambar-10, ^tabel-4
    text = re.sub(r'\s*\^[a-zA-Z0-9_-]+', '', text)
    # Remove markdown link syntax [text](url) -> text
    text = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', text)
    
    # Tokenize bold and italic
    tokens = re.split(r'(\*\*.*?\*\*|\*.*?\*|`.*?`)', text)
    for token in tokens:
        if not token:
            continue
        if token.startswith('**') and token.endswith('**'):
            inner = token[2:-2]
            run = paragraph.add_run(inner)
            format_run(run, bold=True, italic=base_italic, font_size=font_size, font_name=font_name)
        elif token.startswith('*') and token.endswith('*'):
            inner = token[1:-1]
            run = paragraph.add_run(inner)
            format_run(run, bold=base_bold, italic=True, font_size=font_size, font_name=font_name)
        elif token.startswith('`') and token.endswith('`'):
            inner = token[1:-1]
            run = paragraph.add_run(inner)
            format_run(run, bold=base_bold, italic=base_italic, font_size=font_size, font_name="Courier New")
        else:
            run = paragraph.add_run(token)
            format_run(run, bold=base_bold, italic=base_italic, font_size=font_size, font_name=font_name)

def add_field_code(paragraph, instr_text):
    """Add a Microsoft Word dynamic field code (like TOC, SEQ, PAGEREF)."""
    r1 = paragraph.add_run()
    fld1 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="begin"/>')
    r1._r.append(fld1)

    r2 = paragraph.add_run()
    instr = parse_xml(f'<w:instrText {nsdecls("w")} xml:space="preserve"> {instr_text} </w:instrText>')
    r2._r.append(instr)

    r3 = paragraph.add_run()
    fld2 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="separate"/>')
    r3._r.append(fld2)

    r4 = paragraph.add_run()
    fld3 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="end"/>')
    r4._r.append(fld3)

def add_caption_with_seq(paragraph, caption_type, number_str, title_str, alignment=WD_ALIGN_PARAGRAPH.CENTER):
    """Add a native Word Caption paragraph containing SEQ field (SEQ Gambar / SEQ Tabel)."""
    paragraph.alignment = alignment
    paragraph.paragraph_format.line_spacing = 1.0
    paragraph.paragraph_format.space_before = Pt(8) if caption_type == "Tabel" else Pt(2)
    paragraph.paragraph_format.space_after = Pt(2) if caption_type == "Tabel" else Pt(10)

    # Label: "Gambar " or "Tabel "
    run_lbl = paragraph.add_run(f"{caption_type} ")
    format_run(run_lbl, bold=True, font_size=10)

    # SEQ field
    r_seq1 = paragraph.add_run()
    fld_b = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="begin"/>')
    r_seq1._r.append(fld_b)

    r_seq2 = paragraph.add_run()
    instr = parse_xml(f'<w:instrText {nsdecls("w")} xml:space="preserve"> SEQ {caption_type} \\* ARABIC </w:instrText>')
    r_seq2._r.append(instr)

    r_seq3 = paragraph.add_run()
    fld_s = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="separate"/>')
    r_seq3._r.append(fld_s)

    # Fallback display number
    clean_num = re.sub(r'[^0-9a-zA-Z]', '', number_str)
    r_seq_disp = paragraph.add_run(clean_num)
    format_run(r_seq_disp, bold=True, font_size=10)

    r_seq4 = paragraph.add_run()
    fld_e = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="end"/>')
    r_seq4._r.append(fld_e)

    # Dot separator
    run_dot = paragraph.add_run(". ")
    format_run(run_dot, bold=True, font_size=10)

    # Title text
    add_formatted_text(paragraph, title_str, base_bold=False, font_size=10)

def resolve_image_path(raw_path, base_dir):
    """Resolve image path and map SVGs or drawio to converted PNGs."""
    raw_path = raw_path.strip().replace('\\', '/')
    possible_paths = [
        os.path.join(base_dir, raw_path),
        os.path.join(base_dir, 'images', os.path.basename(raw_path)),
        os.path.join(base_dir, os.path.basename(raw_path))
    ]
    
    # Check if direct file exists
    for p in possible_paths:
        if os.path.exists(p) and not p.endswith('.drawio') and not p.endswith('.svg'):
            return p
            
    # Check SVG replacement
    if raw_path.endswith('.svg'):
        png_path = raw_path[:-4] + '.png'
        for p in [os.path.join(base_dir, png_path), os.path.join(base_dir, 'images', os.path.basename(png_path))]:
            if os.path.exists(p):
                return p
                
    # Check drawio replacements
    if 'booking-flow' in raw_path:
        p = os.path.join(base_dir, 'images', 'image019.png')
        if os.path.exists(p): return p
    if 'use-case' in raw_path:
        p = os.path.join(base_dir, 'images', 'image020.png')
        if os.path.exists(p): return p
    if 'alur-penelitian' in raw_path:
        p = os.path.join(base_dir, 'images', 'gambar-4-alur-penelitian.png')
        if os.path.exists(p): return p
    if 'waterfall' in raw_path:
        p = os.path.join(base_dir, 'images', 'gambar-waterfall-sdlc.png')
        if os.path.exists(p): return p
    if 'dsr' in raw_path:
        p = os.path.join(base_dir, 'images', 'gambar-dsr-fieldmax.png')
        if os.path.exists(p): return p
    if 'analisis-masalah' in raw_path:
        p = os.path.join(base_dir, 'images', 'gambar-analisis-masalah.png')
        if os.path.exists(p): return p
        
    for p in possible_paths:
        if os.path.exists(p):
            return p
    return None

def setup_document_styles(doc):
    """Configure Word Document built-in styles according to Unhas 2023 guidelines."""
    # Enable automatic update of fields (TOC, Table of Figures) on open
    try:
        settings = doc.settings.element
        update_fields = parse_xml(f'<w:updateFields {nsdecls("w")} w:val="true"/>')
        settings.append(update_fields)
    except Exception as e:
        print(f"Notice: updateFields setting: {e}")

    # Normal Style
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Arial'
    normal_style.font.size = Pt(10)
    normal_style.font.color.rgb = RGBColor(0, 0, 0)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(0)
    normal_style.paragraph_format.space_before = Pt(0)

    # Heading 1 Style (Bab & Front Matter Main Headings)
    h1 = doc.styles['Heading 1']
    h1.font.name = 'Arial'
    h1.font.size = Pt(11)
    h1.font.bold = True
    h1.font.color.rgb = RGBColor(0, 0, 0)
    h1.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    h1.paragraph_format.line_spacing = 1.0
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(12)
    h1.paragraph_format.keep_with_next = True

    # Heading 2 Style (Sub-bab: 1.1, 1.2, 2.1, dst.)
    h2 = doc.styles['Heading 2']
    h2.font.name = 'Arial'
    h2.font.size = Pt(10)
    h2.font.bold = True
    h2.font.color.rgb = RGBColor(0, 0, 0)
    h2.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
    h2.paragraph_format.line_spacing = 1.15
    h2.paragraph_format.space_before = Pt(12)
    h2.paragraph_format.space_after = Pt(4)
    h2.paragraph_format.keep_with_next = True

    # Heading 3 Style (Anak Sub-bab: 1.6.1, 2.4.1, dst.)
    h3 = doc.styles['Heading 3']
    h3.font.name = 'Arial'
    h3.font.size = Pt(10)
    h3.font.bold = True
    h3.font.color.rgb = RGBColor(0, 0, 0)
    h3.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
    h3.paragraph_format.line_spacing = 1.15
    h3.paragraph_format.space_before = Pt(8)
    h3.paragraph_format.space_after = Pt(2)
    h3.paragraph_format.keep_with_next = True

    # Heading 4 Style (Sub-anak Sub-bab: #### 1. Next.js, dst.)
    h4 = doc.styles['Heading 4']
    h4.font.name = 'Arial'
    h4.font.size = Pt(10)
    h4.font.bold = True
    h4.font.color.rgb = RGBColor(0, 0, 0)
    h4.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
    h4.paragraph_format.line_spacing = 1.15
    h4.paragraph_format.space_before = Pt(6)
    h4.paragraph_format.space_after = Pt(2)
    h4.paragraph_format.keep_with_next = True

    # Caption Style
    try:
        caption_style = doc.styles['Caption']
        caption_style.font.name = 'Arial'
        caption_style.font.size = Pt(10)
        caption_style.font.italic = False
        caption_style.font.color.rgb = RGBColor(0, 0, 0)
        caption_style.paragraph_format.line_spacing = 1.0
    except Exception:
        pass

def convert_md_to_docx(input_md_path, output_docx_path, page_size="B5"):
    print(f"[*] Reading source Markdown: {input_md_path}")
    with open(input_md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    base_dir = os.path.dirname(os.path.abspath(input_md_path))
    doc = Document()

    # Configure Section & Margins according to Unhas 2023 Guideline
    section = doc.sections[0]
    if page_size.upper() == "B5":
        section.page_width = Cm(17.6)
        section.page_height = Cm(25.0)
        max_img_width = Cm(13.0)
    else: # A4
        section.page_width = Cm(21.0)
        section.page_height = Cm(29.7)
        max_img_width = Cm(15.5)

    # 5.1.2 Batas Sembir: 2.25 cm all sides
    section.top_margin = Cm(2.25)
    section.bottom_margin = Cm(2.25)
    section.left_margin = Cm(2.25)
    section.right_margin = Cm(2.25)

    # Setup styles
    setup_document_styles(doc)

    lines = content.split('\n')
    i = 0
    table_rows = []
    is_front_matter = True
    is_cover_page = True
    first_p_after_heading = False
    current_special_section = None # 'DAFTAR ISI', 'DAFTAR GAMBAR', 'DAFTAR TABEL'

    while i < len(lines):
        line = lines[i].strip()

        # Handle Markdown Tables
        if line.startswith('|') and line.endswith('|'):
            table_rows.append(line)
            i += 1
            continue
        elif table_rows:
            # If we are in DAFTAR ISI, DAFTAR GAMBAR, or DAFTAR TABEL, skip the static markdown table
            # and insert Word's dynamic Reference Field instead!
            if current_special_section == 'DAFTAR ISI':
                p_fld = doc.add_paragraph()
                p_fld.paragraph_format.line_spacing = 1.0
                add_field_code(p_fld, 'TOC \\o "1-3" \\h \\z \\u')
                current_special_section = None
                table_rows = []
                continue
            elif current_special_section == 'DAFTAR GAMBAR':
                p_fld = doc.add_paragraph()
                p_fld.paragraph_format.line_spacing = 1.0
                add_field_code(p_fld, 'TOC \\h \\z \\c "Gambar"')
                current_special_section = None
                table_rows = []
                continue
            elif current_special_section == 'DAFTAR TABEL':
                p_fld = doc.add_paragraph()
                p_fld.paragraph_format.line_spacing = 1.0
                add_field_code(p_fld, 'TOC \\h \\z \\c "Tabel"')
                current_special_section = None
                table_rows = []
                continue

            # Process normal tables
            parsed_rows = []
            for tr in table_rows:
                # Skip markdown separator row like |:---|:---|
                if re.match(r'^\|[\s:-|]+\|$', tr):
                    continue
                cells = [c.strip() for c in tr.strip('|').split('|')]
                parsed_rows.append(cells)
            
            if parsed_rows:
                num_cols = max(len(r) for r in parsed_rows)
                tbl = doc.add_table(rows=len(parsed_rows), cols=num_cols)
                tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
                set_table_borders(tbl)

                for r_idx, row_data in enumerate(parsed_rows):
                    for c_idx, cell_text in enumerate(row_data):
                        if c_idx < num_cols:
                            cell = tbl.cell(r_idx, c_idx)
                            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
                            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
                            p = cell.paragraphs[0]
                            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                            p.paragraph_format.line_spacing = 1.0
                            p.paragraph_format.space_before = Pt(0)
                            p.paragraph_format.space_after = Pt(0)
                            is_header = (r_idx == 0)
                            add_formatted_text(p, cell_text, base_bold=is_header, font_size=9 if num_cols > 4 else 9.5)
                            if is_header:
                                # Header shading
                                tcPr = cell._tc.get_or_add_tcPr()
                                shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F2F2F2"/>')
                                tcPr.append(shd)

                # Add a small spacing after table
                sp_p = doc.add_paragraph()
                sp_p.paragraph_format.space_before = Pt(0)
                sp_p.paragraph_format.space_after = Pt(4)

            table_rows = []

        if not line:
            i += 1
            continue

        # Skip horizontal rules
        if line == '---' or line == '***':
            i += 1
            continue

        # Check for Chapter Title (# BAB I / # BAB II / # ABSTRAK / # DAFTAR ISI etc.)
        if line.startswith('# '):
            heading_text = line[2:].strip()
            heading_clean = re.sub(r'\s*\^[a-zA-Z0-9_-]+', '', heading_text)
            
            # Handle Cover Title differently
            if is_cover_page and ("RANCANG BANGUN" in heading_clean.upper()):
                p = doc.add_paragraph()
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.line_spacing = 1.15
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(12)
                run = p.add_run(heading_clean.upper())
                format_run(run, bold=True, font_size=11)
                i += 1
                continue

            # Formal Headings (Heading 1)
            if "BAB " in heading_clean.upper() or any(k in heading_clean.upper() for k in ["ABSTRAK", "ABSTRACT", "DAFTAR ISI", "DAFTAR GAMBAR", "DAFTAR TABEL", "DAFTAR PUSTAKA"]):
                is_cover_page = False
                if i > 5: # Page break before each main chapter
                    doc.add_page_break()

                # Mark special sections for Reference Fields
                if "DAFTAR ISI" in heading_clean.upper():
                    current_special_section = 'DAFTAR ISI'
                elif "DAFTAR GAMBAR" in heading_clean.upper():
                    current_special_section = 'DAFTAR GAMBAR'
                elif "DAFTAR TABEL" in heading_clean.upper():
                    current_special_section = 'DAFTAR TABEL'
                else:
                    current_special_section = None

                # Add as native Heading 1 so it appears in Word Navigation Pane
                p = doc.add_paragraph(style='Heading 1')
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.line_spacing = 1.0
                p.paragraph_format.space_before = Pt(12)
                p.paragraph_format.space_after = Pt(12)
                
                # Split BAB I PENDAHULUAN into two lines for display while keeping it in Navigation pane
                bab_match = re.match(r'^(BAB\s+[IVXLCDM]+)\s+(.*)$', heading_clean, re.IGNORECASE)
                if bab_match:
                    run1 = p.add_run(bab_match.group(1).upper() + "\n")
                    format_run(run1, bold=True, font_size=11)
                    run2 = p.add_run(bab_match.group(2).upper())
                    format_run(run2, bold=True, font_size=11)
                    is_front_matter = False
                else:
                    run = p.add_run(heading_clean.upper())
                    format_run(run, bold=True, font_size=11)
                
                first_p_after_heading = True
                i += 1
                continue

        # Check for Section Headings (## 1.1, ## 2.1, etc.) -> Heading 2
        if line.startswith('## '):
            heading_text = line[3:].strip()
            heading_clean = re.sub(r'\s*\^[a-zA-Z0-9_-]+', '', heading_text)
            p = doc.add_paragraph(style='Heading 2')
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_before = Pt(12)
            p.paragraph_format.space_after = Pt(4)
            add_formatted_text(p, heading_clean, base_bold=True, font_size=10)
            first_p_after_heading = True
            i += 1
            continue

        # Check for Sub-section Headings (### 1.6.1, ### 2.4.1, etc.) -> Heading 3
        if line.startswith('### '):
            heading_text = line[4:].strip()
            heading_clean = re.sub(r'\s*\^[a-zA-Z0-9_-]+', '', heading_text)
            
            # If on cover page (e.g. ### **PROPOSAL SKRIPSI**)
            if is_cover_page:
                p = doc.add_paragraph()
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.space_before = Pt(6)
                p.paragraph_format.space_after = Pt(6)
                add_formatted_text(p, heading_clean, base_bold=True, font_size=10)
            else:
                p = doc.add_paragraph(style='Heading 3')
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.line_spacing = 1.15
                p.paragraph_format.space_before = Pt(8)
                p.paragraph_format.space_after = Pt(2)
                add_formatted_text(p, heading_clean, base_bold=True, font_size=10)
            first_p_after_heading = True
            i += 1
            continue

        # Check for Sub-sub-section Headings (#### 1. Next.js, etc.) -> Heading 4
        if line.startswith('#### '):
            heading_text = line[5:].strip()
            heading_clean = re.sub(r'\s*\^[a-zA-Z0-9_-]+', '', heading_text)
            p = doc.add_paragraph(style='Heading 4')
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(2)
            add_formatted_text(p, heading_clean, base_bold=True, font_size=10)
            first_p_after_heading = True
            i += 1
            continue

        # Check for Table Titles (e.g. **Tabel 4.** Judul Tabel) -> Native Caption with SEQ Tabel
        tbl_caption_match = re.match(r'^\*\*(Tabel\s+([0-9a-zA-Z]+(?:\.[0-9]+)?)\.?)\*\*\s*(.*)$', line)
        if tbl_caption_match:
            num_str = tbl_caption_match.group(2).strip()
            title = tbl_caption_match.group(3).strip()
            title = re.sub(r'\s*\^[a-zA-Z0-9_-]+', '', title)
            
            p = doc.add_paragraph(style='Caption')
            add_caption_with_seq(p, caption_type="Tabel", number_str=num_str, title_str=title, alignment=WD_ALIGN_PARAGRAPH.LEFT)
            i += 1
            continue

        # Check for Images (![alt](path) or ![[path]])
        img_match = re.search(r'!\[(.*?)\]\((.*?)\)|!\[\[(.*?)\]\]', line)
        if img_match:
            raw_img_path = img_match.group(2) if img_match.group(2) else img_match.group(3)
            img_file = resolve_image_path(raw_img_path, base_dir)
            if img_file and os.path.exists(img_file):
                p = doc.add_paragraph()
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.space_before = Pt(8)
                p.paragraph_format.space_after = Pt(4)
                
                # Check dimensions and scale
                try:
                    with Image.open(img_file) as im:
                        w, h = im.size
                        # If cover logo, keep it neat around 3.5 cm
                        if 'image001' in img_file:
                            p.add_run().add_picture(img_file, width=Cm(3.5))
                        else:
                            target_w = max_img_width
                            if w < 600:
                                target_w = Cm(min(max_img_width.cm, w / 37.79))
                            p.add_run().add_picture(img_file, width=target_w)
                except Exception as e:
                    print(f"Warning: could not insert image {img_file}: {e}")
            i += 1
            continue

        # Check for Figure Captions (e.g. **Gambar 1.** Judul Gambar) -> Native Caption with SEQ Gambar
        fig_caption_match = re.match(r'^\*\*(Gambar\s+([0-9a-zA-Z]+(?:\.[0-9]+)?)\.?)\*\*\s*(.*)$', line)
        if fig_caption_match:
            num_str = fig_caption_match.group(2).strip()
            title = fig_caption_match.group(3).strip()
            title = re.sub(r'\s*\^[a-zA-Z0-9_-]+', '', title)
            
            p = doc.add_paragraph(style='Caption')
            add_caption_with_seq(p, caption_type="Gambar", number_str=num_str, title_str=title, alignment=WD_ALIGN_PARAGRAPH.CENTER)
            i += 1
            continue

        # Handle Standard Paragraphs
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        
        # Check if line is centered in HTML block or Title block
        if '<div align="center">' in line or '<div align=\'center\'>' in line:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            i += 1
            continue
        if '</div>' in line or '<br>' in line:
            i += 1
            continue

        if is_cover_page:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(4)
            add_formatted_text(p, line, font_size=10)
            i += 1
            continue

        # Lists or numbered bullets
        list_match = re.match(r'^(\d+\.|\*|\-)\s+(.*)$', line)
        if list_match:
            bullet = list_match.group(1)
            rest = list_match.group(2)
            p.paragraph_format.left_indent = Cm(1.25)
            p.paragraph_format.first_line_indent = Cm(-0.6)
            run_b = p.add_run(f"{bullet} ")
            format_run(run_b, bold=(bullet.isdigit() and len(bullet) <= 2), font_size=10)
            add_formatted_text(p, rest, font_size=10)
        else:
            # Body paragraph: First paragraph after heading has 0 indent, others have 1.25 cm
            if not is_front_matter:
                p.paragraph_format.first_line_indent = Cm(0) if first_p_after_heading else Cm(1.25)
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(4)
            add_formatted_text(p, line, font_size=10)

        first_p_after_heading = False
        i += 1

    print(f"[*] Saving DOCX document to: {output_docx_path}")
    doc.save(output_docx_path)
    print(f"[+] Conversion complete! Output size: {os.path.getsize(output_docx_path):,} bytes")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Convert Markdown Skripsi to DOCX following Unhas 2023 Guidelines with Word Dynamic References")
    parser.add_argument("--input", default=r"c:\Users\Ztzrk\Documents\fieldmax\obsidian\Fieldmax\Proposal Skripsi - BAB I dan BAB II (Audited).md", help="Path to input Markdown file")
    parser.add_argument("--output", default=r"c:\Users\Ztzrk\Documents\fieldmax\obsidian\Fieldmax\Proposal Skripsi - BAB I dan BAB II (Audited) - References.docx", help="Path to output DOCX file")
    parser.add_argument("--size", default="B5", choices=["B5", "A4"], help="Paper size (B5 as per Unhas guideline, or A4)")
    args = parser.parse_args()

    convert_md_to_docx(args.input, args.output, page_size=args.size)
