# BAB II METODE PENELITIAN ^bab-2

## 2.1 Waktu dan Lokasi Penelitian ^waktu-dan-lokasi-penelitian

Penelitian ini dilaksanakan pada bulan Juli 2025 sampai dengan bulan November 2025 yang bertempat di Kota Makassar, Sulawesi Selatan.

**Tabel 4.** Waktu dan Jadwal Pelaksanaan Penelitian ^tabel-4

| No | Tahapan Penelitian | Juli 2025 | Agustus 2025 | September 2025 | Oktober 2025 | November 2025 |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| 1 | Studi Literatur | ✓ | ✓ | | | |
| 2 | Analisis Kebutuhan (*Requirements*) | | ✓ | | | |
| 3 | Desain Sistem (*Design*) | | ✓ | ✓ | | |
| 4 | Implementasi Sistem (*Implementation*) | | | ✓ | ✓ | |
| 5 | Pengujian Sistem (*Testing*) | | | | ✓ | ✓ |
| 6 | Pemeliharaan & Dokumentasi (*Maintenance*) | | | | | ✓ |

## 2.2 *Design Science Research* ^design-science-research

Penelitian ini mengadopsi kerangka kerja *Design Science Research* (DSR) yang dikemukakan oleh Hevner et al. (2004). Kerangka DSR bertujuan memecahkan permasalahan praktis organisasi melalui penciptaan dan evaluasi artefak teknologi informasi inovatif. Gambar 3 mengilustrasikan kerangka penelitian sistem informasi yang diterapkan pada riset ini.

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

**Gambar 5.** Tahapan Metode *Waterfall* pada Pengembangan Platform FieldMax ^gambar-5

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
2. **Node.js (v20+) & pnpm (v10)**: *Runtime* JavaScript/TypeScript dan manajer paket *monorepo*.
3. **Git & GitHub**: Sistem kendali versi (*version control system*) dan repositori kode.
4. **Figma**: Perancangan purwarupa antarmuka pengguna (*UI/UX design*).
5. **PostgreSQL & Prisma ORM**: Sistem basis data relasional dan generator kueri *type-safe*.
6. **Midtrans *Sandbox***: Lingkungan pengujian simulasi transaksi pembayaran digital.
7. **Postman**: Pengujian dan verifikasi *endpoint* RESTful API *backend*.

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

#### 1. Halaman *Login*
Berfungsi sebagai pintu masuk pengguna terdaftar menggunakan email dan kata sandi. *(Menjawab Masalah Poin 7)*.

![[figma/Auth/Login.jpg]]

**Gambar 10.** Halaman *Login* ^gambar-10

#### 2. Halaman *Register User*
Berfungsi untuk mendaftarkan akun baru bagi calon pelanggan penyewa lapangan. *(Menjawab Masalah Poin 7)*.

![[figma/Auth/Register User.jpg]]

**Gambar 11.** Halaman *Register User* ^gambar-11

#### 3. Halaman *Register Renter*
Berfungsi untuk mendaftarkan akun mitra pengelola fasilitas olahraga. *(Menjawab Masalah Poin 7)*.

![[figma/Auth/Register Renter.jpg]]

**Gambar 12.** Halaman *Register Renter* ^gambar-12

#### 4. Halaman *Forgot Password*
Berfungsi untuk menginisiasi pemulihan akun bagi pengguna yang melupakan kata sandi. *(Menjawab Masalah Poin 7)*.

![[figma/Auth/Forgot Password.jpg]]

**Gambar 13.** Halaman *Forgot Password* ^gambar-13

#### 5. Halaman *Reset Password*
Berfungsi untuk menetapkan kata sandi baru pasca verifikasi token email. *(Menjawab Masalah Poin 7)*.

![[figma/Auth/Reset Password.jpg]]

**Gambar 14.** Halaman *Reset Password* ^gambar-14

#### 6. Halaman *Verify Email*
Berfungsi untuk memasukkan token verifikasi email guna mengaktifkan akun pengguna baru. *(Menjawab Masalah Poin 7)*.

![[figma/Auth/Verify Email.jpg]]

**Gambar 15.** Halaman *Verify Email* ^gambar-15

### 2.8.2 Halaman Publik ^halaman-publik

#### 7. Halaman *Home*
Menampilkan pengenalan platform, *banner* statistik, rekomendasi venue/lapangan unggulan, dan kolom pencarian cepat. *(Menjawab Masalah Poin 1 dan 6)*.

