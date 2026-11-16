export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Syarat &amp; Ketentuan Layanan
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Terakhir diperbarui: 1 Januari 2026
                    </p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            1. Penerimaan Ketentuan
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Dengan mengakses atau menggunakan FieldMax
                            (&quot;Platform&quot;), Anda setuju untuk terikat
                            oleh Syarat &amp; Ketentuan Layanan ini. Jika Anda
                            tidak menyetujui ketentuan ini, harap tidak
                            menggunakan layanan kami.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            2. Akun Pengguna
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Untuk mengakses fitur tertentu pada Platform, Anda
                            mungkin diminta membuat akun. Anda bertanggung jawab
                            penuh menjaga kerahasiaan kredensial akun Anda serta
                            seluruh aktivitas yang terjadi di dalamnya.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            3. Pemesanan dan Pembayaran
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            FieldMax memfasilitasi pemesanan antara pemain dan
                            pemilik tempat olahraga. Dengan melakukan pemesanan,
                            Anda menyetujui syarat dan ketentuan masing-masing
                            tempat olahraga, termasuk kebijakan pembatalan yang
                            berlaku. Seluruh pembayaran diproses secara aman
                            melalui mitra pembayaran terpercaya kami.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            4. Pedoman Penggunaan
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Anda secara tegas menyetujui untuk tidak:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground leading-relaxed">
                            <li>
                                Menggunakan Platform untuk tujuan yang melanggar
                                hukum.
                            </li>
                            <li>
                                Mencoba memperoleh akses tidak sah ke bagian mana
                                pun dari Platform.
                            </li>
                            <li>
                                Mengganggu atau merugikan pengguna lain pada
                                Platform.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            5. Batasan Tanggung Jawab
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            FieldMax tidak bertanggung jawab atas kerugian tidak
                            langsung, insidental, khusus, atau konsekuensial
                            yang timbul dari penggunaan atau ketidakmampuan Anda
                            dalam menggunakan Platform.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
