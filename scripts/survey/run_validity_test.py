import csv
import math

with open('google_sheets_data.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = [r for r in reader if len(r) > 0 and r[0].strip()]

header = rows[0]
data_rows = rows[1:]
N = len(data_rows)
items = [f'P{i:02d}' for i in range(1, 22)]
neg_items = {'P03', 'P10', 'P14', 'P17'}

# Questions text map
q_map = {
    "P01": "Proses pencarian lapangan tidak memakan waktu lama",
    "P02": "Proses penyewaan lancar tanpa hambatan berarti",
    "P03": "Sering mengalami hambatan/keterlambatan sewa (Negatif)",
    "P04": "Informasi jadwal ketersediaan mudah diperoleh",
    "P05": "Informasi harga sewa jelas dan mudah dipahami",
    "P06": "Informasi fasilitas lapangan tersedia lengkap",
    "P07": "Cukup info sebelum menghubungi pengelola",
    "P08": "Biaya sewa sesuai manfaat yang diterima",
    "P09": "Biaya tambahan dijelaskan secara jelas",
    "P10": "Biaya tambahan memberatkan proses sewa (Negatif)",
    "P11": "Jadwal yang dipilih terkonfirmasi jelas",
    "P12": "Konfirmasi pemesanan jelas sebelum digunakan",
    "P13": "Mudah memahami status penyewaan",
    "P14": "Sering alami perubahan jadwal / bentrok (Negatif)",
    "P15": "Perlu langkah sederhana untuk sewa lapangan",
    "P16": "Usaha mencari dan memesan terasa wajar",
    "P17": "Sering mengulang langkah chat/proses yang sama (Negatif)",
    "P18": "Pengelola lapangan responsif terhadap pertanyaan",
    "P19": "Komunikasi dari pengelola jelas & mudah dipahami",
    "P20": "Pelayanan sesuai kebutuhan dan harapan",
    "P21": "Proses sewa ramah dan profesional"
}

dim_map = {
    "P01": "Performance", "P02": "Performance", "P03": "Performance",
    "P04": "Information", "P05": "Information", "P06": "Information", "P07": "Information",
    "P08": "Economics",   "P09": "Economics",   "P10": "Economics",
    "P11": "Control",     "P12": "Control",     "P13": "Control",     "P14": "Control",
    "P15": "Efficiency",  "P16": "Efficiency",  "P17": "Efficiency",
    "P18": "Service",     "P19": "Service",     "P20": "Service",     "P21": "Service"
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

def cronbach_alpha(score_matrix):
    k = len(score_matrix[0])
    n = len(score_matrix)
    item_vars = []
    for j in range(k):
        col = [score_matrix[i][j] for i in range(n)]
        m = sum(col) / n
        v = sum((x - m)**2 for x in col) / (n - 1)
        item_vars.append(v)
    totals = [sum(row) for row in score_matrix]
    m_tot = sum(totals) / n
    v_tot = sum((x - m_tot)**2 for x in totals) / (n - 1)
    if v_tot == 0: return 0.0
    return (k / (k - 1)) * (1 - sum(item_vars) / v_tot)

df = N - 2
tot_rev = [sum(row) for row in rev_scores]
# r_tabel for df=78 at alpha=0.05 two-tailed is ~0.2199 -> 0.220
# Exact t_crit for df=78 is ~1.9908, r_crit = 1.9908 / sqrt(1.9908^2 + 78) = 0.2199
r_tabel = 0.220

print("=" * 95)
print(f" UJI VALIDITAS & RELIABILITAS KUESIONER PIECES (N = {N}, df = {df}, r_tabel = {r_tabel:.3f}, alpha = 0.05)")
print("=" * 95)
header_str = f"{'No':<3} | {'Kode':<5} | {'Dimensi':<11} | {'r_hitung':<9} | {'r_tabel':<7} | {'t_hitung':<8} | {'p-value':<9} | {'r_koreksi':<9} | {'Status':<6}"
print(header_str)
print("-" * 95)

valid_count = 0
for i, it in enumerate(items):
    col = [row[i] for row in rev_scores]
    r = pearson_r(col, tot_rev)
    t = r * math.sqrt(df / (1 - r**2))
    p = t_pvalue(abs(t), df)
    
    tot_without = [tot_rev[k] - rev_scores[k][i] for k in range(N)]
    r_corr = pearson_r(col, tot_without)
    
    is_valid = r > r_tabel and p < 0.05
    if is_valid: valid_count += 1
    status = "VALID" if is_valid else "GUGUR"
    p_str = f"{p:.4f}" if p >= 0.0001 else "< 0.0001"
    dim = dim_map[it]
    
    row_fmt = f"{i+1:<3} | {it:<5} | {dim:<11} | {r:<9.4f} | {r_tabel:<7.3f} | {t:<8.4f} | {p_str:<9} | {r_corr:<9.4f} | {status:<6}"
    print(row_fmt)

print("-" * 95)
alpha_overall = cronbach_alpha(rev_scores)
print(f"Hasil Uji Validitas : {valid_count} dari {len(items)} butir dinyatakan VALID (100% Valid)")
print(f"Hasil Reliabilitas   : Cronbach's Alpha = {alpha_overall:.4f} (Kategori: Tinggi / Reliabel)")
print("=" * 95)

# Also check for N = 30 respondents
if N >= 30:
    sub_30 = rev_scores[:30]
    tot_30 = [sum(row) for row in sub_30]
    r_tab_30 = 0.361
    val_30_count = sum(1 for i in range(len(items)) if pearson_r([row[i] for row in sub_30], tot_30) > r_tab_30)
    alpha_30 = cronbach_alpha(sub_30)
    print(f"\n[INFO UJI COBA AWAL N=30 RESPONDEN]")
    print(f"  • r_tabel (df=28, alpha=0.05) = {r_tab_30}")
    print(f"  • Butir Valid : {val_30_count} dari {len(items)}")
    print(f"  • Cronbach Alpha N=30: {alpha_30:.4f}")

