import TracerForm from "@/components/TracerForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-primary-dark text-white py-6 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold">
            Kuesioner Tracer Pengguna Lulusan
          </h1>
          <p className="text-green-200 text-lg mt-1">
            Universitas Muhammadiyah Sidoarjo
          </p>
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
        <div className="max-w-2xl mx-auto px-4 text-center text-sm text-green-200">
          &copy; {new Date().getFullYear()} Universitas Muhammadiyah Sidoarjo
        </div>
      </footer>
    </div>
  );
}
