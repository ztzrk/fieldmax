#!/usr/bin/env python3
"""
FieldMax - Google Form Dummy Data Generator & Selenium Automator
Target Form: https://forms.gle/tXJt76dSAVpehgKP9
Title: Kuesioner Pengalaman Penyewa dalam Proses Penyewaan Lapangan Olahraga

Features:
- Dual Modes:
  1. 'selenium' (default): Real browser automation (Edge / Chrome) with visible or headless execution.
  2. 'fast': High-speed HTTP POST submission for batch dataset generation (e.g., 50+ responses).
- Realistic Data Generation:
  - Demographic distribution (18-22, 23-29, etc. based on typical Indonesian sports renters).
  - Four distinct respondent personas (Student Athlete, Young Professional, Team Captain, Casual Player).
  - Correlated PIECES Likert scale values (1-5) matching manual vs digital booking frictions.
  - Realistic qualitative responses in Indonesian for open-ended questions.
  - Natural variance and noise simulating real-world survey responses.
- Automatic CSV export of all generated dummy data for visualization & analysis (Excel, SPSS, Matplotlib).
"""

import os
import sys
import time
import random
import argparse
import csv
from datetime import datetime
from typing import Dict, List, Any

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# ==============================================================================
# FORM CONFIGURATION & ENTRY IDs
# ==============================================================================
FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSciW5wzsHfekSu_PKKlfiIx3TO0wKhY4daNoO2Z96bUQfoe_g/viewform"
POST_URL = "https://docs.google.com/forms/d/e/1FAIpQLSciW5wzsHfekSu_PKKlfiIx3TO0wKhY4daNoO2Z96bUQfoe_g/formResponse"

ENTRY_MAP = {
    # Page 1: Informed Consent
    "consent": "entry.2070542005",
    # Page 2: Screening
    "rented_last_12m": "entry.732652001",
    "compared_fields": "entry.1241406248",
    "rental_need": "entry.2134304703",
    # Page 3: Demographics & Habits
    "age": "entry.1796507563",
    "frequency": "entry.836178065",
    "sports": "entry.1978879377",
    "info_sources": "entry.1452513650",
    "booking_methods": "entry.487205980",
    "searched_info": "entry.99438614",
    # Page 4: PIECES Framework (21 Likert questions, 1-5)
    "P01": "entry.134638900",
    "P02": "entry.1242550770",
    "P03": "entry.1022251847",
    "P04": "entry.1003311236",
    "P05": "entry.777861534",
    "P06": "entry.812410928",
    "P07": "entry.467133911",
    "P08": "entry.1698165255",
    "P09": "entry.768339926",
    "P10": "entry.1131879128",
    "P11": "entry.1651365315",
    "P12": "entry.1631733609",
    "P13": "entry.1621276924",
    "P14": "entry.470874018",
    "P15": "entry.129639783",
    "P16": "entry.1499979441",
    "P17": "entry.1505151475",
    "P18": "entry.970968850",
    "P19": "entry.374479161",
    "P20": "entry.1197921964",
    "P21": "entry.280930660",
    # Page 5: Qualitative Open Questions
    "q_obstacles": "entry.511027710",
    "q_crucial_info": "entry.1107481516",
    "q_expectations": "entry.1133423154",
}

# ==============================================================================
# REALISTIC DATA DISTRIBUTIONS & PERSONAS
# ==============================================================================

