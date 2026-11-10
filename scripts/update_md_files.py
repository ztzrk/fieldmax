import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# -------------------------------------------------------------------------
# 1. UPDATE 07 - BAB II - Metode Penelitian.md (Subbab 2.9)
# -------------------------------------------------------------------------
subbab_29_md = """## 2.9 Metode Pengujian Sistem: Evaluasi Skema Pencegahan Bentrok Jadwal (Black Box Testing) ^metode-pengujian-sistem

Pengujian perangkat lunak merupakan tahapan krusial dalam siklus rekayasa perangkat lunak dan kerangka kerja *Design Science Research* guna mengevaluasi kualitas, keandalan, serta kesesuaian fungsional artefak yang dibangun (Pressman, 2010). Pada penelitian ini, pengujian sistem informasi FieldMax secara spesifik difokuskan pada pembuktian empiris keandalan skema komputasi pencegahan bentrok jadwal sewa (*double booking prevention schema*), yang menjadi rumusan masalah utama penelitian. Pengujian ini dieksekusi menggunakan metode *Black Box Testing* (pengujian kotak hitam), yaitu pendekatan evaluasi yang menguji respon fungsional dan keluaran sistem melalui antarmuka pengguna serta interaksi *Application Programming Interface* (API) backend tanpa memeriksa struktur internal kode program (Shadiq et al., 2021).

Perancangan skenario kasus uji (*test cases*) dirancang secara terstruktur menggunakan kombinasi teknik *Equivalence Partitioning* dan *Boundary Value Analysis* (analisis nilai batas). Teknik ini memetakan seluruh variasi kondisi irisan rentang waktu antara reservasi baru yang diajukan dengan jadwal yang telah tersimpan di basis data PostgreSQL. Logika komputasi validasi ketersediaan jadwal yang diuji bertumpu pada formula deteksi bentrok matematis:

$$\\text{Kondisi Bentrok} = (\\text{Start}_{\\text{req}} < \\text{End}_{\\text{db}}) \\land (\\text{End}_{\\text{req}} > \\text{Start}_{\\text{db}})$$

Di mana $\\text{Start}_{\\text{req}}$ dan $\\text{End}_{\\text{req}}$ menyatakan rentang waktu sewa baru yang diajukan oleh pemesan, $\\text{Start}_{\\text{db}}$ dan $\\text{End}_{\\text{db}}$ merupakan rentang jadwal reservasi yang telah tersimpan di basis data dengan status aktif (`PENDING` atau `CONFIRMED`), serta simbol $\\land$ merupakan operator logika konjungsi (*AND*). Apabila kondisi logika tumpang tindih waktu menghasilkan nilai benar (*true*), sistem secara otomatis menolak transaksi pemesanan baru tersebut. Pengujian kasus uji dikelompokkan ke dalam tiga kategori skenario inti yang dievaluasi pada Bab III:

1. **Skenario Uji Nilai Batas Waktu (*Boundary Time Overlap Cases*)**: Menguji ketahanan algoritma validasi terhadap berbagai variasi tumpang tindih waktu, meliputi: kesamaan jam sewa secara persis (*exact slot match*), tumpang tindih pada jam awal (*start-time overlap*), tumpang tindih pada jam akhir (*end-time overlap*), tumpang tindih di dalam rentang waktu yang ada (*enclosing overlap*), serta kondisi batas jam yang tepat berdampingan (*adjacent boundary*). Sistem harus mampu menolak seluruh kondisi irisan waktu terlarang dan tetap mengizinkan pemesanan pada jam yang tepat berdampingan.
2. **Skenario Konkurensi dan Penguncian Status (*Concurrency & Status Locking*)**: Menguji ketahanan sistem terhadap kondisi balapan (*race condition*) ketika dua pengguna berupaya memesan slot waktu dan unit lapangan yang sama secara simultan. Sistem diuji untuk memastikan bahwa transaksi pertama berhasil mengunci status pemesanan sebagai `PENDING`, sedangkan permintaan kedua seketika ditolak.
3. **Skenario Pelepasan Slot Otomatis (*Lifecycle Auto-Release*)**: Memverifikasi bahwa slot waktu yang sebelumnya terkunci dalam status `PENDING` akan secara otomatis dilepaskan kembali menjadi tersedia (*available*) bagi calon penyewa lain apabila pembayaran kedaluwarsa atau dibatalkan oleh pengguna.

Kriteria kelulusan pengujian (*pass/fail criteria*) ditetapkan berdasarkan kesesuaian mutlak antara hasil keluaran aktual sistem (*actual result*) dengan hasil yang diharapkan (*expected result*). Pengujian dinyatakan berhasil (*Passed*) apabila sistem terbukti 100% konsisten menolak setiap upaya pemesanan yang bertabrakan waktu dan berhasil menjaga integritas data ketersediaan slot sewa. Matriks rancangan dan hasil evaluasi pengujian secara komprehensif disajikan pada Tabel 30 di Bab III.
"""

