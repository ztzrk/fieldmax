<div align="center">

# RANCANG BANGUN SISTEM INFORMASI RESERVASI DAN FASILITAS OLAHRAGA MULTI-TENANT BERBASIS WEB

<br>

### **PROPOSAL SKRIPSI**

*Diajukan sebagai salah satu syarat untuk mencapai gelar Sarjana Komputer (S.Kom.) pada Program Studi Sistem Informasi Fakultas Matematika dan Ilmu Pengetahuan Alam Universitas Hasanuddin*

<br>

![](images/image001.png)

<br>

**Disusun Oleh:**

### **AFLAH ALIFU NA MAPPATAJANG RAHMAN**
**NIM: H071211012**

<br>
<br>

**PROGRAM STUDI SISTEM INFORMASI**  
**FAKULTAS MATEMATIKA DAN ILMU PENGETAHUAN ALAM**  
**UNIVERSITAS HASANUDDIN**  
**MAKASSAR**  
**2025**

</div>

---

# ABSTRAK ^abstrak

Minat masyarakat yang tinggi terhadap olahraga mendorong peningkatan permintaan terhadap penyewaan sarana dan fasilitas olahraga. Namun, tata kelola operasional konvensional yang masih manual kerap memicu berbagai permasalahan krusial, seperti terjadinya jadwal ganda (*double booking*), kelalaian pencatatan, manipulasi bukti transfer pembayaran, serta ketiadaan saluran informasi ketersediaan lapangan secara *real-time*. Penelitian ini bertujuan untuk merancang dan membangun platform FieldMax, sebuah *marketplace* reservasi dan manajemen penyewaan fasilitas olahraga *multi-tenant* berbasis web, sekaligus menguji keandalan sistem dalam mengeliminasi potensi *double booking*. Pengembangan sistem menerapkan pendekatan *Design Science Research* (DSR) dan siklus hidup perangkat lunak *Waterfall*. Sistem dibangun dengan arsitektur *full-stack TypeScript monorepo*, memisahkan antarmuka pengguna berbasis Next.js (App Router) dan peladen layanan berbasis Express.js, dengan basis data relasional PostgreSQL yang diakses menggunakan Prisma ORM. Otentikasi sistem memanfaatkan *session-based authentication* tersimpan di basis data, transaksi pembayaran otomatis terintegrasi melalui *payment gateway* Midtrans Snap, penyimpanan berkas media dioptimalkan melalui ImageKit CDN, dan notifikasi email dikirimkan via SMTP Nodemailer. Evaluasi fungsionalitas dilakukan melalui metode *Black Box Testing* yang mencakup peran *User*, *Renter*, dan *Admin*. Hasil pengujian membuktikan bahwa platform FieldMax berhasil mengotomatisasi transaksi reservasi instan, memperbarui ketersediaan jadwal secara *real-time*, mengeliminasi terjadinya bentrok jadwal (*double booking*) hingga 100% valid, serta menyediakan transparansi rekapitulasi analitik pendapatan bagi mitra pengelola.

**Kata Kunci:** Reservasi Lapangan, *Marketplace Multi-Tenant*, *Double Booking*, Next.js, Express.js, Midtrans Snap, *Design Science Research*.

# ABSTRACT ^abstract

The growing public enthusiasm for sports has driven a significant increase in demand for sports facility rentals. However, conventional and manual operational management often triggers critical issues, such as double bookings, record-keeping discrepancies, payment receipt manipulation, and the lack of real-time schedule availability information. This study aims to design and develop the FieldMax platform, a web-based multi-tenant sports facility booking and management marketplace, while empirically testing the system's reliability in eliminating double-booking conflicts. The system was developed using the Design Science Research (DSR) framework and the Waterfall software development life cycle (SDLC). The system is built upon a full-stack TypeScript monorepo architecture, separating a Next.js (App Router) frontend from an Express.js backend, backed by a PostgreSQL relational database accessed through Prisma ORM. Security is managed via database-persisted session-based authentication, automated digital payment transactions are integrated through the Midtrans Snap payment gateway, media storage is optimized with ImageKit CDN, and system email notifications are delivered using SMTP Nodemailer. Functional evaluation was conducted using the Black Box Testing method covering User, Renter, and Admin roles. Testing results demonstrate that the FieldMax platform successfully automates instant booking transactions, synchronizes schedule availability in real-time, completely eliminates double bookings (100% valid test cases), and provides transparent revenue analytics for venue partners.

**Keywords:** Sports Venue Reservation, Multi-Tenant Marketplace, Double Booking Prevention, Next.js, Express.js, Midtrans Snap, Design Science Research.


---

# DAFTAR ISI ^daftar-isi