PERSONAS = [
    {
        "name": "Student Athlete (Komunitas Mahasiswa)",
        "weight": 0.40,
        "age_dist": [("< 18 tahun", 0.05), ("18–22 tahun", 0.75), ("23–29 tahun", 0.20)],
        "frequency_dist": [("3–5 kali", 0.25), ("6–10 kali", 0.50), ("Lebih dari 10 kali", 0.25)],
        "need_dist": [("Kelompok", 0.90), ("Keduanya", 0.10)],
        "compared_dist": [("Ya", 0.95), ("Tidak", 0.05)],
        "sports_pool": ["Futsal", "Badminton", "Basket"],
        "info_pool": ["Media sosial", "Rekomendasi teman atau keluarga", "Komunitas / kelompok / agen"],
        "booking_pool": ["WhatsApp", "Datang langsung"],
        "searched_info_pool": ["Jadwal ketersediaan", "Harga sewa", "Fasilitas lapangan", "Lokasi"],
        # PIECES base tendency: High friction, slow manual process, urgently needs system
        "pieces_base": {
            "P01": 1.9, "P02": 2.1, "P03": 4.5,  # Performance: Lama cari lapangan, sering terhambat chat WA
            "P04": 1.7, "P05": 2.7, "P06": 2.3, "P07": 1.6,  # Information: Jadwal susah dilihat, minim info mandiri
            "P08": 2.8, "P09": 2.4, "P10": 4.1,  # Economics: Biaya tambahan memberatkan, kurang transparan
            "P11": 2.4, "P12": 2.6, "P13": 2.1, "P14": 4.1,  # Control: Jadwal rawan bentrok, status booking tidak jelas
            "P15": 1.7, "P16": 1.9, "P17": 4.6,  # Efficiency: Langkah berbelit-belit, chat nanya berulang
            "P18": 2.0, "P19": 2.7, "P20": 2.2, "P21": 2.8   # Service: Admin slow response, pelayanan belum memuaskan
        }
    },
    {
        "name": "Young Professional (Pekerja Kantoran)",
        "weight": 0.35,
        "age_dist": [("23–29 tahun", 0.75), ("30–39 tahun", 0.25)],
        "frequency_dist": [("1–2 kali", 0.10), ("3–5 kali", 0.50), ("6–10 kali", 0.30), ("Lebih dari 10 kali", 0.10)],
        "need_dist": [("Kelompok", 0.70), ("Keduanya", 0.25), ("Pribadi", 0.05)],
        "compared_dist": [("Ya", 0.95), ("Tidak", 0.05)],
        "sports_pool": ["Badminton", "Futsal", "Tenis", "Basket"],
        "info_pool": ["Media sosial", "Aplikasi pencarian", "Rekomendasi teman atau keluarga"],
        "booking_pool": ["WhatsApp", "Telepon", "Datang langsung"],
        "searched_info_pool": ["Jadwal ketersediaan", "Harga sewa", "Lokasi", "Fasilitas lapangan"],
        "pieces_base": {
            "P01": 1.8, "P02": 2.0, "P03": 4.3,  # Performance: Butuh cepat di sela jam kerja, tapi admin slow
            "P04": 1.8, "P05": 2.8, "P06": 2.4, "P07": 1.5,  # Information: Sangat butuh info mandiri sebelum kontak
            "P08": 2.9, "P09": 2.5, "P10": 3.8,  # Economics
            "P11": 2.5, "P12": 2.7, "P13": 2.3, "P14": 3.7,  # Control
            "P15": 1.6, "P16": 1.8, "P17": 4.5,  # Efficiency: Ingin 1-2 klik seperti beli tiket bioskop
            "P18": 2.2, "P19": 2.8, "P20": 2.3, "P21": 2.9   # Service
        }
    },
    {
        "name": "Team Captain / Event Organizer",
        "weight": 0.15,
        "age_dist": [("23–29 tahun", 0.50), ("30–39 tahun", 0.40), ("40–49 tahun", 0.10)],
        "frequency_dist": [("6–10 kali", 0.30), ("Lebih dari 10 kali", 0.70)],
        "need_dist": [("Kelompok", 0.95), ("Keduanya", 0.05)],
        "compared_dist": [("Ya", 0.95), ("Tidak", 0.05)],
        "sports_pool": ["Futsal", "Sepak bola", "Basket"],
        "info_pool": ["Komunitas / kelompok / agen", "Media sosial", "Rekomendasi teman atau keluarga"],
        "booking_pool": ["WhatsApp", "Datang langsung", "Telepon"],
        "searched_info_pool": ["Jadwal ketersediaan", "Harga sewa", "Fasilitas lapangan", "Lokasi"],
        "pieces_base": {
            "P01": 1.6, "P02": 1.9, "P03": 4.7,  # Performance: Sangat sering mengalami keterlambatan & kendala
            "P04": 1.5, "P05": 2.5, "P06": 2.2, "P07": 1.4,  # Information: Paling merasa info jadwal sangat sulit
            "P08": 2.6, "P09": 2.3, "P10": 4.2,  # Economics: Biaya sewa mahal tapi pelayanan tidak sebanding
            "P11": 2.1, "P12": 2.4, "P13": 1.9, "P14": 4.4,  # Control: Paling sering kena jadwal bentrok / digeser
            "P15": 1.5, "P16": 1.7, "P17": 4.7,  # Efficiency: Harus berulang-ulang nego jam dengan admin
            "P18": 1.9, "P19": 2.5, "P20": 2.0, "P21": 2.6   # Service: Sangat butuh sistem pemesanan otomatis
        }
    },
    {
        "name": "Casual Weekend Renter",
        "weight": 0.10,
        "age_dist": [("18–22 tahun", 0.20), ("23–29 tahun", 0.30), ("30–39 tahun", 0.35), ("40–49 tahun", 0.15)],
        "frequency_dist": [("1–2 kali", 0.70), ("3–5 kali", 0.30)],
        "need_dist": [("Pribadi", 0.30), ("Kelompok", 0.50), ("Keduanya", 0.20)],
        "compared_dist": [("Ya", 0.85), ("Tidak", 0.15)],
        "sports_pool": ["Badminton", "Tenis", "Voli"],
        "info_pool": ["Rekomendasi teman atau keluarga", "Aplikasi pencarian", "Media sosial"],
        "booking_pool": ["WhatsApp", "Datang langsung", "Telepon"],
        "searched_info_pool": ["Jadwal ketersediaan", "Harga sewa", "Lokasi", "Fasilitas lapangan"],
        "pieces_base": {
            "P01": 2.1, "P02": 2.3, "P03": 4.0,  # Performance
            "P04": 1.9, "P05": 2.9, "P06": 2.5, "P07": 1.8,  # Information
            "P08": 3.0, "P09": 2.6, "P10": 3.6,  # Economics
            "P11": 2.6, "P12": 2.8, "P13": 2.4, "P14": 3.4,  # Control
            "P15": 1.9, "P16": 2.1, "P17": 4.2,  # Efficiency
            "P18": 2.3, "P19": 2.9, "P20": 2.4, "P21": 3.0   # Service
        }
    }
]

