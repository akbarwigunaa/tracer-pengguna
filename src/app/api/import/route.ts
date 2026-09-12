import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

const REQUIRED_FIELDS = [
  "email",
  "namaPengguna",
  "noWhatsapp",
  "namaPerusahaan",
  "namaLulusan",
  "jabatanLulusan",
  "fakultas",
  "programStudi",
  "tingkatanPerusahaan",
  "bidangPerusahaan",
  "kepuasanUmum",
  "harapanPengguna",
  "integritas",
  "keahlianBidang",
  "kemampuanBahasa",
  "penggunaanTeknologi",
  "komunikasi",
  "kerjasamaTim",
  "pengembanganDiri",
];

const HEADER_MAP: Record<string, string> = {
  "email": "email",
  "nama pengguna": "namaPengguna",
  "jabatan pengguna": "jabatan",
  "jabatan": "jabatan",
  "no whatsapp": "noWhatsapp",
  "no. whatsapp": "noWhatsapp",
  "whatsapp": "noWhatsapp",
  "nama perusahaan/institusi": "namaPerusahaan",
  "nama perusahaan": "namaPerusahaan",
  "nama lulusan": "namaLulusan",
  "jabatan lulusan": "jabatanLulusan",
  "fakultas": "fakultas",
  "program studi": "programStudi",
  "prodi": "programStudi",
  "tingkatan perusahaan": "tingkatanPerusahaan",
  "bidang perusahaan": "bidangPerusahaan",
  "kepuasan umum": "kepuasanUmum",
  "kepuasan": "kepuasanUmum",
  "harapan pengguna": "harapanPengguna",
  "harapan": "harapanPengguna",
  "integritas": "integritas",
  "keahlian bidang": "keahlianBidang",
  "kemampuan bahasa": "kemampuanBahasa",
  "bahasa asing": "kemampuanBahasa",
  "penggunaan teknologi": "penggunaanTeknologi",
  "teknologi informasi": "penggunaanTeknologi",
  "komunikasi": "komunikasi",
  "kerjasama tim": "kerjasamaTim",
  "pengembangan diri": "pengembanganDiri",
};

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const sheet = workbook.worksheets[0];
    if (!sheet) {
      return NextResponse.json({ error: "File Excel kosong" }, { status: 400 });
    }

    const headerRow = sheet.getRow(1);
    const columnMap: Record<number, string> = {};

    headerRow.eachCell((cell, colNumber) => {
      const header = String(cell.value || "").trim().toLowerCase();
      const field = HEADER_MAP[header];
      if (field) {
        columnMap[colNumber] = field;
      }
    });

    const missingFields = REQUIRED_FIELDS.filter(
      (f) => !Object.values(columnMap).includes(f)
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Kolom tidak ditemukan: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const records: Record<string, string | null>[] = [];
    let skipped = 0;

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const record: Record<string, string | null> = {};
      let hasData = false;

      for (const [colStr, field] of Object.entries(columnMap)) {
        const col = Number(colStr);
        const val = row.getCell(col).value;
        const strVal = val != null ? String(val).trim() : "";
        if (strVal) hasData = true;
        record[field] = strVal || null;
      }

      if (!hasData) return;

      const allRequired = REQUIRED_FIELDS.every((f) => record[f]);
      if (allRequired) {
        records.push(record);
      } else {
        skipped++;
      }
    });

    if (records.length === 0) {
      return NextResponse.json(
        { error: `Tidak ada data valid. ${skipped} baris dilewati karena data tidak lengkap.` },
        { status: 400 }
      );
    }

    const data = records.map((r) => ({
      email: r.email!,
      namaPengguna: r.namaPengguna!,
      jabatan: r.jabatan || null,
      noWhatsapp: r.noWhatsapp!,
      namaPerusahaan: r.namaPerusahaan!,
      namaLulusan: r.namaLulusan!,
      jabatanLulusan: r.jabatanLulusan!,
      fakultas: r.fakultas!,
      programStudi: r.programStudi!,
      tingkatanPerusahaan: r.tingkatanPerusahaan!,
      bidangPerusahaan: r.bidangPerusahaan!,
      kepuasanUmum: r.kepuasanUmum!,
      harapanPengguna: r.harapanPengguna!,
      integritas: r.integritas!,
      keahlianBidang: r.keahlianBidang!,
      kemampuanBahasa: r.kemampuanBahasa!,
      penggunaanTeknologi: r.penggunaanTeknologi!,
      komunikasi: r.komunikasi!,
      kerjasamaTim: r.kerjasamaTim!,
      pengembanganDiri: r.pengembanganDiri!,
    }));

    await prisma.response.createMany({ data });

    return NextResponse.json({
      success: true,
      imported: records.length,
      skipped,
    });
  } catch (e) {
    console.error("Import error:", e);
    return NextResponse.json(
      { error: "Gagal memproses file Excel" },
      { status: 500 }
    );
  }
}
