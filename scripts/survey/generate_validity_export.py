import csv
import math
import os

with open('google_sheets_data.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = [r for r in reader if len(r) > 0 and r[0].strip()]

header = rows[0]
data_rows = rows[1:]
N = len(data_rows)
items = [f'P{i:02d}' for i in range(1, 22)]
neg_items = {'P03', 'P10', 'P14', 'P17'}

dim_names = {
    "P01": "Performance", "P02": "Performance", "P03": "Performance",
    "P04": "Information", "P05": "Information", "P06": "Information", "P07": "Information",
    "P08": "Economics",   "P09": "Economics",   "P10": "Economics",
    "P11": "Control",     "P12": "Control",     "P13": "Control",     "P14": "Control",
    "P15": "Efficiency",  "P16": "Efficiency",  "P17": "Efficiency",
    "P18": "Service",     "P19": "Service",     "P20": "Service",     "P21": "Service"
}

statements = {
    "P01": "Proses pencarian lapangan yang saya inginkan tidak memakan waktu yang lama",
    "P02": "Saya dapat menjalani proses penyewaan secara lancar tanpa hambatan yang berarti",
    "P03": "Saya sering mengalami hambatan atau keterlambatan selama proses penyewaan (*unfavorable*)",
    "P04": "Informasi jadwal ketersediaan lapangan yang saya butuhkan mudah diperoleh",
    "P05": "Informasi harga sewa lapangan yang saya cari jelas dan mudah dipahami",
    "P06": "Informasi mengenai fasilitas lapangan yang saya butuhkan tersedia dengan lengkap",
    "P07": "Saya memperoleh informasi yang cukup untuk memutuskan menyewa sebelum menghubungi pengelola",
    "P08": "Biaya sewa lapangan yang saya bayarkan sesuai dengan manfaat yang saya terima",
    "P09": "Biaya tambahan yang mungkin muncul dalam proses penyewaan dijelaskan dengan jelas",
    "P10": "Biaya tambahan sering kali memberatkan saya dalam proses penyewaan (*unfavorable*)",
    "P11": "Saya merasa jadwal yang saya pilih cenderung terkonfirmasi dengan jelas",
    "P12": "Saya mendapatkan konfirmasi pemesanan secara jelas sebelum jadwal digunakan",
    "P13": "Saya mudah memahami status penyewaan yang sedang saya lakukan",
    "P14": "Saya sering mengalami perubahan jadwal atau bentrok tanpa klarifikasi yang memadai (*unfavorable*)",
    "P15": "Saya hanya perlu beberapa langkah sederhana untuk memperoleh informasi dan menyewa lapangan",
    "P16": "Usaha yang saya keluarkan untuk mencari dan memesan lapangan terasa wajar",
    "P17": "Proses penyewaan sering mengharuskan saya mengulang langkah yang sama (*unfavorable*)",
    "P18": "Pengelola lapangan responsif terhadap pertanyaan atau kebutuhan saya",
    "P19": "Komunikasi yang saya terima dari pengelola lapangan jelas dan mudah dipahami",
    "P20": "Pelayanan yang saya terima selama proses penyewaan sesuai dengan kebutuhan dan harapan saya",
    "P21": "Saya merasa proses penyewaan berlangsung dengan sikap yang ramah dan profesional"
}

rev_scores = []
raw_scores = []
for r in data_rows:
    row_raw = [int(r[c].strip()) for c in range(11, 32)]
    row_rev = []
    for c, it in zip(range(11, 32), items):
        val = int(r[c].strip())
        if it in neg_items:
            row_rev.append(6 - val)
        else:
            row_rev.append(val)
    raw_scores.append(row_raw)
    rev_scores.append(row_rev)

def pearson_r(x, y):
    n = len(x)
    mx = sum(x) / n
    my = sum(y) / n
    num = sum((xi - mx) * (yi - my) for xi, yi in zip(x, y))
    den = math.sqrt(sum((xi - mx)**2 for xi in x) * sum((yi - my)**2 for yi in y))
    return num / den if den != 0 else 0.0

def betainc(a, b, x, steps=600):
    if x <= 0: return 0.0
    if x >= 1: return 1.0
    h = x / steps
    s = 0.0
    for i in range(steps + 1):
        t = i * h
        if t == 0 or t == 1:
            w = 1 if (i == 0 or i == steps) else (4 if i % 2 == 1 else 2)
            f = 0.0
        else:
            w = 1 if (i == 0 or i == steps) else (4 if i % 2 == 1 else 2)
            f = (t ** (a - 1)) * ((1 - t) ** (b - 1))
        s += w * f
    integral = s * (h / 3)
    log_beta = math.lgamma(a) + math.lgamma(b) - math.lgamma(a + b)
    beta_ab = math.exp(log_beta)
    return integral / beta_ab

def t_pvalue(t_val, df_val):
    x = df_val / (df_val + t_val**2)
    return betainc(df_val / 2.0, 0.5, x)

df = N - 2
r_tabel = 0.220
tot_rev = [sum(row) for row in rev_scores]

output_rows = []
for i, it in enumerate(items):
    col = [row[i] for row in rev_scores]
    raw_col = [row[i] for row in raw_scores]
    mean_raw = sum(raw_col) / N
    std_raw = math.sqrt(sum((x - mean_raw)**2 for x in raw_col) / (N - 1))
    
    r = pearson_r(col, tot_rev)
    t = r * math.sqrt(df / (1 - r**2))
    p = t_pvalue(abs(t), df)
    
    tot_without = [tot_rev[k] - rev_scores[k][i] for k in range(N)]
    r_corr = pearson_r(col, tot_without)
    
    status = "VALID" if r > r_tabel and p < 0.05 else "TIDAK VALID"
    p_str = f"{p:.4f}" if p >= 0.0001 else "< 0.0001"
    
    output_rows.append({
        "no": i + 1,
        "kode": it,
        "dimensi": dim_names[it],
        "pernyataan": statements[it],
        "mean_raw": f"{mean_raw:.2f}",
        "std_raw": f"{std_raw:.2f}",
        "r_hitung": f"{r:.4f}",
        "r_tabel": f"{r_tabel:.3f}",
        "t_hitung": f"{t:.4f}",
        "p_value": p_str,
        "r_koreksi": f"{r_corr:.4f}",
        "status": status
    })

# Export to CSV
csv_path = 'hasil_uji_validitas_dan_reliabilitas.csv'
with open(csv_path, 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.DictWriter(f, fieldnames=[
        "no", "kode", "dimensi", "pernyataan", "mean_raw", "std_raw",
        "r_hitung", "r_tabel", "t_hitung", "p_value", "r_koreksi", "status"
    ])
    writer.writeheader()
    writer.writerows(output_rows)

print(f"Exported CSV: {csv_path}")