# Qualitative Open-Ended Response Pools (Indonesian natural text)
OBSTACLES_POOL = [
    "Admin lapangan slow response ketika dihubungi lewat WhatsApp, terutama di jam sibuk malam hari.",
    "Jadwal ketersediaan sering tidak akurat, pas ditanya katanya kosong tapi ternyata sudah dipesan tim lain.",
    "Harus menanyakan ketersediaan jam kosong ke beberapa pengelola lapangan satu per satu, sangat makan waktu.",
    "Pernah mengalami bentrok jadwal (double booking) karena pencatatan manual pengelola yang terlewat.",
    "Proses transfer uang muka dan pengiriman bukti pembayaran via chat lambat dikonfirmasi.",
    "Informasi foto kondisi lapangan dan fasilitas seperti toilet/kamar ganti kurang jelas di media sosial.",
    "Tidak ada kepastian slot jam kosong secara langsung tanpa menunggu balasan chat dari pengelola.",
    "Tarif sewa terkadang ada biaya tambahan lampu atau sewa bola yang baru diinfokan belakangan.",
    "Kesulitan mencari alternatif lapangan olahraga terdekat saat lapangan langganan sudah penuh.",
    "Sering harus mengulang chat menanyakan ulang jam yang tersedia jika jam pertama sudah terisi."
]

