import csv
from collections import Counter

with open('google_sheets_data.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = [r for r in reader if len(r) > 0 and r[0].strip()]

data_rows = rows[1:]

ans_q1 = []
ans_q2 = []
ans_q3 = []

for r in data_rows:
    c32 = r[32].strip() if len(r) > 32 else ''
    c33 = r[33].strip() if len(r) > 33 else ''
    c34 = r[34].strip() if len(r) > 34 else ''
    if c32 or c33 or c34:
        ans_q1.append(c32)
        ans_q2.append(c33)
        ans_q3.append(c34)

total_n = len(ans_q1)

print(f"Total yang mengisi pertanyaan terbuka: N = {total_n}")

# 1. Coding Kendala
cats_q1 = {
    "Admin Slow Response / Lama Balas Chat": 0,
    "Sulit Cek Slot Kosong & Pencarian Berulang": 0,
    "Jadwal Bentrok (Double Booking)": 0,
    "Informasi Lapangan & Foto Minim": 0
}

for text in ans_q1:
    t = text.lower()
    if "bentrok" in t:
        cats_q1["Jadwal Bentrok (Double Booking)"] += 1
    elif "lambat" in t or "slow" in t or "lama" in t:
        cats_q1["Admin Slow Response / Lama Balas Chat"] += 1
    elif "foto" in t:
        cats_q1["Informasi Lapangan & Foto Minim"] += 1
    elif "cari" in t or "pencarian" in t or "slot kosong" in t or "ulang" in t:
        cats_q1["Sulit Cek Slot Kosong & Pencarian Berulang"] += 1
    else:
        cats_q1["Sulit Cek Slot Kosong & Pencarian Berulang"] += 1

print("\n--- 1. Analisis Tematik Kendala ---")
for k, v in cats_q1.items():
    print(f"  • {k}: {v} ({v/total_n*100:.1f}%)")

# 2. Coding Info Penting
cats_q2 = {
    "Jadwal Ketersediaan Slot Kosong": 0,
    "Tarif / Rincian Harga Sewa": 0,
    "Foto & Fasilitas Lapangan": 0
}

for text in ans_q2:
    t = text.lower()
    if "jadwal" in t or "slot" in t:
        cats_q2["Jadwal Ketersediaan Slot Kosong"] += 1
    if "harga" in t:
        cats_q2["Tarif / Rincian Harga Sewa"] += 1
    if "info" in t or "lapangan" in t or "foto" in t:
        cats_q2["Foto & Fasilitas Lapangan"] += 1

print("\n--- 2. Analisis Tematik Informasi Penting ---")
for k, v in cats_q2.items():
    print(f"  • {k}: {v} ({v/total_n*100:.1f}%)")

# 3. Coding Harapan
cats_q3 = {
    "Respon Cepat / Konfirmasi Instan": 0,
    "Kemudahan & Penyederhanaan Pencarian": 0,
    "Pengecekan Slot Real-Time": 0,
    "Konfirmasi Pembayaran Otomatis": 0,
    "Pencegahan Jadwal Bentrok": 0
}

for text in ans_q3:
    t = text.lower()
    if "bentrok" in t:
        cats_q3["Pencegahan Jadwal Bentrok"] += 1
    elif "pembayaran" in t or "otomatis" in t:
        cats_q3["Konfirmasi Pembayaran Otomatis"] += 1
    elif "real time" in t:
        cats_q3["Pengecekan Slot Real-Time"] += 1
    elif "cepat" in t or "fast" in t:
        cats_q3["Respon Cepat / Konfirmasi Instan"] += 1
    elif "cari" in t or "mudah" in t or "simpel" in t:
        cats_q3["Kemudahan & Penyederhanaan Pencarian"] += 1
    else:
        cats_q3["Kemudahan & Penyederhanaan Pencarian"] += 1

print("\n--- 3. Analisis Tematik Harapan ---")
for k, v in cats_q3.items():
    print(f"  • {k}: {v} ({v/total_n*100:.1f}%)")
