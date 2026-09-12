"use client";

import { useState } from "react";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

type Response = {
  id: string;
  createdAt: Date;
  email: string;
  namaPengguna: string;
  jabatan: string | null;
  noWhatsapp: string;
  namaLulusan: string;
  jabatanLulusan: string;
  programStudi: string | null;
  tingkatanPerusahaan: string;
  bidangPerusahaan: string;
  kepuasanUmum: string;
  harapanPengguna: string;
  integritas: string;
  keahlianBidang: string;
  kemampuanBahasa: string;
  penggunaanTeknologi: string;
  komunikasi: string;
  kerjasamaTim: string;
  pengembanganDiri: string;
};

type Stats = {
  total: number;
  kepuasan: Record<string, number>;
  tingkatan: Record<string, number>;
};

export default function AdminDashboard({
  responses,
  stats,
}: {
  responses: Response[];
  stats: Stats;
}) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = responses.filter(
    (r) =>
      r.namaPengguna.toLowerCase().includes(search.toLowerCase()) ||
      r.namaLulusan.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
  );

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-dark text-white py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin — Tracer Pengguna UMSIDA</h1>
          <div className="flex items-center gap-3">
            <a
              href="/api/export"
              className="px-4 py-2 bg-white text-primary-dark rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Excel
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-white/30 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Respons" value={stats.total} />
          <StatCard
            label="Sangat Puas"
            value={stats.kepuasan["Sangat Puas"] || 0}
            sub={
              stats.total
                ? `${Math.round(((stats.kepuasan["Sangat Puas"] || 0) / stats.total) * 100)}%`
                : "0%"
            }
          />
          <StatCard
            label="Puas"
            value={stats.kepuasan["Puas"] || 0}
            sub={
              stats.total
                ? `${Math.round(((stats.kepuasan["Puas"] || 0) / stats.total) * 100)}%`
                : "0%"
            }
          />
          <StatCard
            label="Cukup / Kurang"
            value={
              (stats.kepuasan["Cukup"] || 0) +
              (stats.kepuasan["Kurang Puas"] || 0) +
              (stats.kepuasan["Sangat Tidak Puas"] || 0)
            }
          />
        </div>

        {/* Tingkatan breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="font-bold text-lg mb-3">Tingkatan Perusahaan</h2>
          <div className="flex gap-6 flex-wrap">
            {Object.entries(stats.tingkatan).map(([label, count]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-primary-dark">
                  {count}
                </div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search & table */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="font-bold text-lg">Data Respons</h2>
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">#</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Pengguna</th>
                  <th className="p-3">Lulusan</th>
                  <th className="p-3">Prodi</th>
                  <th className="p-3">Tingkatan</th>
                  <th className="p-3">Kepuasan</th>
                  <th className="p-3">Harapan</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-gray-500">{i + 1}</td>
                    <td className="p-3 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{r.namaPengguna}</div>
                      <div className="text-gray-500 text-xs">{r.email}</div>
                    </td>
                    <td className="p-3">
                      <div>{r.namaLulusan}</div>
                      <div className="text-gray-500 text-xs">
                        {r.jabatanLulusan}
                      </div>
                    </td>
                    <td className="p-3">{r.programStudi || "-"}</td>
                    <td className="p-3">{r.tingkatanPerusahaan}</td>
                    <td className="p-3">
                      <KepuasanBadge value={r.kepuasanUmum} />
                    </td>
                    <td className="p-3 max-w-xs truncate">
                      {r.harapanPengguna}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400">
                      {search
                        ? "Tidak ada data yang cocok"
                        : "Belum ada respons"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-3xl font-bold text-primary-dark mt-1">{value}</div>
      {sub && <div className="text-sm text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

function KepuasanBadge({ value }: { value: string }) {
  const colors: Record<string, string> = {
    "Sangat Puas": "bg-green-100 text-green-800",
    Puas: "bg-blue-100 text-blue-800",
    Cukup: "bg-yellow-100 text-yellow-800",
    "Kurang Puas": "bg-orange-100 text-orange-800",
    "Sangat Tidak Puas": "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value] || "bg-gray-100"}`}
    >
      {value}
    </span>
  );
}
