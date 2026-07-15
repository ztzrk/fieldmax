# BAB I PENDAHULUAN ^bab-1 ^bab-1



## 1.1 Latar Belakang ^latar-belakang

Olahraga telah menjadi bagian penting dari gaya hidup masyarakat modern. Kesadaran akan pentingnya kesehatan mendorong peningkatan minat masyarakat terhadap aktivitas fisik, seperti futsal, badminton, basket, dan sepak bola mini. Peningkatan minat ini sejalan dengan meningkatnya permintaan akan fasilitas olahraga yang memadai. Bagi para pengelola fasilitas olahraga, hal ini merupakan peluang bisnis yang menjanjikan, namun juga menghadirkan tantangan dalam hal operasional dan manajemen pelayanan.

Saat ini, masih banyak penyedia jasa penyewaan lapangan olahraga yang menggunakan sistem konvensional atau manual dalam proses bisnisnya, seperti pencatatan pada buku agenda dan pemesanan melalui telepon atau aplikasi pesan singkat (WhatsApp). Metode ini memiliki kelemahan yang berdampak pada efisiensi operasional. Menurut penelitian Nadjamuddin (2023), penggunaan sistem manual sering menyulitkan pelanggan dalam mengetahui jadwal yang tersedia secara pasti dan membebani admin atau pengelola dalam mengolah data pemesanan. Permasalahan klasik seperti jadwal bersamaan (double booking), kesalahan pencatatan, dan lambatnya rekapitulasi laporan pendapatan menjadi kendala utama yang dihadapi oleh pengelola fasilitas olahraga (Ratama et al., 2022).

Selain itu, dari sisi pelanggan (User), ketiadaan platform terpusat membuat mereka kesulitan untuk mengakses informasi fasilitas dan melakukan pemesanan secara fleksibel. Saat ini, pelanggan menuntut kemudahan akses informasi dan transaksi yang cepat tanpa terikat waktu dan tempat. Sebagaimana dikemukakan oleh Nurhakim dkk. (2023), implementasi sistem informasi berbasis web bertujuan untuk memudahkan pemesanan secara daring, meningkatkan efisiensi operasional, serta meningkatkan kepuasan pelanggan melalui pelayanan yang lebih transparan dan responsif. Transformasi digital ini menjadi solusi strategis untuk memudahkan akses informasi antara kebutuhan pengguna akan fleksibilitas dan kebutuhan pengelola akan manajemen yang teratur.

Berdasarkan permasalahan tersebut, diperlukan adanya solusi berupa sistem informasi terintegrasi yang dapat menampung kebutuhan kedua belah pihak. Penelitian terbaru oleh Fortunata dan Cahyaningtyas (2023) menunjukkan bahwa pengembangan sistem penyewaan lapangan berbasis web terbukti memudahkan pelanggan dalam melakukan penyewaan dan membantu pemilik dalam mengelola data sewa secara lebih terstruktur.

Oleh karena itu, penelitian ini mengusulkan "Rancang Bangun Sistem Informasi Penyewaan dan Pengelolaan Lapangan Olahraga Berbasis Web". Sistem ini, yang kemudian dinamakan FieldMax, dirancang untuk memiliki fitur banyak role yang memfasilitasi Pemilik Fasilitas (Renter) dalam mengelola jadwal, lapangan, dan laporan transaksi, serta memudahkan Pelanggan (User) dalam melakukan pencarian, pengecekan ketersediaan jadwal secara real-time, dan pemesanan lapangan. Implementasi sistem ini diharapkan dapat menjadi solusi efisien untuk mengurangi kesalahan operasional dan meningkatkan kualitas layanan penyewaan fasilitas olahraga.

## 1.2 Rumusan Masalah ^rumusan-masalah

Berdasarkan latar belakang yang telah diuraikan, adapun rumusan masalah yang akan dibahas dalam penelitian ini yaitu sebagai berikut:

 
1. Bagaimana merancang dan membangun sistem informasi penyewaan lapangan olahraga berbasis web yang dapat menggantikan pencatatan manual?
 
