# BAB III HASIL DAN PEMBAHASAN ^bab-3

## 3.1 Implementasi Sistem ^implementasi-sistem

Setelah proses perancangan sistem diselesaikan, tahap berikutnya dalam pengembangan sistem informasi adalah mengimplementasikan hasil rancangan tersebut ke dalam bentuk sistem informasi berbasis web. Web ini dibangun menggunakan *framework* Next.js dari sisi Front End dan Express.js dari sisi Back End, yang keduanya menggunakan bahasa pemrograman TypeScript. Untuk *styling* pada sisi Front End dibantu dengan TailwindCSS. Adapun untuk pengelolaan data digunakan PostgreSQL sebagai basis data utama. Sebelum implementasi kode, perancangan antarmuka pengguna dilakukan menggunakan Figma untuk mendesain UI/UX yang intuitif bagi seluruh aktor sistem.

## 3.2 Implementasi Basis Data ^implementasi-basis-data

Implementasi basis data terdiri dari tiga tahapan utama yang saling berkaitan. Tahap pertama yaitu pembuatan Entity Relationship Diagram (ERD) untuk memetakan entitas, atribut, serta hubungan antar entitas sehingga diperoleh gambaran menyeluruh alur pengelolaan data. Tahap berikutnya adalah perancangan struktur tabel, yang mencakup penentuan tipe data, *primary key*, dan *foreign key* agar data dapat lebih konsisten dan terorganisir. Terakhir adalah membangun relasi antar tabel berdasarkan hubungan yang telah dirancang pada ERD, baik relasi *one-to-one*, *one-to-many*, maupun *many-to-many*. Melalui tahapan tersebut, integritas data dapat terjaga dengan baik dan basis data dapat berfungsi secara optimal untuk mendukung kinerja sistem.

### 3.2.1 Entity Relationship Diagram (ERD)

Berikut adalah rancangan *Entity Relationship Diagram* (ERD) yang digunakan untuk memetakan entitas, atribut, dan hubungan antar entitas pada sistem:

![[images/gambar-erd-fieldmax.drawio]]

**Gambar 9a.** ERD Web Platform FieldMax ^gambar-9a

Dalam penelitian ini, terdapat beberapa entitas yang digunakan untuk menggambarkan alur dari basis data. ERD yang dirancang untuk web ini mencakup berbagai entitas utama sebagai berikut:

1. **users**: Menyimpan informasi kredensial dan data akun dasar pengguna.
2.**verification_tokens**: Menyimpan token verifikasi email untuk pendaftaran akun baru.
3.**reset_tokens**: Menyimpan token reset sandi untuk fitur lupa password.
4.**user_profiles**: Menyimpan informasi profil tambahan untuk pengguna (User) maupun profil usaha untuk pemilik lapangan (Renter).
5.**sport_types**: Menyimpan kategori jenis olahraga (misalnya Futsal, Bulutangkis, Basket).
6.**venues**: Menyimpan informasi lokasi tempat olahraga (lapangan olahraga multi-tenant).
7.**venue_schedules**: Menyimpan jadwal operasional buka dan tutup dari suatu venue berdasarkan hari dalam seminggu.
8.**venue_photos**: Menyimpan foto-foto dokumentasi venue olahraga.
9.**fields**: Menyimpan detail data lapangan yang disewakan di dalam venue beserta tarif per jam.
10.**field_photos**: Menyimpan foto-foto detail lapangan olahraga.
11.**bookings**: Menyimpan data transaksi pemesanan lapangan oleh pengguna.
12.**payments**: Menyimpan informasi transaksi pembayaran booking menggunakan Midtrans Snap.
13.**reviews**: Menyimpan data ulasan dan rating lapangan setelah penyewaan selesai.
14.**sessions**: Menyimpan data sesi login aktif pengguna di database.
15.**reports**: Menyimpan laporan kendala atau keluhan dari pengguna (SCAM, TECHNICAL, PAYMENT, OTHER).
16.**report_replies**: Menyimpan balasan pesan terhadap laporan keluhan antara admin dan pengguna.

### 3.2.2 Struktur Tabel

Sebelum membahas struktur tabel secara rinci, terdapat beberapa nilai bertipe *enum* yang dideklarasikan sebagai tipe data kolom basis data. Enum ini berfungsi untuk membatasi nilai yang dapat dimasukkan ke dalam suatu kolom sehingga menjaga konsistensi dan validitas data. Enam enum didefinisikan dalam sistem ini: `UserRole` untuk membedakan tingkat hak akses pengguna, `BookingStatus` untuk melacak siklus hidup pemesanan, `PaymentStatus` untuk memantau status transaksi pembayaran, `VerificationStatus` untuk mengelola alur persetujuan venue dan lapangan, `ReportStatus` untuk menandai progres penanganan pengaduan, dan `ReportCategory` untuk mengklasifikasikan jenis pengaduan yang dilaporkan. Adapun nilai-nilainya sebagai berikut pada **Tabel 5.** Tabel daftar Enum yang digunakan beserta nilainya. ^tabel-5