file_bab2 = 'obsidian/Fieldmax/07 - BAB II - Metode Penelitian.md'
with open(file_bab2, 'r', encoding='utf-8') as f:
    c_bab2 = f.read()

# Replace 2.9 section in 07 - BAB II
m29 = re.search(r'## 2\.9 Metode Pengujian.*', c_bab2, flags=re.DOTALL)
if m29:
    c_bab2 = c_bab2[:m29.start()] + subbab_29_md.strip() + "\n"
    with open(file_bab2, 'w', encoding='utf-8') as f:
        f.write(c_bab2)
    print(f'[+] Updated Subbab 2.9 in {file_bab2}')

# -------------------------------------------------------------------------
# 2. UPDATE 08 - BAB III - Hasil dan Pembahasan.md
# -------------------------------------------------------------------------
file_bab3 = 'obsidian/Fieldmax/08 - BAB III - Hasil dan Pembahasan.md'
with open(file_bab3, 'r', encoding='utf-8') as f:
    c_bab3 = f.read()

# 2a. Update Gambar 9a -> Gambar 44
c_bab3 = c_bab3.replace('**Gambar 9a.** ERD Web Platform FieldMax ^gambar-9a', '**Gambar 44.** ERD Web Platform FieldMax ^gambar-44')
c_bab3 = c_bab3.replace('**Gambar 10.** Relasi antar tabel ^gambar-10', '**Gambar 45.** Relasi antar tabel ^gambar-45')

# 2b. Insert Gambar 46 right after line 308 (under 3.3 Implementasi Activity Diagram text)
booking_flow_block = """
![[images/gambar-booking-flow.drawio]]

**Gambar 46.** Activity Diagram Proses Reservasi Lapangan di FieldMax ^gambar-46
"""

if 'gambar-booking-flow.drawio' not in c_bab3:
    target_pos = c_bab3.find('### 3.3.1 *Activity Diagram* Aktor *Guest*')
    if target_pos != -1:
        c_bab3 = c_bab3[:target_pos] + booking_flow_block.strip() + "\n\n" + c_bab3[target_pos:]
        print('[+] Inserted Gambar 46 into BAB III')

# 2c. Update Activity diagrams (Gambar 11..31 -> Gambar 47..67)
# And UI screens (Gambar 32..67 -> Gambar 68..103)
# To avoid partial match conflicts, process from 67 down to 11!
for old_num in range(67, 10, -1):
    new_num = old_num + 36 # 11+36=47, 31+36=67, 32+36=68, 67+36=103
    old_str = f'**Gambar {old_num}.**'
    new_str = f'**Gambar {new_num}.**'
    c_bab3 = c_bab3.replace(old_str, new_str)
    # Also update anchor tags like ^gambar-11 or ^gambar-11-label
    c_bab3 = c_bab3.replace(f'^gambar-{old_num}-label', f'^gambar-{new_num}-label')
    c_bab3 = c_bab3.replace(f'^gambar-{old_num}\n', f'^gambar-{new_num}\n')
    c_bab3 = c_bab3.replace(f'^gambar-{old_num} ', f'^gambar-{new_num} ')