CRUCIAL_INFO_POOL = [
    "Jadwal ketersediaan slot lapangan yang akurat dan real-time per jam.",
    "Rincian harga sewa yang transparan antara tarif siang, malam, dan akhir pekan.",
    "Foto riil kondisi lapangan, jenis lantai (vinyl/interlock/rumput), dan pencahayaan.",
    "Fasilitas pendukung seperti tempat parkir, kamar ganti, toilet, dan kantin.",
    "Lokasi akurat yang terhubung dengan Google Maps serta nomor kontak aktif pengelola.",
    "Kebijakan pembatalan, rescheduling, dan sistem pembayaran DP/pelunasan.",
    "Review dan penilaian rating dari pengguna atau penyewa sebelumnya."
]

EXPECTATIONS_POOL = [
    "Adanya platform aplikasi booking online langsung seperti reservasi bioskop atau hotel yang menampilkan jadwal kosong real-time.",
    "Sistem pembayaran digital otomatis (QRIS / Virtual Account) tanpa perlu kirim struk transfer manual.",
    "Notifikasi konfirmasi pemesanan dan pengingat jadwal yang dikirim otomatis via sistem.",
    "Katalog visual lapangan dengan foto terbaru dan filter pencarian berdasarkan jenis olahraga dan lokasi terdekat.",
    "Pencegahan jadwal ganda atau double-booking dengan sistem kunci jadwal otomatis.",
    "Kemudahan membatalkan atau mengubah jadwal booking secara mandiri melalui aplikasi."
]

# ==============================================================================
# DATA GENERATOR HELPER
# ==============================================================================

def weighted_choice(items_weights: List[tuple]) -> Any:
    """Selects an item based on its assigned probability weight."""
    items, weights = zip(*items_weights)
    return random.choices(items, weights=weights, k=1)[0]


def generate_likert_score(base_mean: float) -> int:
    """
    Generates a realistic integer Likert score (1-5) centered around base_mean
    with a Gaussian distribution (standard deviation ~ 0.75).
    """
    val = round(random.gauss(base_mean, 0.72))
    return max(1, min(5, val))


def generate_single_response(response_id: int, fill_open_ended: bool = False) -> Dict[str, Any]:
    """Generates a complete, realistic respondent survey record."""
    # Pick a persona based on population weights
    p_weights = [p["weight"] for p in PERSONAS]
    persona = random.choices(PERSONAS, weights=p_weights, k=1)[0]

    # Demographic & basic fields
    age = weighted_choice(persona["age_dist"])
    frequency = weighted_choice(persona["frequency_dist"])
    need = weighted_choice(persona["need_dist"])
    compared = weighted_choice(persona["compared_dist"])

    # Multi-select options with natural selection count (1 to 3 items)
    sports_count = random.choices([1, 2, 3], weights=[0.45, 0.40, 0.15], k=1)[0]
    sports = random.sample(persona["sports_pool"], min(sports_count, len(persona["sports_pool"])))

    info_count = random.choices([1, 2, 3], weights=[0.40, 0.45, 0.15], k=1)[0]
    info_sources = random.sample(persona["info_pool"], min(info_count, len(persona["info_pool"])))

    booking_count = random.choices([1, 2], weights=[0.70, 0.30], k=1)[0]
    booking_methods = random.sample(persona["booking_pool"], min(booking_count, len(persona["booking_pool"])))

    searched_count = random.choices([2, 3, 4], weights=[0.30, 0.50, 0.20], k=1)[0]
    searched_info = random.sample(persona["searched_info_pool"], min(searched_count, len(persona["searched_info_pool"])))

    # PIECES scores (P01 through P21)
    pieces_scores = {}
    for code, base in persona["pieces_base"].items():
        pieces_scores[code] = generate_likert_score(base)

    # Open-ended responses (skipped by default as requested)
    q_obs = ""
    q_info = ""
    q_exp = ""
    if fill_open_ended:
        q_obs = random.choice(OBSTACLES_POOL) if random.random() > 0.15 else ""
        q_info = random.choice(CRUCIAL_INFO_POOL) if random.random() > 0.15 else ""
        q_exp = random.choice(EXPECTATIONS_POOL) if random.random() > 0.15 else ""

    record = {
        "id": response_id,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "persona": persona["name"],
        "consent": "Ya, saya bersedia",
        "rented_last_12m": "Ya",
        "compared_fields": compared,
        "rental_need": need,
        "age": age,
        "frequency": frequency,
        "sports": sports,
        "info_sources": info_sources,
        "booking_methods": booking_methods,
        "searched_info": searched_info,
        **pieces_scores,
        "q_obstacles": q_obs,
        "q_crucial_info": q_info,
        "q_expectations": q_exp
    }
    return record


