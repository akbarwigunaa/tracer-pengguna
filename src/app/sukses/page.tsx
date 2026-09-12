import Link from "next/link";

export default function Sukses() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-primary"
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
        <h1 className="text-2xl font-bold text-primary-dark mb-3">
          Terima Kasih!
        </h1>
        <p className="text-gray-600 mb-6">
          Respons Bapak/Ibu telah berhasil dikirim. Masukan ini sangat berharga
          bagi peningkatan kualitas lulusan Universitas Muhammadiyah Sidoarjo.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
