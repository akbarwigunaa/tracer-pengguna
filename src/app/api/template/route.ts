import { isAuthenticated } from "@/lib/auth";
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

const COLUMNS = [
  { header: "Email", key: "email", width: 25 },
  { header: "Nama Pengguna", key: "namaPengguna", width: 22 },
  { header: "Jabatan Pengguna", key: "jabatan", width: 20 },
  { header: "No WhatsApp", key: "noWhatsapp", width: 16 },
  { header: "Nama Perusahaan/Institusi", key: "namaPerusahaan", width: 30 },
  { header: "Nama Lulusan", key: "namaLulusan", width: 22 },
  { header: "Jabatan Lulusan", key: "jabatanLulusan", width: 20 },
  { header: "Fakultas", key: "fakultas", width: 40 },
  { header: "Program Studi", key: "programStudi", width: 28 },
  { header: "Tingkatan Perusahaan", key: "tingkatanPerusahaan", width: 22 },
  { header: "Bidang Perusahaan", key: "bidangPerusahaan", width: 22 },
  { header: "Kepuasan Umum", key: "kepuasanUmum", width: 20 },
  { header: "Harapan Pengguna", key: "harapanPengguna", width: 35 },
  { header: "Integritas", key: "integritas", width: 14 },
  { header: "Keahlian Bidang", key: "keahlianBidang", width: 16 },
  { header: "Kemampuan Bahasa", key: "kemampuanBahasa", width: 18 },
  { header: "Penggunaan Teknologi", key: "penggunaanTeknologi", width: 20 },
  { header: "Komunikasi", key: "komunikasi", width: 14 },
  { header: "Kerjasama Tim", key: "kerjasamaTim", width: 16 },
  { header: "Pengembangan Diri", key: "pengembanganDiri", width: 18 },
];