# ==============================================================================
# FAST SUBMISSION ENGINE (HTTP POST)
# ==============================================================================

def submit_fast(record: Dict[str, Any]) -> bool:
    """Submits a survey response directly to Google Forms via HTTP POST."""
    import urllib.request
    import urllib.parse

    params = [
        (ENTRY_MAP["consent"], record["consent"]),
        (ENTRY_MAP["rented_last_12m"], record["rented_last_12m"]),
        (ENTRY_MAP["compared_fields"], record["compared_fields"]),
        (ENTRY_MAP["rental_need"], record["rental_need"]),
        (ENTRY_MAP["age"], record["age"]),
        (ENTRY_MAP["frequency"], record["frequency"]),
    ]

    # Multi-select entries
    for s in record["sports"]:
        params.append((ENTRY_MAP["sports"], s))
    for src in record["info_sources"]:
        params.append((ENTRY_MAP["info_sources"], src))
    for bm in record["booking_methods"]:
        params.append((ENTRY_MAP["booking_methods"], bm))
    for si in record["searched_info"]:
        params.append((ENTRY_MAP["searched_info"], si))

    # PIECES scores
    for i in range(1, 22):
        code = f"P{i:02d}"
        params.append((ENTRY_MAP[code], str(record[code])))

    # Open-ended responses
    if record["q_obstacles"]:
        params.append((ENTRY_MAP["q_obstacles"], record["q_obstacles"]))
    if record["q_crucial_info"]:
        params.append((ENTRY_MAP["q_crucial_info"], record["q_crucial_info"]))
    if record["q_expectations"]:
        params.append((ENTRY_MAP["q_expectations"], record["q_expectations"]))

    encoded_data = urllib.parse.urlencode(params).encode("utf-8")
    req = urllib.request.Request(
        POST_URL,
        data=encoded_data,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.status == 200
    except Exception as e:
        print(f"  [!] HTTP POST Error: {e}", file=sys.stderr)
        return False


# ==============================================================================
# SELENIUM AUTOMATION ENGINE
# ==============================================================================

def init_selenium_driver(browser_name: str = "edge", headless: bool = True):
    """Initializes and configures the Selenium WebDriver."""
    from selenium import webdriver

    browser = browser_name.lower()
    driver = None

    if browser == "edge":
        from selenium.webdriver.edge.options import Options as EdgeOptions
        options = EdgeOptions()
        if headless:
            options.add_argument("--headless=new")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1280,960")
        options.add_argument("--log-level=3")

        edge_binary = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
        if os.path.exists(edge_binary):
            options.binary_location = edge_binary

        driver = webdriver.Edge(options=options)

    elif browser in ["chrome", "brave"]:
        from selenium.webdriver.chrome.options import Options as ChromeOptions
        options = ChromeOptions()
        if headless:
            options.add_argument("--headless=new")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1280,960")
        options.add_argument("--log-level=3")

        brave_path = r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
        if os.path.exists(brave_path):
            options.binary_location = brave_path

        driver = webdriver.Chrome(options=options)
    else:
        raise ValueError(f"Unsupported browser: {browser_name}. Use 'edge' or 'chrome'.")

    return driver


def submit_selenium(driver, record: Dict[str, Any], delay: float = 0.8, fill_open_ended: bool = False, interactive: bool = False) -> bool:
    """Automates filling and submitting the 5-page Google Form using Selenium."""
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC

    def click_next_button():
        time.sleep(delay)
        btn = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((
                By.XPATH,
                "//div[@role='button']//span[contains(text(), 'Berikutnya') or contains(text(), 'Next')]"
            ))
        )
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn)
        time.sleep(0.3)
        btn.click()
        time.sleep(delay + 0.5)

    try:
        # Load the form
        driver.get(FORM_URL)
        time.sleep(delay + 1.0)

        # -------------------------------------------------------------
        # PAGE 1: INFORMED CONSENT
        # -------------------------------------------------------------
        consent_radio = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[@role='radio'][@data-value='Ya, saya bersedia']"))
        )
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", consent_radio)
        time.sleep(0.2)
        consent_radio.click()
        click_next_button()

        # -------------------------------------------------------------
        # PAGE 2: SCREENING QUESTIONS
        # -------------------------------------------------------------
        screening_items = [
            ("12 bulan", record["rented_last_12m"]),
            ("membandingkan", record["compared_fields"]),
            ("kebutuhan", record["rental_need"])
        ]
        for q_keyword, val in screening_items:
            q_elem = driver.find_element(By.XPATH, f"//div[@role='listitem' and contains(., '{q_keyword}')]")
            r = q_elem.find_element(By.XPATH, f".//div[@role='radio'][@data-value='{val}']")
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", r)
            time.sleep(0.15)
            r.click()
        click_next_button()

        # -------------------------------------------------------------
        # PAGE 3: DEMOGRAPHICS & HABITS
        # -------------------------------------------------------------
        # Age radio
        q_age = driver.find_element(By.XPATH, "//div[@role='listitem' and contains(., 'rentang usia')]")
        r_age = q_age.find_element(By.XPATH, f".//div[@role='radio'][@data-value='{record['age']}']")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", r_age)
        time.sleep(0.15)
        r_age.click()

        # Frequency radio
        q_freq = driver.find_element(By.XPATH, "//div[@role='listitem' and contains(., 'Berapa kali')]")
        r_freq = q_freq.find_element(By.XPATH, f".//div[@role='radio'][@data-value='{record['frequency']}']")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", r_freq)
        time.sleep(0.15)
        r_freq.click()

        # Multi-select Checkboxes
        checkbox_mappings = [
            ("Jenis olahraga", record["sports"]),
            ("memperoleh informasi", record["info_sources"]),
            ("melakukan pemesanan", record["booking_methods"]),
            ("Informasi apa yang biasanya Anda cari", record["searched_info"])
        ]
        for q_keyword, choices in checkbox_mappings:
            q_elem = driver.find_element(By.XPATH, f"//div[@role='listitem' and contains(., '{q_keyword}')]")
            for c in choices:
                cb = q_elem.find_element(By.XPATH, f".//div[@role='checkbox'][contains(@aria-label, '{c}') or contains(., '{c}')]")
                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", cb)
                time.sleep(0.15)
                cb.click()

        click_next_button()

        # -------------------------------------------------------------
        # PAGE 4: PIECES FRAMEWORK (21 LIKERT QUESTIONS)
        # -------------------------------------------------------------
        q_items = driver.find_elements(By.XPATH, "//div[@role='listitem']")
        p_index = 1
        for item in q_items:
            radios = item.find_elements(By.XPATH, ".//div[@role='radio']")
            if len(radios) >= 5:
                code = f"P{p_index:02d}"
                target_score = record.get(code, 3)  # 1 to 5
                # Click target score radio (index is score - 1)
                target_radio = radios[target_score - 1]
                driver.execute_script("arguments[0].click();", target_radio)
                p_index += 1

        click_next_button()

        # -------------------------------------------------------------
        # PAGE 5: SUBMISSION & OPTIONAL OPEN-ENDED QUESTIONS
        # -------------------------------------------------------------
        text_areas = driver.find_elements(By.XPATH, "//textarea | //input[@type='text']")
        if interactive:
            print("\n" + "=" * 70)
            print(" [HALAMAN 5: INPUT PERTANYAAN TERBUKA DARI TERMINAL]")
            print(" Masukkan jawaban Anda di bawah ini (atau tekan Enter untuk melewati):")
            print("-" * 70)
            prompts = [
                "1. Kendala apa yang paling sering Anda alami dalam proses penyewaan lapangan?",
                "2. Menurut Anda, informasi apa yang paling penting untuk tersedia sebelum memutuskan menyewa?",
                "3. Apa yang Anda harapkan agar proses penyewaan menjadi lebih mudah dan memuaskan?"
            ]
            ans_list = []
            for i, p in enumerate(prompts):
                print(f"\n{p}")
                ans = input(" Jawaban Anda: ").strip()
                ans_list.append(ans)
                if i < len(text_areas) and ans:
                    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", text_areas[i])
                    time.sleep(0.15)
                    text_areas[i].click()
                    text_areas[i].clear()
                    text_areas[i].send_keys(ans)
                    time.sleep(0.15)

            record["q_obstacles"] = ans_list[0]
            record["q_crucial_info"] = ans_list[1]
            record["q_expectations"] = ans_list[2]

        elif fill_open_ended:
            q_texts = [record["q_obstacles"], record["q_crucial_info"], record["q_expectations"]]
            for ta, text in zip(text_areas, q_texts):
                if text:
                    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", ta)
                    time.sleep(0.1)
                    ta.send_keys(text)
                    time.sleep(0.15)
        else:
            time.sleep(0.3)

        # Submit button
        submit_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((
                By.XPATH,
                "//div[@role='button']//span[contains(text(), 'Kirim') or contains(text(), 'Submit')]"
            ))
        )
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", submit_btn)
        time.sleep(0.3)
        submit_btn.click()

        # Wait for confirmation screen
        time.sleep(2.5)
        body_text = driver.find_element(By.TAG_NAME, "body").text
        success = ("Tanggapan Anda telah dicatat" in body_text or
                   "Terima kasih" in body_text or
                   "formResponse" in driver.current_url)
        return success

    except Exception as e:
        print(f"  [!] Selenium Error: {e}", file=sys.stderr)
        return False