2. Bagaimana mengatasi masalah jadwal yang konflik (double booking) dan ketidakpastian ketersediaan lapangan yang sering dialami oleh pelanggan dan pengelola?
 
3. Bagaimana menyediakan platform terintegrasi yang memudahkan pengelola (Renter) dalam manajemen data transaksi dan laporan pendapatan, serta memudahkan pelanggan (User) dalam pencarian dan pemesanan lapangan?

## 1.3 Tujuan Penelitian ^tujuan-penelitian

Tujuan yang ingin dicapai dari penelitian ini yaitu:

1. Merancang dan mengimplementasikan aplikasi berbasis web yang dapat menggantikan peran buku agenda dan komunikasi manual (WhatsApp) dalam proses pencatatan reservasi, sehingga data tersimpan secara digital, aman, dan terstruktur

2. Menyediakan fitur pengecekan jadwal ketersediaan lapangan secara real-time yang dapat diakses langsung oleh pelanggan, guna memastikan tidak ada dua pemesanan pada waktu dan lapangan yang sama.

3. Menghasilkan platform terpadu (FieldMax) yang mampu memberikan kemudahan bagi pemilik fasilitas (Renter) dalam mengelola operasional bisnis dan laporan, sekaligus memberikan kemudahan bagi pengguna (User) dalam mencari informasi lapangan dan melakukan transaksi pemesanan secara mandiri.

## 1.4 Batasan Masalah ^batasan-masalah

Dalam penelitian ini, ada beberapa batasan yang ditetapkan untuk menjaga agar fokus penelitian tetap jelas dan untuk memastikan hasil yang sesuai dengan tujuan yang diinginkan, yaitu:

 
1. Sistem ini dibangun berbasis Web (Website) menggunakan teknolog Next.js dan dapat diakses melalui browser pada perangkat desktop maupun mobile (responsif), namun tidak berupa aplikasi native (Android/iOS).
 
2. Basis data dari sistem aplikasi ini menggunakan PostgreSQL
 
3. Sistem tidak membahas manajemen keuangan/akuntansi yang mendalam (seperti neraca atau arus kas perusahaan), melainkan hanya menyediakan rekapitulasi laporan pendapatan transaksi penyewaan.

## 1.5 Manfaat Penelitian ^manfaat-penelitian

Manfaat yang didapatkan dari penelitian ini, yaitu yaitu:

1. Adanya sistem yang terintegrasi untuk proses reservasi, pembayaran, dan manajemen layanan penyewaan lapangan.

2. Makin mudahnya proses pemesanan layanan reservasi bagi calon user layanan penyewaan lapangan di Platform FieldMax.

## 1.6 Landasan Teori ^landasan-teori

### 1.6.1 Sistem Informasi Berbasis Web

Sistem informasi merupakan serangkaian kegiatan mengumpulkan, mengolah, menganalisis, serta mendistribusikan informasi yang dapat digunakan untuk mencapai tujuan tertentu, yang biasanya terdiri dari beberapa komponen di dalamnya meliputi manusia, perangkat keras, perangkat lunak, dan basis data. Dengan sistem informasi, proses komunikasi, transaksi, kegiatan operasional, manajerial, hingga pengambilan keputusan dapat menjadi lebih akurat dan tepat. Di sisi lain, web adalah kumpulan halaman yang di dalamnya terdiri dari berbagai macam bentuk informasi, seperti teks, gambar, video, dan elemen multimedia lainnya yang dapat diakses kapan saja dan di mana saja melalui jaringan internet (Rahmi et al., 2023).

Sistem informasi berbasis web, berarti sistem informasi yang dibangun diwujudkan dalam bentuk web. Adanya hal ini diharapkan dapat memberikan banyak manfaat, terutama dari segi efisiensi karena dapat mengotomatisasi pekerjaan dan memudahkan proses bisnis, yang dalam kasus ini untuk sistem reservasi lapangan olahraga dan manajemen penyedia lapangan (renter) pada platform FieldMax..

### 1.6.2 Reservasi Lapangan Olahraga