![[figma/Public/Home.jpg]]

**Gambar 16.** Halaman *Home* ^gambar-16

#### 8. Halaman *Search*
Menyajikan katalog pencarian lapangan dilengkapi filter cabang olahraga, kisaran harga, dan lokasi. *(Menjawab Masalah Poin 1 dan 6)*.

![[figma/Public/Search.jpg]]

**Gambar 17.** Halaman *Search* ^gambar-17

#### 9. Halaman *Venue Detail*
Menampilkan profil lengkap sarana venue, alamat, jam operasional, dan daftar unit lapangan yang tersedia. *(Menjawab Masalah Poin 6)*.

![[figma/Public/Venue Detail.jpg]]

**Gambar 18.** Halaman *Venue Detail* ^gambar-18

#### 10. Halaman *Field Detail*
Menampilkan rincian spesifik satu unit lapangan, tarif sewa per jam, kalender ketersediaan jadwal, formulir reservasi *real-time*, dan ulasan pengguna. *(Menjawab Masalah Poin 1 dan 2)*.

![[figma/Public/Field Detail.jpg]]

**Gambar 19.** Halaman *Field Detail* ^gambar-19

#### 11. Halaman *About*
Menyajikan informasi profil, visi, dan misi platform FieldMax.

![[figma/Public/About.jpg]]

**Gambar 20.** Halaman *About* ^gambar-20

#### 12. Halaman *Pricing*
Menjelaskan struktur biaya layanan dan skema kerja sama bagi mitra Renter.

![[figma/Public/Pricing.jpg]]

**Gambar 21.** Halaman *Pricing* ^gambar-21

#### 13. Halaman FAQ
Menyajikan daftar pertanyaan umum seputar alur reservasi, pembayaran, dan ketentuan sewa.

![[figma/Public/Faq.jpg]]

**Gambar 22.** Halaman FAQ ^gambar-22

#### 14. Halaman *Privacy Policy*
Menjelaskan kebijakan perlindungan dan pengelolaan data pribadi pengguna.

![[figma/Public/Privacy Policy.jpg]]

**Gambar 23.** Halaman *Privacy Policy* ^gambar-23

#### 15. Halaman *Terms of Service*
Menyajikan syarat dan ketentuan hukum penggunaan platform FieldMax.

![[figma/Public/Terms of Service.jpg]]

**Gambar 24.** Halaman *Terms of Service* ^gambar-24

#### 16. Halaman *Renter Profile*
Menampilkan profil publik mitra Renter beserta daftar seluruh venue yang dikelolanya.

![[figma/Public/Renter Profile.jpg]]

**Gambar 25.** Halaman *Renter Profile* ^gambar-25

#### 17. Halaman *Error*
Halaman penanganan kondisi galat sistem (*fallback page*) dengan navigasi kembali ke beranda.

![[figma/Public/Error.jpg]]

**Gambar 26.** Halaman *Error* ^gambar-26

### 2.8.3 Halaman *User* (Penyewa) ^halaman-user

#### 18. Halaman *My Bookings*
Menampilkan daftar seluruh riwayat reservasi yang telah dibuat oleh pelanggan. *(Menjawab Masalah Poin 8)*.

![[figma/User/My Bookings.jpg]]

**Gambar 27.** Halaman *My Bookings* ^gambar-27

#### 19. Halaman *Booking Detail*
Menampilkan rincian satu transaksi reservasi, kode booking, instruksi pembayaran Midtrans, serta formulir pemberian ulasan. *(Menjawab Masalah Poin 2 dan 8)*.

![[figma/User/Booking Detail.jpg]]

**Gambar 28.** Halaman *Booking Detail* ^gambar-28

#### 20. Halaman *Profile*
Memfasilitasi pengguna untuk memperbarui data pribadi, foto profil, dan informasi kontak. *(Menjawab Masalah Poin 7)*.

![[figma/User/Profile.jpg]]

**Gambar 29.** Halaman *Profile* ^gambar-29

#### 21. Halaman *Report*
Menampilkan riwayat laporan kendala pengguna serta formulir pembuatan tiket baru. *(Menjawab Masalah Poin 9)*.

![[figma/User/Report.jpg]]

**Gambar 30.** Halaman *Report* ^gambar-30

#### 22. Halaman *Report Detail*
Menampilkan rincian tiket pengaduan beserta riwayat utas pesan tanggapan dari Admin. *(Menjawab Masalah Poin 9)*.

![[figma/User/Report Detail.jpg]]

