export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Kebijakan Privasi
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Terakhir diperbarui: 1 Januari 2026
                    </p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            1. Informasi yang Kami Kumpulkan
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Kami mengumpulkan informasi yang Anda berikan secara
                            langsung kepada kami, seperti saat Anda membuat
                            akun, melakukan pemesanan, atau menghubungi layanan
                            bantuan. Informasi ini dapat mencakup nama, alamat
                            email, nomor telepon, dan informasi pembayaran Anda.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            2. Cara Kami Menggunakan Informasi Anda
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Kami menggunakan informasi Anda untuk:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground leading-relaxed">
                            <li>
                                Memfasilitasi pemesanan dan memproses
                                pembayaran.
                            </li>
                            <li>
                                Mengirimkan konfirmasi dan pembaruan status
                                pemesanan Anda.
                            </li>
                            <li>
                                Meningkatkan dan mengoptimalkan kinerja
                                Platform kami.
                            </li>
                            <li>
                                Berkomunikasi dengan Anda terkait layanan dan
                                informasi promosi.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            3. Pembagian Informasi
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Kami membagikan informasi Anda kepada Pemilik Tempat
                            Olahraga saat Anda melakukan pemesanan untuk
                            memfasilitasi layanan. Kami tidak menjual data
                            pribadi Anda kepada pihak ketiga.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            4. Keamanan Data
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Kami menerapkan langkah-langkah teknis dan
                            organisasi yang tepat untuk melindungi informasi
                            pribadi Anda dari akses, perubahan, pengungkapan,
                            atau perusakan yang tidak sah.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            5. Hak Anda
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Anda berhak untuk mengakses, memperbaiki, atau
                            menghapus informasi pribadi Anda. Anda dapat
                            mengelola pengaturan akun secara langsung melalui
                            Platform atau menghubungi kami untuk mendapatkan
                            bantuan.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