Reservasi merupakan sebuah proses pemesanan produk baik barang maupun jasa yang pada saat itu telah terdapat kesepahaman antara konsumen dengan produsen mengenai produk tersebut. Selama berlangsungnya proses reservasi biasanya ditandai dengan adanya proses tukar menukar informasi antara konsumen dan produsen atau penyedia jasa agar pemahaman akan produk dan cara pemesanannya dapat tercapai (Christanto et al., 2012). Proses reservasi ini dimungkinkan dilakukan secara daring, sehingga memungkinkan pengguna melakukan pemesanan secara fleksibel tanpa perlu datang langsung ke lokasi layanan. Selain untuk memudahkan akses bagi pengguna, sistem ini juga mendukung dari sisi internal pemilik lapangan (sebagai penyedia fasilitas), untuk pengoptimalan dari sisi tata kelola waktu dan sumber daya operasional. Penerapan reservasi secara daring pada berbagai fasilitas olahraga menunjukkan bahwa penggunaan sistem ini dapat meningkatkan efektivitas pelayanan dengan mengurangi waktu tunggu, menghindari bentrok jadwal (double booking), dan memperbaiki keseluruhan alur penyewaan.

 

Adapun sistem reservasi pada layanan olahraga tidak hanya berfungsi untuk mengatur jadwal penyewaan lapangan, tetapi juga mendukung pengelolaan data pengguna, ketersediaan fasilitas lapangan, serta rekapitulasi operasional renter. Penelitian mengenai sistem informasi reservasi layanan berbasis web menunjukkan bahwa penerapan sistem tersebut mampu meningkatkan efisiensi pelayanan, mempermudah proses pemesanan jadwal sewa, serta membantu manajemen tempat olahraga dalam mengelola operasional secara lebih sistematis dan terkontrol (Hasibuan et al., 2024). Sehingga reservasi lapangan olahraga dapat diartikan sebagai sistem pemesanan dan penyewaan secara daring di dalam domain fasilitas olahraga.

### 1.6.3 Layanan Penyewaan Lapangan di FieldMax

Platform FieldMax merupakan sebuah sistem marketplace multi-tenant yang dirancang khusus untuk memfasilitasi penyewaan lapangan olahraga di Kota Makassar. Platform ini menghubungkan pemilik venue olahraga (*Renter*) dengan masyarakat umum (*User*) yang ingin menyewa lapangan secara praktis.

Sebelum adanya platform ini, proses penyewaan fasilitas olahraga pada umumnya masih dilakukan secara manual menggunakan chat WhatsApp atau Google Form, di mana pencatatan jadwal sewa dan konfirmasi pembayaran transfer bank harus diverifikasi manual satu per satu. Alur konvensional ini membutuhkan waktu lama, tidak efisien, dan rentan terhadap kesalahan pencatatan jadwal ganda (*double booking*). Melalui FieldMax, seluruh proses dari pencarian lapangan, cek ketersediaan jadwal real-time, reservasi, hingga pembayaran terintegrasi otomatis secara online menggunakan Midtrans payment gateway.

### 1.6.4 Teknologi Pengembangan

#### 1. Next.js.

Next.js merupakan kerangka kerja (framework) berbasis pustaka (library) React.js yang mempermudah pengembangan aplikasi web modern yang mendukung Search Engine Optimization (SEO). Framework ini dirancang untuk meminimalkan masalah performa pada aplikasi yang hanya menggunakan Client-Side Rendering (CSR) ataupun Server-Side Rendering (SSR) dengan mengombinasikan keduanya. Selain SSR dan CSR, framework ini juga menyediakan beragam fitur bawaan yang lain, seperti Static Site Generation (SSG), dynamic routing, dan lain sebagainya, sehingga proses pembangunan bagian antar-muka aplikasi dapat lebih efisien (Pati & Zaki, 2025).

