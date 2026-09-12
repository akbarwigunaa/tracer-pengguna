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

const SKALA_ORDER = ["Sangat baik", "Baik", "Cukup", "Kurang"] as const;

const KEPUASAN_COLORS: Record<string, string> = {
  "Sangat Puas": "bg-green-500",
  Puas: "bg-blue-500",
  Cukup: "bg-yellow-500",
  "Kurang Puas": "bg-orange-500",
  "Sangat Tidak Puas": "bg-red-500",
};

function IconDashboard() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function IconExcel() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
      <path d="M8 12.5l2.5 3.5H9l-1.5-2.1L6 16H4.5l2.5-3.5L4.7 9H6.2l1.3 1.9L8.8 9h1.5L8 12.5z" />
    </svg>
  );
}

function IconWord() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
      <path d="M7 13h1.5l1 3.5 1-3.5H12l1 3.5 1-3.5H15.5l-2 6h-1.5l-1-3.5-1 3.5H9.5l-2.5-6z" />
    </svg>
  );
}

export default function LaporanProdi({
  reports,
  totalResponses,
  universityReport,
  years,
  selectedYear,
}: {
  reports: ProdiReport[];
  totalResponses: number;
  universityReport: ProdiReport;
  years: number[];
  selectedYear: number | null;
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
          <h1 className="text-xl font-bold">Laporan Per Prodi</h1>
          <div className="flex items-center gap-3">
            <a
              href="/admin"
              className="px-4 py-2 bg-white text-primary-dark rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <IconDashboard />
              Dashboard
            </a>
            <a
              href="/api/export-laporan"
              className="px-4 py-2 bg-white text-primary-dark rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <IconExcel />
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
        {/* Summary & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Total <span className="font-bold text-primary-dark">{totalResponses}</span> respons dari{" "}
            <span className="font-bold text-primary-dark">{reports.length}</span> program studi
            {selectedYear && (
              <span className="ml-1">
                — Tahun <span className="font-bold text-primary-dark">{selectedYear}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedYear ?? "all"}
              onChange={(e) => {
                const val = e.target.value;
                router.push(val === "all" ? "/admin/laporan" : `/admin/laporan?tahun=${val}`);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="all">Semua Tahun</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={selectedFakultas}
              onChange={(e) => setSelectedFakultas(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
            >
              <option value="all">Semua Fakultas</option>
              {fakultasList.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Laporan Keseluruhan Universitas */}
        {selectedFakultas === "all" && universityReport.total > 0 && (
          <UniversityCard report={universityReport} prodiCount={reports.length} />
        )}

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

function UniversityCard({ report, prodiCount }: { report: ProdiReport; prodiCount: number }) {
  const [expanded, setExpanded] = useState(false);

  const kompetensiEntries = Object.entries(report.kompetensi);
  const avgAll =
    kompetensiEntries.length > 0
      ? kompetensiEntries.reduce((sum, [, v]) => sum + v, 0) / kompetensiEntries.length
      : 0;

  return (
    <div className="bg-primary-dark rounded-lg shadow-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-primary-dark/90 transition-colors text-left"
      >
        <div>
          <div className="text-xs text-white/60 mb-1">Laporan Keseluruhan</div>
          <h3 className="text-lg font-bold text-white">Universitas Muhammadiyah Sidoarjo</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{report.total}</div>
            <div className="text-xs text-white/60">respons</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-2xl font-bold text-white">{prodiCount}</div>
            <div className="text-xs text-white/60">prodi</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-2xl font-bold text-white">{avgAll.toFixed(2)}</div>
            <div className="text-xs text-white/60">rata-rata</div>
          </div>
          <svg
            className={`w-5 h-5 text-white/60 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="bg-white border-t px-5 pb-5 space-y-5">
          <div className="pt-4 flex justify-end">
            <a
              href="/api/export-word-universitas"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-lg text-sm font-medium hover:bg-primary-dark/90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Laporan Word
            </a>
          </div>
          {/* Kepuasan */}
          <div>
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

          {/* Tingkatan */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Tingkatan Perusahaan/Instansi</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["Lokal", "Nasional", "Multinasional/Internasional"].map((t) => {
                const count = report.tingkatan[t] || 0;
                const pct = report.total > 0 ? (count / report.total) * 100 : 0;
                return (
                  <div key={t} className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-primary-dark">{count}</div>
                    <div className="text-xs text-gray-500">{t}</div>
                    <div className="text-xs text-gray-400">{pct.toFixed(0)}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bidang */}
          {Object.keys(report.bidang).length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-3">Bidang Perusahaan/Instansi</h4>
              <div className="space-y-2">
                {Object.entries(report.bidang)
                  .sort((a, b) => b[1] - a[1])
                  .map(([b, count]) => {
                    const pct = report.total > 0 ? (count / report.total) * 100 : 0;
                    return (
                      <div key={b} className="flex items-center gap-3">
                        <div className="w-40 text-sm text-gray-600 shrink-0 truncate" title={b}>{b}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary/70 transition-all"
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
          )}

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
                    {SKALA_ORDER.map((s, si) => (
                      <th key={s} className={`p-3 text-center${si === SKALA_ORDER.length - 1 ? " rounded-tr-lg" : ""}`}>{s}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {kompetensiEntries.map(([key, avg], i) => {
                    const dist = report.kompetensiDist?.[key] || {};
                    return (
                      <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                        <td className="p-3 font-medium">{KOMPETENSI_LABELS[key] || key}</td>
                        <td className="p-3 text-center">
                          <span className={`font-bold ${getScoreColor(avg)}`}>{avg.toFixed(2)}</span>
                        </td>
                        {SKALA_ORDER.map((s) => {
                          const count = dist[s] || 0;
                          const pct = report.total > 0 ? ((count / report.total) * 100).toFixed(0) : "0";
                          return (
                            <td key={s} className="p-3 text-center text-gray-600">
                              {count} <span className="text-gray-400 text-xs">({pct}%)</span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td className="p-3">Rata-rata Keseluruhan</td>
                    <td className="p-3 text-center">
                      <span className={getScoreColor(avgAll)}>{avgAll.toFixed(2)}</span>
                    </td>
                    <td colSpan={4} className="p-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden max-w-48">
                        <div
                          className={`h-full rounded-full ${getBarColor(avgAll)} transition-all`}
                          style={{ width: `${(avgAll / 4) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Daftar Perusahaan/Instansi */}
          {report.perusahaan && report.perusahaan.length > 0 && (
            <PerusahaanTable data={report.perusahaan} />
          )}
        </div>
      )}
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

  const wordUrl = `/api/export-word?fakultas=${encodeURIComponent(report.fakultas)}&prodi=${encodeURIComponent(report.programStudi)}`;

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
          {/* Download Word button */}
          <div className="pt-4 flex justify-end">
            <a
              href={wordUrl}
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <IconWord />
              Download Laporan Word
            </a>
          </div>

          {/* Kepuasan */}
          <div>
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

          {/* Tingkatan Perusahaan */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Tingkatan Perusahaan/Instansi</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["Lokal", "Nasional", "Multinasional/Internasional"].map((t) => {
                const count = report.tingkatan[t] || 0;
                const pct = report.total > 0 ? (count / report.total) * 100 : 0;
                return (
                  <div key={t} className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-primary-dark">{count}</div>
                    <div className="text-xs text-gray-500">{t}</div>
                    <div className="text-xs text-gray-400">{pct.toFixed(0)}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bidang Perusahaan */}
          {Object.keys(report.bidang).length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-3">Bidang Perusahaan/Instansi</h4>
              <div className="space-y-2">
                {Object.entries(report.bidang)
                  .sort((a, b) => b[1] - a[1])
                  .map(([b, count]) => {
                    const pct = report.total > 0 ? (count / report.total) * 100 : 0;
                    return (
                      <div key={b} className="flex items-center gap-3">
                        <div className="w-40 text-sm text-gray-600 shrink-0 truncate" title={b}>{b}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary/70 transition-all"
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
          )}

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
                    {SKALA_ORDER.map((s, si) => (
                      <th key={s} className={`p-3 text-center${si === SKALA_ORDER.length - 1 ? " rounded-tr-lg" : ""}`}>{s}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {kompetensiEntries.map(([key, avg], i) => {
                    const dist = report.kompetensiDist?.[key] || {};
                    return (
                      <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                        <td className="p-3 font-medium">{KOMPETENSI_LABELS[key] || key}</td>
                        <td className="p-3 text-center">
                          <span className={`font-bold ${getScoreColor(avg)}`}>{avg.toFixed(2)}</span>
                        </td>
                        {SKALA_ORDER.map((s) => {
                          const count = dist[s] || 0;
                          const pct = report.total > 0 ? ((count / report.total) * 100).toFixed(0) : "0";
                          return (
                            <td key={s} className="p-3 text-center text-gray-600">
                              {count} <span className="text-gray-400 text-xs">({pct}%)</span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td className="p-3">Rata-rata Keseluruhan</td>
                    <td className="p-3 text-center">
                      <span className={getScoreColor(avgAll)}>{avgAll.toFixed(2)}</span>
                    </td>
                    <td colSpan={4} className="p-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden max-w-48">
                        <div
                          className={`h-full rounded-full ${getBarColor(avgAll)} transition-all`}
                          style={{ width: `${(avgAll / 4) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Daftar Perusahaan/Instansi */}
          {report.perusahaan && report.perusahaan.length > 0 && (
            <PerusahaanTable data={report.perusahaan} />
          )}

          {/* Harapan Pengguna */}
          {report.harapan.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-3">Harapan Pengguna</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-primary-dark text-white">
                      <th className="p-3 text-center rounded-tl-lg w-12">No</th>
                      <th className="p-3 text-left">Nama Pengguna</th>
                      <th className="p-3 text-left rounded-tr-lg">Harapan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.harapan.map((h, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                        <td className="p-3 text-center text-gray-500">{i + 1}</td>
                        <td className="p-3 font-medium whitespace-nowrap">{h.nama}</td>
                        <td className="p-3 text-gray-600">{h.teks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PerusahaanTable({ data }: { data: { nama: string; jabatan: string; perusahaan: string; jabatanLulusan: string }[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm text-gray-700 mb-3">Daftar Perusahaan/Instansi Pengguna</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary-dark text-white">
              <th className="p-3 text-center rounded-tl-lg w-12">No</th>
              <th className="p-3 text-left">Nama Pengguna</th>
              <th className="p-3 text-left">Jabatan</th>
              <th className="p-3 text-left">Perusahaan/Instansi</th>
              <th className="p-3 text-left rounded-tr-lg">Jabatan Lulusan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                <td className="p-3 text-center text-gray-500">{i + 1}</td>
                <td className="p-3 font-medium whitespace-nowrap">{d.nama}</td>
                <td className="p-3 text-gray-600">{d.jabatan}</td>
                <td className="p-3 text-gray-600">{d.perusahaan}</td>
                <td className="p-3 text-gray-600">{d.jabatanLulusan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