# ==============================================================================
# CSV EXPORTER
# ==============================================================================

def export_records_to_csv(records: List[Dict[str, Any]], filepath: str):
    """Exports generated respondent survey data to a tidy CSV file for visualization."""
    if not records:
        return

    # Flatten multi-select lists into semicolon-separated strings for CSV
    headers = [
        "id", "timestamp", "persona", "consent", "rented_last_12m", "compared_fields",
        "rental_need", "age", "frequency", "sports", "info_sources", "booking_methods",
        "searched_info"
    ]
    for i in range(1, 22):
        headers.append(f"P{i:02d}")
    headers.extend(["q_obstacles", "q_crucial_info", "q_expectations"])

    with open(filepath, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for r in records:
            row = [
                r["id"],
                r["timestamp"],
                r["persona"],
                r["consent"],
                r["rented_last_12m"],
                r["compared_fields"],
                r["rental_need"],
                r["age"],
                r["frequency"],
                "; ".join(r["sports"]) if isinstance(r["sports"], list) else r["sports"],
                "; ".join(r["info_sources"]) if isinstance(r["info_sources"], list) else r["info_sources"],
                "; ".join(r["booking_methods"]) if isinstance(r["booking_methods"], list) else r["booking_methods"],
                "; ".join(r["searched_info"]) if isinstance(r["searched_info"], list) else r["searched_info"]
            ]
            for i in range(1, 22):
                row.append(r[f"P{i:02d}"])
            row.extend([r["q_obstacles"], r["q_crucial_info"], r["q_expectations"]])
            writer.writerow(row)


# ==============================================================================
# MAIN CLI ENTRYPOINT
# ==============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Automate realistic dummy data generation and submission for the FieldMax sports field rental Google Form.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Fill 1 form using Selenium (visible browser window):
  python fill_form_selenium.py --count 1 --no-headless

  # Fill 5 forms using Selenium headless:
  python fill_form_selenium.py --count 5 --headless

  # Generate 50 realistic responses instantly via fast HTTP POST:
  python fill_form_selenium.py --count 50 --mode fast --output survey_50_responses.csv
        """
    )
    parser.add_argument("--count", type=int, default=1, help="Number of responses to submit (default: 1)")
    parser.add_argument("--mode", choices=["selenium", "fast"], default="selenium",
                        help="Execution mode: 'selenium' for browser automation, 'fast' for high-speed direct POST (default: selenium)")
    parser.add_argument("--browser", choices=["edge", "chrome", "brave"], default="edge",
                        help="Browser for Selenium automation (default: edge)")
    parser.add_argument("--headless", action="store_true", default=False,
                        help="Run browser in headless mode without UI window")
    parser.add_argument("--no-headless", action="store_false", dest="headless",
                        help="Display actual browser window during automation")
    parser.add_argument("--delay", type=float, default=0.8,
                        help="Delay in seconds between page actions for natural execution (default: 0.8)")
    parser.add_argument("--output", type=str, default="survey_dummy_data.csv",
                        help="CSV filename to save generated responses for visual analysis (default: survey_dummy_data.csv)")
    parser.add_argument("--fill-open-ended", action="store_true", default=False,
                        help="Fill the optional open-ended questions on Page 5 with canned answers (default: False/skipped)")
    parser.add_argument("--interactive", action="store_true", default=False,
                        help="Interactive mode: prompt terminal for answers to the open-ended questions on Page 5")

    args = parser.parse_args()

    # If interactive mode is chosen, force non-headless unless explicitly requested
    if args.interactive and "--headless" not in sys.argv:
        args.headless = False

    print("=" * 70)
    print(" [FIELDMAX] Google Form - Realistic Survey Data Automator")
    print("=" * 70)
    print(f" Target Form : {FORM_URL}")
    print(f" Total Count : {args.count}")
    print(f" Mode        : {args.mode.upper()}")
    if args.mode == "selenium":
        print(f" Browser     : {args.browser.capitalize()} (Headless: {args.headless})")
        print(f" Step Delay  : {args.delay}s")
        print(f" Interactive : {args.interactive}")
    print(f" Open-Ended  : {'Interactive Terminal' if args.interactive else ('Filled' if args.fill_open_ended else 'Skipped (default)')}")
    print(f" Output CSV  : {args.output}")
    print("-" * 70)

    records: List[Dict[str, Any]] = []
    success_count = 0
    driver = None

    if args.mode == "selenium":
        print(">> Launching WebDriver...")
        try:
            driver = init_selenium_driver(args.browser, headless=args.headless)
        except Exception as e:
            print(f"[!] Error initializing {args.browser} driver: {e}", file=sys.stderr)
            sys.exit(1)

    try:
        for idx in range(1, args.count + 1):
            record = generate_single_response(idx, fill_open_ended=args.fill_open_ended)
            records.append(record)

            print(f"\n[{idx}/{args.count}] Submitting response for Persona: '{record['persona']}'")
            print(f"       Demographic : Usia: {record['age']} | Frekuensi: {record['frequency']}")
            print(f"       Olahraga    : {', '.join(record['sports'])}")
            print(f"       PIECES Mean : {sum(record[f'P{i:02d}'] for i in range(1, 22)) / 21.0:.2f} / 5.0")

            if args.mode == "selenium":
                ok = submit_selenium(
                    driver,
                    record,
                    delay=args.delay,
                    fill_open_ended=args.fill_open_ended,
                    interactive=args.interactive
                )
            else:
                ok = submit_fast(record)

            if ok:
                success_count += 1
                print(f"       Status      : [SUCCESS] Response successfully recorded!")
            else:
                print(f"       Status      : [FAILED] Submission error encountered.")

            # Politeness delay between batch submissions
            if idx < args.count:
                sleep_time = random.uniform(0.5, 1.2) if args.mode == "fast" else random.uniform(1.0, 2.0)
                time.sleep(sleep_time)

    finally:
        if driver:
            print("\n>> Closing WebDriver...")
            driver.quit()

    # Save data to CSV for immediate visualization
    export_records_to_csv(records, args.output)
    print("\n" + "=" * 70)
    print(f" [DONE] Completed {success_count}/{args.count} submissions successfully!")
    print(f" [DATA] Visual Data Exported to: {os.path.abspath(args.output)}")
    print("=" * 70)


if __name__ == "__main__":
    main()
