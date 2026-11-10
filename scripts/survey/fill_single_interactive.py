#!/usr/bin/env python3
"""
FieldMax - Interactive Single Survey Automator with Terminal Input
Target Form: https://forms.gle/tXJt76dSAVpehgKP9
Title: Kuesioner Pengalaman Penyewa dalam Proses Penyewaan Lapangan Olahraga

Features:
- Automatically fills Pages 1 - 4 with realistic, calibrated survey data demonstrating
  the difficulty and friction of manual booking (need for FieldMax system).
- Pauses at Page 5 (Pertanyaan Terbuka) and prompts you interactively in the terminal.
- Allows typing custom answers or selecting quick suggestions for:
  1. Kendala paling sering dialami saat sewa lapangan.
  2. Informasi paling krusial sebelum memutuskan menyewa.
  3. Harapan agar proses sewa menjadi lebih mudah & efisien.
- Types your inputs into the browser in real time and submits upon confirmation.
- Appends the completed response to survey_dummy_data.csv.
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

FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSciW5wzsHfekSu_PKKlfiIx3TO0wKhY4daNoO2Z96bUQfoe_g/viewform"

# Sample realistic suggestions demonstrating difficulty/need for system
SUGGESTIONS_Q1 = [
    "Admin lapangan slow response ketika dihubungi via WhatsApp, apalagi di jam malam.",
    "Jadwal ketersediaan sering tidak akurat dan pernah bentrok (double booking) karena pencatatan manual.",
    "Harus menanyakan ketersediaan jam kosong satu per satu ke banyak pengelola, sangat memakan waktu.",
    "Bukti transfer uang muka (DP) lambat dikonfirmasi oleh pengelola.",
    "Tidak ada sistem live yang memperlihatkan sisa slot jam lapangan yang masih kosong."
]

SUGGESTIONS_Q2 = [
    "Jadwal ketersediaan slot lapangan yang akurat dan real-time per jam.",
    "Transparansi rincian harga sewa (tarif pagi, malam, weekday vs weekend).",
    "Foto riil kondisi lapangan dan kelengkapan fasilitas (toilet, parkir, kamar ganti).",
    "Lokasi akurat yang terhubung dengan maps dan kontak aktif pengelola.",
    "Kebijakan pembatalan / reschedule dan metode pembayaran yang jelas."
]

SUGGESTIONS_Q3 = [
    "Adanya platform aplikasi booking online mandiri dengan jadwal real-time seperti pesan tiket bioskop.",
    "Sistem pembayaran otomatis menggunakan QRIS / Virtual Account tanpa harus kirim bukti transfer manual.",
    "Konfirmasi booking dan tiket reservasi instan yang dikirim langsung ke sistem/email/WhatsApp.",
    "Pencegahan bentrok jadwal otomatis dengan penguncian slot yang sedang dipesan.",
    "Kemudahan membandingkan harga dan lokasi beberapa lapangan olahraga terdekat dalam satu aplikasi."
]

# Calibrated persona demonstrating high friction in current manual process
PERSONA = {
    "name": "Penyewa Lapangan Aktif (Butuh Sistem Baru)",
    "age": "23–29 tahun",
    "frequency": "6–10 kali",
    "need": "Kelompok",
    "compared": "Ya",
    "sports": ["Futsal", "Badminton"],
    "info_sources": ["Media sosial", "Rekomendasi teman atau keluarga"],
    "booking_methods": ["WhatsApp", "Datang langsung"],
    "searched_info": ["Jadwal ketersediaan", "Harga sewa", "Fasilitas lapangan", "Lokasi"],
    # PIECES base values showing clear pain points
    "pieces_base": {
        "P01": 1.8, "P02": 2.0, "P03": 4.5,  # Performance: Lama cari lapangan, sering terhambat
        "P04": 1.7, "P05": 2.7, "P06": 2.3, "P07": 1.6,  # Information: Info jadwal susah didapat mandiri
        "P08": 2.8, "P09": 2.4, "P10": 4.1,  # Economics: Biaya tambahan memberatkan
        "P11": 2.3, "P12": 2.5, "P13": 2.0, "P14": 4.2,  # Control: Rawan bentrok, status tak pasti
        "P15": 1.7, "P16": 1.9, "P17": 4.6,  # Efficiency: Langkah berulang chat WA
        "P18": 2.0, "P19": 2.7, "P20": 2.2, "P21": 2.8   # Service: Pelayanan manual kurang memuaskan
    }
}


def generate_likert_score(base_mean: float) -> int:
    val = round(random.gauss(base_mean, 0.70))
    return max(1, min(5, val))


def init_driver(browser_name: str = "edge", headless: bool = False):
    from selenium import webdriver

    browser = browser_name.lower()
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

        return webdriver.Edge(options=options)
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

        return webdriver.Chrome(options=options)
    else:
        raise ValueError(f"Browser '{browser_name}' tidak didukung. Gunakan 'edge' atau 'chrome'.")


def prompt_question(q_num: int, title: str, suggestions: List[str]) -> str:
    print("\n" + "=" * 70)
    print(f" [PERTANYAAN {q_num}/3]")
    print(f" {title}")
    print("=" * 70)
    print(" Rekomendasi Jawaban Cepat:")
    for i, s in enumerate(suggestions, 1):
        print(f"   [{i}] {s}")
    print("   [0] Kosongkan / Lewati")
    print("-" * 70)

    try:
        user_input = input(" Ketik nomor rekomendasi [1-5], teks jawaban sendiri, atau Enter: ").strip()
    except (KeyboardInterrupt, EOFError):
        print("\n[!] Dibatalkan oleh pengguna.")
        sys.exit(0)

    if not user_input or user_input == "0":
        return ""
    if user_input in ["1", "2", "3", "4", "5"]:
        idx = int(user_input) - 1
        selected = suggestions[idx]
        print(f" -> Dipilih: \"{selected}\"")
        return selected

    print(f" -> Jawaban kustom: \"{user_input}\"")
    return user_input


def append_to_csv(record: Dict[str, Any], filepath: str = "survey_dummy_data.csv"):
    file_exists = os.path.exists(filepath)
    headers = [
        "id", "timestamp", "persona", "consent", "rented_last_12m", "compared_fields",
        "rental_need", "age", "frequency", "sports", "info_sources", "booking_methods",
        "searched_info"
    ]
    for i in range(1, 22):
        headers.append(f"P{i:02d}")
    headers.extend(["q_obstacles", "q_crucial_info", "q_expectations"])

    # Determine ID
    row_id = 1
    if file_exists:
        try:
            with open(filepath, "r", encoding="utf-8-sig") as f:
                reader = csv.reader(f)
                lines = list(reader)
                if len(lines) > 1:
                    row_id = len(lines)
        except Exception:
            pass

    row = [
        row_id,
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        record["persona"],
        record["consent"],
        record["rented_last_12m"],
        record["compared_fields"],
        record["rental_need"],
        record["age"],
        record["frequency"],
        "; ".join(record["sports"]),
        "; ".join(record["info_sources"]),
        "; ".join(record["booking_methods"]),
        "; ".join(record["searched_info"])
    ]
    for i in range(1, 22):
        row.append(record[f"P{i:02d}"])
    row.extend([record["q_obstacles"], record["q_crucial_info"], record["q_expectations"]])

    with open(filepath, "a", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(headers)
        writer.writerow(row)
    print(f" [CSV] Data tersimpan ke: {os.path.abspath(filepath)}")


def main():
    parser = argparse.ArgumentParser(description="Isi Google Form interaktif dengan input pertanyaan terbuka dari terminal.")
    parser.add_argument("--browser", choices=["edge", "chrome", "brave"], default="edge", help="Pilihan browser (default: edge)")
    parser.add_argument("--headless", action="store_true", default=False, help="Jalankan browser di latar belakang tanpa jendela")
    parser.add_argument("--output", type=str, default="survey_dummy_data.csv", help="File CSV output")
    args = parser.parse_args()

    print("=" * 70)
    print(" 🏟️  FIELDMAX - PENGISIAN FORM INTERAKTIF DENGAN INPUT TERMINAL")
    print("=" * 70)
    print(" • Halaman 1 - 4 akan diisi otomatis dengan data realistis terkalibrasi.")
    print(" • Halaman 5 (Pertanyaan Terbuka) akan meminta input dari Anda di terminal.")
    print(f" • Browser : {args.browser.capitalize()} ({'Headless' if args.headless else 'Jendela Terbuka'})")
    print("-" * 70)

    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC

    print(">> Menjalankan browser...")
    driver = init_driver(args.browser, headless=args.headless)
    wait = WebDriverWait(driver, 15)

    def click_next():
        time.sleep(0.6)
        btn = wait.until(EC.element_to_be_clickable((
            By.XPATH,
            "//div[@role='button']//span[contains(text(), 'Berikutnya') or contains(text(), 'Next')]"
        )))
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn)
        time.sleep(0.3)
        btn.click()
        time.sleep(1.2)

    try:
        print(f">> Mengakses Google Form: {FORM_URL}")
        driver.get(FORM_URL)
        time.sleep(1.5)

        # ----------------------------------------------------------------------
        # HALAMAN 1: PERSETUJUAN
        # ----------------------------------------------------------------------
        print(">> [1/5] Mengisi Halaman 1: Persetujuan Partisipasi...")
        consent = wait.until(EC.element_to_be_clickable((By.XPATH, "//div[@role='radio'][@data-value='Ya, saya bersedia']")))
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", consent)
        time.sleep(0.2)
        consent.click()
        click_next()

        # ----------------------------------------------------------------------
        # HALAMAN 2: PENYARINGAN
        # ----------------------------------------------------------------------
        print(">> [2/5] Mengisi Halaman 2: Pertanyaan Penyaringan...")
        screening = [("12 bulan", "Ya"), ("membandingkan", "Ya"), ("kebutuhan", PERSONA["need"])]
        for kw, val in screening:
            q_elem = driver.find_element(By.XPATH, f"//div[@role='listitem' and contains(., '{kw}')]")
            r = q_elem.find_element(By.XPATH, f".//div[@role='radio'][@data-value='{val}']")
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", r)
            time.sleep(0.15)
            r.click()
        click_next()

        # ----------------------------------------------------------------------
        # HALAMAN 3: PROFIL & PENGALAMAN
        # ----------------------------------------------------------------------
        print(">> [3/5] Mengisi Halaman 3: Profil & Pengalaman Responden...")
        # Usia
        q_age = driver.find_element(By.XPATH, "//div[@role='listitem' and contains(., 'rentang usia')]")
        r_age = q_age.find_element(By.XPATH, f".//div[@role='radio'][contains(@data-value, '23')]")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", r_age)
        time.sleep(0.15)
        r_age.click()

        # Frekuensi
        q_freq = driver.find_element(By.XPATH, "//div[@role='listitem' and contains(., 'Berapa kali')]")
        r_freq = q_freq.find_element(By.XPATH, f".//div[@role='radio'][contains(@data-value, '6–10')]")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", r_freq)
        time.sleep(0.15)
        r_freq.click()

        # Multi-select Checkboxes
        mappings = [
            ("Jenis olahraga", PERSONA["sports"]),
            ("memperoleh informasi", PERSONA["info_sources"]),
            ("melakukan pemesanan", PERSONA["booking_methods"]),
            ("Informasi apa yang biasanya Anda cari", PERSONA["searched_info"])
        ]
        for kw, choices in mappings:
            q_elem = driver.find_element(By.XPATH, f"//div[@role='listitem' and contains(., '{kw}')]")
            for c in choices:
                cb = q_elem.find_element(By.XPATH, f".//div[@role='checkbox'][contains(@aria-label, '{c}') or contains(., '{c}')]")
                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", cb)
                time.sleep(0.15)
                cb.click()
        click_next()

        # ----------------------------------------------------------------------
        # HALAMAN 4: KERANGKA PIECES (21 BUTIR LIKERT)
        # ----------------------------------------------------------------------
        print(">> [4/5] Mengisi Halaman 4: Penilaian PIECES (Terkalibrasi Kebutuhan Sistem)...")
        q_items = driver.find_elements(By.XPATH, "//div[@role='listitem']")
        pieces_scores = {}
        p_idx = 1
        for item in q_items:
            radios = item.find_elements(By.XPATH, ".//div[@role='radio']")
            if len(radios) >= 5:
                code = f"P{p_idx:02d}"
                base = PERSONA["pieces_base"][code]
                score = generate_likert_score(base)
                pieces_scores[code] = score
                target_radio = radios[score - 1]
                driver.execute_script("arguments[0].click();", target_radio)
                p_idx += 1
        click_next()

        # ----------------------------------------------------------------------
        # HALAMAN 5: PERTANYAAN TERBUKA (TERMINAL INTERACTIVE INPUT)
        # ----------------------------------------------------------------------
        print(">> [5/5] Sampai di Halaman 5 (Pertanyaan Terbuka).")
        text_areas = wait.until(lambda d: d.find_elements(By.XPATH, "//textarea | //input[@type='text']"))

        ans_q1 = prompt_question(
            1,
            "Kendala apa yang paling sering Anda alami dalam proses penyewaan lapangan olahraga?",
            SUGGESTIONS_Q1
        )
        ans_q2 = prompt_question(
            2,
            "Menurut Anda, informasi apa yang paling penting untuk tersedia sebelum Anda memutuskan menyewa lapangan?",
            SUGGESTIONS_Q2
        )
        ans_q3 = prompt_question(
            3,
            "Apa yang Anda harapkan agar proses penyewaan lapangan olahraga menjadi lebih mudah, jelas, dan memuaskan?",
            SUGGESTIONS_Q3
        )

        user_answers = [ans_q1, ans_q2, ans_q3]

        # Type answers into form textareas
        print("\n>> Memasukkan teks jawaban Anda ke dalam browser formulir...")
        for ta, ans in zip(text_areas, user_answers):
            if ans:
                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", ta)
                time.sleep(0.2)
                ta.click()
                time.sleep(0.1)
                ta.clear()
                ta.send_keys(ans)
                time.sleep(0.2)

        # Confirm submission
        print("-" * 70)
        confirm = input(" Siap mengirimkan formulir? [Y/n]: ").strip().lower()
        if confirm in ["n", "no", "tidak"]:
            print("[!] Pengiriman dibatalkan. Browser tetap terbuka.")
            input(" Tekan Enter untuk menutup browser...")
            return

        print(">> Mengirimkan tanggapan (klik Submit)...")
        submit_btn = wait.until(EC.element_to_be_clickable((
            By.XPATH,
            "//div[@role='button']//span[contains(text(), 'Kirim') or contains(text(), 'Submit')]"
        )))
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", submit_btn)
        time.sleep(0.3)
        submit_btn.click()

        time.sleep(3.0)
        body_text = driver.find_element(By.TAG_NAME, "body").text
        if ("Tanggapan Anda telah dicatat" in body_text or
                "Terima kasih" in body_text or
                "formResponse" in driver.current_url):
            print("\n" + "=" * 70)
            print(" 🎉 BERHASIL! Formulir berhasil dikirim ke Google Form.")
            print("=" * 70)

            # Record details
            record = {
                "persona": PERSONA["name"],
                "consent": "Ya, saya bersedia",
                "rented_last_12m": "Ya",
                "compared_fields": PERSONA["compared"],
                "rental_need": PERSONA["need"],
                "age": PERSONA["age"],
                "frequency": PERSONA["frequency"],
                "sports": PERSONA["sports"],
                "info_sources": PERSONA["info_sources"],
                "booking_methods": PERSONA["booking_methods"],
                "searched_info": PERSONA["searched_info"],
                **pieces_scores,
                "q_obstacles": ans_q1,
                "q_crucial_info": ans_q2,
                "q_expectations": ans_q3
            }
            append_to_csv(record, args.output)
        else:
            print("[!] Tanggapan terkirim namun layar konfirmasi tidak terdeteksi.")

    except Exception as e:
        print(f"\n[!] Terjadi kesalahan selama eksekusi: {e}", file=sys.stderr)
    finally:
        print(">> Menutup WebDriver...")
        try:
            driver.quit()
        except Exception:
            pass


if __name__ == "__main__":
    main()