# 2d. Update Subbab 3.6 in 08 - BAB III
subbab_36_md = """## 3.6 Pembahasan Hasil Penelitian ^pembahasan-hasil-penelitian

Berdasarkan serangkaian tahapan perancangan, implementasi, dan pengujian sistem yang telah dilaksanakan, pembahasan hasil penelitian diuraikan ke dalam tiga capaian pokok yang secara langsung menjawab rumusan masalah penelitian, membuktikan pencapaian tujuan, serta mengonfirmasi penyelesaian terhadap permasalahan operasional yang teridentifikasi pada Bab II:

### 3.6.1 Rancang Bangun Platform Marketplace Multi-Tenant Berbasis Web
Penelitian ini berhasil merancang dan mengimplementasikan artefak platform FieldMax sebagai sistem informasi marketplace penyewaan fasilitas olahraga berbasis web multi-tenant. Arsitektur perangkat lunak yang dibangun berhasil mengintegrasikan tiga tingkatan pengguna (*User*, *Renter*, dan *Admin*) dalam satu sistem terpadu berbasis monorepo full-stack TypeScript (Next.js 16 dan Express.js 5).

Keberhasilan implementasi platform FieldMax ini sekaligus membuktikan penyelesaian konkret terhadap 10 permasalahan operasional utama yang sebelumnya teridentifikasi dari hasil analisis kuesioner kerangka kerja PIECES pada Bab II:
1. **Penggantian Pencatatan Manual**: Inefisiensi pencatatan manual pada buku agenda fisik dan pesan instan digantikan oleh sistem pencatatan pemesanan terpusat berbasis basis data relasional PostgreSQL dengan status transaksi yang terbarui secara otomatis.
2. **Integrasi Pembayaran Digital**: Kendala manipulasi bukti transfer pembayaran manual dieliminasi melalui integrasi resmi *payment gateway* Midtrans Snap yang memverifikasi transaksi secara instan melalui sistem *webhook*.
3. **Sentralisasi Pengelolaan Sarana Mitra**: Fragmentasi pengelolaan *venue* diselesaikan melalui *dashboard* mandiri mitra pengelola (*Renter*) untuk memperbarui data lapangan, tarif sewa, jam operasional, dan galeri fasilitas secara independen.
4. **Penjaminan Kualitas Fasilitas melalui Moderasi**: Risiko penerbitan fasilitas olahraga fiktif dicegah melalui alur moderasi bertingkat oleh Administrator (status `DRAFT`, `PENDING`, `APPROVED`, dan `REJECTED` dengan catatan alasan penolakan).
5. **Otomasi Analitik Pendapatan**: Kesulitan rekapitulasi omzet diselesaikan dengan modul *Revenue Analytics* pada panel *Renter* yang menyajikan visualisasi statistik pendapatan dan tren okupansi lapangan secara otomatis.
6. **Transparansi Ketersediaan Slot Real-Time**: Hambatan lamanya konfirmasi ketersediaan lapangan diatasi melalui kalender slot interaktif di halaman publik yang membedakan slot kosong dan terisi secara visual dan waktu-nyata.
7. **Sentralisasi Identitas dan Otentikasi Terpadu**: Ketiadaan manajemen pengguna diselesaikan melalui arsitektur *Role-Based Access Control* (RBAC), *session-based authentication* dengan cookie `HttpOnly`, dan verifikasi akun via kode OTP email SMTP.
8. **Fasilitasi Umpan Balik Kualitas melalui Ulasan**: Keraguan penyewa terhadap kualitas lapangan diatasi melalui fitur *rating* bintang dan ulasan yang terikat secara sah pada riwayat transaksi pemesanan yang telah diselesaikan.
9. **Saluran Pengaduan Resmi Terdokumentasi**: Ketidakteraturan penanganan keluhan diselesaikan melalui sistem tiket laporan (*Report System*) terpusat dengan kategorisasi masalah (`SCAM`, `TECHNICAL`, `PAYMENT`) beserta riwayat pesan balasan dua arah antara pengguna dan admin.
10. **Eliminasi Potensi Bentrok Jadwal (Double Booking)**: Risiko bentrok jadwal sewa yang paling dikeluhkan pengguna dieliminasi secara tuntas melalui algoritma validasi tumpang tindih waktu dan kontrol penguncian status pesanan atomik.

### 3.6.2 Pembuktian Empiris Eliminasi Potensi Double Booking
Keberhasilan platform FieldMax dalam mengeliminasi bentrok jadwal sewa (*double booking*) hingga mencapai tingkat keberhasilan 100% pada pengujian Black Box (Tabel 30) membuktikan ketercapaian rumusan masalah kedua secara empiris. Pada studi pendahuluan (Bab II), indikator kendala operasional (*Control*) mencatat skor rata-rata yang tinggi (3,90 dari skala 5), di mana 78,1% responden menyatakan kebutuhan mendesak akan kepastian jadwal secara *real-time* akibat tingginya frekuensi bentrok jadwal pada sistem sewa konvensional.

Secara komputasi, keandalan ini dicapai melalui dua mekanisme terpadu pada lapisan backend (`bookings.service.ts`):
1. **Ketelitian Algoritma Kueri Relasional**: Evaluasi logika $(\\text{Start}_{\\text{req}} < \\text{End}_{\\text{db}}) \\land (\\text{End}_{\\text{req}} > \\text{Start}_{\\text{db}})$ pada basis data PostgreSQL terbukti mampu mendeteksi seluruh variasi irisan waktu tanpa celah (Skenario 1, 2, 3, dan 4), sementara tetap secara presisi mengizinkan pesanan pada jam yang tepat berdampingan (Skenario 5). Hal ini menghindarkan sistem dari kesalahan penolakan palsu (*false rejection*).
2. **Kendali Konkurensi dan Siklus Hidup Transaksi**: Mekanisme penguncian status (*status locking*) secara instan mengubah status slot menjadi `PENDING` begitu pembayaran diinisiasi. Hal ini mencegah terjadinya kondisi balapan (*race condition*) saat dua pengguna mengakses slot yang sama secara bersamaan (Skenario 6). Selain itu, sistem *webhook payment gateway* secara otomatis melepaskan slot kembali menjadi tersedia apabila pembayaran kedaluwarsa atau dibatalkan (Skenario 7), menjamin tidak adanya slot yang terkunci secara permanen tanpa pembayaran valid.

Dengan demikian, pengujian empiris membuktikan bahwa platform FieldMax berhasil mengeliminasi akar penyebab *double booking* dan memberikan jaminan keandalan operasional penuh bagi penyewa maupun pemilik *venue*.

### 3.6.3 Efisiensi Operasional dan Keamanan Transaksi Digital
Selain menyelesaikan masalah bentrok jadwal, implementasi FieldMax memberikan dampak peningkatan efisiensi operasional yang nyata. Pada mekanisme konvensional, proses reservasi membutuhkan waktu beberapa jam hingga hitungan hari untuk komunikasi bolak-balik antara penyewa dan pengelola lapangan. Melalui platform FieldMax, keseluruhan siklus reservasi—mulai dari penelusuran slot jadwal, pemilihan lapangan, hingga penerbitan tanda bukti sewa resmi—dapat diselesaikan secara mandiri dalam waktu kurang dari dua menit.

Keamanan transaksi dan integritas data juga dijamin melalui penerapan arsitektur modern: autentikasi berbasis sesi yang tersimpan di basis data dengan cookie `HttpOnly` mencegah risiko serangan *Cross-Site Scripting* (XSS) dan pemalsuan sesi; kata sandi pengguna dilindungi dengan algoritma *hashing* Bcrypt yang tangguh; optimalisasi berkas visual melalui ImageKit CDN mempercepat pemuatan halaman tanpa membebani server utama; serta pengiriman kode verifikasi via SMTP Nodemailer menjamin bahwa setiap akun yang bertransaksi adalah identitas yang valid. Dengan demikian, platform FieldMax menyediakan ekosistem penyewaan lapangan olahraga yang aman, transparan, dan andal secara *end-to-end*.
"""

m36 = re.search(r'## 3\.6 Pembahasan Hasil Penelitian.*', c_bab3, flags=re.DOTALL)
if m36:
    c_bab3 = c_bab3[:m36.start()] + subbab_36_md.strip() + "\n"
    with open(file_bab3, 'w', encoding='utf-8') as f:
        f.write(c_bab3)
    print(f'[+] Updated figures and Subbab 3.6 in {file_bab3}')

