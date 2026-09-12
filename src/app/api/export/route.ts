import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const responses = await prisma.response.findMany({
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "No",
    "Tanggal",
    "Email",
    "Nama Pengguna",
    "Jabatan Pengguna",
    "No WhatsApp",
    "Nama Lulusan",
    "Jabatan Lulusan",
    "Program Studi",
    "Tingkatan Perusahaan",
    "Bidang Perusahaan",
    "Kepuasan Umum",
    "Harapan Pengguna",
    "Integritas",
    "Keahlian Bidang",
    "Kemampuan Bahasa",
    "Penggunaan Teknologi",
    "Komunikasi",
    "Kerjasama Tim",
    "Pengembangan Diri",
  ];

  function esc(val: string | null) {
    if (!val) return "";
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  }

  const rows = responses.map((r, i) =>
    [
      i + 1,
      new Date(r.createdAt).toLocaleDateString("id-ID"),
      esc(r.email),
      esc(r.namaPengguna),
      esc(r.jabatan),
      esc(r.noWhatsapp),
      esc(r.namaLulusan),
      esc(r.jabatanLulusan),
      esc(r.programStudi),
      esc(r.tingkatanPerusahaan),
      esc(r.bidangPerusahaan),
      esc(r.kepuasanUmum),
      esc(r.harapanPengguna),
      esc(r.integritas),
      esc(r.keahlianBidang),
      esc(r.kemampuanBahasa),
      esc(r.penggunaanTeknologi),
      esc(r.komunikasi),
      esc(r.kerjasamaTim),
      esc(r.pengembanganDiri),
    ].join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tracer-pengguna-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
