import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

const KOMPETENSI_KEYS = [
  "integritas",
  "keahlianBidang",
  "kemampuanBahasa",
  "penggunaanTeknologi",
  "komunikasi",
  "kerjasamaTim",
  "pengembanganDiri",
] as const;

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

const SKALA_NILAI: Record<string, number> = {
  "Sangat baik": 4,
  Baik: 3,
  Cukup: 2,
  Kurang: 1,
};

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const responses = await prisma.response.findMany({
    orderBy: { createdAt: "desc" },
  });

  type ProdiData = {
    fakultas: string;
    programStudi: string;
    total: number;
    kepuasan: Record<string, number>;
    kompetensiSum: Record<string, number>;
  };

  const prodiMap = new Map<string, ProdiData>();

  for (const r of responses) {
    const key = `${r.fakultas}||${r.programStudi}`;
    if (!prodiMap.has(key)) {
      prodiMap.set(key, {
        fakultas: r.fakultas,
        programStudi: r.programStudi,
        total: 0,
        kepuasan: {},
        kompetensiSum: {},
      });
    }
    const p = prodiMap.get(key)!;
    p.total++;
    p.kepuasan[r.kepuasanUmum] = (p.kepuasan[r.kepuasanUmum] || 0) + 1;
    for (const k of KOMPETENSI_KEYS) {
      const score = SKALA_NILAI[r[k]] || 0;
      p.kompetensiSum[k] = (p.kompetensiSum[k] || 0) + score;
    }
  }

  const reports = Array.from(prodiMap.values()).sort(
    (a, b) => a.fakultas.localeCompare(b.fakultas) || a.programStudi.localeCompare(b.programStudi)
  );

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Tracer Pengguna UMSIDA";
  workbook.created = new Date();

  // Sheet 1: Ringkasan per Prodi
  const sheet = workbook.addWorksheet("Laporan Per Prodi");

  sheet.columns = [
    { header: "No", key: "no", width: 5 },
    { header: "Fakultas", key: "fakultas", width: 40 },
    { header: "Program Studi", key: "programStudi", width: 25 },
    { header: "Jumlah Respons", key: "total", width: 15 },
    ...KEPUASAN_ORDER.map((k) => ({ header: k, key: `kep_${k}`, width: 16 })),
    ...KOMPETENSI_KEYS.map((k) => ({
      header: `Avg ${KOMPETENSI_LABELS[k]}`,
      key: `avg_${k}`,
      width: 18,
    })),
    { header: "Avg Keseluruhan", key: "avgAll", width: 16 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0f2340" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

  reports.forEach((p, i) => {
    const row: Record<string, string | number> = {
      no: i + 1,
      fakultas: p.fakultas,
      programStudi: p.programStudi,
      total: p.total,
    };

    for (const k of KEPUASAN_ORDER) {
      row[`kep_${k}`] = p.kepuasan[k] || 0;
    }

    let sumAvg = 0;
    for (const k of KOMPETENSI_KEYS) {
      const avg = p.total > 0 ? (p.kompetensiSum[k] || 0) / p.total : 0;
      row[`avg_${k}`] = Number(avg.toFixed(2));
      sumAvg += avg;
    }
    row.avgAll = Number((sumAvg / KOMPETENSI_KEYS.length).toFixed(2));

    sheet.addRow(row);
  });

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
      "Content-Disposition": `attachment; filename="laporan-prodi-${date}.xlsx"`,
    },
  });
}