| Nama Enum              | Nilai / Deskripsi                                |
| ---------------------- | ------------------------------------------------ |
|**UserRole**           | `USER`, `RENTER`, `ADMIN`                        |
|**BookingStatus**      | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED` |
|**PaymentStatus**      | `PENDING`, `PAID`, `EXPIRED`, `FAILED`           |
|**VerificationStatus** | `DRAFT`, `PENDING`, `APPROVED`, `REJECTED`       |
|**ReportStatus**       | `PENDING`, `RESOLVED`                            |
|**ReportCategory**     | `SCAM`, `TECHNICAL`, `PAYMENT`, `OTHER`          |

Berikut adalah tabel-tabel penyusun basis data sistem informasi FieldMax:

Berikut adalah detail struktur tabel dari basis data web Platform FieldMax yang dirancang sesuai dengan Prisma schema:

#### 1. Tabel *users*
**Tabel 6** (*users*) merupakan tabel utama yang menyimpan data autentikasi dan identitas seluruh pengguna platform FieldMax. Setiap pengguna memiliki *primary key* bertipe UUID yang dihasilkan secara otomatis melalui fungsi `uuid()`, memastikan setiap akun mendapat identitas unik yang tidak dapat ditebak. Kolom `email` memiliki constraint *unique* sehingga tidak ada dua akun yang dapat menggunakan alamat email yang sama, sementara kolom `password` menyimpan *hash* kata sandi yang dienkripsi menggunakan algoritma bcrypt untuk menjaga keamanan kredensial. Kolom `role` bertipe enum `UserRole` dengan tiga nilai (USER, RENTER, ADMIN) berfungsi sebagai mekanisme otorisasi yang menentukan halaman dan fitur apa saja yang dapat diakses oleh masing-masing pengguna. Kolom `is_verified` bertindak sebagai penanda bahwa email pengguna telah diverifikasi melalui kode aktivasi enam digit yang dikirimkan melalui layanan SMTP Nodemailer.

**Tabel 6.** *users* ^tabel-6

| Nama Field   | Tipe Field    | Keterangan              | Default    |
| ------------ | ------------- | ----------------------- | ---------- |
| id           | String (UUID) | Primary Key             | uuid()     |
| full_name    | String        | Nama lengkap pengguna   | No Default |
| email        | String        | Email unik untuk login  | No Default |
| password     | String        | Hash password akun      | No Default |
| phone_number | String        | Nomor telepon unik      | Nullable   |
| role         | UserRole      | Hak akses akun          | USER       |
| is_verified  | Boolean       | Status verifikasi email | false      |
| created_at   | DateTime      | Waktu pendaftaran       | now()      |

#### 2. Tabel *verification_tokens*
**Tabel 7** (*verification_tokens*) digunakan untuk menyimpan token verifikasi email yang dikirimkan kepada pengguna setelah proses pendaftaran akun. Tabel ini memiliki *composite unique constraint* pada kombinasi kolom `identifier` dan `token`, yang memastikan bahwa setiap pasangan email dan token bersifat unik. Kolom `identifier` menyimpan alamat email pengguna yang mendaftar, sedangkan kolom `token` menyimpan kode verifikasi enam digit yang dihasilkan secara acak. Setiap token memiliki masa berlaku yang ditentukan oleh kolom `expires`, dengan durasi default selama 15 menit sejak token dibuat. Setelah pengguna berhasil memverifikasi emailnya, token akan dihapus dari tabel ini untuk mencegah penggunaan ulang.

**Tabel 7.** *verification_tokens* ^tabel-7

| Nama Field | Tipe Field | Keterangan             | Default    |
| ---------- | ---------- | ---------------------- | ---------- |
| identifier | String     | Email/identitas user   | No Default |
| token      | String     | Token verifikasi unik  | No Default |
| expires    | DateTime   | Waktu kadaluarsa token | No Default |

#### 3. Tabel *reset_tokens*
**Tabel 8** (*reset_tokens*) berfungsi menyimpan token yang digunakan dalam proses pengaturan ulang kata sandi (*reset password*). Setiap token dihasilkan secara acak menggunakan fungsi `randomBytes` dari modul *crypto* Node.js dan dikirimkan ke email pengguna dalam bentuk tautan pemulihan. Kolom `user_id` merupakan *foreign key* yang merujuk ke tabel *users* dengan aturan *onDelete: Cascade*, yang berarti token akan otomatis terhapus jika akun pengguna yang bersangkutan dihapus. Sebelum token baru dibuat, sistem terlebih dahulu menghapus seluruh token lama milik pengguna tersebut melalui operasi `deleteMany` untuk mencegah penumpukan token kadaluarsa. Token memiliki masa berlaku satu jam sebagaimana ditentukan pada kolom `expires`.

**Tabel 8.** *reset_tokens* ^tabel-8

| Nama Field | Tipe Field    | Keterangan              | Default    |
| ---------- | ------------- | ----------------------- | ---------- |
| id         | String (UUID) | Primary Key             | uuid()     |
| token      | String        | Token reset unik        | No Default |
| expires    | DateTime      | Waktu kadaluarsa        | No Default |
| user_id    | String        | Foreign Key ke users.id | No Default |
| created_at | DateTime      | Waktu pembuatan         | now()      |

#### 4. Tabel *user_profiles*
**Tabel 9** (*user_profiles*) menyimpan data profil tambahan untuk setiap pengguna, baik sebagai individu (User) maupun sebagai badan usaha (Renter). Tabel ini menggunakan `user_id` sebagai *primary key* sekaligus *foreign key* yang merujuk ke tabel *users* dengan relasi *one-to-one*, artinya setiap pengguna maksimal memiliki satu profil. Untuk pengguna dengan peran Renter, tersedia kolom-kolom khusus seperti `company_name`, `company_description`, `company_logo_url`, dan `company_website` yang digunakan untuk menampilkan informasi bisnis kepada calon penyewa di halaman profil publik. Kolom `profile_picture_url` menyimpan tautan gambar yang diunggah ke ImageKit, sedangkan kolom `bio` dan `address` menyimpan informasi pribadi pengguna. Kolom `updated_at` mencatat waktu terakhir profil diperbarui.

**Tabel 9.** *user_profiles* ^tabel-9

| Nama Field          | Tipe Field    | Keterangan                            | Default  |
| ------------------- | ------------- | ------------------------------------- | -------- |
| user_id             | String (UUID) | Primary Key & Foreign Key ke users.id | uuid()   |
| profile_picture_url | String        | URL foto profil user                  | Nullable |
| bio                 | String        | Deskripsi singkat diri                | Nullable |
| address             | String        | Alamat lengkap user                   | Nullable |
| updated_at          | DateTime      | Waktu pembaruan profil                | now()    |
| company_description | String        | Deskripsi bisnis/usaha Renter         | Nullable |
| company_logo_url    | String        | Logo bisnis Renter                    | Nullable |
| company_name        | String        | Nama perusahaan Renter                | Nullable |
| company_website     | String        | Website bisnis Renter                 | Nullable |

#### 5. Tabel *sport_types*
**Tabel 10** (*sport_types*) merupakan tabel referensi (*master data*) yang menyimpan daftar jenis cabang olahraga yang tersedia di platform FieldMax. Tabel ini memiliki struktur yang sederhana dengan hanya dua kolom: `id` sebagai *primary key* UUID dan `name` sebagai nama jenis olahraga yang bersifat *unique*. Keunikan nama memastikan tidak ada duplikasi kategori olahraga dalam sistem. Data dalam tabel ini digunakan di seluruh platform, mulai dari filter pencarian lapangan di halaman publik, pemilihan kategori saat Renter menambahkan lapangan baru, hingga pengelolaan data oleh Admin. Admin memiliki kewenangan penuh untuk menambah, mengedit, atau menghapus jenis olahraga melalui halaman Sport Types di dashboard admin.

**Tabel 10.** *sport_types* ^tabel-10

| Nama Field | Tipe Field    | Keterangan                   | Default    |
| ---------- | ------------- | ---------------------------- | ---------- |
| id         | String (UUID) | Primary Key                  | uuid()     |
| name       | String        | Nama jenis olahraga (Unique) | No Default |

#### 6. Tabel *venues*
**Tabel 11** (*venues*) menyimpan data lokasi tempat olahraga yang didaftarkan oleh Renter. Setiap venue terhubung ke satu Renter melalui *foreign key* `renter_id` yang merujuk ke tabel *users*, membentuk relasi *one-to-many* di mana satu Renter dapat memiliki banyak venue. Informasi alamat venue disimpan secara hierarkis melalui kolom `address`, `city`, `district`, `province`, dan `postal_code` untuk mendukung fitur pencarian berbasis lokasi. Kolom `status` bertipe enum `VerificationStatus` mengontrol visibilitas venue melalui alur persetujuan: DRAFT (masih dalam penyusunan), PENDING (menunggu tinjauan admin), APPROVED (telah disetujui dan tampil di halaman publik), dan REJECTED (ditolak). Apabila venue ditolak, admin wajib mengisi kolom `rejection_reason` sebagai umpan balik kepada Renter.

**Tabel 11.** *venues* ^tabel-11

| Nama Field       | Tipe Field         | Keterangan               | Default    |
| ---------------- | ------------------ | ------------------------ | ---------- |
| id               | String (UUID)      | Primary Key              | uuid()     |
| renter_id        | String             | Foreign Key ke users.id  | No Default |
| name             | String             | Nama venue olahraga      | No Default |
| address          | String             | Alamat lengkap lokasi    | No Default |
| city             | String             | Kota lokasi venue        | Nullable   |
| district         | String             | Kecamatan venue          | Nullable   |
| province         | String             | Provinsi venue           | Nullable   |
| postal_code      | String             | Kode pos venue           | Nullable   |
| description      | String             | Deskripsi detail venue   | Nullable   |
| created_at       | DateTime           | Tanggal dibuat           | now()      |
| status           | VerificationStatus | Status persetujuan admin | DRAFT      |
| rejection_reason | String             | Alasan penolakan admin   | Nullable   |

#### 7. Tabel *venue_schedules*
**Tabel 12** (*venue_schedules*) menyimpan jadwal operasional harian untuk setiap venue yang terdaftar. Tabel ini menggunakan *foreign key* `venue_id` yang merujuk ke tabel *venues* dengan aturan *onDelete: Cascade*, sehingga jadwal akan otomatis terhapus jika venue induknya dihapus. Kolom `day_of_week` bertipe integer menyimpan hari dalam seminggu (0 untuk Minggu hingga 6 untuk Sabtu), sementara `open_time` dan `close_time` bertipe `Time(6)` menyimpan jam buka dan tutup dengan presisi hingga mikrodetik. Renter dapat mengatur jadwal yang berbeda untuk setiap hari, misalnya jam operasional lebih panjang di akhir pekan. Data jadwal ini digunakan oleh sistem untuk memvalidasi ketersediaan slot waktu saat pengguna melakukan reservasi lapangan.

**Tabel 12.** *venue_schedules* ^tabel-12

| Nama Field  | Tipe Field    | Keterangan                                | Default    |
| ----------- | ------------- | ----------------------------------------- | ---------- |
| id          | String (UUID) | Primary Key                               | uuid()     |
| venue_id    | String        | Foreign Key ke venues.id                  | No Default |
| day_of_week | Integer       | Hari operasional (0=Minggu, 1=Senin, dst) | No Default |
| open_time   | Time(6)       | Jam operasional buka                      | No Default |
| close_time  | Time(6)       | Jam operasional tutup                     | No Default |

#### 8. Tabel *venue_photos*
**Tabel 13** (*venue_photos*) menyimpan data galeri foto untuk setiap venue yang terdaftar di platform. Setiap foto terhubung ke venue melalui *foreign key* `venue_id`, membentuk relasi *one-to-many* di mana satu venue dapat memiliki banyak foto. Kolom `url` menyimpan tautan gambar yang di-*hosting* di ImageKit CDN, yang diunggah melalui API unggahan dengan batas maksimal lima foto per permintaan. Kolom `is_featured` bertipe boolean memungkinkan Renter atau Admin menandai satu foto sebagai foto utama yang akan ditampilkan sebagai sampul di kartu venue. Foto-foto venue menjadi syarat wajib dalam proses pengajuan venue — Renter harus mengunggah minimal dua foto sebelum venue dapat diajukan ke admin untuk ditinjau.

**Tabel 13.** *venue_photos* ^tabel-13

| Nama Field  | Tipe Field    | Keterangan                    | Default    |
| ----------- | ------------- | ----------------------------- | ---------- |
| id          | String (UUID) | Primary Key                   | uuid()     |
| venue_id    | String        | Foreign Key ke venues.id      | No Default |
| url         | String        | Tautan gambar di ImageKit CDN | No Default |
| is_featured | Boolean       | Gambar utama venue            | false      |
| created_at  | DateTime      | Waktu unggah                  | now()      |

#### 9. Tabel *fields*
**Tabel 14** (*fields*) menyimpan data detail setiap lapangan olahraga yang disewakan di dalam suatu venue. Setiap lapangan terhubung ke satu venue melalui `venue_id` dan ke satu jenis olahraga melalui `sport_type_id`, membentuk struktur hierarkis venue → lapangan → jenis olahraga. Kolom `price_per_hour` menentukan tarif sewa per jam yang ditetapkan oleh Renter dan digunakan oleh sistem untuk menghitung total biaya pemesanan. Kolom `is_closed` merupakan sakelar (*toggle*) yang memungkinkan Renter menutup sementara lapangan untuk pemeliharaan tanpa menghapusnya. Serupa dengan venue, lapangan juga melalui alur persetujuan admin melalui kolom `status` bertipe `VerificationStatus`, dengan nilai awal PENDING. Admin dapat menolak lapangan dengan mengisi `rejection_reason` sebagai alasan penolakan.

**Tabel 14.** *fields* ^tabel-14

| Nama Field       | Tipe Field         | Keterangan                    | Default    |
| ---------------- | ------------------ | ----------------------------- | ---------- |
| id               | String (UUID)      | Primary Key                   | uuid()     |
| venue_id         | String             | Foreign Key ke venues.id      | No Default |
| sport_type_id    | String             | Foreign Key ke sport_types.id | No Default |
| name             | String             | Nama/nomor lapangan           | No Default |
| description      | String             | Deskripsi lapangan            | Nullable   |
| price_per_hour   | Float              | Harga sewa per jam            | No Default |
| is_closed        | Boolean            | Lapangan sedang ditutup/tidak | false      |
| status           | VerificationStatus | Status approval admin         | PENDING    |
| rejection_reason | String             | Alasan penolakan admin        | Nullable   |
| created_at       | DateTime           | Tanggal penambahan            | now()      |

#### 10. Tabel *field_photos*
**Tabel 15** (*field_photos*) menyimpan galeri foto untuk setiap lapangan olahraga yang terdaftar. Struktur tabel ini serupa dengan *venue_photos*, menggunakan `field_id` sebagai *foreign key* yang merujuk ke tabel *fields*. Foto-foto diunggah melalui layanan ImageKit dan disimpan sebagai tautan URL pada kolom `url`. Kolom `is_featured` menandai foto utama yang ditampilkan sebagai sampul di kartu lapangan pada halaman pencarian dan detail. Keberadaan foto lapangan membantu calon penyewa menilai kondisi dan fasilitas lapangan sebelum memutuskan untuk melakukan reservasi. Proses unggah foto lapangan diatur melalui middleware `canManageField` yang memastikan hanya Renter pemilik atau Admin yang dapat mengelola foto.

**Tabel 15.** *field_photos* ^tabel-15

| Nama Field  | Tipe Field    | Keterangan               | Default    |
| ----------- | ------------- | ------------------------ | ---------- |
| id          | String (UUID) | Primary Key              | uuid()     |
| field_id    | String        | Foreign Key ke fields.id | No Default |
| url         | String        | Tautan gambar di CDN     | No Default |
| is_featured | Boolean       | Foto utama lapangan      | false      |
| created_at  | DateTime      | Waktu unggah             | now()      |

#### 11. Tabel *bookings*
**Tabel 16** (*bookings*) merupakan tabel inti dari proses bisnis platform FieldMax yang menyimpan seluruh data transaksi pemesanan lapangan. Setiap pemesanan menghubungkan satu pengguna (`user_id`) dengan satu lapangan (`field_id`) pada tanggal dan rentang waktu tertentu. Kolom `booking_date` menyimpan tanggal pemesanan, sementara `start_time` dan `end_time` bertipe `Time(6)` menandai jam mulai dan selesai sewa. Sistem secara otomatis menghitung `total_price` berdasarkan durasi sewa dikalikan dengan `price_per_hour` dari lapangan yang dipesan. Kolom `status` bertipe enum `BookingStatus` melacak siklus hidup pemesanan: PENDING (menunggu pembayaran), CONFIRMED (pembayaran berhasil), CANCELLED (dibatalkan), dan COMPLETED (sewa telah selesai). Cron job yang berjalan setiap jam akan otomatis mengubah status CONFIRMED menjadi COMPLETED ketika waktu sewa telah lewat.

**Tabel 16.** *bookings* ^tabel-16

| Nama Field   | Tipe Field    | Keterangan               | Default    |
| ------------ | ------------- | ------------------------ | ---------- |
| id           | String (UUID) | Primary Key              | uuid()     |
| user_id      | String        | Foreign Key ke users.id  | No Default |
| field_id     | String        | Foreign Key ke fields.id | No Default |
| booking_date | Date          | Tanggal penyewaan        | No Default |
| start_time   | Time(6)       | Jam mulai sewa           | No Default |
| end_time     | Time(6)       | Jam selesai sewa         | No Default |
| total_price  | Float         | Total biaya pemesanan    | No Default |
| status       | BookingStatus | Status pesanan           | PENDING    |
| created_at   | DateTime      | Waktu pesanan dibuat     | now()      |

#### 12. Tabel *payments*
**Tabel 17** (*payments*) menyimpan informasi transaksi pembayaran yang terintegrasi dengan *payment gateway* Midtrans Snap. Setiap pembayaran memiliki relasi *one-to-one* dengan tabel *bookings* melalui *foreign key* `booking_id` yang bersifat *unique*, memastikan satu pemesanan hanya memiliki satu catatan pembayaran. Kolom `amount` mencatat jumlah pembayaran yang harus diselesaikan, sementara `snap_token` menyimpan token yang dihasilkan oleh Midtrans Snap API untuk memunculkan pop-up pembayaran di sisi klien. Kolom `status` bertipe enum `PaymentStatus` melacak status pembayaran melalui empat tahap: PENDING (menunggu pembayaran), PAID (pembayaran berhasil), EXPIRED (token kedaluwarsa), dan FAILED (pembayaran gagal). Perubahan status pembayaran dipicu oleh notifikasi webhook yang dikirimkan Midtrans ke endpoint `/api/payments/midtrans-notification` pada server FieldMax.

**Tabel 17.** *payments* ^tabel-17

| Nama Field           | Tipe Field    | Keterangan                          | Default    |
| -------------------- | ------------- | ----------------------------------- | ---------- |
| id                   | String (UUID) | Primary Key                         | uuid()     |
| booking_id           | String        | Foreign Key (Unique) ke bookings.id | No Default |
| amount               | Float         | Jumlah pembayaran                   | No Default |
| status               | PaymentStatus | Status transaksi pembayaran         | PENDING    |
| snap_token           | String        | Token Midtrans Snap                 | Nullable   |
| payment_redirect_url | String        | Tautan url pembayaran Midtrans      | Nullable   |
| created_at           | DateTime      | Tanggal dibuat                      | now()      |
| updated_at           | DateTime      | Waktu pembaruan status              | otomatis  |

#### 13. Tabel *reviews*
**Tabel 18** (*reviews*) menyimpan data ulasan dan penilaian yang diberikan oleh pengguna setelah menyelesaikan penyewaan lapangan. Setiap ulasan terikat pada satu pemesanan melalui `booking_id` yang bersifat *unique*, sehingga satu pemesanan hanya dapat memiliki satu ulasan (relasi *one-to-one*). Kolom `rating` bertipe integer menyimpan nilai bintang dari 1 hingga 5, sementara `comment` menyimpan teks ulasan yang bersifat opsional. Ulasan juga terhubung ke pengguna (`user_id`) dan lapangan (`field_id`) untuk mendukung agregasi data — sistem secara otomatis menghitung rata-rata rating per lapangan menggunakan fungsi `groupBy` Prisma. Ulasan hanya dapat dibuat jika status pemesanan telah COMPLETED atau CONFIRMED dengan waktu sewa yang telah lewat, sebagaimana divalidasi di lapisan *service*.

**Tabel 18.** *reviews* ^tabel-18

| Nama Field | Tipe Field    | Keterangan                          | Default    |
| ---------- | ------------- | ----------------------------------- | ---------- |
| id         | String (UUID) | Primary Key                         | uuid()     |
| rating     | Integer       | Nilai bintang (1 s/d 5)             | No Default |
| comment    | String        | Komentar atau ulasan user           | Nullable   |
| user_id    | String        | Foreign Key ke users.id             | No Default |
| field_id   | String        | Foreign Key ke fields.id            | No Default |
| booking_id | String        | Foreign Key (Unique) ke bookings.id | No Default |
| created_at | DateTime      | Tanggal ulasan dibuat               | now()      |

#### 14. Tabel *sessions*
**Tabel 19** (*sessions*) menyimpan data sesi login aktif pengguna sebagai bagian dari sistem autentikasi berbasis sesi (*session-based authentication*). Berbeda dengan pendekatan JWT yang menyimpan token di sisi klien, sistem FieldMax menyimpan ID sesi sebagai *HttpOnly cookie* di peramban pengguna dan memvalidasinya terhadap tabel ini di setiap permintaan yang memerlukan autentikasi. Kolom `id` berfungsi sebagai *primary key* yang nilainya dihasilkan menggunakan `randomBytes(32)` dari modul *crypto*, menghasilkan string heksadesimal sepanjang 64 karakter yang sulit ditebak. Kolom `expires_at` menentukan masa berlaku sesi dengan durasi default 24 jam. *Middleware* `authMiddleware` pada setiap rute yang dilindungi akan memeriksa keberadaan dan validitas sesi sebelum mengizinkan akses.

**Tabel 19.** *sessions* ^tabel-19

| Nama Field | Tipe Field | Keterangan               | Default    |
| ---------- | ---------- | ------------------------ | ---------- |
| id         | String     | Primary Key              | No Default |
| user_id    | String     | Foreign Key ke users.id  | No Default |
| expires_at | DateTime   | Waktu kadaluarsa session | No Default |

#### 15. Tabel *reports*
**Tabel 20** (*reports*) menyimpan data pengaduan atau keluhan yang diajukan oleh pengguna maupun Renter kepada admin platform. Setiap laporan terhubung ke pengguna pelapor melalui `user_id` dan memiliki `subject` sebagai judul serta `description` sebagai uraian detail masalah. Kolom `category` bertipe enum `ReportCategory` mengklasifikasikan laporan ke dalam empat kategori: SCAM (penipuan), TECHNICAL (masalah teknis), PAYMENT (masalah pembayaran), dan OTHER (lainnya), yang membantu admin dalam memprioritaskan dan mengelola pengaduan. Kolom `status` bertipe `ReportStatus` menandai apakah laporan masih PENDING atau sudah RESOLVED. Laporan yang telah diselesaikan dapat ditandai sebagai RESOLVED oleh admin, namun pengguna dan admin tetap dapat melanjutkan percakapan melalui tabel *report_replies*.

**Tabel 20.** *reports* ^tabel-20

| Nama Field  | Tipe Field     | Keterangan                | Default    |
| ----------- | -------------- | ------------------------- | ---------- |
| id          | String (UUID)  | Primary Key               | uuid()     |
| user_id     | String         | Foreign Key ke users.id   | No Default |
| subject     | String         | Judul keluhan/laporan     | No Default |
| description | String         | Deskripsi detail masalah  | No Default |
| category    | ReportCategory | Jenis kategori kendala    | OTHER      |
| status      | ReportStatus   | Status penanganan keluhan | PENDING    |
| created_at  | DateTime       | Tanggal keluhan dikirim   | now()      |
| updated_at  | DateTime       | Tanggal pembaruan laporan | now()      |

#### 16. Tabel *report_replies*
**Tabel 21** (*report_replies*) menyimpan riwayat percakapan antara pengguna (atau Renter) dengan admin dalam konteks penanganan suatu laporan pengaduan. Setiap balasan terhubung ke laporan induk melalui `report_id` (relasi *one-to-many*, satu laporan dapat memiliki banyak balasan) dan ke pengirim melalui `sender_id`. Kolom `message` menyimpan isi pesan teks, sementara `created_at` mencatat waktu pengiriman untuk mengurutkan balasan secara kronologis. Sistem membatasi hak balasan berdasarkan peran: pengguna hanya dapat membalas laporannya sendiri, admin dapat membalas laporan siapa pun, dan pengguna tidak dapat membalas laporan yang telah berstatus RESOLVED. Fitur ini menyediakan saluran komunikasi dua arah yang terdokumentasi antara pengguna dan admin tanpa perlu meninggalkan platform.

**Tabel 21.** *report_replies* ^tabel-21

| Nama Field | Tipe Field    | Keterangan                   | Default    |
| ---------- | ------------- | ---------------------------- | ---------- |
| id         | String (UUID) | Primary Key                  | uuid()     |
| report_id  | String        | Foreign Key ke reports.id    | No Default |
| sender_id  | String        | Foreign Key ke users.id      | No Default |
| message    | String        | Isi pesan tanggapan          | No Default |
| created_at | DateTime      | Tanggal pengiriman tanggapan | now()      |


### 3.2.3 Relasi Antar Tabel

Setelah perancangan, selanjutnya adalah merancang relasi antar tabel, yang berfungsi untuk menentukan keterhubungan antar tabel yang ada dalam basis data. Perancangan yang tepat diperlukan agar mengakses basis data dari sistem dapat efektif dan efisien.

![[images/gambar-relasi-tabel.drawio]]

**Gambar 10.** Relasi antar tabel ^gambar-10

## 3.3 Implementasi *Activity Diagram* ^implementasi-activity-diagram

*Activity diagram* menggambarkan alur kerja, aktivitas, atau proses bisnis yang terjadi di dalam sistem untuk setiap *use case* yang telah dirancang sebelumnya. Pada bagian ini, alur aktivitas dijabarkan secara terpisah untuk masing-masing *use case* dengan menggunakan pembagian kolom *Client* (aktor) dan *System* (aplikasi) untuk memperjelas batas interaksi.

### 3.3.1 *Activity Diagram* Aktor *Guest* (Pengunjung Umum) ^gambar-11

#### 1. Cari & Filter Lapangan (`uc-cari`)
Menggambarkan alur aktivitas saat pengunjung mencari lapangan olahraga berdasarkan kota/daerah atau filter kategori olahraga dan kisaran harga sewa:

![[images/drawio/gambar-activity-cari.drawio]]

**Gambar 11.** Activity Diagram Cari & Filter Lapangan ^gambar-11-label

#### 2. Lihat Detail Venue & Lapangan (`uc-detail`)
Menggambarkan alur aktivitas saat pengunjung memilih salah satu tempat olahraga untuk melihat detail jam operasional, galeri foto, ulasan, serta daftar lapangan yang disewakan:

![[images/drawio/gambar-activity-detail.drawio]]

**Gambar 12.** Activity Diagram Lihat Detail Venue & Lapangan ^gambar-12-label


### 3.3.2 *Activity Diagram* Aktor *User* (Penyewa Terdaftar) ^gambar-12

#### 3. Registrasi Akun (`uc-daftar`)
Menggambarkan proses pendaftaran akun baru oleh calon User hingga aktivasi melalui kode OTP verifikasi email:

![[images/drawio/gambar-activity-daftar.drawio]]

**Gambar 13.** Activity Diagram Registrasi Akun ^gambar-13-label

#### 4. Login Akun (`uc-login`)
Menggambarkan alur masuk ke dalam sistem menggunakan akun terdaftar untuk memperoleh otorisasi sesi login:

![[images/drawio/gambar-activity-login.drawio]]

**Gambar 14.** Activity Diagram Login Akun ^gambar-14-label

#### 5. Reservasi Lapangan (`uc-reservasi`)
Menggambarkan alur pemesanan lapangan oleh User dengan memilih tanggal, durasi sewa, dan meminta snap_token pembayaran dari Midtrans Snap API:

![[images/drawio/gambar-activity-reservasi.drawio]]

**Gambar 15.** Activity Diagram Reservasi Lapangan ^gambar-15-label

#### 6. Lakukan Pembayaran (`uc-bayar`)
Menggambarkan proses penyelesaian pembayaran di portal Midtrans Snap hingga status booking terkonfirmasi secara otomatis:

![[images/drawio/gambar-activity-bayar.drawio]]

**Gambar 16.** Activity Diagram Lakukan Pembayaran ^gambar-16-label

#### 7. Lihat Riwayat Pemesanan (`uc-riwayat`)
Menggambarkan alur saat User mengakses log riwayat transaksi penyewaan yang pernah dilakukan sebelumnya:

![[images/drawio/gambar-activity-riwayat.drawio]]

**Gambar 17.** Activity Diagram Lihat Riwayat Pemesanan ^gambar-17-label

#### 8. Beri Ulasan (`uc-ulasan`)
Menggambarkan alur pemberian rating bintang dan teks komentar oleh User terhadap unit lapangan yang telah selesai disewa:

![[images/drawio/gambar-activity-ulasan.drawio]]

**Gambar 18.** Activity Diagram Beri Ulasan ^gambar-18-label

#### 9. Buat Pengaduan User (`uc-pengaduan-user`)
Menggambarkan proses pelaporan kendala teknis atau pengaduan masalah pembayaran oleh User:

![[images/drawio/gambar-activity-pengaduan-user.drawio]]

**Gambar 19.** Activity Diagram Buat Pengaduan User ^gambar-19-label


### 3.3.3 *Activity Diagram* Aktor *Renter* (Pemilik Lapangan) ^gambar-13

#### 10. Kelola Venue (`uc-kelola-venue`)
Menggambarkan alur pengisian detail venue, jam operasional harian, serta galeri foto lokasi oleh Renter:

![[images/drawio/gambar-activity-kelola-venue.drawio]]

**Gambar 20.** Activity Diagram Kelola Venue ^gambar-20-label

#### 11. Kelola Lapangan (`uc-kelola-lapangan`)
Menggambarkan alur penambahan data unit lapangan olahraga, penentuan tarif per jam sewa, serta pengaturan penutupan sementara lapangan:

![[images/drawio/gambar-activity-kelola-lapangan.drawio]]

**Gambar 21.** Activity Diagram Kelola Lapangan ^gambar-21-label

#### 12. Ajukan Venue & Lapangan (`uc-ajukan`)
Menggambarkan alur pengajuan verifikasi venue atau lapangan yang masih berstatus DRAFT/REJECTED ke antrean peninjauan Admin:

![[images/drawio/gambar-activity-ajukan.drawio]]

**Gambar 22.** Activity Diagram Ajukan Verifikasi Venue & Lapangan ^gambar-22-label

#### 13. Kelola Pemesanan Renter (`uc-kelola-pemesanan-renter`)
Menggambarkan alur pemantauan pesanan masuk dan penyelesaian masa sewa lapangan penyewa oleh Renter di lokasi:

![[images/drawio/gambar-activity-kelola-pemesanan-renter.drawio]]

**Gambar 23.** Activity Diagram Kelola Pemesanan Renter ^gambar-23-label

#### 14. Lihat Pendapatan Renter (`uc-pendapatan`)
Menggambarkan alur saat Renter mengakses visualisasi grafik tren omzet harian/bulanan hasil penyewaan lapangan:

![[images/drawio/gambar-activity-pendapatan.drawio]]

**Gambar 24.** Activity Diagram Lihat Pendapatan Renter ^gambar-24-label

#### 15. Buat Pengaduan Renter (`uc-pengaduan-renter`)
Menggambarkan alur pengiriman tiket keluhan Renter terkait kendala operasional usaha atau dashboard ke Admin:

![[images/drawio/gambar-activity-pengaduan-renter.drawio]]

**Gambar 25.** Activity Diagram Buat Pengaduan Renter ^gambar-25-label


### 3.3.4 *Activity Diagram* Aktor *Admin* (Administrator Sistem) ^gambar-14

#### 16. Lihat Dashboard Admin (`uc-dashboard-admin`)
Menggambarkan alur saat Admin memantau data ringkasan agregat pengguna, venue, dan omzet transaksi di platform:

![[images/drawio/gambar-activity-dashboard-admin.drawio]]

**Gambar 26.** Activity Diagram Lihat Dashboard Admin ^gambar-26-label

#### 17. Kelola Data Pengguna (`uc-kelola-user`)
Menggambarkan alur penangguhan akses akun pengguna (suspend) dan verifikasi profil bisnis Renter oleh Admin:

![[images/drawio/gambar-activity-kelola-user.drawio]]

**Gambar 27.** Activity Diagram Kelola Data Pengguna ^gambar-27-label

#### 18. Kelola Sport Type (`uc-sport-type`)
Menggambarkan alur manajemen master data jenis cabang olahraga (tambah/edit/hapus kategori) oleh Admin:

![[images/drawio/gambar-activity-sport-type.drawio]]

**Gambar 28.** Activity Diagram Kelola Sport Type ^gambar-28-label

#### 19. Moderasi Venue & Lapangan (`uc-moderasi`)
Menggambarkan alur pemeriksaan kelayakan pengajuan tempat olahraga dari Renter hingga pemberian status APPROVED atau REJECTED:

![[images/drawio/gambar-activity-moderasi.drawio]]

**Gambar 29.** Activity Diagram Moderasi Venue & Lapangan ^gambar-29-label

#### 20. Pantau Pemesanan & Pembayaran (`uc-pantau`)
Menggambarkan alur pengawasan real-time log reservasi dan status aliran dana transaksi penyewaan di platform:

![[images/drawio/gambar-activity-pantau.drawio]]

**Gambar 30.** Activity Diagram Pantau Pemesanan & Pembayaran ^gambar-30-label

#### 21. Kelola Pengaduan Admin (`uc-pengaduan-admin`)
Menggambarkan alur penanganan tiket aduan masuk, penulisan pesan respon, dan penutupan tiket laporan setelah teratasi:

![[images/drawio/gambar-activity-pengaduan-admin.drawio]]

**Gambar 31.** Activity Diagram Kelola Pengaduan Admin ^gambar-31-label


## 3.4 Implementasi *UI/UX* ^implementasi-ui-ux

Implementasi antarmuka pengguna dibangun secara dinamis menggunakan Next.js 16 App Router dengan pembagian halaman sebagai berikut:

### 3.4.1 Halaman Publik (Guest)

#### 1. Halaman Utama (*Landing Page*)
Halaman utama menampilkan banner hero dengan tagline FieldMax, pengenalan fitur unggulan platform, daftar kategori olahraga yang dapat diklik sebagai filter pencarian, testimoni pengguna, serta bagian kaki halaman dengan tautan navigasi.

![[halaman-utama.png]]

**Gambar 32.** Halaman Utama (Landing Page) ^gambar-32

#### 2. Halaman Pencarian Venue (`/search`)
Halaman pencarian menyediakan kolom input lokasi kota dan filter kategori jenis olahraga. Hasil pencarian ditampilkan dalam bentuk kartu venue interaktif yang menampilkan nama, lokasi, harga mulai, dan foto utama venue.

![[halaman-pencarian.png]]

**Gambar 33.** Halaman Pencarian Venue ^gambar-33

#### 3. Halaman Daftar Venue (`/venues`)
Halaman daftar venue menampilkan seluruh venue olahraga yang telah disetujui (*APPROVED*) oleh admin dalam format kartu. Setiap kartu memuat foto utama, nama venue, lokasi kota, dan kisaran harga lapangan per jam.

![[halaman-daftar-venue.png]]

**Gambar 34.** Halaman Daftar Venue ^gambar-34

#### 4. Halaman Detail Venue (`/venues/[id]`)
Halaman detail venue menampilkan informasi lengkap venue meliputi foto galeri, deskripsi, jadwal operasional harian, serta daftar lapangan olahraga yang tersedia beserta harga sewanya.

![[halaman-detail-venue.png]]

**Gambar 35.** Halaman Detail Venue ^gambar-35

#### 5. Halaman Daftar Lapangan (`/fields`)
Halaman daftar lapangan menampilkan semua lapangan olahraga yang tersedia di seluruh venue, dilengkapi dengan filter berdasarkan jenis olahraga dan rentang harga.

![[halaman-daftar-lapangan.png]]

**Gambar 36.** Halaman Daftar Lapangan ^gambar-36

#### 6. Halaman Detail Lapangan (`/fields/[id]`)
Halaman detail lapangan menampilkan informasi spesifik satu lapangan, mencakup foto galeri, deskripsi, harga per jam, ulasan pengguna, serta kalender pemilihan tanggal dan jam sewa untuk memulai proses reservasi.

![[halaman-detail-lapangan.png]]

**Gambar 37.** Halaman Detail Lapangan ^gambar-37

### 3.4.2 Halaman Autentikasi

#### 7. Halaman Login (`/login`)
Halaman login menyediakan form masuk akun dengan validasi *client-side* menggunakan Zod dan React Hook Form. Terdapat pula tautan menuju halaman pendaftaran bagi pengguna baru dan tautan lupa password.

![[halaman-login.png]]

**Gambar 38.** Halaman Login ^gambar-38

#### 8. Halaman Registrasi (`/register`)
Halaman registrasi menyediakan form pendaftaran akun baru yang mencakup input nama lengkap, email, kata sandi, konfirmasi kata sandi, dan pilihan peran akun (User atau Renter). Validasi dilakukan secara *real-time* di sisi klien.

![[halaman-register.png]]

**Gambar 39.** Halaman Registrasi ^gambar-39

#### 9. Halaman Verifikasi Email (`/verify-email`)
Halaman ini ditampilkan setelah pengguna berhasil mendaftar, menginformasikan bahwa kode OTP verifikasi enam digit telah dikirim ke alamat email yang didaftarkan dan meminta pengguna untuk mengisinya.

![[halaman-verifikasi-email.png]]

**Gambar 40.** Halaman Verifikasi Email ^gambar-40

#### 10. Halaman Lupa Password (`/forgot-password`)
Halaman lupa password menyediakan form input email untuk meminta pengiriman tautan pemulihan kata sandi. Sistem akan mengirimkan token reset ke email pengguna yang terdaftar melalui layanan SMTP Nodemailer.

![[halaman-lupa-password.png]]

**Gambar 41.** Halaman Lupa Password ^gambar-41

#### 11. Halaman Reset Password (`/reset-password`)
Halaman reset password menampilkan form pengisian kata sandi baru yang diakses melalui tautan pemulihan di email. Pengguna diminta mengisi kata sandi baru dan konfirmasinya sebelum disimpan ke basis data.

![[halaman-reset-password.png]]

**Gambar 42.** Halaman Reset Password ^gambar-42

### 3.4.3 Dashboard Pengguna (User / Customer)

#### 12. Halaman Kelola Profil (`/profile`)
Halaman profil memungkinkan pengguna mengatur data diri seperti nama lengkap, bio, alamat, nomor telepon, dan foto avatar. Foto profil diunggah ke *cloud* ImageKit CDN dan disimpan sebagai URL.

![[halaman-profil-user.png]]

**Gambar 43.** Halaman Profil Pengguna ^gambar-43

#### 13. Halaman Riwayat Booking (`/bookings`)
Halaman riwayat booking menampilkan daftar seluruh pemesanan lapangan yang pernah dilakukan pengguna. Setiap kartu booking menampilkan status transaksi beserta tombol aksi kontekstual: **Bayar** untuk transaksi PENDING, **Beri Ulasan** untuk transaksi COMPLETED, dan **Unduh Invoice** untuk semua transaksi.

![[halaman-riwayat-booking.png]]

**Gambar 44.** Halaman Riwayat Booking Pengguna ^gambar-44

#### 14. Halaman Detail Booking (`/bookings/[id]`)
Halaman detail booking menampilkan ringkasan lengkap satu transaksi pemesanan, mencakup informasi lapangan, tanggal dan jam sewa, total biaya, status pembayaran, dan riwayat status pemesanan.

![[halaman-detail-booking-user.png]]

**Gambar 45.** Halaman Detail Booking Pengguna ^gambar-45

#### 15. Halaman Laporan Keluhan (`/reports`)
Halaman laporan keluhan menyediakan form pengaduan masalah (kategori SCAM, TECHNICAL, PAYMENT, atau OTHER) serta menampilkan daftar riwayat laporan yang pernah diajukan beserta status penanganannya.

![[halaman-laporan-user.png]]

**Gambar 46.** Halaman Laporan Keluhan Pengguna ^gambar-46

#### 16. Halaman Detail Laporan (`/reports/[id]`)
Halaman detail laporan menampilkan rincian satu pengaduan beserta thread percakapan dua arah antara pengguna dan admin. Pengguna dapat melanjutkan percakapan selama laporan masih berstatus PENDING.

![[halaman-detail-laporan-user.png]]

**Gambar 47.** Halaman Detail Laporan Pengguna ^gambar-47

### 3.4.4 Dashboard Mitra (Renter)

#### 17. Halaman Dashboard Renter (`/renter/dashboard`)
Halaman dashboard mitra menampilkan rangkuman statistik bisnis harian: total lapangan aktif, jumlah pesanan masuk hari ini, ulasan terbaru dari penyewa, dan grafik tren pendapatan bulanan.

![[halaman-dashboard-renter.png]]

**Gambar 48.** Halaman Dashboard Renter ^gambar-48

#### 18. Halaman Kelola Venue (`/renter/venues`)
Halaman kelola venue menampilkan daftar seluruh venue milik renter. Renter dapat menambahkan venue baru, mengedit informasi venue, mengatur jadwal operasional mingguan, mengunggah galeri foto, serta mengajukan venue ke admin untuk mendapatkan persetujuan.

![[halaman-kelola-venue-renter.png]]

**Gambar 49.** Halaman Kelola Venue Renter ^gambar-49

#### 19. Halaman Detail Venue Renter (`/renter/venues/[id]`)
Halaman detail venue di sisi renter menampilkan pratinjau tampilan venue beserta ringkasan statistik seperti total lapangan, total booking, dan status persetujuan venue dari admin.

![[halaman-detail-venue-renter.png]]

**Gambar 50.** Halaman Detail Venue Renter ^gambar-50

#### 20. Halaman Kelola Lapangan (`/renter/fields`)
Halaman kelola lapangan menampilkan daftar seluruh lapangan olahraga milik renter lintas venue. Renter dapat menambahkan lapangan baru, mengatur harga per jam, mengunggah foto, menutup lapangan sementara (*is_closed*), dan mengajukan lapangan ke admin.

![[halaman-kelola-lapangan-renter.png]]

**Gambar 51.** Halaman Kelola Lapangan Renter ^gambar-51

#### 21. Halaman Edit Lapangan (`/renter/fields/[id]/edit`)
Halaman edit lapangan menyediakan form lengkap untuk memperbarui informasi lapangan seperti nama, deskripsi, jenis olahraga, harga per jam, serta pengelolaan galeri foto lapangan.

![[halaman-edit-lapangan-renter.png]]

**Gambar 52.** Halaman Edit Lapangan Renter ^gambar-52

#### 22. Halaman Kelola Booking Renter (`/renter/bookings`)
Halaman kelola booking menampilkan seluruh daftar pemesanan yang masuk untuk semua lapangan milik renter. Renter dapat memantau status pesanan, mengkonfirmasi kehadiran penyewa, serta menandai sesi sewa sebagai selesai (COMPLETED).

![[halaman-kelola-booking-renter.png]]

**Gambar 53.** Halaman Kelola Booking Renter ^gambar-53

#### 23. Halaman Pendapatan (`/renter/revenue`)
Halaman pendapatan menampilkan visualisasi grafik analitik tren omzet harian dan bulanan, total transaksi terkonfirmasi, serta rincian pendapatan per lapangan yang dikelola.

![[halaman-pendapatan-renter.png]]

**Gambar 54.** Halaman Pendapatan Renter ^gambar-54

#### 24. Halaman Laporan Pengaduan Renter (`/renter/reports`)
Halaman laporan pengaduan renter menampilkan daftar keluhan yang pernah diajukan oleh renter kepada admin, beserta status penanganannya (PENDING atau RESOLVED).

![[halaman-laporan-renter.png]]

**Gambar 55.** Halaman Laporan Pengaduan Renter ^gambar-55

#### 25. Halaman Detail Laporan Renter (`/renter/reports/[id]`)
Halaman detail laporan pengaduan renter menampilkan rincian satu tiket keluhan beserta thread percakapan dua arah antara renter dan admin platform.

![[halaman-detail-laporan-renter.png]]

**Gambar 56.** Halaman Detail Laporan Renter ^gambar-56

### 3.4.5 Dashboard Administrator (Admin)

#### 26. Halaman Dashboard Admin (`/admin/dashboard`)
Halaman dashboard administrator menampilkan ringkasan statistik platform secara keseluruhan, mencakup total pengguna terdaftar, total venue, total lapangan aktif, dan total transaksi yang berjalan di platform FieldMax.

![[halaman-dashboard-admin.png]]

**Gambar 57.** Halaman Dashboard Admin ^gambar-57

#### 27. Halaman Kelola Pengguna (`/admin/users`)
Halaman kelola pengguna menampilkan daftar seluruh akun yang terdaftar di platform, baik User, Renter, maupun Admin. Administrator dapat melihat detail profil, memverifikasi data bisnis Renter, atau menonaktifkan akun yang melanggar kebijakan.

![[halaman-kelola-pengguna-admin.png]]

**Gambar 58.** Halaman Kelola Pengguna Admin ^gambar-58

#### 28. Halaman Moderasi Venue (`/admin/venues`)
Halaman moderasi venue menampilkan daftar venue yang sedang menunggu peninjauan (status PENDING). Admin dapat mengubah status venue menjadi APPROVED agar tampil di halaman publik, atau REJECTED dengan menyertakan alasan penolakan sebagai umpan balik bagi renter.

![[halaman-moderasi-venue-admin.png]]

**Gambar 59.** Halaman Moderasi Venue Admin ^gambar-59

#### 29. Halaman Edit Venue Admin (`/admin/venues/[id]/edit`)
Halaman edit venue di sisi admin memungkinkan administrator memperbarui informasi venue, mengubah status verifikasi, serta mengisi alasan penolakan apabila venue tidak memenuhi syarat platform.

![[halaman-edit-venue-admin.png]]

**Gambar 60.** Halaman Edit Venue Admin ^gambar-60

#### 30. Halaman Moderasi Lapangan (`/admin/fields`)
Halaman moderasi lapangan menampilkan daftar lapangan yang diajukan oleh renter dan memerlukan peninjauan admin. Admin dapat menyetujui atau menolak lapangan dengan mekanisme yang sama seperti moderasi venue.

![[halaman-moderasi-lapangan-admin.png]]

**Gambar 61.** Halaman Moderasi Lapangan Admin ^gambar-61

#### 31. Halaman Edit Lapangan Admin (`/admin/fields/[id]/edit`)
Halaman edit lapangan di sisi admin memungkinkan administrator memperbarui data lapangan, mengubah status verifikasi, serta memberikan keterangan penolakan kepada renter apabila lapangan tidak disetujui.

![[halaman-edit-lapangan-admin.png]]

**Gambar 62.** Halaman Edit Lapangan Admin ^gambar-62

#### 32. Halaman Kelola Sport Type (`/admin/sport-types`)
Halaman kelola sport type merupakan panel manajemen data master jenis cabang olahraga. Administrator dapat menambahkan kategori olahraga baru, mengedit nama kategori yang ada, atau menghapus kategori yang tidak lagi digunakan.

![[halaman-sport-type-admin.png]]

**Gambar 63.** Halaman Kelola Sport Type Admin ^gambar-63

#### 33. Halaman Kelola Booking Admin (`/admin/bookings`)
Halaman kelola booking admin menampilkan seluruh riwayat transaksi pemesanan yang terjadi di platform FieldMax, beserta informasi status booking dan status pembayaran dari setiap transaksi.

![[halaman-kelola-booking-admin.png]]

**Gambar 64.** Halaman Kelola Booking Admin ^gambar-64

#### 34. Halaman Detail Booking Admin (`/admin/bookings/[id]`)
Halaman detail booking admin menampilkan informasi lengkap satu transaksi pemesanan, termasuk data penyewa, lapangan yang dipesan, waktu sewa, total biaya, serta status pembayaran yang terintegrasi dengan Midtrans.

![[halaman-detail-booking-admin.png]]

**Gambar 65.** Halaman Detail Booking Admin ^gambar-65

#### 35. Halaman Pengaduan Masalah Admin (`/admin/reports`)
Halaman pengaduan masalah menampilkan seluruh tiket keluhan yang masuk dari pengguna dan renter, dikelompokkan berdasarkan status (PENDING atau RESOLVED). Admin dapat menelusuri dan menangani setiap laporan yang masuk.

![[halaman-laporan-admin.png]]

**Gambar 66.** Halaman Daftar Laporan Admin ^gambar-66

#### 36. Halaman Detail Laporan Admin (`/admin/reports/[id]`)
Halaman detail laporan admin menampilkan rincian tiket pengaduan beserta thread percakapan dua arah. Admin dapat membalas pesan pengguna dan mengubah status laporan menjadi RESOLVED setelah permasalahan terselesaikan.

![[halaman-detail-laporan-admin.png]]

**Gambar 67.** Halaman Detail Laporan Admin ^gambar-67


## 3.5 Pengujian Sistem ^pengujian-sistem

### 3.5.1 *Black Box Testing*

*Black box testing* digunakan untuk menguji fungsionalitas sistem informasi FieldMax untuk memastikan input dan output berjalan sesuai dengan skenario bisnis reservasi lapangan olahraga yang dirancang.

**Tabel 22.** Pengujian Halaman Utama & Pencarian Venue ^tabel-22

Pengujian pada Tabel 22 berfokus pada fungsionalitas halaman publik yang dapat diakses oleh pengunjung tanpa perlu autentikasi. Skenario pertama menguji fitur filter olahraga di halaman utama (*landing page*) — ketika pengunjung menekan opsi cabang olahraga, sistem harus mengarahkan ke halaman pencarian dengan parameter filter yang sesuai. Skenario kedua menguji fitur pencarian berbasis lokasi, di mana pengunjung mengetik nama kota dan sistem menampilkan daftar venue yang berada di kota tersebut. Skenario ketiga menguji navigasi ke halaman detail venue, memastikan bahwa informasi venue, fasilitas, foto, dan daftar lapangan ditampilkan dengan benar. Ketiga skenario ini mewakili jalur utama (*happy path*) yang dilalui pengunjung sebelum memutuskan untuk membuat akun dan melakukan reservasi.

| No | Deskripsi Pengujian                                                 | Hasil yang Diharapkan                                                                       | Hasil Pengujian |
| --- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------- |
| 1  | Pengunjung menekan opsi cabang olahraga di landing page             | Sistem menyaring dan mengarahkan ke halaman pencarian dengan filter olahraga tersebut aktif | Berhasil        |
| 2  | Pengunjung mengetik nama kota pada input pencarian dan menekan cari | Sistem menampilkan daftar venue olahraga yang berada di kota tersebut                       | Berhasil        |
| 3  | Pengunjung menekan salah satu kartu venue olahraga                  | Sistem menampilkan halaman informasi detail venue, fasilitas, foto, dan lapangan            | Berhasil        |

**Tabel 23.** Pengujian Fitur Otentikasi & Akun ^tabel-23

Pengujian pada Tabel 23 mencakup tiga skenario kritis dalam alur otentikasi pengguna. Skenario pertama menguji validasi pendaftaran — sistem harus menolak pendaftaran dengan email yang sudah terdaftar dan menampilkan pesan peringatan yang sesuai, mengandalkan constraint *unique* pada kolom `email` di tabel *users*. Skenario kedua menguji proses *login* yang berhasil, di mana sistem membuat sesi baru di tabel *sessions* dan mengatur *cookie* `sessionId` pada peramban pengguna. Skenario ketiga menguji fitur *forgot password*, memastikan bahwa token reset dibuat di tabel *reset_tokens* dan email pemulihan terkirim melalui layanan SMTP Nodemailer. Ketiga skenario ini memvalidasi keandalan sistem autentikasi sebagai gerbang utama keamanan platform.

| No | Deskripsi Pengujian                                                  | Hasil yang Diharapkan                                                                       | Hasil Pengujian |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------- |
| 1  | Pengguna mendaftar dengan email yang sudah terdaftar                 | Sistem memvalidasi input dan menampilkan pesan peringatan email telah digunakan             | Berhasil        |
| 2  | Pengguna masuk (login) dengan email dan password yang sesuai         | Sistem membuat sesi login (Session) di database dan mengarahkan pengguna ke halaman beranda | Berhasil        |
| 3  | Pengguna menekan tombol "Lupa Password" dan mengirim email pemulihan | Sistem mengirim token reset (ResetToken) ke email pengguna                                  | Berhasil        |

**Tabel 24.** Skema Reservasi Lapangan & Pembayaran (User-Side) ^tabel-24

Pengujian pada Tabel 24 memvalidasi alur bisnis utama platform, yaitu reservasi lapangan hingga pembayaran. Skenario pertama menguji logika ketersediaan (*availability*) — sistem harus menghitung total tarif berdasarkan durasi sewa dan memeriksa bahwa slot waktu yang dipilih tidak bentrok dengan pemesanan lain pada lapangan yang sama. Skenario kedua menguji integrasi dengan Midtrans Snap — setelah pengguna menekan tombol bayar, sistem membuat data *booking* baru berstatus PENDING dan data *payment* dengan *snap token* dari Midtrans, kemudian memunculkan pop-up pembayaran. Skenario ketiga merupakan pengujian paling kritis yang memvalidasi penanganan *webhook callback* dari Midtrans — ketika notifikasi pembayaran berhasil diterima, sistem harus mengubah status pembayaran menjadi PAID dan status pemesanan menjadi CONFIRMED. Rangkaian skenario ini menguji integritas transaksi dari ujung ke ujung.

| No | Deskripsi Pengujian                                                          | Hasil yang Diharapkan                                                                                           | Hasil Pengujian |
| --- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------- |
| 1  | User memilih tanggal sewa dan rentang waktu/jam sewa lapangan                | Sistem menghitung total tarif berdasarkan harga per jam dan memeriksa ketersediaan jam                          | Berhasil        |
| 2  | User menekan tombol "Bayar Sekarang"                                         | Sistem membuat data booking baru (status PENDING) dan memunculkan pop-up Midtrans Snap                          | Berhasil        |
| 3  | User menyelesaikan transaksi pembayaran pada simulasi bank transfer Midtrans | Sistem menerima webhook callback, mengubah status pembayaran menjadi PAID, dan status booking menjadi CONFIRMED | Berhasil        |

**Tabel 25.** Fitur Ulasan Lapangan & Laporan Pengaduan ^tabel-25

Pengujian pada Tabel 25 memvalidasi dua fitur pendukung yang memperkaya pengalaman pengguna setelah transaksi selesai. Skenario pertama menguji fitur ulasan — pengguna yang pemesanannya telah berstatus COMPLETED dapat memberikan rating bintang 5 dan komentar, yang kemudian tersimpan di tabel *reviews* dan memengaruhi rata-rata rating lapangan yang dihitung ulang secara otomatis. Skenario kedua menguji fitur laporan pengaduan — pengguna dapat membuat laporan baru dengan kategori PAYMENT, dan sistem menyimpannya di tabel *reports* dengan status awal PENDING. Kedua skenario ini memastikan bahwa pengguna memiliki saluran untuk memberikan umpan balik positif (ulasan) maupun negatif (pengaduan) terhadap layanan yang diterima.

| No | Deskripsi Pengujian                                                            | Hasil yang Diharapkan                                                                     | Hasil Pengujian |
| --- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | --------------- |
| 1  | User memberikan rating bintang 5 dan komentar pada pesanan berstatus COMPLETED | Ulasan tersimpan di tabel reviews dan rata-rata rating lapangan terupdate secara otomatis | Berhasil        |
| 2  | User mengirim laporan pengaduan masalah transaksi dengan kategori PAYMENT      | Laporan tersimpan di tabel reports dengan status awal PENDING                             | Berhasil        |

**Tabel 26.** Pengelolaan Venue & Lapangan (Renter-Side) ^tabel-26

Pengujian pada Tabel 26 memvalidasi fungsionalitas utama yang dimiliki oleh Renter dalam mengelola venue dan lapangan miliknya. Skenario pertama menguji pembuatan venue baru — setelah Renter mengisi formulir detail lokasi dan jam operasional, data venue tersimpan dengan status DRAFT yang menandakan venue masih dalam proses penyusunan. Skenario kedua menguji fitur unggah foto yang terintegrasi dengan ImageKit — foto diproses melalui multer *middleware* di server, diunggah ke ImageKit menggunakan SDK, dan URL hasil unggahan disimpan di tabel *venue_photos*. Skenario ketiga menguji penambahan lapangan baru di bawah venue, mencakup pemilihan jenis olahraga dari tabel *sport_types* dan penetapan harga sewa per jam, dengan data lapangan tersimpan berstatus PENDING menunggu persetujuan admin. Ketiga skenario ini mewakili alur kerja inti Renter dari pendaftaran venue hingga lapangan siap disewakan.

| No | Deskripsi Pengujian                                                       | Hasil yang Diharapkan                                                         | Hasil Pengujian |
| --- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------- |
| 1  | Renter mengisi formulir detail lokasi venue dan jam operasional           | Data venue disimpan di database dengan status DRAFT menunggu verifikasi admin | Berhasil        |
| 2  | Renter mengunggah foto venue olahraga                                     | Foto diproses menggunakan ImageKit SDK dan tersimpan dalam tabel venue_photos | Berhasil        |
| 3  | Renter menambahkan lapangan olahraga baru dan mengatur harga sewa per jam | Data lapangan disimpan ke tabel fields berstatus PENDING                      | Berhasil        |

**Tabel 27.** Panel Moderasi & Administrasi (Admin-Side) ^tabel-27

Pengujian pada Tabel 27 memvalidasi peran Admin sebagai moderator dan pengawas platform. Skenario pertama menguji proses persetujuan venue — ketika Admin menekan tombol APPROVED pada panel tinjauan, status venue berubah menjadi APPROVED dan venue tersebut langsung dapat ditemukan di halaman pencarian publik. Perubahan status ini merupakan titik kritis dalam alur bisnis karena menentukan apakah venue dan lapangan milik Renter dapat mulai menerima pemesanan. Skenario kedua menguji fitur balasan pengaduan — Admin dapat membalas laporan pengguna, pesan balasan tersimpan di tabel *report_replies*, dan pengguna terkait dapat melihat balasan tersebut pada halaman detail laporannya. Kedua skenario ini menegaskan peran ganda Admin sebagai penjaga kualitas (melalui moderasi) sekaligus penyedia dukungan (melalui penanganan pengaduan).

| No | Deskripsi Pengujian                                               | Hasil yang Diharapkan                                                                       | Hasil Pengujian |
| --- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------- |
| 1  | Admin membuka panel review venue baru dan menekan tombol APPROVED | Status venue berubah menjadi APPROVED dan venue dapat dicari di halaman publik              | Berhasil        |
| 2  | Admin membalas pesan keluhan transaksi pembayaran dari user       | Pesan tanggapan disimpan ke tabel report_replies dan dapat dilihat oleh user terkait pada halaman laporan | Berhasil        |

### 3.5.2 Pembahasan Hasil Penelitian ^pembahasan-hasil-penelitian

Berdasarkan serangkaian tahapan perancangan, implementasi, dan pengujian sistem yang telah dilaksanakan, terdapat beberapa poin pembahasan utama yang merefleksikan pencapaian tujuan penelitian dan penyelesaian rumusan masalah:

#### 1. Otomasi Proses Bisnis dan Penggantian Sistem Konvensional
Pengembangan platform FieldMax berhasil mentransformasikan alur operasional reservasi lapangan olahraga yang sebelumnya bersifat konvensional dan manual (menggunakan buku agenda fisik, formulir Google Form terpisah, atau obrolan pesan instan WhatsApp) menjadi sistem berbasis web terintegrasi. Penerapan arsitektur *full-stack TypeScript monorepo* membagi tanggung jawab sistem secara terstruktur: Next.js (App Router) pada sisi antarmuka (*frontend*) memberikan pengalaman pengguna yang responsif dan interaktif, sedangkan Express.js pada sisi peladen (*backend*) mengisolasi logika bisnis ke dalam pola tiga lapis (*Controller-Service-Route*). Penggunaan Prisma ORM dan basis data PostgreSQL menjamin integritas data secara relasional dan konsisten. Seluruh data transaksi, informasi profil pengguna, jadwal operasional venue, serta galeri fasilitas tersimpan secara terpusat, aman, dan dapat diakses kapan saja.

#### 2. Mekanisme Pencegahan Bentrok Jadwal (*Double Booking*) dan Sinkronisasi *Real-Time*
Permasalahan klasik berupa jadwal pemesanan ganda (*double booking*) berhasil diatasi melalui penerapan algoritma validasi ketersediaan jadwal pada lapisan layanan pemesanan (*bookings service*). Ketika pengguna memilih tanggal dan slot waktu sewa tertentu, sistem mengeksekusi kueri pengecekan tumpang tindih waktu (*time overlap query*) pada basis data PostgreSQL. Apabila slot waktu tersebut telah terikat oleh pemesanan berstatus `PENDING` (dalam masa tenggat penyelesaian pembayaran) atau `CONFIRMED`, sistem secara otomatis menolak permintaan pemesanan baru pada slot tersebut. Selain itu, integrasi *webhook callback* notifikasi instan dari *payment gateway* Midtrans Snap memastikan status pembayaran terverifikasi secara *real-time*, sehingga slot waktu yang gagal atau melewati batas waktu pembayaran (*expired*) akan langsung dilepaskan kembali menjadi tersedia (*available*), sementara transaksi yang berhasil dibayar langsung dikunci secara permanen menjadi status `CONFIRMED`.

#### 3. Efektivitas Platform Multi-Tenant dan Dampak Penggunaan bagi Ketiga Aktor
Penerapan *Role-Based Access Control* (RBAC) pada platform FieldMax memberikan diferensiasi hak akses dan fungsionalitas yang proporsional bagi ketiga peran aktor sistem:
- **Pelanggan (*User*)**: Memperoleh fleksibilitas penuh untuk mencari venue olahraga berdasarkan filter cabang olahraga, kisaran harga, dan lokasi; memeriksa transparansi harga serta fasilitas pendukung; memilih jam sewa secara mandiri; dan menyelesaikan transaksi melalui berbagai kanal pembayaran digital (QRIS, *Virtual Account*, *e-Wallet*) tanpa perlu menunggu konfirmasi manual dari pihak pemilik lapangan.
- **Mitra Pengelola (*Renter*)**: Mendapatkan otonomi penuh dalam mengelola fasilitas fisik olahraga miliknya, mengatur jam operasional harian, menetapkan tarif per jam, serta memantau kalender reservasi lapangan. Kehadiran dasbor analitik pendapatan (*Revenue*) memberikan visualisasi omzet dan tren pemesanan secara transparan, mempermudah evaluasi kinerja bisnis tanpa perlu melakukan pembukuan manual.
- **Administrator (*Admin*)**: Memiliki visibilitas pengawasan menyeluruh terhadap ekosistem platform melalui mekanisme moderasi venue dan lapangan baru sebelum dipublikasikan, pengawasan data transaksi lintas mitra, pengelolaan master data jenis cabang olahraga, serta penanganan tiket pengaduan (*Report*) pengguna secara terpusat dan terstruktur.

Secara keseluruhan, hasil evaluasi fungsional melalui *Black Box Testing* pada Tabel 22 hingga Tabel 27 membuktikan bahwa seluruh modul sistem berjalan dengan tingkat keberhasilan 100% dan memenuhi seluruh spesifikasi kebutuhan yang telah dirumuskan pada tahap awal penelitian.



