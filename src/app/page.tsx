import Link from "next/link";
import Image from "next/image";
import TracerForm from "@/components/TracerForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-primary-dark text-white py-6 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/logo-umsida-putih.png"
              alt="Logo UMSIDA"
              width={60}
              height={60}
              className="h-14 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold">
                Kuesioner Tracer Pengguna Lulusan
              </h1>
              <p className="text-blue-200 text-lg mt-1">
                Universitas Muhammadiyah Sidoarjo
              </p>
            </div>
          </div>
          <Link
            href="/admin/login"
            className="px-4 py-2 border border-white/30 rounded-lg text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Admin
          </Link>
        </div>
      </header>

      {/* Description */}
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-accent">
          <p className="text-gray-700 text-sm leading-relaxed">
            Universitas Muhammadiyah Sidoarjo (UMSIDA) mengundang Bapak/Ibu
            sebagai pengguna lulusan kami untuk mengisi kuesioner ini. Masukan
            Bapak/Ibu sangat berharga untuk meningkatkan kualitas pendidikan dan
            lulusan kami di masa depan.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            * Menunjukkan pertanyaan yang wajib diisi
          </p>
        </div>
      </div>

      {/* Form */}
      <main className="px-4 py-6 pb-16">
        <TracerForm />
      </main>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-4 mt-auto">
        <div className="max-w-2xl mx-auto px-4 text-center text-sm text-blue-200">
          &copy; {new Date().getFullYear()} Universitas Muhammadiyah Sidoarjo
        </div>
      </footer>
    </div>
  );
}