| Judul | Halaman |
|---|---|
| [ABSTRAK](#^abstrak) | i |
| [ABSTRACT](#^abstract) | ii |
| DAFTAR ISI | iii |
| [DAFTAR GAMBAR](#^daftar-gambar) | v |
| [DAFTAR TABEL](#^daftar-tabel) | x |
| [BAB I. PENDAHULUAN](#^bab-1) | 1 |
| [1.1 Latar Belakang](#^latar-belakang) | 1 |
| [1.2 Rumusan Masalah](#^rumusan-masalah) | 3 |
| [1.3 Tujuan Penelitian](#^tujuan-penelitian) | 3 |
| [1.4 Batasan Masalah](#^batasan-masalah) | 3 |
| [1.5 Manfaat Penelitian](#^manfaat-penelitian) | 3 |
| [1.6 Landasan Teori](#^landasan-teori) | 4 |
| [BAB II. METODE PENELITIAN](#^bab-2) | 13 |
| [2.1 Waktu dan Lokasi Penelitian](#^waktu-dan-lokasi-penelitian) | 13 |
| [2.2 Design Science Research](#^design-science-research) | 13 |
| [2.3 Metode Pengumpulan Data](#^metode-pengumpulan-data) | 14 |
| [2.4 Metode Pengembangan Sistem](#^metode-pengembangan-sistem) | 15 |
| [2.5 Tahapan Penelitian](#^tahapan-penelitian) | 16 |
| [2.6 Analisis Pengembangan Sistem](#^analisis-pengembangan-sistem) | 16 |
| [2.7 Perancangan Sistem](#^perancangan-sistem) | 19 |
| [2.8 Rancangan *User Interface* (UI)](#^rancangan-user-interface) | 19 |
| [BAB III. HASIL DAN PEMBAHASAN](#^bab-3) | 59 |
| [3.1 Implementasi Sistem](#^implementasi-sistem) | 59 |
| [3.2 Implementasi Basis Data](#^implementasi-basis-data) | 59 |
| [3.3 Implementasi *Activity Diagram*](#^implementasi-activity-diagram) | 76 |
| [3.4 Implementasi *UI/UX*](#^implementasi-ui-ux) | 116 |
| [3.5 Pengujian Sistem](#^pengujian-sistem) | 146 |
| [3.5.1 *Black Box Testing*](#^pengujian-sistem) | 146 |
| [3.5.2 Pembahasan Hasil Penelitian](#^pembahasan-hasil-penelitian) | 160 |
| [BAB IV. KESIMPULAN DAN SARAN](#^bab-4) | 164 |
| [4.1 Kesimpulan](#^kesimpulan) | 164 |
| [4.2 Saran](#^saran) | 164 |
| [DAFTAR PUSTAKA](#^daftar-pustaka) | 165 |
| [LAMPIRAN](#^lampiran) | 167 |

 

 



---

# DAFTAR GAMBAR ^daftar-gambar

| Gambar | Judul Gambar |
|---|---|
| [**Gambar 1.**](#^gambar-1) | Kerangka *Design Science Research* |
| [**Gambar 2.**](#^gambar-2) | Tahapan dari metode waterfall |
| [**Gambar 3.**](#^gambar-3) | Kerangka Penelitian Sistem Informasi yang Digunakan Pada Penelitian Ini |
| [**Gambar 4.**](#^gambar-4) | Pemetaan Design Science Research pada Platform FieldMax |
| [**Gambar 5.**](#^gambar-5) | Tahapan Metode Waterfall pada Pengembangan Platform FieldMax |
| [**Gambar 6.**](#^gambar-6) | Alur Penelitian |
| [**Gambar 7.**](#^gambar-7) | Diagram Analisis Masalah Sistem Reservasi Lapangan |
| [**Gambar 8.**](#^gambar-8) | Activity Diagram Proses Reservasi Lapangan di FieldMax |
| [**Gambar 9.**](#^gambar-9) | Use Case Diagram Web Platform FieldMax |
| [**Gambar 9a.**](#^gambar-9a) | ERD Web Platform FieldMax |
| [**Gambar 10.**](#^gambar-10) | Relasi antar tabel |
| [**Gambar 11.**](#^gambar-11-label) | Activity Diagram Cari & Filter Lapangan |
| [**Gambar 12.**](#^gambar-12-label) | Activity Diagram Lihat Detail Venue & Lapangan |
| [**Gambar 13.**](#^gambar-13-label) | Activity Diagram Registrasi Akun |
| [**Gambar 14.**](#^gambar-14-label) | Activity Diagram Login Akun |
| [**Gambar 15.**](#^gambar-15-label) | Activity Diagram Reservasi Lapangan |
| [**Gambar 16.**](#^gambar-16-label) | Activity Diagram Lakukan Pembayaran |
| [**Gambar 17.**](#^gambar-17-label) | Activity Diagram Lihat Riwayat Pemesanan |
| [**Gambar 18.**](#^gambar-18-label) | Activity Diagram Beri Ulasan |
| [**Gambar 19.**](#^gambar-19-label) | Activity Diagram Buat Pengaduan User |
| [**Gambar 20.**](#^gambar-20-label) | Activity Diagram Kelola Venue |
| [**Gambar 21.**](#^gambar-21-label) | Activity Diagram Kelola Lapangan |
| [**Gambar 22.**](#^gambar-22-label) | Activity Diagram Ajukan Verifikasi Venue & Lapangan |
| [**Gambar 23.**](#^gambar-23-label) | Activity Diagram Kelola Pemesanan Renter |
| [**Gambar 24.**](#^gambar-24-label) | Activity Diagram Lihat Pendapatan Renter |
| [**Gambar 25.**](#^gambar-25-label) | Activity Diagram Buat Pengaduan Renter |
| [**Gambar 26.**](#^gambar-26-label) | Activity Diagram Lihat Dashboard Admin |
| [**Gambar 27.**](#^gambar-27-label) | Activity Diagram Kelola Data Pengguna |
| [**Gambar 28.**](#^gambar-28-label) | Activity Diagram Kelola Sport Type |
| [**Gambar 29.**](#^gambar-29-label) | Activity Diagram Moderasi Venue & Lapangan |
| [**Gambar 30.**](#^gambar-30-label) | Activity Diagram Pantau Pemesanan & Pembayaran |
| [**Gambar 31.**](#^gambar-31-label) | Activity Diagram Kelola Pengaduan Admin |
| [**Gambar 32.**](#^gambar-32) | Halaman Utama (*Landing Page*) |
| [**Gambar 33.**](#^gambar-33) | Halaman Pencarian Venue |
| [**Gambar 34.**](#^gambar-34) | Halaman Daftar Venue |
| [**Gambar 35.**](#^gambar-35) | Halaman Detail Venue |
| [**Gambar 36.**](#^gambar-36) | Halaman Daftar Lapangan |
| [**Gambar 37.**](#^gambar-37) | Halaman Detail Lapangan |
| [**Gambar 38.**](#^gambar-38) | Halaman Login |
| [**Gambar 39.**](#^gambar-39) | Halaman Registrasi |
| [**Gambar 40.**](#^gambar-40) | Halaman Verifikasi Email |
| [**Gambar 41.**](#^gambar-41) | Halaman Lupa Password |
| [**Gambar 42.**](#^gambar-42) | Halaman Reset Password |
| [**Gambar 43.**](#^gambar-43) | Halaman Profil Pengguna |
| [**Gambar 44.**](#^gambar-44) | Halaman Riwayat Booking Pengguna |
| [**Gambar 45.**](#^gambar-45) | Halaman Detail Booking Pengguna |
| [**Gambar 46.**](#^gambar-46) | Halaman Laporan Keluhan Pengguna |
| [**Gambar 47.**](#^gambar-47) | Halaman Detail Laporan Pengguna |
| [**Gambar 48.**](#^gambar-48) | Halaman Dashboard Renter |
| [**Gambar 49.**](#^gambar-49) | Halaman Kelola Venue Renter |
| [**Gambar 50.**](#^gambar-50) | Halaman Detail Venue Renter |
| [**Gambar 51.**](#^gambar-51) | Halaman Kelola Lapangan Renter |
| [**Gambar 52.**](#^gambar-52) | Halaman Edit Lapangan Renter |
| [**Gambar 53.**](#^gambar-53) | Halaman Kelola Booking Renter |
| [**Gambar 54.**](#^gambar-54) | Halaman Pendapatan Renter |
| [**Gambar 55.**](#^gambar-55) | Halaman Laporan Pengaduan Renter |
| [**Gambar 56.**](#^gambar-56) | Halaman Detail Laporan Renter |
| [**Gambar 57.**](#^gambar-57) | Halaman Dashboard Admin |
| [**Gambar 58.**](#^gambar-58) | Halaman Kelola Pengguna Admin |
| [**Gambar 59.**](#^gambar-59) | Halaman Moderasi Venue Admin |
| [**Gambar 60.**](#^gambar-60) | Halaman Edit Venue Admin |
| [**Gambar 61.**](#^gambar-61) | Halaman Moderasi Lapangan Admin |
| [**Gambar 62.**](#^gambar-62) | Halaman Edit Lapangan Admin |
| [**Gambar 63.**](#^gambar-63) | Halaman Kelola Sport Type Admin |
| [**Gambar 64.**](#^gambar-64) | Halaman Kelola Booking Admin |
| [**Gambar 65.**](#^gambar-65) | Halaman Detail Booking Admin |
| [**Gambar 66.**](#^gambar-66) | Halaman Daftar Laporan Admin |
| [**Gambar 67.**](#^gambar-67) | Halaman Detail Laporan Admin |



---

# DAFTAR TABEL ^daftar-tabel

| Tabel | Judul Tabel |
|---|---|
| [**Tabel 1.**](#^tabel-1) | Komponen *use case diagram* |
| [**Tabel 2.**](#^tabel-2) | Komponen *activity diagram* |
| [**Tabel 3.**](#^tabel-3) | Komponen *Entity Relationship Diagram* |
| [**Tabel 4.**](#^tabel-4) | Waktu Penelitian |
| [**Tabel 4a.**](#^tabel-4a) | Definisi Aktor Sistem Informasi FieldMax |
| [**Tabel 5.**](#^tabel-5) | Tabel daftar Enum yang digunakan beserta nilainya |
| [**Tabel 6.**](#^tabel-6) | Tabel *users* |
| [**Tabel 7.**](#^tabel-7) | Tabel *verification_tokens* |
| [**Tabel 8.**](#^tabel-8) | Tabel *reset_tokens* |
| [**Tabel 9.**](#^tabel-9) | Tabel *user_profiles* |
| [**Tabel 10.**](#^tabel-10) | Tabel *sport_types* |
| [**Tabel 11.**](#^tabel-11) | Tabel *venues* |
| [**Tabel 12.**](#^tabel-12) | Tabel *venue_schedules* |
| [**Tabel 13.**](#^tabel-13) | Tabel *venue_photos* |
| [**Tabel 14.**](#^tabel-14) | Tabel *fields* |
| [**Tabel 15.**](#^tabel-15) | Tabel *field_photos* |
| [**Tabel 16.**](#^tabel-16) | Tabel *bookings* |
| [**Tabel 17.**](#^tabel-17) | Tabel *payments* |
| [**Tabel 18.**](#^tabel-18) | Tabel *reviews* |
| [**Tabel 19.**](#^tabel-19) | Tabel *sessions* |
| [**Tabel 20.**](#^tabel-20) | Tabel *reports* |
| [**Tabel 21.**](#^tabel-21) | Tabel *report_replies* |
| [**Tabel 22.**](#^tabel-22) | Pengujian Halaman Utama & Pencarian Venue |
| [**Tabel 23.**](#^tabel-23) | Pengujian Fitur Otentikasi & Akun |
| [**Tabel 24.**](#^tabel-24) | Skema Reservasi Lapangan & Pembayaran (User-Side) |
| [**Tabel 25.**](#^tabel-25) | Fitur Ulasan Lapangan & Laporan Pengaduan |
| [**Tabel 26.**](#^tabel-26) | Pengelolaan Venue & Lapangan (Renter-Side) |
| [**Tabel 27.**](#^tabel-27) | Panel Moderasi & Administrasi (Admin-Side) |




---

# BAB I PENDAHULUAN ^bab-1

## 1.1 Latar Belakang ^latar-belakang

Olahraga telah menjadi bagian tak terpisahkan dari gaya hidup masyarakat modern. Meningkatnya kesadaran akan pentingnya kesehatan dan kebugaran mendorong lonjakan minat masyarakat terhadap berbagai aktivitas fisik dan olahraga kelompok, seperti futsal, bulu tangkis (*badminton*), bola basket, dan sepak bola mini (*mini soccer*). Peningkatan tren ini sejalan dengan melonjaknya permintaan terhadap ketersediaan fasilitas dan penyewaan lapangan olahraga yang representatif. Bagi para pemilik dan penyedia sarana olahraga, kondisi ini membuka peluang bisnis yang menjanjikan, namun sekaligus menghadirkan tantangan signifikan dalam tata kelola operasional dan mutu pelayanan pelanggan.

Hingga saat ini, sebagian besar penyedia jasa penyewaan lapangan olahraga masih mengandalkan mekanisme konvensional atau manual dalam menjalankan proses bisnisnya, seperti pencatatan pada buku agenda harian serta komunikasi reservasi melalui panggilan telepon atau aplikasi pesan instan WhatsApp. Pola kerja manual ini memiliki berbagai kelemahan mendasar yang berdampak langsung pada penurunan efisiensi operasional. Menurut penelitian Nadjamuddin (2023) serta Swastika dan Khasanah (2017), sistem manual menyulitkan pelanggan dalam memastikan ketersediaan jadwal dan membebani pengelola dalam mengolah data pemesanan yang menumpuk. Permasalahan klasik seperti jadwal ganda (*double booking*), kesalahan pencatatan waktu sewa, lambatnya rekapitulasi laporan pendapatan, serta ketidakefisienan waktu operasional menjadi kendala utama yang kerap dihadapi oleh pengelola fasilitas olahraga (Pramono et al., 2025; Ratama et al., 2022). Secara teknis, ketiadaan mekanisme kendali konkurensi (*concurrency control*) pada sistem pemesanan konvensional menjadi penyebab utama terjadinya konflik jadwal ketika beberapa calon penyewa memperebutkan slot jam sewa yang sama secara bersamaan (Saputra, 2018).

Selain masalah penjadwalan, alur pembayaran pada sistem konvensional umumnya masih mengandalkan transfer bank manual dengan bukti transfer berupa gambar atau struk. Pola transaksi ini memperlambat proses konfirmasi karena pengelola harus memeriksa mutasi rekening secara manual satu per satu, sekaligus membuka celah manipulasi bukti transfer palsu (*fraudulent transfer receipt*) (Hafiz et al., 2023). Sebagaimana ditegaskan oleh Ramadan dan Arifin (2025) serta Siahaan dan Sianturi (2024), integrasi teknologi transaksi digital otomatis (*payment gateway*) menjadi komponen krusial untuk mengotomatisasi konfirmasi pembayaran secara instan, mengunci slot waktu sewa secara *real-time*, dan mengeliminasi ketergantungan pada verifikasi manual pengelola.

Dari perspektif kebutuhan pasar dan penelitian terdahulu, sebagian besar pengembangan sistem informasi reservasi olahraga yang telah ada hanya berfokus pada satu fasilitas tertentu (*single-tenant / single-venue*) (Fortunata & Cahyaningtyas, 2023; Nurhakim dkk., 2023). Pendekatan *single-venue* tersebut memiliki keterbatasan, yaitu memicu fragmentasi layanan di mana pelanggan harus mengakses banyak aplikasi berbeda untuk membandingkan fasilitas, harga, dan ketersediaan jadwal. Di sisi lain, pemilik sarana olahraga skala kecil dan menengah menghadapi kendala biaya investasi yang tinggi apabila harus membangun sistem aplikasi digital secara mandiri. Oleh karena itu, penerapan konsep *marketplace multi-tenant* menjadi solusi strategis yang efektif karena mampu mempertemukan banyak penyedia lapangan (*Renter*) dengan masyarakat luas (*User*) dalam satu wadah terpusat berbasis pencarian cabang olahraga, harga, dan lokasi (Anwar et al., 2020; Sidiarta, 2018).

Berdasarkan latar belakang permasalahan dan kesenjangan (*gap*) penelitian tersebut, penelitian ini mengusulkan **"Rancang Bangun Sistem Informasi Reservasi dan Fasilitas Olahraga Multi-Tenant Berbasis Web"** yang dinamakan **FieldMax**. Platform FieldMax dirancang dengan arsitektur modern berbasis *full-stack TypeScript monorepo* yang mengintegrasikan tiga peran pengguna (*User*, *Renter*, dan *Admin*). Platform ini memfasilitasi Pemilik Fasilitas (*Renter*) dalam mengelola jadwal operasional, data lapangan, galeri fasilitas, dan visualisasi laporan pendapatan, sekaligus memberikan kemudahan bagi Pelanggan (*User*) untuk mengecek ketersediaan jadwal secara *real-time*, melakukan pemesanan instan, serta menyelesaikan pembayaran digital otomatis melalui *payment gateway* Midtrans Snap. Implementasi sistem ini diharapkan menjadi solusi komprehensif untuk mengeliminasi masalah *double booking*, mencegah kecurangan bukti transaksi, meningkatkan efisiensi operasional pengelola, dan memberikan pengalaman reservasi digital yang praktis bagi masyarakat.

## 1.2 Rumusan Masalah ^rumusan-masalah

Berdasarkan latar belakang yang telah diuraikan, rumusan masalah dalam penelitian ini adalah sebagai berikut:

1. Bagaimana merancang dan membangun sistem informasi reservasi dan fasilitas olahraga *multi-tenant* berbasis web (FieldMax) yang mampu mengotomatisasi proses bisnis penyewaan lapangan, memfasilitasi transaksi secara digital, serta menyediakan layanan terpadu bagi pengelola fasilitas dan pelanggan?
2. Bagaimana menguji dan membuktikan keandalan sistem informasi FieldMax menggunakan metode *Black Box Testing* dalam mengeliminasi terjadinya bentrok jadwal (*double booking*) pada proses reservasi lapangan?

## 1.3 Tujuan Penelitian ^tujuan-penelitian

Tujuan yang ingin dicapai dalam penelitian ini adalah:

1. Merancang dan mengimplementasikan sistem informasi reservasi dan fasilitas olahraga *multi-tenant* berbasis web (FieldMax) guna mendigitalisasi pengelolaan sarana olahraga, mempermudah proses transaksi pemesanan secara mandiri, dan menyediakan platform terpadu bagi seluruh pengguna sistem (*User*, *Renter*, dan *Admin*).
2. Menguji dan membuktikan secara empiris keandalan sistem informasi FieldMax menggunakan metode *Black Box Testing* dalam mencegah dan mengeliminasi terjadinya pemesanan ganda (*double booking*) pada slot waktu dan lapangan yang sama.

## 1.4 Batasan Masalah ^batasan-masalah

Untuk menjaga fokus penelitian agar terarah dan sesuai dengan sasaran yang ditetapkan, batasan masalah dalam penelitian ini mencakup:

1. Sistem dibangun berbasis web responsif menggunakan *framework* Next.js (App Router) pada sisi antarmuka (*frontend*) dan Express.js pada sisi layanan peladen (*backend*), yang dapat diakses melalui peramban (*browser*) desktop maupun perangkat bergerak (*mobile*).
2. Pengelolaan dan persistensi data menggunakan sistem manajemen basis data relasional PostgreSQL yang diakses menggunakan Prisma *Object-Relational Mapping* (ORM).
3. Transaksi pembayaran terintegrasi secara daring menggunakan *payment gateway* Midtrans Snap pada lingkungan *sandbox/production* yang mendukung metode pembayaran digital Indonesia (QRIS, *Virtual Account*, dan *e-Wallet*).
4. Pengelolaan dan penyimpanan berkas media (foto profil, foto venue, dan foto lapangan) menggunakan layanan pihak ketiga ImageKit *Content Delivery Network* (CDN).
5. Sistem otentikasi pengguna menggunakan mekanisme *session-based authentication* yang disimpan langsung di dalam basis data (tanpa *JSON Web Token* / JWT).
6. Sistem tidak mencakup pengelolaan akuntansi keuangan mendalam (seperti neraca, jurnal umum, atau buku besar), melainkan berfokus pada rekapitulasi transaksi sewa, status pembayaran, dan total pendapatan operasional lapangan.
7. Pengujian sistem dibatasi pada evaluasi fungsionalitas perangkat lunak menggunakan metode *Black Box Testing* untuk memverifikasi kesesuaian alur bisnis dan keandalan pencegahan *double booking*, serta tidak mencakup pengujian keamanan penetrasi mendalam (*penetration testing*) maupun uji beban masif (*stress testing*).

## 1.5 Manfaat Penelitian ^manfaat-penelitian

Hasil dari penelitian ini diharapkan dapat memberikan manfaat baik secara teoretis maupun praktis:

1. **Manfaat Teoretis**:
   Menjadi referensi akademik dalam penerapan metode *Design Science Research* (DSR) dan siklus pengembangan *Waterfall* pada perancangan sistem informasi *multi-tenant* dan *marketplace* reservasi berbasis web dengan arsitektur *full-stack TypeScript monorepo*.

2. **Manfaat Praktis**:
   - **Bagi Pelanggan (*User*)**: Memperoleh kemudahan dalam mencari informasi venue olahraga, memantau ketersediaan lapangan secara akurat dan *real-time*, serta melakukan pemesanan dan pembayaran digital secara mandiri dan fleksibel tanpa batasan waktu.
   - **Bagi Pemilik Fasilitas (*Renter*)**: Meningkatkan efisiensi tata kelola operasional sarana olahraga, mengeliminasi kesalahan pencatatan jadwal ganda (*double booking*), mempermudah pemantauan rekapitulasi pendapatan secara transparan, serta memperluas jangkauan promosi fasilitas olahraga kepada masyarakat luas.
   - **Bagi Administrator (*Admin*)**: Mempermudah proses moderasi, verifikasi kelayakan mitra pengelola/venue baru, serta penanganan keluhan dan laporan pengguna secara terpusat.
   - **Bagi Peneliti**: Menerapkan dan menguji integrasi teknologi rekayasa web modern (Next.js, Express.js, PostgreSQL, Prisma ORM, Midtrans Snap, dan ImageKit CDN) dalam memecahkan masalah riil di industri layanan olahraga.

## 1.6 Landasan Teori ^landasan-teori

### 1.6.1 Sistem Informasi Berbasis Web

Sistem informasi merupakan keterpaduan komponen yang terdiri atas manusia, perangkat keras (*hardware*), perangkat lunak (*software*), jaringan komunikasi, dan sumber data yang saling berinteraksi untuk mengumpulkan, mengolah, menyimpan, serta mendistribusikan informasi guna mendukung pengambilan keputusan, koordinasi, dan kendali dalam suatu organisasi (O'Brien & Marakas, 2011). Melalui sistem informasi, proses bisnis operasional dan transaksi dapat berjalan secara lebih cepat, tepat, dan transparan.

Di era digital, sistem informasi berbasis web (*web-based information system*) menjadi solusi dominan karena mengombinasikan kekuatan basis data terpusat dengan fleksibilitas antarmuka web yang dapat diakses secara luas melalui jaringan internet menggunakan peramban (*browser*) tanpa memerlukan instalasi aplikasi lokal yang rumit (Rahmi et al., 2023). Pada platform FieldMax, sistem informasi berbasis web difungsikan sebagai media penghubung interaktif yang mengotomatisasi proses bisnis reservasi lapangan dan manajemen fasilitas olahraga bagi seluruh pihak yang terlibat.

### 1.6.2 Reservasi Lapangan Olahraga

Reservasi merupakan proses perikatan awal antara konsumen dan penyedia jasa mengenai pemanfaatan suatu produk atau fasilitas pada waktu tertentu di masa mendatang (Christanto et al., 2012). Selama proses reservasi berlangsung, terjadi pertukaran informasi terstruktur antara konsumen mengenai kebutuhan spesifik (seperti pilihan lapangan, tanggal sewa, dan rentang jam main) dengan penyedia jasa mengenai ketersediaan jadwal serta tarif yang berlaku.

Penerapan reservasi secara daring (*online reservation*) terbukti mampu meminimalkan friksi operasional, seperti antrean panjang, ketidakpastian ketersediaan lapangan, dan risiko bentrok jadwal (*double booking*). Penelitian Hasibuan dkk. (2024) menunjukkan bahwa sistem informasi reservasi olahraga berbasis web berhasil meningkatkan efisiensi operasional pengelola tempat olahraga secara sistematis dan terkontrol, sekaligus memberikan kepastian konfirmasi instan bagi pelanggan.

### 1.6.3 Layanan Penyewaan Lapangan di FieldMax

Platform FieldMax dikembangkan sebagai platform *marketplace multi-tenant* yang dirancang khusus untuk memfasilitasi ekosistem penyewaan lapangan olahraga. Platform ini membagi hak akses ke dalam tiga tingkatan peran (*role*):
1. **User (Pelanggan)**: Masyarakat umum yang memanfaatkan platform untuk menjelajahi katalog venue/lapangan, memfilter berdasarkan cabang olahraga atau harga, mengecek jadwal kosong secara *real-time*, membuat reservasi, melakukan pembayaran daring, serta memberikan ulasan (*review*) pasca bermain.
2. **Renter (Mitra Pengelola)**: Pemilik atau pengelola sarana olahraga yang memiliki hak mengelola profil venue, mendaftarkan lapangan, mengatur jadwal jam operasional (*VenueSchedule*), menetapkan tarif per jam, memantau kalender booking, serta melihat statistik pendapatan.
3. **Admin (Administrator)**: Pengelola platform FieldMax yang bertugas memverifikasi kelayakan akun *Renter* dan venue baru, mengawasi kepatuhan operasional, serta menangani tiket laporan permasalahan (*Report*) dari pengguna.

Melalui arsitektur ini, FieldMax mentransformasi alur reservasi konvensional (yang sebelumnya mengandalkan percakapan manual WhatsApp dan transfer bank manual) menjadi proses yang terintegrasi secara otomatis dari awal hingga akhir (*end-to-end*).

### 1.6.4 Teknologi Pengembangan

#### 1. Next.js

Next.js merupakan kerangka kerja (*framework*) berbasis React.js yang digunakan untuk membangun antarmuka web modern dengan performa tinggi dan ramah terhadap *Search Engine Optimization* (SEO). Next.js memadukan keunggulan *Server-Side Rendering* (SSR), *Static Site Generation* (SSG), serta *Client-Side Rendering* (CSR) melalui arsitektur terbarunya, yaitu *App Router* dan *React Server Components* (Pati & Zaki, 2025). Pemanfaatan Next.js pada sisi *frontend* FieldMax memungkinkan rendering halaman dinamis yang cepat, pembagian rute modular (*file-system based routing*), dan pengelolaan status aplikasi yang efisien dengan TanStack React Query.

#### 2. Express.js

Express.js adalah kerangka kerja sisi peladen (*backend framework*) berbasis Node.js yang bersifat minimalis, cepat, dan fleksibel (Nasution & Pane, 2025). Express.js memfasilitasi pembuatan *Application Programming Interface* (RESTful API) yang kokoh, dilengkapi mekanisme *middleware* untuk penanganan otentikasi sesi, validasi skema data permintaan menggunakan Zod, serta pengendalian galat terpusat (*centralized error handling*) (Azkarin et al., 2023).

#### 3. PostgreSQL dan Prisma ORM

PostgreSQL merupakan sistem manajemen basis data relasional (*Relational Database Management System* / RDBMS) sumber terbuka tingkat lanjut yang andal dalam menangani transaksi data kompleks. PostgreSQL mengimplementasikan mekanisme *Multi-Version Concurrency Control* (MVCC), yang memastikan konsistensi dan integritas data ketika banyak pengguna melakukan transaksi secara bersamaan (*concurrency*) tanpa saling mengunci tabel secara berlebihan (Salunke & Ouda, 2024).

Untuk menjembatani komunikasi antara kode TypeScript dan basis data PostgreSQL, digunakan **Prisma ORM**. Prisma menyediakan *type-safe database client*, pengelolaan skema basis data terpadu, dan sistem migrasi otomatis (*Prisma Migrate*) yang meminimalkan kesalahan penulisan kueri SQL manual.

#### 4. *Payment Gateway* Midtrans Snap

*Payment gateway* adalah layanan perantara otorisasi pembayaran elektronik yang menghubungkan sistem aplikasi perdagangan digital (*e-commerce*) dengan berbagai institusi finansial dan bank secara aman (Siahaan & Sianturi, 2024). Pada platform FieldMax, integrasi pembayaran digital memanfaatkan layanan **Midtrans Snap**.

Midtrans memfasilitasi berbagai kanal pembayaran lokal di Indonesia, termasuk *Virtual Account* (BCA, Mandiri, BNI, BRI, Permata), QRIS (GoPay, ShopeePay, OVO, Dana), dan *e-Wallet*. Melalui mekanisme *Snap Token* dan notifikasi *HTTP Webhook*, server FieldMax dapat mendeteksi perubahan status pembayaran secara instan, sehingga status pemesanan (*Booking*) dapat diperbarui secara otomatis dari status `PENDING` menjadi `CONFIRMED`/`PAID` tanpa memerlukan verifikasi manual bukti struk pembayaran oleh pengelola (Hafiz et al., 2023).

#### 5. ImageKit CDN dan Nodemailer

Pengelolaan media foto (seperti foto profil pengguna, foto fasilitas venue, dan foto lapangan) dioptimalkan menggunakan **ImageKit**, sebuah layanan *Content Delivery Network* (CDN) berbasis komputasi awan yang menyediakan penyimpanan berkas terpusat dan optimasi resolusi gambar otomatis sesuai perangkat pengguna. Sedangkan untuk kebutuhan komunikasi notifikasi sistem, digunakan pustaka **Nodemailer** yang terhubung dengan protokol SMTP (*Simple Mail Transfer Protocol*) guna mengirimkan tautan verifikasi alamat email serta token pemulihan kata sandi (*password reset*).

### 1.6.5 Pemodelan Sistem Berbasis UML

*Unified Modeling Language* (UML) merupakan standar bahasa visual untuk menspesifikasikan, memvisualisasikan, membangun, dan mendokumentasikan artefak dari suatu sistem perangkat lunak (Pressman, 2010). Pemodelan berorientasi objek ini mempermudah pemahaman arsitektur dan alur kerja sistem. Diagram UML yang digunakan dalam penelitian ini meliputi:

#### 1. *Use Case Diagram*

*Use Case Diagram* menggambarkan interaksi fungsional antara satu atau lebih aktor eksternal dengan sistem dari sudut pandang perilaku (*behavioral view*). Diagram ini mendefinisikan batasan sistem dan hak akses fungsionalitas bagi masing-masing pengguna.

**Tabel 1.** Komponen *Use Case Diagram* ^tabel-1

| SIMBOL | NAMA | KETERANGAN |
| :---: | :--- | :--- |
| <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/></svg> | *Actor* | Mewakili peran pengguna, sistem lain, atau perangkat luar yang berinteraksi dengan sistem |
| <svg width="40" height="20" viewBox="0 0 40 20"><ellipse cx="20" cy="10" rx="18" ry="8" stroke="currentColor" stroke-width="2" fill="none"/></svg> | *Use Case* | Deskripsi urutan aksi yang dilakukan sistem untuk menghasilkan nilai terukur bagi aktor |
| <svg width="40" height="20" viewBox="0 0 40 20"><line x1="2" y1="10" x2="38" y2="10" stroke="currentColor" stroke-width="2"/></svg> | *Association* | Garis penghubung komunikasi antara aktor dengan *use case* yang bersangkutan |
| <svg width="40" height="20" viewBox="0 0 40 20"><line x1="2" y1="10" x2="30" y2="10" stroke="currentColor" stroke-width="2"/><polygon points="30,6 38,10 30,14" stroke="currentColor" stroke-width="2" fill="none"/></svg> | *Generalization* | Relasi hierarki pewarisan sifat atau perilaku dari *use case* umum ke khusus |
| <svg width="40" height="20" viewBox="0 0 40 20"><line x1="2" y1="10" x2="30" y2="10" stroke="currentColor" stroke-width="2" stroke-dasharray="3,3"/><polygon points="30,6 38,10 30,14" fill="currentColor"/></svg> | *Include* | Relasi keharusan di mana eksekusi *use case* sumber mutlak menyertakan fungsionalitas *use case* target |

#### 2. *Activity Diagram*

*Activity Diagram* memodelkan alur kerja (*workflow*) dari suatu proses bisnis atau urutan eksekusi logika sistem dari suatu aktivitas ke aktivitas lainnya, termasuk percabangan kondisi (*decision*) dan titik awal/akhir proses.

**Tabel 2.** Komponen *Activity Diagram* ^tabel-2

| SIMBOL | NAMA | KETERANGAN |
| :---: | :--- | :--- |
| <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="currentColor"/></svg> | *Initial Node (Start Point)* | Menandai titik awal dimulainya suatu aliran aktivitas |
| <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="10" cy="10" r="4" fill="currentColor"/></svg> | *Activity Final Node (End Point)* | Menandai titik akhir penyelesaian seluruh aliran aktivitas |
| <svg width="40" height="20" viewBox="0 0 40 20"><rect x="2" y="2" width="36" height="16" rx="5" ry="5" stroke="currentColor" stroke-width="2" fill="none"/></svg> | *Action / Activity* | Menunjukkan pekerjaan atau tindakan komputasi yang sedang dilakukan dalam alur proses |
| <svg width="20" height="20" viewBox="0 0 20 20"><polygon points="10,2 18,10 10,18 2,10" stroke="currentColor" stroke-width="2" fill="none"/></svg> | *Decision Node* | Titik percabangan logika untuk menentukan arah alur berdasarkan evaluasi kondisi boolean tertentu |

#### 3. *Entity Relationship Diagram* (ERD)

*Entity Relationship Diagram* (ERD) adalah notasi grafis yang digunakan untuk memodelkan struktur konseptual dan relasional dari suatu basis data. ERD mendefinisikan entitas objek, atribut-atribut pembentuknya, kunci utama (*primary key*), kunci asing (*foreign key*), serta derajat kardinalitas hubungan antar-entitas (1:1, 1:N, M:N).

**Tabel 3.** Komponen *Entity Relationship Diagram* ^tabel-3

| SIMBOL | NAMA | KETERANGAN |
| :---: | :--- | :--- |
| <svg width="40" height="20" viewBox="0 0 40 20"><rect x="2" y="2" width="36" height="16" stroke="currentColor" stroke-width="2" fill="none"/></svg> | *Entity* | Objek data riil atau konseptual yang memiliki karakteristik tersendiri dalam basis data |
| <svg width="40" height="20" viewBox="0 0 40 20"><ellipse cx="20" cy="10" rx="18" ry="8" stroke="currentColor" stroke-width="2" fill="none"/></svg> | *Attribute* | Properti atau karakteristik spesifik yang mendeskripsikan suatu entitas |
| <svg width="30" height="20" viewBox="0 0 30 20"><polygon points="15,2 27,10 15,18 3,10" stroke="currentColor" stroke-width="2" fill="none"/></svg> | *Relationship* | Keterhubungan logis antara dua entitas atau lebih di dalam sistem basis data |
| <svg width="40" height="20" viewBox="0 0 40 20"><line x1="2" y1="10" x2="38" y2="10" stroke="currentColor" stroke-width="2"/></svg> | *Line / Connector* | Garis penghubung yang mengaitkan entitas dengan atribut maupun relasinya |

### 1.6.6 Ruang Lingkup Penelitian Sistem Informasi (Design Science Research)

Kerangka kerja *Design Science Research* (DSR) dalam bidang Sistem Informasi berfokus pada penciptaan dan evaluasi artefak teknologi informasi yang inovatif untuk memecahkan permasalahan manajerial dan organisasi yang nyata (Hevner et al., 2004).

![Design science research in information systems according to [33] | Download Scientific Diagram](images/image015.png)

**Gambar 1.** Kerangka *Design Science Research* ^gambar-1

Berdasarkan Gambar 1, kerangka DSR terdiri atas tiga domain utama:
1. **Environment (Lingkungan)**: Merupakan ruang permasalahan (*problem space*) yang mencakup interaksi antara manusia (*People*), organisasi (*Organizations*), dan teknologi (*Technology*). Lingkungan ini mendefinisikan sasaran bisnis, kendala operasional, dan peluang transformasi digital dari sistem yang diteliti.
2. **Knowledge Base (Basis Pengetahuan)**: Merupakan landasan ilmiah (*foundations*) dan metodologi (*methodologies*) yang menjamin keketatan (*rigor*) akademis penelitian. Meliputi teori sistem informasi, pola arsitektur perangkat lunak, paradigma basis data, dan metode pengujian standar.
3. **IS Research (Riset Sistem Informasi)**: Siklus iteratif yang menghubungkan ruang permasalahan dan basis pengetahuan melalui dua aktivitas inti: pembangunan artefak (*Build*) dan evaluasi performa artefak (*Evaluate*) guna menghasilkan kontribusi keilmuan yang dapat dipertanggungjawabkan.

### 1.6.7 Metode Pengembangan Perangkat Lunak (*Waterfall*)

Metode *Waterfall* merupakan model klasik dalam *Software Development Life Cycle* (SDLC) yang menerapkan pendekatan sekuensial dan linier dalam rekayasa perangkat lunak (Pressman, 2010). Setiap fase pengembangan harus diselesaikan dan diverifikasi secara menyeluruh sebelum melangkah ke fase berikutnya guna memastikan kejelasan spesifikasi dan pengendalian kualitas artefak secara ketat.

![](images/image016.png)

**Gambar 2.** Tahapan Metode *Waterfall* ^gambar-2

Tahapan dalam model *Waterfall* meliputi:
1. ***Requirement Analysis***: Mengidentifikasi dan menganalisis seluruh kebutuhan fungsional dan non-fungsional sistem melalui observasi proses bisnis dan studi literatur.
2. ***System Design***: Merancang arsitektur sistem perangkat lunak, diagram alir proses (UML), struktur basis data (ERD), serta desain antarmuka pengguna (*User Interface* / UI).
3. ***Implementation***: Mengonversi rancangan desain ke dalam bentuk baris kode program (*coding*) fungsional menggunakan bahasa pemrograman TypeScript, Next.js, Express.js, dan skema Prisma ORM.
4. ***Testing / Verification***: Menguji seluruh fungsionalitas dan integrasi modul sistem untuk memastikan kesesuaian dengan kebutuhan yang telah didefinisikan sebelumnya.
5. ***Maintenance***: Memperbaiki kendala teknis atau galat (*bug*) yang terdeteksi serta melakukan pembaruan berkala untuk menjaga keandalan sistem.

### 1.6.8 *Black Box Testing*

*Black Box Testing* (pengujian kotak hitam) merupakan teknik pengujian perangkat lunak yang berfokus pada evaluasi spesifikasi fungsional sistem tanpa memerlukan pengetahuan terhadap struktur kode internal atau algoritma logika program (Pressman, 2010; Uminingsih et al., 2022). Pengujian dilakukan dari sudut pandang pengguna akhir (*end-user*) dengan memberikan serangkaian nilai masukan (*input*) pada form antarmuka sistem dan memverifikasi apakah keluaran (*output*) serta perubahan status data yang dihasilkan telah sesuai dengan skenario hasil yang diharapkan (*expected results*) (Shadiq et al., 2021).


---

# BAB II METODE PENELITIAN ^bab-2

## 2.1 Waktu dan Lokasi Penelitian ^waktu-dan-lokasi-penelitian

Penelitian ini dilaksanakan pada bulan Juli 2025 sampai dengan bulan November 2025 yang bertempat di Kota Makassar, Sulawesi Selatan.

**Tabel 4.** Waktu dan Jadwal Pelaksanaan Penelitian ^tabel-4

| No | Tahapan Penelitian | Juli M1 | Juli M2 | Juli M3 | Juli M4 | Ags M1 | Ags M2 | Ags M3 | Ags M4 | Sep M1 | Sep M2 | Sep M3 | Sep M4 | Okt M1 | Okt M2 | Okt M3 | Okt M4 | Nov M1 | Nov M2 | Nov M3 | Nov M4 |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | Studi Literatur | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | | | | | | | | | | | | | | |
| 2 | Analisis Kebutuhan (*Requirements*) | | | | ✓ | ✓ | ✓ | | | | | | | | | | | | | | |
| 3 | Desain Sistem (*Design*) | | | | | | | ✓ | ✓ | ✓ | ✓ | | | | | | | | | | |
| 4 | Implementasi Sistem (*Implementation*) | | | | | | | | | | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | | | | |
| 5 | Pengujian Sistem (*Testing*) | | | | | | | | | | | | | | | | | ✓ | ✓ | ✓ | ✓ |
| 6 | Pemeliharaan Sistem (*Maintenance*) | | | | | | | | | | | | | | | | | | | ✓ | ✓ |

## 2.2 Design Science Research ^design-science-research

Penelitian ini mengadopsi kerangka kerja *Design Science Research* (DSR) yang dikemukakan oleh Hevner dkk. (2004). Kerangka DSR bertujuan memecahkan permasalahan praktis organisasi melalui penciptaan dan evaluasi artefak teknologi informasi inovatif. Gambar 3 mengilustrasikan kerangka penelitian sistem informasi yang diterapkan pada riset ini.

![](images/image017.png)

**Gambar 3.** Kerangka Penelitian Sistem Informasi yang Digunakan Pada Penelitian Ini ^gambar-3

Penjelasan dari ketiga domain utama kerangka DSR pada penelitian ini meliputi:
1. **Aspek *Environment* (Lingkungan)**: Terdiri atas *People* (pengguna akhir, mitra pemilik lapangan/renter, dan administrator), *Organizations* (ekosistem bisnis penyedia sarana olahraga FieldMax), serta *Technology* (perangkat keras pengembang, arsitektur *cloud*, dan infrastruktur peramban web modern).
2. **Aspek *IS Research* (Riset Sistem Informasi)**: Terdiri atas siklus *Build* (pembangunan artefak sistem informasi berupa web FieldMax yang mencakup perancangan UML, ERD, antarmuka Figma, serta implementasi *full-stack TypeScript*) dan *Evaluate* (pengujian fungsionalitas dan integrasi modul menggunakan metode *Black Box Testing* untuk menilai efektivitas serta kinerja sistem).
3. **Aspek *Knowledge Base* (Basis Pengetahuan)**: Terdiri atas *Foundations* (teori rekayasa web, arsitektur RESTful API, paradigma *session-based auth*, dan integrasi *payment gateway*) serta *Methodologies* (penerapan metodologi DSR dan model proses rekayasa perangkat lunak *Waterfall*).

Gambar 4 menunjukkan pemetaan spesifik dari kerangka *Design Science Research* yang diterapkan secara langsung dalam konteks pengembangan Platform FieldMax.

![[images/gambar-dsr-fieldmax.svg]]

**Gambar 4.** Pemetaan *Design Science Research* pada Platform FieldMax ^gambar-4

## 2.3 Metode Pengumpulan Data ^metode-pengumpulan-data

Tahap pengumpulan data dilakukan untuk mengidentifikasi kebutuhan bisnis, kendala operasional, dan parameter fungsional yang harus diakomodasi oleh sistem. Metode pengumpulan data yang diterapkan dalam penelitian ini adalah **Studi Literatur (*Literature Review*)**.

Studi literatur dilakukan secara komprehensif dengan menelaah berbagai sumber rujukan ilmiah tertulis, mencakup:
1. **Jurnal Ilmiah Nasional dan Internasional Terakreditasi**: Mengkaji penelitian terdahulu terkait sistem informasi reservasi sarana olahraga, isu konkurensi dan bentrok jadwal (*double booking*), implementasi arsitektur platform *multi-tenant / marketplace*, serta integrasi *payment gateway*.
2. **Buku Teks Rekayasa Perangkat Lunak & Sistem Informasi**: Mengkaji teori dasar pemodelan sistem (*Unified Modeling Language* / UML), siklus hidup pengembangan perangkat lunak (*Waterfall SDLC*), kerangka kerja *Design Science Research* (DSR), serta metodologi pengujian *Black Box Testing*.
3. **Dokumentasi Teknis Resmi (*Official Technical Documentation*)**: Mengkaji spesifikasi teknis dan standar implementasi dari teknologi yang digunakan, meliputi Next.js (App Router), Express.js, PostgreSQL, Prisma ORM, Midtrans API, dan ImageKit SDK.

Informasi dan sintesis yang diperoleh dari studi literatur ini menjadi landasan teoretis yang kokoh dalam memetakan kesenjangan penelitian (*research gap*) serta merumuskan arsitektur sistem informasi FieldMax.

## 2.4 Metode Pengembangan Sistem ^metode-pengembangan-sistem

Pengembangan platform FieldMax menerapkan metode rekayasa perangkat lunak *Waterfall* dalam *System Development Life Cycle* (SDLC). Model ini dipilih karena tahapan kerjanya yang terstruktur, sekuensial, dan sistematis, sehingga memudahkan pengendalian kualitas pada setiap fase.

![[images/gambar-waterfall-sdlc.svg]]

**Gambar 5.** Tahapan Metode Waterfall pada Pengembangan Platform FieldMax ^gambar-5

Tahapan *Waterfall* yang dilaksanakan mencakup:

### 2.4.1 Requirements (Analisis Kebutuhan)
Pada tahap ini, dilakukan elisitasi dan analisis mendalam untuk merumuskan spesifikasi kebutuhan fungsional dan non-fungsional sistem berdasarkan kendala proses bisnis reservasi manual yang ditemukan pada literatur.

### 2.4.2 Design (Perancangan Sistem)
Pada tahap ini, dirancang arsitektur perangkat lunak yang mencakup diagram perilaku sistem (*Use Case Diagram* dan *Activity Diagram*), struktur relasional basis data (*Entity Relationship Diagram* / ERD), serta rancangan visual antarmuka pengguna (*User Interface* / UI) menggunakan Figma.

### 2.4.3 Implementation (Implementasi / Pengkodean)
Pada tahap ini, rancangan desain diwujudkan ke dalam kode program fungsional menggunakan Next.js (App Router) pada sisi antarmuka, Express.js pada sisi peladen, Prisma ORM sebagai lapisan akses data PostgreSQL, dan Tailwind CSS untuk tata letak antarmuka responsif.

### 2.4.4 Testing (Pengujian Sistem)
Pada tahap ini, dilakukan pengujian perangkat lunak menggunakan metode *Black Box Testing*. Pengujian difokuskan secara khusus pada **pembuktian empiris bahwa sistem informasi FieldMax berhasil mengeliminasi terjadinya jadwal ganda (*double booking*)**, yaitu dengan memvalidasi bahwa sistem secara konsisten menolak setiap upaya pemesanan yang bertabrakan pada slot waktu dan unit lapangan yang sama, serta memverifikasi integritas status penguncian jadwal selama transaksi berlangsung.

### 2.4.5 Maintenance (Pemeliharaan Sistem)
Pada tahap ini, dilakukan pemeliharaan sistem berupa koreksi *bug*, optimasi performa kueri basis data, serta penyesuaian konfigurasi lingkungan *production* agar sistem tetap beroperasi secara andal.

## 2.5 Tahapan Penelitian ^tahapan-penelitian

Secara keseluruhan, alur pelaksanaan penelitian dirancang secara sistematis dengan menggabungkan prinsip DSR dan tahapan sekuensial *Waterfall*. Alur penelitian disajikan pada Gambar 6.

![[images/gambar-4-alur-penelitian.svg]]

**Gambar 6.** Alur Penelitian ^gambar-6

Penelitian diawali dari tahap identifikasi masalah dan analisis kebutuhan (*Requirements*), dilanjutkan dengan perancangan arsitektur, pemodelan UML, ERD, dan antarmuka (*Design*). Selanjutnya, dilakukan pengkodean program (*Implementation*) dan pengujian kesesuaian fungsional (*Testing*). Apabila ditemukan ketidaksesuaian fungsional pada tahap pengujian, dilakukan proses evaluasi dan penyesuaian kembali sebelum ditarik kesimpulan akhir.

## 2.6 Analisis Pengembangan Sistem ^analisis-pengembangan-sistem

### 2.6.1 Analisis Masalah

Berdasarkan hasil sintesis studi literatur terhadap berbagai penelitian proses bisnis operasional penyewaan sarana olahraga konvensional, dirumuskan 10 permasalahan utama yang menjadi justifikasi pengembangan platform FieldMax:

1. **Pencatatan Reservasi Masih Manual**: Penggunaan buku agenda atau pesan singkat WhatsApp menyulitkan pencatatan terpusat dan rawan terselip.
2. **Proses Pembayaran Tidak Terintegrasi**: Konfirmasi pembayaran transfer manual memerlukan verifikasi bukti transfer satu per satu oleh pengelola, yang memakan waktu dan berisiko manipulasi bukti bayar.
3. **Pengelolaan Data Sarana Tidak Terpusat**: Mitra pemilik lapangan (*Renter*) tidak memiliki dasbor mandiri untuk memperbarui jadwal, harga, atau foto lapangan secara instan.
4. **Ketiadaan Mekanisme Moderasi Venue**: Tidak ada proses peninjauan kelayakan dan validasi identitas venue olahraga sebelum dipublikasikan kepada masyarakat.
5. **Ketiadaan Dasbor Analitik Pendapatan**: Pemilik venue kesulitan merekap total omzet dan tren okupansi lapangan secara akurat dan otomatis.
6. **Sulitnya Pencarian dan Pengecekan Jadwal *Real-Time***: Pelanggan tidak dapat memantau ketersediaan slot jam kosong secara langsung tanpa harus menanyakan pihak pengelola terlebih dahulu.
7. **Ketiadaan Sistem Otentikasi dan Manajemen Pengguna Terpadu**: Tidak tersedianya akun terverifikasi yang mengikat riwayat transaksi pengguna.
8. **Ketiadaan Riwayat Transaksi dan Ulasan (*Review*)**: Pengguna tidak dapat memantau riwayat pemesanan masa lalu maupun memberikan penilaian kepuasan kualitas fasilitas.
9. **Ketiadaan Saluran Pengaduan Resmi**: Penanganan kendala teknis atau komplain operasional tidak tercatat dan terdokumentasi secara tertib.
10. **Ketiadaan Panel Kontrol Terpadu bagi Administrator**: Pengelola platform tidak memiliki alat terpusat untuk memoderasi data pengguna, transaksi, dan kategori cabang olahraga.

![[images/gambar-analisis-masalah.svg]]

**Gambar 7.** Diagram Analisis Masalah Sistem Reservasi Lapangan ^gambar-7

![[images/gambar-booking-flow.drawio]]

**Gambar 8.** *Activity Diagram* Proses Reservasi Lapangan di FieldMax ^gambar-8

### 2.6.2 Analisis Kebutuhan Sistem

Berdasarkan analisis permasalahan di atas, dirumuskan kebutuhan fungsional bagi ketiga peran pengguna, kebutuhan perangkat lunak, perangkat keras, dan profil pengguna sistem.

#### 1. Kebutuhan Fungsional

**a. Kebutuhan Fungsional Admin:**
1. Admin dapat meninjau, menyetujui (*approve*), atau menolak (*reject*) pengajuan pendaftaran venue dan unit lapangan dari Renter disertai alasan penolakan.
2. Admin dapat melihat, memfilter, dan mengelola seluruh data pengguna yang terdaftar di platform.
3. Admin dapat memantau seluruh riwayat transaksi pemesanan (*booking*) dan aliran pembayaran secara menyeluruh.
4. Admin dapat mengelola data referensi cabang olahraga (*Sport Types*), meliputi penambahan, pengubahan, dan penghapusan kategori.
5. Admin dapat meninjau, membalas melalui utas pesan, dan menyelesaikan tiket pengaduan (*Report*) dari User maupun Renter.
6. Admin memiliki dasbor analitik ringkasan yang menampilkan metrik pertumbuhan platform secara keseluruhan.

**b. Kebutuhan Fungsional Renter:**
1. Renter dapat mendaftarkan venue baru beserta informasi alamat, deskripsi, tautan lokasi, dan jadwal jam operasional harian (*VenueSchedule*).
2. Renter dapat mendaftarkan unit lapangan di bawah venue miliknya, memilih cabang olahraga, menetapkan harga sewa per jam, serta mengatur status buka/tutup sementara.
3. Renter dapat mengunggah dan mengelola galeri foto fasilitas venue dan lapangan melalui integrasi ImageKit CDN.
4. Renter dapat mengajukan venue dan unit lapangan kepada Admin untuk proses moderasi dan verifikasi kelayakan publikasi.
5. Renter dapat memantau daftar pemesanan masuk secara *real-time*, memverifikasi kehadiran penyewa, dan menyelesaikan status sewa.
6. Renter dapat menganalisis grafik rekapitulasi pendapatan kotor dan tren okupansi lapangan melalui dasbor pendapatan (*Revenue*).
7. Renter dapat membuat tiket laporan pengaduan kepada Admin jika mendapati kendala teknis atau operasional.

**c. Kebutuhan Fungsional User:**
1. User dapat melakukan pendaftaran akun, verifikasi email melalui kode OTP/token, masuk (*login*), dan pemulihan kata sandi (*forgot/reset password*).
2. User dapat mencari dan memfilter lapangan olahraga berdasarkan nama, cabang olahraga, lokasi kota/daerah, dan rentang harga.
3. User dapat melihat rincian detail venue dan lapangan, fasilitas pendukung, galeri foto, jadwal operasional, serta ulasan dari pengguna lain.
4. User dapat melakukan reservasi lapangan dengan memilih tanggal dan slot jam sewa yang tersedia secara *real-time*.
5. User dapat menyelesaikan pembayaran digital secara instan melalui Midtrans Snap (*QRIS*, *Virtual Account*, dan *e-Wallet*).
6. User dapat melihat riwayat daftar pemesanan (*My Bookings*) beserta rincian status pembayaran dan kode reservasi.
7. User dapat memberikan ulasan (*review*) dan penilaian bintang (rating 1–5) terhadap lapangan yang telah selesai disewa.
8. User dapat mengajukan laporan keluhan atau kendala transaksi (*Report*) kepada Admin dan memantau respons balasannya.

#### 2. Kebutuhan Perangkat Lunak

Perangkat lunak yang digunakan dalam proses perancangan, implementasi, dan pengujian sistem meliputi:
1. **Visual Studio Code**: Lingkungan pengembangan terintegrasi (*IDE*) utama.
2. **Node.js (v20+) & pnpm (v10)**: *Runtime* JavaScript/TypeScript dan manajer paket monorepo.
3. **Git & GitHub**: Sistem kendali versi (*version control system*) dan repositori kode.
4. **Figma**: Perancangan purwarupa antarmuka pengguna (*UI/UX design*).
5. **PostgreSQL & Prisma ORM**: Sistem basis data relasional dan generator kueri *type-safe*.
6. **Midtrans Sandbox**: Lingkungan pengujian simulasi transaksi pembayaran digital.
7. **Postman**: Pengujian dan verifikasi *endpoint* RESTful API backend.

#### 3. Kebutuhan Perangkat Keras

Pengembangan dan pengujian sistem dilakukan menggunakan laptop dengan spesifikasi:
- **Model**: Lenovo LOQ 15IRX9
- **Prosesor**: Intel® Core™ i5-12450HX @ 2.40 GHz (8 Cores, 12 Threads)
- **Memori (RAM)**: 28 GB DDR5
- **Penyimpanan**: 512 GB NVMe PCIe SSD
- **Sistem Operasi**: Microsoft Windows 11 Home 64-bit

#### 4. Profil Pengguna Sistem

1. **Admin (Administrator)**: Berperan sebagai pengawas dan moderator sentral yang memastikan kepatuhan standar kualitas venue, mengelola data master, serta menjaga kelancaran operasional platform.
2. **Renter (Mitra Pemilik/Pengelola Lapangan)**: Pihak penyedia sarana fisik olahraga yang memanfaatkan FieldMax untuk mendigitalkan jadwal sewa, memasarkan lapangan, dan mengotomatisasi pencatatan keuangan.
3. **User (Pelanggan/Penyewa)**: Komunitas atau perorangan pecinta olahraga yang membutuhkan sarana pencarian lapangan yang cepat, transparan, dan dapat dipesan secara instan.

## 2.7 Perancangan Sistem ^perancangan-sistem

Perancangan sistem dimodelkan menggunakan *Unified Modeling Language* (UML) yang mencakup *Use Case Diagram* untuk memetakan batasan fungsional serta hak akses dari setiap peran aktor.

![[images/gambar-use-case-diagram.drawio]]

**Gambar 9.** *Use Case Diagram* Platform Web FieldMax ^gambar-9

Diagram pada Gambar 9 menggambarkan pembagian 22 *use case* yang terdistribusi ke dalam tiga peran aktor: Admin, Renter, dan User. Definisi peran dan batasan hak akses dari masing-masing aktor dijelaskan pada Tabel 4a.

**Tabel 4a.** Definisi Aktor Sistem Informasi FieldMax ^tabel-4a

| No | Aktor | Deskripsi Peran & Hak Akses |
|:---:|:---|:---|
| 1 | **User** | Pelanggan/penyewa yang memanfaatkan platform untuk mencari fasilitas olahraga, mengecek jadwal *real-time*, melakukan pemesanan dan pembayaran digital, melihat riwayat sewa, memberikan ulasan, serta mengajukan pengaduan. |
| 2 | **Renter** | Mitra pemilik atau pengelola sarana olahraga yang memiliki hak mengelola profil venue, mendaftarkan unit lapangan, mengatur jadwal jam operasional harian, memantau pesanan masuk, dan melihat analitik pendapatan. |
| 3 | **Admin** | Administrator platform yang memiliki hak tertinggi untuk memoderasi legalitas venue dan unit lapangan baru, mengelola data master cabang olahraga, mengawasi seluruh transaksi pemesanan, serta menanggapi tiket pengaduan. |

### 2.7.1 *Use Case* Admin
1. **Login**: Melakukan autentikasi ke panel administrasi sistem.
2. **Kelola Data Pengguna**: Melihat, mencari, memfilter status, dan mengelola akun pengguna (*User* & *Renter*).
3. **Kelola Sport Type**: Menambah, mengubah, dan menghapus master data cabang olahraga.
4. **Moderasi Venue dan Lapangan**: Meninjau pengajuan sarana olahraga baru dari Renter, kemudian menyetujui (*approve*) atau menolak (*reject*) disertai catatan perbaikan.
5. **Pantau Pemesanan dan Pembayaran**: Memantau seluruh rekapitulasi data transaksi booking dan status pembayaran Midtrans.
6. **Kelola Pengaduan**: Meninjau laporan permasalahan, mengirimkan balasan solusi, dan mengubah status laporan menjadi selesai (*resolved*).
7. **Lihat Dashboard Admin**: Memantau grafik statistik pertumbuhan metrik sistem.

### 2.7.2 *Use Case* Renter
1. **Daftar dan Login**: Mendaftarkan akun mitra bisnis dan masuk ke panel Renter.
2. **Kelola Venue**: Mendaftarkan data venue, jam operasional, alamat, dan foto fasilitas.
3. **Kelola Lapangan**: Menambahkan unit lapangan, memilih cabang olahraga, dan menetapkan tarif per jam.
4. **Ajukan Venue dan Lapangan**: Mengirimkan permohonan publikasi venue/lapangan kepada Admin untuk diverifikasi.
5. **Kelola Pemesanan**: Memantau pemesanan masuk, memverifikasi kedatangan pelanggan, dan menyelesaikan status sewa.
6. **Lihat Pendapatan**: Memantau grafik rekapitulasi omzet dan analitik pemesanan.
7. **Buat Pengaduan**: Mengirimkan tiket keluhan atau pertanyaan kepada Admin.

### 2.7.3 *Use Case* User
1. **Daftar dan Login**: Mendaftarkan akun penyewa, memverifikasi email, dan masuk ke platform.
2. **Cari dan Filter Lapangan**: Menjelajahi katalog lapangan dengan filter cabang olahraga, lokasi, dan harga.
3. **Lihat Detail Venue dan Lapangan**: Memeriksa deskripsi fasilitas, galeri foto, ulasan pengguna, dan kalender ketersediaan.
4. **Reservasi Lapangan**: Memilih tanggal dan slot jam sewa kosong secara *real-time*.
5. **Lakukan Pembayaran**: Menyelesaikan tagihan melalui Midtrans Snap (*QRIS*, *Virtual Account*, *e-Wallet*).
6. **Lihat Riwayat Pemesanan**: Memantau daftar booking aktif maupun riwayat masa lalu.
7. **Beri Ulasan**: Memberikan rating bintang (1–5) dan komentar ulasan terhadap lapangan yang telah disewa.
8. **Buat Pengaduan**: Mengirimkan tiket kendala pembayaran atau fasilitas kepada Admin.

## 2.8 Rancangan *User Interface* (UI) ^rancangan-user-interface

Rancangan antarmuka pengguna (*User Interface*) dirancang menggunakan Figma dengan pendekatan desain yang bersih, intuitif, dan responsif. Desain UI dikelompokkan ke dalam lima kelompok utama:

### 2.8.1 Halaman Autentikasi (*Auth*) ^halaman-autentikasi

#### 1. Halaman Login
Berfungsi sebagai pintu masuk pengguna terdaftar menggunakan email dan kata sandi. *(Menjawab Masalah Poin 7)*.

![[figma/Auth/Login.jpg]]

**Gambar 10.** Halaman Login ^gambar-10

#### 2. Halaman Register User
Berfungsi untuk mendaftarkan akun baru bagi calon pelanggan penyewa lapangan. *(Menjawab Masalah Poin 7)*.

![[figma/Auth/Register User.jpg]]

**Gambar 11.** Halaman Register User ^gambar-11

#### 3. Halaman Register Renter
Berfungsi untuk mendaftarkan akun mitra pengelola fasilitas olahraga. *(Menjawab Masalah Poin 7)*.

![[figma/Auth/Register Renter.jpg]]

**Gambar 12.** Halaman Register Renter ^gambar-12

#### 4. Halaman Forgot Password
Berfungsi untuk menginisiasi pemulihan akun bagi pengguna yang melupakan kata sandi. *(Menjawab Masalah Poin 7)*.

![[figma/Auth/Forgot Password.jpg]]

**Gambar 13.** Halaman Forgot Password ^gambar-13

#### 5. Halaman Reset Password
Berfungsi untuk menetapkan kata sandi baru pasca verifikasi token email. *(Menjawab Masalah Poin 7)*.

![[figma/Auth/Reset Password.jpg]]

**Gambar 14.** Halaman Reset Password ^gambar-14

#### 6. Halaman Verify Email
Berfungsi untuk memasukkan token verifikasi email guna mengaktifkan akun pengguna baru. *(Menjawab Masalah Poin 7)*.

![[figma/Auth/Verify Email.jpg]]

**Gambar 15.** Halaman Verify Email ^gambar-15

### 2.8.2 Halaman Publik ^halaman-publik

#### 7. Halaman Home
Menampilkan pengenalan platform, *banner* statistik, rekomendasi venue/lapangan unggulan, dan kolom pencarian cepat. *(Menjawab Masalah Poin 1 dan 6)*.

![[figma/Public/Home.jpg]]

**Gambar 16.** Halaman Home ^gambar-16

#### 8. Halaman Search
Menyajikan katalog pencarian lapangan dilengkapi filter cabang olahraga, kisaran harga, dan lokasi. *(Menjawab Masalah Poin 1 dan 6)*.

![[figma/Public/Search.jpg]]

**Gambar 17.** Halaman Search ^gambar-17

#### 9. Halaman Venue Detail
Menampilkan profil lengkap sarana venue, alamat, jam operasional, dan daftar unit lapangan yang tersedia. *(Menjawab Masalah Poin 6)*.

![[figma/Public/Venue Detail.jpg]]

**Gambar 18.** Halaman Venue Detail ^gambar-18

#### 10. Halaman Field Detail
Menampilkan rincian spesifik satu unit lapangan, tarif sewa per jam, kalender ketersediaan jadwal, formulir reservasi *real-time*, dan ulasan pengguna. *(Menjawab Masalah Poin 1 dan 2)*.

![[figma/Public/Field Detail.jpg]]

**Gambar 19.** Halaman Field Detail ^gambar-19

#### 11. Halaman About
Menyajikan informasi profil, visi, dan misi platform FieldMax.

![[figma/Public/About.jpg]]

**Gambar 20.** Halaman About ^gambar-20

#### 12. Halaman Pricing
Menjelaskan struktur biaya layanan dan skema kerja sama bagi mitra Renter.

![[figma/Public/Pricing.jpg]]

**Gambar 21.** Halaman Pricing ^gambar-21

#### 13. Halaman FAQ
Menyajikan daftar pertanyaan umum seputar alur reservasi, pembayaran, dan ketentuan sewa.

![[figma/Public/Faq.jpg]]

**Gambar 22.** Halaman FAQ ^gambar-22

#### 14. Halaman Privacy Policy
Menjelaskan kebijakan perlindungan dan pengelolaan data pribadi pengguna.

![[figma/Public/Privacy Policy.jpg]]

**Gambar 23.** Halaman Privacy Policy ^gambar-23

#### 15. Halaman Terms of Service
Menyajikan syarat dan ketentuan hukum penggunaan platform FieldMax.

![[figma/Public/Terms of Service.jpg]]

**Gambar 24.** Halaman Terms of Service ^gambar-24

#### 16. Halaman Renter Profile
Menampilkan profil publik mitra Renter beserta daftar seluruh venue yang dikelolanya.

![[figma/Public/Renter Profile.jpg]]

**Gambar 25.** Halaman Renter Profile ^gambar-25

#### 17. Halaman Error
Halaman penanganan kondisi galat sistem (*fallback page*) dengan navigasi kembali ke beranda.

![[figma/Public/Error.jpg]]

**Gambar 26.** Halaman Error ^gambar-26

### 2.8.3 Halaman *User* (Penyewa) ^halaman-user

#### 18. Halaman My Bookings
Menampilkan daftar seluruh riwayat reservasi yang telah dibuat oleh pelanggan. *(Menjawab Masalah Poin 8)*.

![[figma/User/My Bookings.jpg]]

**Gambar 27.** Halaman My Bookings ^gambar-27

#### 19. Halaman Booking Detail
Menampilkan rincian satu transaksi reservasi, kode booking, instruksi pembayaran Midtrans, serta formulir pemberian ulasan. *(Menjawab Masalah Poin 2 dan 8)*.

![[figma/User/Booking Detail.jpg]]

**Gambar 28.** Halaman Booking Detail ^gambar-28

#### 20. Halaman Profile
Memfasilitasi pengguna untuk memperbarui data pribadi, foto profil, dan informasi kontak. *(Menjawab Masalah Poin 7)*.

![[figma/User/Profile.jpg]]

**Gambar 29.** Halaman Profile ^gambar-29

#### 21. Halaman Report
Menampilkan riwayat laporan kendala pengguna serta formulir pembuatan tiket baru. *(Menjawab Masalah Poin 9)*.

![[figma/User/Report.jpg]]

**Gambar 30.** Halaman Report ^gambar-30

#### 22. Halaman Report Detail
Menampilkan rincian tiket pengaduan beserta riwayat utas pesan tanggapan dari Admin. *(Menjawab Masalah Poin 9)*.

![[figma/User/Report Detail.jpg]]

**Gambar 31.** Halaman Report Detail ^gambar-31

### 2.8.4 Halaman *Renter* (Pemilik Lapangan) ^halaman-renter

#### 23. Halaman Dashboard Renter
Menampilkan ringkasan metrik performa bisnis, grafik omzet harian/bulanan, dan aktivitas booking terbaru. *(Menjawab Masalah Poin 3 dan 5)*.

![[figma/Renter/Dashboard.jpg]]

**Gambar 32.** Halaman Dashboard Renter ^gambar-32

#### 24. Halaman Venues
Menampilkan daftar venue milik Renter serta tombol penambahan venue baru. *(Menjawab Masalah Poin 3)*.

![[figma/Renter/Venues.jpg]]

**Gambar 33.** Halaman Venues ^gambar-33

#### 25. Halaman Venue Detail
Menampilkan informasi rincian venue, pengaturan jam operasional, galeri foto, dan daftar lapangan di dalamnya. *(Menjawab Masalah Poin 3)*.

![[figma/Renter/Venue Detail.jpg]]

**Gambar 34.** Halaman Venue Detail ^gambar-34

#### 26. Halaman Fields
Menampilkan daftar seluruh unit lapangan yang dikelola di bawah akun Renter. *(Menjawab Masalah Poin 3)*.

![[figma/Renter/Fields.jpg]]

**Gambar 35.** Halaman Fields ^gambar-35

#### 27. Halaman Field Detail
Menampilkan formulir pengaturan tarif sewa, status operasional, dan galeri foto lapangan. *(Menjawab Masalah Poin 3)*.

![[figma/Renter/Field Detail.jpg]]

**Gambar 36.** Halaman Field Detail ^gambar-36

#### 28. Halaman Revenue
Menyajikan visualisasi analitik pendapatan kotor Renter secara terperinci per venue dan periode waktu. *(Menjawab Masalah Poin 5)*.

![[figma/Renter/Revenue.jpg]]

**Gambar 37.** Halaman Revenue ^gambar-37

#### 29. Halaman Reports
Menampilkan daftar tiket pengaduan yang diajukan Renter kepada pihak Admin. *(Menjawab Masalah Poin 9)*.

![[figma/Renter/Reports.jpg]]

**Gambar 38.** Halaman Reports ^gambar-38

#### 30. Halaman Report Detail
Menampilkan detail komunikasi tiket kendala antara Renter dan Admin. *(Menjawab Masalah Poin 9)*.

![[figma/Renter/Report Detail.jpg]]

**Gambar 39.** Halaman Report Detail ^gambar-39

### 2.8.5 Halaman *Admin* ^halaman-admin

#### 31. Halaman Dashboard Admin
Menampilkan statistik sistem secara menyeluruh, total pengguna aktif, permohonan venue yang menunggu moderasi (*pending approval*), dan total volume transaksi. *(Menjawab Masalah Poin 4 dan 10)*.

![[figma/Admin/Dashboard.jpg]]

**Gambar 40.** Halaman Dashboard Admin ^gambar-40

#### 32. Halaman Booking
Menampilkan rekapitulasi seluruh transaksi pemesanan lintas venue yang terjadi di dalam platform. *(Menjawab Masalah Poin 4 dan 10)*.

![[figma/Admin/Booking.jpg]]

**Gambar 41.** Halaman Booking ^gambar-41

#### 33. Halaman Booking Detail
Menampilkan rincian lengkap transaksi pemesanan, data penyewa, identitas venue/lapangan, dan status pembayaran Midtrans. *(Menjawab Masalah Poin 4 dan 10)*.

![[figma/Admin/Booking Detail.jpg]]

**Gambar 42.** Halaman Booking Detail ^gambar-42

#### 34. Halaman Users
Menyajikan tabel manajemen akun pengguna terdaftar dengan fitur pencarian, filter peran (*role*), dan aksi pengelolaan status akun. *(Menjawab Masalah Poin 10)*.

![[figma/Admin/Users.jpg]]

**Gambar 43.** Halaman Users ^gambar-43

#### 35. Halaman Sport Types
Menyajikan antarmuka pengelolaan data master cabang olahraga (tambah, ubah, hapus). *(Menjawab Masalah Poin 10)*.

![[figma/Admin/Sport Types.jpg]]

**Gambar 44.** Halaman Sport Types ^gambar-44