Dengan adanya fitur tersebut, pengembang dapat menentukan proses rendering sesuai kebutuhan, dilakukan pada saat permintaan diterima (SSR), pada saat proses build (SSG), pada saat sudah sampai di client-side (CSR) atau dengan mengombinasikannya. Oleh karena itu, Next.js menjadi salah satu pilihan krusial untuk menangani bagian Front End dari sistem ini. Kombinasi yang dibawa oleh Next.js mampu menjadikan library React.js, yang basisnya hanya pada client-side, memiliki kapabilitas optimal hingga keramahan yang baik terhadap performa SEO secara menyeluruh..

#### 2. Express.js.

Express.js merupakan salah satu framework pengembangan aplikasi sisi antarmuka (backend) Node.js yang paling populer, minimal, dan fleksibel, menyediakan serangkaian fitur tangguh untuk web maupun Application Programming Interface (API) (Nasution & Pane, 2025). Express.js berjalan di sisi server platform Node.js, memungkinkan pengembang membangun lingkungan RESTful API yang cepat, efisien, serta sangat mudah diskalakan sesuai kebutuhan fungsional user. Framework ini bekerja menggunakan arsitektur yang mengutamakan kecepatan pemrosesan dan pola pertukaran data secara aman (Azkarin et al., 2023).

#### 3. PostgreSQL.

PostgreSQL merupakan salah satu Relational Database Management System (RDBMS) sumber terbuka yang populer. PostgreSQL versi terbaru memprioritaskan fokus pada tingkatan performa, dukungan paralelisme kueri komputasi kompleks, serta relasi deployment berbasis layanan awan (cloud). Repositori PostgreSQL menyediakan ragam tipe data dari standar format SQL, tipe array, hingga ekstensi penyimpanan semantik JSON untuk fleksibilitas komprehensif terhadap basis data.

Keunggulan PostgreSQL terdapat di mekanisme implementasi Multi-Version Concurrency Control (MVCC) beserta arsitektur pengindekan berlapis. Berkat MVCC, PostgreSQL sanggup menoleransi beragam instruksi transaksi data dari pengguna platform yang berinteraksi dalam satu waktu secara bersamaan, sehingga ketersediaan akses data (availability) pada platform tetap optimal meski dalam trafik request yang tajam dan tak terprediksi dari user. Mekanisme ini menjamin operasi tabel data secara transaksional yang saling tertutup dari intervensi transaksi pihak lain (Salunke & Ouda, 2024).

#### 4. *Payment Gateway.*

Payment gateway merupakan teknologi jembatan perantara fungsional untuk memfasilitasi proses transaksi pembayaran non-tunai yang aman secara sistem antara sistem bisnis digital dengan pihak pelanggan, yang biasanya disertai sistem intelijen untuk mendeteksi penipuan siber. Saat ini, payment gateway krusial pemanfaatannya di bermacam inovasi elektronik dan digital. Dalam konteks sistem e-commerce dan reservasi layanan, sistem ini sanggup mempermudah transaksi beragam ragam metode pembayaran konvensional dari dompet kelab ke rekening bank dalam satu platform tanpa celah verifikasi palsu. Pengguna melakukan pembelajaan via platform, memilih vendor, dan selanjutnya diinisiasikan pihak pemroses (processor) hingga payment gateway bertugas meneruskan verifikasi approval penyelesaian akhir kepada sistem (Siahaan & Sianturi, 2024).

Hal tersebut tecermin nyata di dalam arsitektur penelitian ini. Payment gateway berfungsi mengurus jalur pertukaran keuangan yang diajukan oleh pengguna FieldMax untuk menyewa lapangan secara beragam rupa pembayaran digital instan. Begitu inisiasi transaksi berlangsung dan diakhiri lewat pembayaran berhasil, webhook server pembayaran akan menyampaikan status perintah agar FieldMax langsung mengubah status pesanan PENDING menjadi PAID, maupun jika melebihi tenggatnya bertransisi kepada EXPIRED/CANCELLED.

