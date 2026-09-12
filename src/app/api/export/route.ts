import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const responses = await prisma.response.findMany({
    orderBy: { createdAt: "desc" },
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Tracer Pengguna UMSIDA";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Data Respons");

  sheet.columns = [
    { header: "No", key: "no", width: 5 },
    { header: "Tanggal", key: "tanggal", width: 15 },
    { header: "Email", key: "email", width: 25 },
    { header: "Nama Pengguna", key: "namaPengguna", width: 20 },
    { header: "Jabatan Pengguna", key: "jabatan", width: 20 },
    { header: "No WhatsApp", key: "noWhatsapp", width: 15 },
    { header: "Nama Lulusan", key: "namaLulusan", width: 20 },
    { header: "Jabatan Lulusan", key: "jabatanLulusan", width: 20 },
    { header: "Program Studi", key: "programStudi", width: 20 },
    { header: "Tingkatan Perusahaan", key: "tingkatanPerusahaan", width: 22 },
    { header: "Bidang Perusahaan", key: "bidangPerusahaan", width: 20 },
    { header: "Kepuasan Umum", key: "kepuasanUmum", width: 18 },
    { header: "Harapan Pengguna", key: "harapanPengguna", width: 35 },
    { header: "Integritas", key: "integritas", width: 14 },
    { header: "Keahlian Bidang", key: "keahlianBidang", width: 14 },
    { header: "Kemampuan Bahasa", key: "kemampuanBahasa", width: 14 },
    { header: "Penggunaan Teknologi", key: "penggunaanTeknologi", width: 18 },
    { header: "Komunikasi", key: "komunikasi", width: 14 },
    { header: "Kerjasama Tim", key: "kerjasamaTim", width: 14 },
    { header: "Pengembangan Diri", key: "pengembanganDiri", width: 16 },
  ];

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0f2340" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };

  responses.forEach((r, i) => {
    sheet.addRow({
      no: i + 1,
      tanggal: new Date(r.createdAt).toLocaleDateString("id-ID"),
      email: r.email,
      namaPengguna: r.namaPengguna,
      jabatan: r.jabatan || "-",
      noWhatsapp: r.noWhatsapp,
      namaLulusan: r.namaLulusan,
      jabatanLulusan: r.jabatanLulusan,
      programStudi: r.programStudi || "-",
      tingkatanPerusahaan: r.tingkatanPerusahaan,
      bidangPerusahaan: r.bidangPerusahaan,
      kepuasanUmum: r.kepuasanUmum,
      harapanPengguna: r.harapanPengguna,
      integritas: r.integritas,
      keahlianBidang: r.keahlianBidang,
      kemampuanBahasa: r.kemampuanBahasa,
      penggunaanTeknologi: r.penggunaanTeknologi,
      komunikasi: r.komunikasi,
      kerjasamaTim: r.kerjasamaTim,
      pengembanganDiri: r.pengembanganDiri,
    });
  });

  // Add borders to all cells
  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="tracer-pengguna-${date}.xlsx"`,
    },
  });
}
