# BAB IV KESIMPULAN DAN SARAN ^bab-4

## 4.1 Kesimpulan ^kesimpulan

Berdasarkan hasil perancangan, implementasi, pengujian, dan pembahasan yang telah dilakukan pada sistem informasi reservasi dan fasilitas olahraga *multi-tenant* berbasis web (**FieldMax**), dapat ditarik dua kesimpulan utama yang menjawab rumusan masalah dan tujuan penelitian:

1. **Rancang Bangun dan Implementasi Sistem Terpadu (*Build*)**:
   Sistem informasi reservasi dan fasilitas olahraga *multi-tenant* berbasis web (FieldMax) telah berhasil dirancang dan dibangun menggunakan arsitektur *full-stack TypeScript monorepo* (Next.js App Router, Express.js, Prisma ORM, dan PostgreSQL). Sistem ini berhasil mengintegrasikan solusi menyeluruh untuk:
   - **Mencegah Bentrok Jadwal (*Double Booking*)**: Menerapkan algoritma validasi ketersediaan jadwal (*time overlap query*) pada basis data PostgreSQL yang didukung mekanisme penguncian status (*status locking*) saat transaksi berlangsung.
   - **Otomasi Pembayaran Digital**: Mengintegrasikan *payment gateway* Midtrans Snap (*QRIS, Virtual Account, e-Wallet*) yang secara otomatis memverifikasi pembayaran dan mengonfirmasi reservasi secara *real-time* via *webhook callback*, mengeliminasi kerentanan manipulasi bukti transfer manual.
   - **Tata Kelola Terpadu Berbasis Peran (*Multi-Role*)**: Memfasilitasi Pelanggan (*User*) untuk reservasi mandiri dan pemberian ulasan, Mitra Pengelola (*Renter*) untuk otonomi manajemen venue dan pemantauan analitik pendapatan (*Revenue*), serta Administrator (*Admin*) untuk moderasi legalitas sarana dan penanganan tiket pengaduan (*Report*).

2. **Evaluasi dan Pengujian Fungsionalitas Sistem (*Evaluate*)**:
   Berdasarkan pengujian fungsionalitas menggunakan metode *Black Box Testing* yang mencakup 6 domain pengujian utama (Halaman Utama & Pencarian, Autentikasi & Akun, Reservasi & Pembayaran, Ulasan & Pengaduan, Pengelolaan Venue Renter, serta Panel Moderasi Admin), seluruh fitur sistem terbukti berjalan dengan tingkat keberhasilan 100% valid. Secara khusus, pengujian memverifikasi secara empiris bahwa **mekanisme pencegahan jadwal ganda (*double booking*) berhasil bekerja secara optimal**, di mana sistem secara konsisten menolak setiap upaya pemesanan baru pada slot waktu yang telah terisi atau sedang dalam proses pembayaran, serta membebaskan kembali slot sewa jika pembayaran dibatalkan atau kedaluwarsa.

## 4.2 Saran ^saran

Meskipun sistem informasi FieldMax telah berhasil dikembangkan dan berfungsi dengan baik, penelitian ini masih memiliki ruang pengembangan lebih lanjut. Berdasarkan hasil evaluasi dan batasan masalah yang ada, beberapa saran konstruktif yang diajukan untuk pengembangan penelitian selanjutnya antara lain:

1. **Pengembangan Aplikasi Bergerak (*Mobile Native / PWA*)**:
   Penelitian berikutnya dapat mengembangkan aplikasi berbasis perangkat bergerak (*native Android/iOS*) atau mengintegrasikan fitur *Progressive Web App* (PWA) yang dilengkapi *push notification* instan untuk mengingatkan pengguna mengenai jadwal sewa yang mendekati waktu bermain.

2. **Integrasi Peta Interaktif Berbasis Lokasi (GIS / Maps API)**:
   Mengintegrasikan layanan pemetaan interaktif (seperti Google Maps Platform atau Mapbox) untuk menampilkan lokasi venue olahraga secara visual pada peta digital, lengkap dengan fitur pencarian venue terdekat berdasarkan koordinat geolokasi (*geolocation*) pengguna.

3. **Pengembangan Fitur Komunitas dan *Sparring Matchmaking***:
   Menambahkan modul komunitas olahraga, seperti fitur pencarian lawan tanding (*sparring partner*), pembagian biaya sewa bersama (*split bill*), dan forum turnamen mini untuk meningkatkan interaksi dan loyalitas pengguna di dalam platform.

4. **Integrasi Notifikasi Otomatis melalui WhatsApp Business API**:
   Menerapkan integrasi dengan *gateway* pesan instan (seperti *WhatsApp Business API*) untuk mengirimkan kode reservasi, bukti pembayaran digital, dan notifikasi konfirmasi pembatalan secara otomatis langsung ke nomor telepon pengguna.

5. **Pengujian Beban dan Skalabilitas Sistem (*Load & Stress Testing*)**:
   Melakukan pengujian performa sistem dalam skala beban tinggi (*load and stress testing*) guna menganalisis ketahanan basis data dan waktu respons server ketika terjadi lonjakan transaksi reservasi secara masif pada jam-jam sibuk (*peak hours*).


 