Payment gateway yang dimanfaatkan di riset sistem FieldMax adalah Midtrans. Midtrans merupakan penyedia infrastruktur payment gateway terintegrasi yang paling terkemuka di tanah air. Pilihan medium digital yang luas (mulai dari Virtual Account, QRIS, Dompet digital, GoPay, dan lainnya) memudahkan konektivitas Application Programming Interface (API) yang mulus di sisi aplikasi tanpa hambatan manual. Efisiensi luar biasa terasa pada mitigasi pengawasan riwayat pendapatan transaksi pemilik venue, pemberitahuan realisasi real-time, hingga mengikis potensi salah verifikasi dari pihak sistem manual reservasi lapangan (Hafiz et al., 2023)..

### 1.6.5 Pemodelan Sistem Berbasis UML

*Unified Modeling Language* (UML) merupakan cara pemodelan berbasis gambar untuk kebutuhan visualisasi, perumusan, pembangunan, serta pendokumentasian dari sebuah sistem (Pressman, 2010). Oleh karena itu, UML dapat dikatakan sebagai, standar penyusunan *blueprint* sistem, mulai dari pemodelan proses bisnis hingga berbagai komponen yang dibutuhkan dalam pengembangan sebuah perangkat lunak. Beberapa komponennya yang digunakan dalam penelitian ini meliputi:

#### 1. *Use Case Diagram.*

*Use Case Diagram* adalah salah satu pemodelan untuk perilaku (behavior) sistem yang akan dibuat, di mana ia menguraikan interaksi antara satu atau lebih aktor dengan sistem. Diagram ini menggambarkan urutan interaksi yang saling berkaitan antara sistem dan aktor dari perspektif pengguna (*external view*). Tujuannya adalah mendefinisikan batas-batas sistem dan mengorganisasi persyaratan fungsional, serta mengetahui fungsi apa saja yang ada di dalam sistem dan aktor yang berhak menggunakan fungsi-fungsi tersebut.

**Tabel 1.** Komponen *use case diagram* ^tabel-1

| SIMBOL | NAMA | KETERANGAN |
| :---: | :--- | :--- |
| <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/></svg> | Actor | Mewakili peran orang, sistem yang lain, atau alat ketika berinteraksi dengan use case |
| <svg width="40" height="20" viewBox="0 0 40 20"><ellipse cx="20" cy="10" rx="18" ry="8" stroke="currentColor" stroke-width="2" fill="none"/></svg> | Use Case | Abstraksi dan interaksi antara sistem dan aktor |
| <svg width="40" height="20" viewBox="0 0 40 20"><line x1="2" y1="10" x2="38" y2="10" stroke="currentColor" stroke-width="2"/></svg> | Association | Abstraksi dari penghubung antara actor dengan use case |
| <svg width="40" height="20" viewBox="0 0 40 20"><line x1="2" y1="10" x2="30" y2="10" stroke="currentColor" stroke-width="2"/><polygon points="30,6 38,10 30,14" stroke="currentColor" stroke-width="2" fill="none"/></svg> | Generalization | Menunjukkan spesialisasi actor untuk dapat berpartisipasi dengan use case |
| <svg width="40" height="20" viewBox="0 0 40 20"><line x1="2" y1="10" x2="30" y2="10" stroke="currentColor" stroke-width="2" stroke-dasharray="3,3"/><polygon points="30,6 38,10 30,14" fill="currentColor"/></svg> | Include | Menunjukkan bahwa suatu use case tambahan merupakan fungsionalitas dari use case lainnya jika suatu kondisi terpenuhi |

#### 2. *Activity Diagram.*

*Activity Diagram* adalah pemodelan yang dilakukan pada suatu sistem untuk menggambarkan aktivitas sistem berjalan dan merepresentasikan aliran proses atau alur kerja (*workflow*). Diagram ini sangat mirip dengan *flowchart* karena memodelkan alur kerja dari satu aktivitas ke aktivitas lainnya atau dari aktivitas ke status, termasuk di dalamnya keputusan-keputusan yang mungkin terjadi. Diagram ini memodelkan proses bisnis dan urutan aktivitas dalam sebuah proses.

**Tabel 2.** Komponen *activity diagram* ^tabel-2

