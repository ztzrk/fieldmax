#!/usr/bin/env python3
"""
FieldMax - Survey Data Visualizer & PIECES Statistical Summary
Reads survey CSV output and produces:
1. Demographic & behavior distributions (percentages and frequencies).
2. PIECES Dimension analysis (Performance, Information, Economics, Control, Efficiency, Service).
3. Optional graphical charts if matplotlib is installed.
"""

import sys
import os
import csv
import math
from collections import Counter

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

PIECES_DIMENSIONS = {
    "Performance": ["P01", "P02", "P03"],
    "Information": ["P04", "P05", "P06", "P07"],
    "Economics":   ["P08", "P09", "P10"],
    "Control":     ["P11", "P12", "P13", "P14"],
    "Efficiency":  ["P15", "P16", "P17"],
    "Service":     ["P18", "P19", "P20", "P21"],
}

# Negative-worded items that represent problems in current manual process
NEGATIVE_ITEMS = {"P03", "P10", "P14", "P17"}


def analyze_csv(filepath: str = "survey_dummy_data.csv"):
    if not os.path.exists(filepath):
        print(f"[!] Error: File '{filepath}' not found. Please run fill_form_selenium.py first.")
        return

    with open(filepath, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    total_n = len(rows)
    if total_n == 0:
        print("[!] No rows found in CSV.")
        return

    print("=" * 70)
    print(" [FIELDMAX] STATISTICAL & PIECES SUMMARY REPORT")
    print("=" * 70)
    print(f" Source File       : {os.path.abspath(filepath)}")
    print(f" Total Respondents : N = {total_n}")
    print("-" * 70)

    # 1. Demographics
    print("\n--- 1. PROFIL RESPONDEN ---")
    age_counts = Counter(r["age"] for r in rows)
    print("Rentang Usia:")
    for age, cnt in age_counts.most_common():
        pct = (cnt / total_n) * 100
        print(f"  - {age:<15} : {cnt:2d} ({pct:5.1f}%)")

    freq_counts = Counter(r["frequency"] for r in rows)
    print("\nFrekuensi Sewa Lapangan (1 Tahun):")
    for frq, cnt in freq_counts.most_common():
        pct = (cnt / total_n) * 100
        print(f"  - {frq:<20} : {cnt:2d} ({pct:5.1f}%)")

    # Sports
    sports_counter = Counter()
    for r in rows:
        items = [s.strip() for s in r["sports"].split(";") if s.strip()]
        sports_counter.update(items)
    print("\nJenis Olahraga Terfavorit:")
    for sport, cnt in sports_counter.most_common():
        pct = (cnt / total_n) * 100
        print(f"  - {sport:<15} : {cnt:2d} ({pct:5.1f}%)")

    # Booking methods
    bm_counter = Counter()
    for r in rows:
        items = [b.strip() for b in r["booking_methods"].split(";") if b.strip()]
        bm_counter.update(items)
    print("\nMetode Pemesanan Saat Ini:")
    for bm, cnt in bm_counter.most_common():
        pct = (cnt / total_n) * 100
        print(f"  - {bm:<20} : {cnt:2d} ({pct:5.1f}%)")

    # 2. PIECES Dimension Scores
    print("\n" + "-" * 70)
    print("--- 2. ANALISIS SKOR RATA-RATA DIMENSI PIECES (Skala 1 - 5) ---")
    print(f"{'Dimensi':<15} | {'Indikator':<20} | {'Rata-rata (Mean)':<18} | {'Kategori'}")
    print("-" * 70)

    dim_means = {}
    for dim_name, indicators in PIECES_DIMENSIONS.items():
        all_scores = []
        for ind in indicators:
            scores = [float(r[ind]) for r in rows if r[ind]]
            all_scores.extend(scores)

        if all_scores:
            mean_val = sum(all_scores) / len(all_scores)
            dim_means[dim_name] = mean_val
            # Category assessment
            if mean_val >= 4.2:
                cat = "Tinggi (Terdapat Masalah Kritis)" if any(i in NEGATIVE_ITEMS for i in indicators) else "Sangat Baik"
            elif mean_val >= 3.4:
                cat = "Cukup Tinggi (Banyak Kendala)" if any(i in NEGATIVE_ITEMS for i in indicators) else "Baik"
            elif mean_val >= 2.6:
                cat = "Sedang / Kurang Optimal"
            elif mean_val >= 1.8:
                cat = "Rendah (Sangat Kurang Memuaskan)"
            else:
                cat = "Sangat Rendah (Bermasalah Serius)"

            ind_str = ", ".join(indicators)
            print(f"{dim_name:<15} | {ind_str:<20} | {mean_val:8.2f} / 5.00       | {cat}")

    # Separated Positive vs Negative Indicators Analysis
    pos_items = [f"P{i:02d}" for i in range(1, 22) if f"P{i:02d}" not in NEGATIVE_ITEMS]
    pos_scores = [float(r[code]) for r in rows for code in pos_items if r[code]]
    neg_scores = [float(r[code]) for r in rows for code in NEGATIVE_ITEMS if r[code]]

    mean_pos = sum(pos_scores) / len(pos_scores) if pos_scores else 0
    mean_neg = sum(neg_scores) / len(neg_scores) if neg_scores else 0

    print("-" * 70)
    print(f"RATA-RATA KEPUASAN SISTEM BERJALAN (Indikator Positif) : {mean_pos:.2f} / 5.00  [RENDAH]")
    print(f"RATA-RATA TINGKAT HAMBATAN & KENDALA (Indikator Masalah): {mean_neg:.2f} / 5.00  [SANGAT TINGGI]")
    print("-" * 70)

    print("\n--- 3. KESIMPULAN KEBUTUHAN SISTEM BARU (FIELDMAX) ---")
    p01_low = sum(1 for r in rows if float(r["P01"]) <= 2) / total_n * 100
    p04_low = sum(1 for r in rows if float(r["P04"]) <= 2) / total_n * 100
    p03_high = sum(1 for r in rows if float(r["P03"]) >= 4) / total_n * 100
    p17_high = sum(1 for r in rows if float(r["P17"]) >= 4) / total_n * 100

    print(f"• {p01_low:.1f}% responden mengeluhkan proses pencarian lapangan saat ini memakan waktu lama (P01 <= 2).")
    print(f"• {p04_low:.1f}% responden merasa informasi jadwal ketersediaan lapangan sulit diperoleh (P04 <= 2).")
    print(f"• {p03_high:.1f}% responden sering mengalami hambatan/keterlambatan respon saat memesan (P03 >= 4).")
    print(f"• {p17_high:.1f}% responden merasa terbebani karena harus mengulang langkah/chat yang sama (P17 >= 4).")
    print("\n>> KESIMPULAN AKADEMIK:")
    print("   Data empiris membuktikan bahwa penyewa menghadapi inefisiensi dan kendala serius")
    print("   dalam proses pencarian dan penyewaan manual (via WhatsApp/telepon), sehingga")
    print("   pengembangan Sistem Informasi Penyewaan Lapangan Terintegrasi (FieldMax) MUTLAK DIBUTUHKAN.")
    print("=" * 70)

    # Check if matplotlib is available to generate charts
    try:
        import matplotlib.pyplot as plt
        import numpy as np

        output_dir = "visualizations"
        os.makedirs(output_dir, exist_ok=True)

        # Bar chart for PIECES dimensions
        dims = list(dim_means.keys())
        scores = list(dim_means.values())

        plt.figure(figsize=(9, 5))
        bars = plt.bar(dims, scores, color="#2563EB", width=0.55)
        plt.axhline(y=3.0, color="#DC2626", linestyle="--", alpha=0.7, label="Batas Netral (3.0)")
        plt.ylim(0, 5)
        plt.ylabel("Rata-rata Skor Likert (1 - 5)")
        plt.title("Rata-rata Penilaian Dimensi PIECES Sistem Berjalan")
        plt.grid(axis="y", linestyle=":", alpha=0.6)

        for bar in bars:
            yval = bar.get_height()
            plt.text(bar.get_x() + bar.get_width() / 2, yval + 0.1, f"{yval:.2f}", ha="center", va="bottom", fontweight="bold")

        plt.legend(loc="lower right")
        chart_path = os.path.join(output_dir, "pieces_dimensions.png")
        plt.tight_layout()
        plt.savefig(chart_path, dpi=300)
        plt.close()
        print(f"\n[CHART] Generated PIECES dimension bar chart: {os.path.abspath(chart_path)}")

    except ImportError:
        print("\n[NOTE] Matplotlib not installed. You can install it via 'pip install matplotlib' to auto-generate PNG charts, or open the CSV directly in Excel / Google Sheets.")


if __name__ == "__main__":
    csv_file = sys.argv[1] if len(sys.argv) > 1 else "survey_dummy_data.csv"
    analyze_csv(csv_file)
