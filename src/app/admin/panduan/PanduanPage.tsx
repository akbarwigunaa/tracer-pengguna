"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

const tabs = [
  { id: "admin", label: "Panduan Admin", src: "/docs/modul-admin.html" },
  { id: "pengguna", label: "Panduan Pengguna", src: "/docs/modul-pengguna.html" },
] as const;

export default function PanduanPage() {
  const [active, setActive] = useState<string>("admin");
  const router = useRouter();
  const current = tabs.find((t) => t.id === active)!;

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-primary-dark text-white py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Modul Penggunaan</h1>
          <div className="flex items-center gap-3">
            <a
              href="/admin"
              className="px-4 py-2 bg-white text-primary-dark rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Dashboard
            </a>
            <a
              href="/admin/laporan"
              className="px-4 py-2 bg-white text-primary-dark rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Laporan Prodi
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

      <div className="max-w-7xl mx-auto px-4 w-full mt-6">
        <div className="flex gap-1 bg-white rounded-t-lg shadow-sm border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                active === tab.id
                  ? "text-primary-dark"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {active === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-dark" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 w-full pb-6">
        <div className="bg-white shadow-sm rounded-b-lg overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
          <iframe
            key={current.id}
            src={current.src}
            className="w-full h-full border-0"
            title={current.label}
          />
        </div>
      </div>
    </div>
  );
}