**Gambar 31.** Halaman *Report* Detail ^gambar-31

### 2.8.4 Halaman *Renter* (Pemilik Lapangan) ^halaman-renter

#### 23. Halaman *Dashboard Renter*
Menampilkan ringkasan metrik performa bisnis, grafik omzet harian/bulanan, dan aktivitas booking terbaru. *(Menjawab Masalah Poin 3 dan 5)*.

![[figma/Renter/Dashboard.jpg]]

**Gambar 32.** Halaman *Dashboard Renter* ^gambar-32

#### 24. Halaman *Venues*
Menampilkan daftar venue milik Renter serta tombol penambahan venue baru. *(Menjawab Masalah Poin 3)*.

![[figma/Renter/Venues.jpg]]

**Gambar 33.** Halaman *Venues* ^gambar-33

#### 25. Halaman *Venue Detail*
Menampilkan informasi rincian venue, pengaturan jam operasional, galeri foto, dan daftar lapangan di dalamnya. *(Menjawab Masalah Poin 3)*.

![[figma/Renter/Venue Detail.jpg]]

**Gambar 34.** Halaman *Venue Detail* ^gambar-34

#### 26. Halaman *Fields*
Menampilkan daftar seluruh unit lapangan yang dikelola di bawah akun Renter. *(Menjawab Masalah Poin 3)*.

![[figma/Renter/Fields.jpg]]

**Gambar 35.** Halaman *Fields* ^gambar-35

#### 27. Halaman *Field Detail*
Menampilkan formulir pengaturan tarif sewa, status operasional, dan galeri foto lapangan. *(Menjawab Masalah Poin 3)*.

![[figma/Renter/Field Detail.jpg]]

**Gambar 36.** Halaman *Field Detail* ^gambar-36

#### 28. Halaman *Revenue*
Menyajikan visualisasi analitik pendapatan kotor Renter secara terperinci per venue dan periode waktu. *(Menjawab Masalah Poin 5)*.

![[figma/Renter/Revenue.jpg]]

**Gambar 37.** Halaman *Revenue* ^gambar-37

#### 29. Halaman *Reports*
Menampilkan daftar tiket pengaduan yang diajukan Renter kepada pihak Admin. *(Menjawab Masalah Poin 9)*.

![[figma/Renter/Reports.jpg]]

**Gambar 38.** Halaman *Reports* ^gambar-38

#### 30. Halaman *Report Detail*
Menampilkan detail komunikasi tiket kendala antara Renter dan Admin. *(Menjawab Masalah Poin 9)*.

![[figma/Renter/Report Detail.jpg]]

**Gambar 39.** Halaman *Report* Detail ^gambar-39

### 2.8.5 Halaman *Admin* ^halaman-admin

#### 31. Halaman *Dashboard Admin*
Menampilkan statistik sistem secara menyeluruh, total pengguna aktif, permohonan venue yang menunggu moderasi (*pending approval*), dan total volume transaksi. *(Menjawab Masalah Poin 4 dan 10)*.

![[figma/Admin/Dashboard.jpg]]

**Gambar 40.** Halaman *Dashboard Admin* ^gambar-40

#### 32. Halaman *Booking*
Menampilkan rekapitulasi seluruh transaksi pemesanan lintas venue yang terjadi di dalam platform. *(Menjawab Masalah Poin 4 dan 10)*.

![[figma/Admin/Booking.jpg]]

**Gambar 41.** Halaman *Booking* ^gambar-41

#### 33. Halaman *Booking Detail*
Menampilkan rincian lengkap transaksi pemesanan, data penyewa, identitas venue/lapangan, dan status pembayaran Midtrans. *(Menjawab Masalah Poin 4 dan 10)*.

![[figma/Admin/Booking Detail.jpg]]

**Gambar 42.** Halaman *Booking Detail* ^gambar-42

#### 34. Halaman *Users*
Menyajikan tabel manajemen akun pengguna terdaftar dengan fitur pencarian, filter peran (*role*), dan aksi pengelolaan status akun. *(Menjawab Masalah Poin 10)*.

![[figma/Admin/Users.jpg]]

**Gambar 43.** Halaman *Users* ^gambar-43

#### 35. Halaman *Sport Types*
Menyajikan antarmuka pengelolaan data master cabang olahraga (tambah, ubah, hapus). *(Menjawab Masalah Poin 10)*.

![[figma/Admin/Sport Types.jpg]]

**Gambar 44.** Halaman *Sport Types* ^gambar-44