const EXAMPLE_ROW = {
  email: "contoh@email.com",
  namaPengguna: "Budi Santoso",
  jabatan: "Manager HRD",
  noWhatsapp: "081234567890",
  namaPerusahaan: "PT Contoh Indonesia",
  namaLulusan: "Siti Rahayu",
  jabatanLulusan: "Staff Administrasi",
  fakultas: "FST (Fakultas Sains dan Teknologi)",
  programStudi: "S1 Informatika",
  tingkatanPerusahaan: "Nasional",
  bidangPerusahaan: "Teknologi Informasi",
  kepuasanUmum: "Puas",
  harapanPengguna: "Tingkatkan kemampuan praktis mahasiswa",
  integritas: "Sangat baik",
  keahlianBidang: "Baik",
  kemampuanBahasa: "Cukup",
  penggunaanTeknologi: "Sangat baik",
  komunikasi: "Baik",
  kerjasamaTim: "Baik",
  pengembanganDiri: "Sangat baik",
};

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Tracer Pengguna UMSIDA";

  // Sheet 1: Template
  const sheet = workbook.addWorksheet("Data Import");
  sheet.columns = COLUMNS;

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0f2340" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

  // Add example row
  const exRow = sheet.addRow(EXAMPLE_ROW);
  exRow.font = { italic: true, color: { argb: "FF888888" } };

  // Add borders to header and example
  [1, 2].forEach((rowNum) => {
    sheet.getRow(rowNum).eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // Data validation for dropdowns
  const tingkatanValidation: ExcelJS.DataValidation = {
    type: "list",
    formulae: ['"Lokal,Nasional,Multinasional/Internasional"'],
    showErrorMessage: true,
    errorTitle: "Nilai tidak valid",
    error: "Pilih: Lokal, Nasional, atau Multinasional/Internasional",
  };

  const kepuasanValidation: ExcelJS.DataValidation = {
    type: "list",
    formulae: ['"Sangat Puas,Puas,Cukup,Kurang Puas,Sangat Tidak Puas"'],
    showErrorMessage: true,
    errorTitle: "Nilai tidak valid",
    error: "Pilih: Sangat Puas, Puas, Cukup, Kurang Puas, atau Sangat Tidak Puas",
  };

  const skalaValidation: ExcelJS.DataValidation = {
    type: "list",
    formulae: ['"Sangat baik,Baik,Cukup,Kurang"'],
    showErrorMessage: true,
    errorTitle: "Nilai tidak valid",
    error: "Pilih: Sangat baik, Baik, Cukup, atau Kurang",
  };

  for (let row = 3; row <= 200; row++) {
    sheet.getCell(`J${row}`).dataValidation = tingkatanValidation;
    sheet.getCell(`L${row}`).dataValidation = kepuasanValidation;
    sheet.getCell(`N${row}`).dataValidation = skalaValidation;
    sheet.getCell(`O${row}`).dataValidation = skalaValidation;
    sheet.getCell(`P${row}`).dataValidation = skalaValidation;
    sheet.getCell(`Q${row}`).dataValidation = skalaValidation;
    sheet.getCell(`R${row}`).dataValidation = skalaValidation;
    sheet.getCell(`S${row}`).dataValidation = skalaValidation;
    sheet.getCell(`T${row}`).dataValidation = skalaValidation;
  }

  // Sheet 2: Panduan
  const guide = workbook.addWorksheet("Panduan");
  guide.columns = [
    { header: "Kolom", width: 25 },
    { header: "Wajib", width: 8 },
    { header: "Keterangan", width: 50 },
    { header: "Contoh Nilai", width: 30 },
  ];

  const guideHeader = guide.getRow(1);
  guideHeader.font = { bold: true, color: { argb: "FFFFFFFF" } };
  guideHeader.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0f2340" },
  };

  const guideData = [
    ["Email", "Ya", "Alamat email pengguna", "contoh@email.com"],
    ["Nama Pengguna", "Ya", "Nama lengkap pengguna (atasan/pemberi kerja)", "Budi Santoso"],
    ["Jabatan Pengguna", "Tidak", "Jabatan pengguna di instansi", "Manager HRD"],
    ["No WhatsApp", "Ya", "Nomor WhatsApp aktif", "081234567890"],
    ["Nama Perusahaan/Institusi", "Ya", "Nama tempat kerja pengguna", "PT Contoh Indonesia"],
    ["Nama Lulusan", "Ya", "Nama lulusan UMSIDA yang dinilai", "Siti Rahayu"],
    ["Jabatan Lulusan", "Ya", "Jabatan lulusan di instansi", "Staff Administrasi"],
    ["Fakultas", "Ya", "Nama fakultas lulusan", "FST (Fakultas Sains dan Teknologi)"],
    ["Program Studi", "Ya", "Nama program studi lulusan", "S1 Informatika"],
    ["Tingkatan Perusahaan", "Ya", "Lokal / Nasional / Multinasional/Internasional", "Nasional"],
    ["Bidang Perusahaan", "Ya", "Bidang usaha perusahaan", "Teknologi Informasi"],
    ["Kepuasan Umum", "Ya", "Sangat Puas / Puas / Cukup / Kurang Puas / Sangat Tidak Puas", "Puas"],
    ["Harapan Pengguna", "Ya", "Harapan/saran untuk peningkatan kualitas lulusan", "Tingkatkan kemampuan praktis"],
    ["Integritas", "Ya", "Sangat baik / Baik / Cukup / Kurang", "Sangat baik"],
    ["Keahlian Bidang", "Ya", "Sangat baik / Baik / Cukup / Kurang", "Baik"],
    ["Kemampuan Bahasa", "Ya", "Sangat baik / Baik / Cukup / Kurang", "Cukup"],
    ["Penggunaan Teknologi", "Ya", "Sangat baik / Baik / Cukup / Kurang", "Sangat baik"],
    ["Komunikasi", "Ya", "Sangat baik / Baik / Cukup / Kurang", "Baik"],
    ["Kerjasama Tim", "Ya", "Sangat baik / Baik / Cukup / Kurang", "Baik"],
    ["Pengembangan Diri", "Ya", "Sangat baik / Baik / Cukup / Kurang", "Sangat baik"],
  ];

  guideData.forEach((row) => guide.addRow(row));

  guide.eachRow((row) => {
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

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="template-import-tracer-pengguna.xlsx"`,
    },
  });
}
