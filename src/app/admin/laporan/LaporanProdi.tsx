"use client";

import { useState } from "react";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import type { ProdiReport } from "./page";

const KOMPETENSI_LABELS: Record<string, string> = {
  integritas: "Integritas",
  keahlianBidang: "Keahlian Bidang",
  kemampuanBahasa: "Bahasa Asing",
  penggunaanTeknologi: "Teknologi Informasi",
  komunikasi: "Komunikasi",
  kerjasamaTim: "Kerjasama Tim",
  pengembanganDiri: "Pengembangan Diri",
};

const KEPUASAN_ORDER = [
  "Sangat Puas",
  "Puas",
  "Cukup",
  "Kurang Puas",
  "Sangat Tidak Puas",
];

const KEPUASAN_COLORS: Record<string, string> = {
  "Sangat Puas": "bg-green-500",
  Puas: "bg-blue-500",
  Cukup: "bg-yellow-500",
  "Kurang Puas": "bg-orange-500",
  "Sangat Tidak Puas": "bg-red-500",
};

export default function LaporanProdi({
  reports,
  totalResponses,
}: {
  reports: ProdiReport[];
  totalResponses: number;
}) {
  const [selectedFakultas, setSelectedFakultas] = useState<string>("all");
  const router = useRouter();

  const fakultasList = [...new Set(reports.map((r) => r.fakultas))];

  const filtered =
    selectedFakultas === "all"
      ? reports
      : reports.filter((r) => r.fakultas === selectedFakultas);

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-dark text-white py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Laporan Per Prodi
          </h1>
          <div className="flex items-center gap-3">
            <a
              href="/admin"
              className="px-4 py-2 bg-white text-primary-dark rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/api/export-laporan"
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
              Export Laporan
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
        {/* Summary & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Total <span className="font-bold text-primary-dark">{totalResponses}</span> respons
            dari <span className="font-bold text-primary-dark">{reports.length}</span> program studi
          </div>
          <select
            value={selectedFakultas}
            onChange={(e) => setSelectedFakultas(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
          >
            <option value="all">Semua Fakultas</option>
            {fakultasList.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-400">
            Belum ada data respons
          </div>
        ) : (
          filtered.map((report) => (
            <ProdiCard key={`${report.fakultas}||${report.programStudi}`} report={report} />
          ))
        )}
      </main>
    </div>
  );
}

function ProdiCard({ report }: { report: ProdiReport }) {
  const [expanded, setExpanded] = useState(false);

  const kompetensiEntries = Object.entries(report.kompetensi);
  const avgAll =
    kompetensiEntries.length > 0
      ? kompetensiEntries.reduce((sum, [, v]) => sum + v, 0) / kompetensiEntries.length
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
      >
        <div>
          <div className="text-xs text-gray-500 mb-1">{report.fakultas}</div>
          <h3 className="text-lg font-bold text-primary-dark">{report.programStudi}</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-dark">{report.total}</div>
            <div className="text-xs text-gray-500">respons</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-2xl font-bold text-primary-dark">{avgAll.toFixed(2)}</div>
            <div className="text-xs text-gray-500">rata-rata kompetensi</div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t px-5 pb-5 space-y-5">
          {/* Kepuasan */}
          <div className="pt-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Kepuasan Pengguna</h4>
            <div className="space-y-2">
              {KEPUASAN_ORDER.map((k) => {
                const count = report.kepuasan[k] || 0;
                const pct = report.total > 0 ? (count / report.total) * 100 : 0;
                return (
                  <div key={k} className="flex items-center gap-3">
                    <div className="w-32 text-sm text-gray-600 shrink-0">{k}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${KEPUASAN_COLORS[k]} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="w-20 text-sm text-right text-gray-600">
                      {count} ({pct.toFixed(0)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kompetensi */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-3">
              Rata-rata Kompetensi <span className="text-gray-400 font-normal">(skala 1-4)</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-dark text-white">
                    <th className="p-3 text-left rounded-tl-lg">Kompetensi</th>
                    <th className="p-3 text-center">Rata-rata</th>
                    <th className="p-3 text-left rounded-tr-lg">Visualisasi</th>
                  </tr>
                </thead>
                <tbody>
                  {kompetensiEntries.map(([key, avg], i) => (
                    <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                      <td className="p-3 font-medium">{KOMPETENSI_LABELS[key] || key}</td>
                      <td className="p-3 text-center">
                        <span className={`font-bold ${getScoreColor(avg)}`}>{avg.toFixed(2)}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden max-w-48">
                            <div
                              className={`h-full rounded-full ${getBarColor(avg)} transition-all`}
                              style={{ width: `${(avg / 4) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td className="p-3">Rata-rata Keseluruhan</td>
                    <td className="p-3 text-center">
                      <span className={getScoreColor(avgAll)}>{avgAll.toFixed(2)}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden max-w-48">
                          <div
                            className={`h-full rounded-full ${getBarColor(avgAll)} transition-all`}
                            style={{ width: `${(avgAll / 4) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 3.5) return "text-green-600";
  if (score >= 2.5) return "text-blue-600";
  if (score >= 1.5) return "text-yellow-600";
  return "text-red-600";
}

function getBarColor(score: number): string {
  if (score >= 3.5) return "bg-green-500";
  if (score >= 2.5) return "bg-blue-500";
  if (score >= 1.5) return "bg-yellow-500";
  return "bg-red-500";
}