| SIMBOL | NAMA | KETERANGAN |
| :---: | :--- | :--- |
| <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="currentColor"/></svg> | Start Point | Titik awal bagaimana objek diawali atau dibentuk |
| <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="10" cy="10" r="4" fill="currentColor"/></svg> | End Point | Titik akhir objek |
| <svg width="40" height="20" viewBox="0 0 40 20"><rect x="2" y="2" width="36" height="16" rx="5" ry="5" stroke="currentColor" stroke-width="2" fill="none"/></svg> | Activities | Memperlihatkan bagaimana masing masing antarmuka kelas saling berinteraksi satu sama lain |
| <svg width="20" height="20" viewBox="0 0 20 20"><polygon points="10,2 18,10 10,18 2,10" stroke="currentColor" stroke-width="2" fill="none"/></svg> | Decision | Menggambarkan suatu Keputusan atau tindakan yang harus diambil pada kondisi tertentu |

#### 3. *Entity Relationship Diagram *(ERD)*.*

*Entity Relationship Diagram* (ERD) adalah diagram yang berbentuk notasi grafis yang merupakan salah satu alat utama dalam perancangan basis data. ERD memodelkan struktur data secara konseptual, yang mendeskripsikan hubungan antara data-data yang saling berhubungan. ERD adalah tahap dasar dalam membuat database dan merupakan teknik perancangan yang paling banyak digunakan karena semua entitas, atribut, dan relasinya harus dirancang secara lengkap dan detail.

**Tabel 3.** Komponen *Entity Relationship Diagram* ^tabel-3

| SIMBOL | NAMA | KETERANGAN |
| :---: | :--- | :--- |
| <svg width="40" height="20" viewBox="0 0 40 20"><rect x="2" y="2" width="36" height="16" stroke="currentColor" stroke-width="2" fill="none"/></svg> | Entity | Merupakan suatu simbol untuk mewakili suatu objek dengan karakteristik sama yang dilengkapi oleh atribut. |
| <svg width="40" height="20" viewBox="0 0 40 20"><ellipse cx="20" cy="10" rx="18" ry="8" stroke="currentColor" stroke-width="2" fill="none"/></svg> | Attribute | Merupakan suatu simbol yang menjelaskan suatu entitas karakteristik dan juga relasinya. |
| <svg width="30" height="20" viewBox="0 0 30 20"><polygon points="15,2 27,10 15,18 3,10" stroke="currentColor" stroke-width="2" fill="none"/></svg> | Strong Relationship | Menggambarkan hubungan beberapa entitas berdasarkan fakta pada suatu lingkungan. |
| <svg width="40" height="20" viewBox="0 0 40 20"><line x1="2" y1="10" x2="38" y2="10" stroke="currentColor" stroke-width="2"/></svg> | Connection | Menggambarkan keterkaitan antara simbol berupa garis penghubung |

 

### 1.6.6 Ruang Lingkup Penelitian Sistem Informasi

Terdapat ruang lingkup penelitian sistem informasi yang terdiri dari Environment, IS Research, dan Technology seperti yang dapat dilihat berikut.

![Design science research in information systems according to [33] | Download Scientific Diagram](images/image015.png)

**Gambar 1.** Kerangka *Design Science Research* ^gambar-1

Pada bagian *Environment* atau lingkungan, mencerminkan konteks permasalahan penelitian muncul. Lingkungan terdiri atas *people* (manusia), *organizations* (organisasi), dan *technology* (teknologi). Di dalam lingkungan terdapat tujuan, tugas, permasalahan, dan peluang yang membentuk kebutuhan bisnis organisasi. Lingkungan inilah yang mendefinisikan ruang permasalahan dan memastikan bahwa penelitian yang dilakukan memiliki relevansi praktis.

Bagian *Knowledge Base* mencakup teori, konsep, model, metode, dan lain sebagainya yang menjadi landasan ilmiah yang digunakan dalam proses penelitian. Bagian ini berfungsi sebagai sumber *rigor* ilmiah, yaitu sebagai landasan utama untuk memastikan bahwa desain dan evaluasi dilakukan secara sistematis dan dapat dipertanggungjawabkan secara akademik.

