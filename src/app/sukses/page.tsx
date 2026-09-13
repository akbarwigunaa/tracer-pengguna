import Link from "next/link";
import Image from "next/image";

export default function Sukses() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-primary-dark text-white py-4 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-center gap-3">
          <Image
            src="/logo-umsida-putih.png"
            alt="Logo UMSIDA"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <p className="text-blue-200 text-sm">
            Universitas Muhammadiyah Sidoarjo
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 max-w-lg w-full text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-primary-dark mb-3">
            Terima Kasih!
          </h1>

          <p className="text-gray-600 text-lg mb-2">
            Respons Bapak/Ibu telah berhasil dikirim.
          </p>

          <p className="text-gray-500 mb-8 leading-relaxed">
            Masukan yang Bapak/Ibu berikan sangat berharga bagi kami dalam upaya
            meningkatkan kualitas pendidikan dan kompetensi lulusan Universitas
            Muhammadiyah Sidoarjo di masa depan. Kami berharap kerja sama ini
            dapat terus terjalin dengan baik.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-8 border border-blue-200">
            <p className="text-primary-dark text-sm font-medium">
              Jika ada pertanyaan lebih lanjut, silakan hubungi:
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Pusat Informasi dan Pengembangan Karir — Universitas Muhammadiyah Sidoarjo
            </p>
            <p className="text-primary text-sm font-medium mt-2">
              pinpku@umsida.ac.id
            </p>
          </div>

          <Link
            href="/"
            className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium text-lg"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-4">
        <div className="max-w-2xl mx-auto px-4 text-center text-sm text-blue-200">
          &copy; {new Date().getFullYear()} Universitas Muhammadiyah Sidoarjo
        </div>
      </footer>
    </div>
  );
}