Adapun *IS Research* yang terletak di antara *Environment* dan *Knowledge Base*, merupakan fase peneliti merancang dan mengevaluasi artefak sistem informasi untuk menjawab kebutuhan bisnis yang ada. Proses ini didasarkan dari masalah yang telah diuraikan pada bagian *Environtment *dan beberapa teori penyelesaian yang diuraikan pada bagian *Knowledge Base*. Proses ini menghasilkan kontribusi ilmiah berupa artefak yang tervalidasi serta pengetahuan baru yang dapat digunakan kembali pada konteks serupa (Hevner et al., 2004).

### 1.6.7 Metode Pengembangan (*Waterfall*)

Metode waterfall merupakan salah satu metode dalam *System Development Life Cycle* (SDLC). Metode ini memiliki ciri khas bahwa setiap tahap harus diselesaikan terlebih dahulu sebelum melanjutkan ke tahap berikutnya. Dengan alur tersebut, fokus pada tiap fase dapat dimaksimalkan karena tidak ada pengerjaan paralel. Metode waterfall juga bersifat rekursif, karena setiap tahapnya dapat diulang kembali tanpa batas sampai mencapai hasil yang optimal (Heriyanti & Ishak, 2020).

![](images/image016.png)

**Gambar 2.** Tahapan dari metode waterfall ^gambar-2

1.***Requirement***, tahap ini merupakan tahap awal untuk menetapkan spesifikasi kebutuhan perangkat lunak. Pada fase ini, analis sistem dan analis bisnis berdiskusi untuk menentukan kebutuhan fungsional, seperti mendeskripsikan interaksi pengguna dengan sistem, maupun non-fungsional, yang meliputi reliabilitas, skalabilitas, kemudahan pengujian, standar kualitas dan lain sebagainya.

2.***Design***, tahap ini merupakan perencanaan dan perancangan solusi perangkat lunak. Pengembang dan desainer sistem menetapkan rancangan solusi yang mencakup perancangan algoritma, basis data, hingga desain antarmuka pengguna.

3.***Implementation***, fase ini merupakan tahap penulisan kode program hingga menghasilkan aplikasi yang dapat dijalankan. Pada tahap ini juga dibuat basis data dan file-file yang dibutuhkan aplikasi.

4.***Verification***, tahap pengujian atau verifikasi dan validasi, yaitu proses memastikan apakah perangkat lunak memenuhi spesifikasi dan kebutuhan awal, serta benar-benar dapat digunakan sesuai tujuan yang ditetapkan.

5.***Maintenance***, tahap pemeliharaan bertujuan memperbaiki kesalahan atau bug yang tidak ditemukan pada fase sebelumnya serta melakukan penyesuaian jika diperlukan.

### 1.6.8 *Black Box Testing*

*Black Box Testing* dalam pengembangan perangkat lunak merupakan metode pengujian yang dilakukan untuk menilai aplikasi dari sisi luar, seperti antarmuka, fungsi-fungsi yang tersedia, dan kesesuaiannya dengan kebutuhan yang telah dirancang sebelumnya. *Black Box Testing* dilakukan dari sudut pandang pengguna akhir. Metode ini tidak memerlukan penguji untuk memahami bahasa pemrograman tertentu, sehingga pengujiannya dilakukan berdasarkan perspektif pengguna. Hal itu dilakukan agar penguji dapat mengidentifikasi inkonsistensi dari kebutuhan awal. Kemudian pengembang dan penguji juga masih tetap dapat bekerja sama (Uminingsih et al., 2022).

Dalam *Black Box Testing* pengujian berfokus pada spesifikasi fungsional dari perangkat lunak, penguji dapat mendefinisikan kondisi-kondisi input dan melakukan pengujian pada fitur aplikasi. Proses pengujianya adalah mencoba program yang telah dibuat dengan memasukkan data pada setiap form yang ada atau menekan tombol untuk mengetahui aksinya sudah sesuai dengan ekspektasi atau tidak. Pengujian seperti ini diperlukan untuk mengetahui program tersebut sudah berjalan sesuai dengan yang dibutuhkan oleh perusahaan (Shadiq et al., 2021).

