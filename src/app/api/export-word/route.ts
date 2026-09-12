import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  HeadingLevel,
  TableLayoutType,
} from "docx";

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
  integritas: "Integritas (Etika dan Moral)",
  keahlianBidang: "Keahlian Berdasarkan Bidang Ilmu",
  kemampuanBahasa: "Kemampuan Bahasa Asing",
  penggunaanTeknologi: "Penggunaan Teknologi Informasi",
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

const BORDER = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
} as const;

function headerCell(text: string, width?: number): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 20, font: "Calibri" })],
        alignment: AlignmentType.CENTER,
      }),
    ],
    shading: { type: ShadingType.SOLID, color: "0f2340" },
    borders: BORDER,
    ...(width ? { width: { size: width, type: WidthType.PERCENTAGE } } : {}),
  });
}

function dataCell(text: string, align: typeof AlignmentType[keyof typeof AlignmentType] = AlignmentType.LEFT): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, size: 20, font: "Calibri" })],
        alignment: align,
      }),
    ],
    borders: BORDER,
  });
}

export async function GET(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fakultas = searchParams.get("fakultas");
  const prodi = searchParams.get("prodi");

  if (!fakultas || !prodi) {
    return NextResponse.json({ error: "Missing fakultas/prodi" }, { status: 400 });
  }

  const responses = await prisma.response.findMany({
    where: { fakultas, programStudi: prodi },
    orderBy: { createdAt: "desc" },
  });

  const total = responses.length;

  const kepuasan: Record<string, number> = {};
  const kompetensiSum: Record<string, number> = {};
  const tingkatan: Record<string, number> = {};
  const bidang: Record<string, number> = {};

  for (const r of responses) {
    kepuasan[r.kepuasanUmum] = (kepuasan[r.kepuasanUmum] || 0) + 1;
    tingkatan[r.tingkatanPerusahaan] = (tingkatan[r.tingkatanPerusahaan] || 0) + 1;
    bidang[r.bidangPerusahaan] = (bidang[r.bidangPerusahaan] || 0) + 1;
    for (const k of KOMPETENSI_KEYS) {
      const score = SKALA_NILAI[r[k]] || 0;
      kompetensiSum[k] = (kompetensiSum[k] || 0) + score;
    }
  }

  const kompetensiAvg: Record<string, number> = {};
  for (const k of KOMPETENSI_KEYS) {
    kompetensiAvg[k] = total > 0 ? (kompetensiSum[k] || 0) / total : 0;
  }

  const avgAll =
    KOMPETENSI_KEYS.reduce((s, k) => s + (kompetensiAvg[k] || 0), 0) / KOMPETENSI_KEYS.length;

  const date = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const sections = [];

  // Title
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "LAPORAN TRACER PENGGUNA LULUSAN",
          bold: true,
          size: 28,
          font: "Calibri",
          color: "0f2340",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Universitas Muhammadiyah Sidoarjo",
          bold: true,
          size: 24,
          font: "Calibri",
          color: "0f2340",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Tanggal: ${date}`, size: 20, font: "Calibri", italics: true })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Info section
  sections.push(
    new Paragraph({
      text: "Informasi Program Studi",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    })
  );

  const infoTable = new Table({
    rows: [
      new TableRow({
        children: [
          dataCell("Fakultas"),
          dataCell(fakultas),
        ],
      }),
      new TableRow({
        children: [
          dataCell("Program Studi"),
          dataCell(prodi),
        ],
      }),
      new TableRow({
        children: [
          dataCell("Jumlah Responden"),
          dataCell(String(total)),
        ],
      }),
      new TableRow({
        children: [
          dataCell("Rata-rata Kompetensi"),
          dataCell(`${avgAll.toFixed(2)} / 4.00`),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
  });
  sections.push(infoTable);

  // Kepuasan section
  sections.push(
    new Paragraph({
      text: "Tingkat Kepuasan Pengguna",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 100 },
    })
  );

  const kepuasanRows = [
    new TableRow({
      children: [
        headerCell("Tingkat Kepuasan", 40),
        headerCell("Jumlah", 20),
        headerCell("Persentase", 20),
      ],
    }),
    ...KEPUASAN_ORDER.map(
      (k) => {
        const count = kepuasan[k] || 0;
        const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
        return new TableRow({
          children: [
            dataCell(k),
            dataCell(String(count), AlignmentType.CENTER),
            dataCell(`${pct}%`, AlignmentType.CENTER),
          ],
        });
      }
    ),
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Total", bold: true, size: 20, font: "Calibri" })],
            }),
          ],
          borders: BORDER,
          shading: { type: ShadingType.SOLID, color: "F0F0F0" },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: String(total), bold: true, size: 20, font: "Calibri" })],
              alignment: AlignmentType.CENTER,
            }),
          ],
          borders: BORDER,
          shading: { type: ShadingType.SOLID, color: "F0F0F0" },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "100%", bold: true, size: 20, font: "Calibri" })],
              alignment: AlignmentType.CENTER,
            }),
          ],
          borders: BORDER,
          shading: { type: ShadingType.SOLID, color: "F0F0F0" },
        }),
      ],
    }),
  ];

  sections.push(
    new Table({
      rows: kepuasanRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
    })
  );

  // Tingkatan Perusahaan section
  const TINGKATAN_ORDER = ["Lokal", "Nasional", "Multinasional/Internasional"];
  sections.push(
    new Paragraph({
      text: "Tingkatan Perusahaan/Instansi",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 100 },
    })
  );

  const tingkatanRows = [
    new TableRow({
      children: [
        headerCell("Tingkatan", 40),
        headerCell("Jumlah", 20),
        headerCell("Persentase", 20),
      ],
    }),
    ...TINGKATAN_ORDER.map((t) => {
      const count = tingkatan[t] || 0;
      const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
      return new TableRow({
        children: [
          dataCell(t),
          dataCell(String(count), AlignmentType.CENTER),
          dataCell(`${pct}%`, AlignmentType.CENTER),
        ],
      });
    }),
    // Include any tingkatan not in the standard order
    ...Object.entries(tingkatan)
      .filter(([t]) => !TINGKATAN_ORDER.includes(t))
      .map(([t, count]) => {
        const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
        return new TableRow({
          children: [
            dataCell(t),
            dataCell(String(count), AlignmentType.CENTER),
            dataCell(`${pct}%`, AlignmentType.CENTER),
          ],
        });
      }),
  ];

  sections.push(
    new Table({
      rows: tingkatanRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
    })
  );

  // Bidang Perusahaan section
  sections.push(
    new Paragraph({
      text: "Bidang Perusahaan/Instansi",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 100 },
    })
  );

  const bidangEntries = Object.entries(bidang).sort((a, b) => b[1] - a[1]);
  const bidangRows = [
    new TableRow({
      children: [
        headerCell("No", 8),
        headerCell("Bidang Perusahaan/Instansi", 52),
        headerCell("Jumlah", 20),
        headerCell("Persentase", 20),
      ],
    }),
    ...bidangEntries.map(([b, count], i) => {
      const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
      return new TableRow({
        children: [
          dataCell(String(i + 1), AlignmentType.CENTER),
          dataCell(b),
          dataCell(String(count), AlignmentType.CENTER),
          dataCell(`${pct}%`, AlignmentType.CENTER),
        ],
      });
    }),
  ];

  sections.push(
    new Table({
      rows: bidangRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
    })
  );

  // Kompetensi section
  sections.push(
    new Paragraph({
      text: "Rata-rata Penilaian Kompetensi Alumni",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Skala penilaian: 1 = Kurang, 2 = Cukup, 3 = Baik, 4 = Sangat Baik",
          size: 18,
          font: "Calibri",
          italics: true,
          color: "666666",
        }),
      ],
      spacing: { after: 100 },
    })
  );

  const kompetensiRows = [
    new TableRow({
      children: [
        headerCell("No", 8),
        headerCell("Kompetensi", 52),
        headerCell("Rata-rata", 20),
        headerCell("Kategori", 20),
      ],
    }),
    ...KOMPETENSI_KEYS.map((k, i) => {
      const avg = kompetensiAvg[k] || 0;
      let kategori = "Kurang";
      if (avg >= 3.5) kategori = "Sangat Baik";
      else if (avg >= 2.5) kategori = "Baik";
      else if (avg >= 1.5) kategori = "Cukup";
      return new TableRow({
        children: [
          dataCell(String(i + 1), AlignmentType.CENTER),
          dataCell(KOMPETENSI_LABELS[k]),
          dataCell(avg.toFixed(2), AlignmentType.CENTER),
          dataCell(kategori, AlignmentType.CENTER),
        ],
      });
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [] })],
          borders: BORDER,
          shading: { type: ShadingType.SOLID, color: "F0F0F0" },
          columnSpan: 2,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: avgAll.toFixed(2), bold: true, size: 20, font: "Calibri" })],
              alignment: AlignmentType.CENTER,
            }),
          ],
          borders: BORDER,
          shading: { type: ShadingType.SOLID, color: "F0F0F0" },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: avgAll >= 3.5 ? "Sangat Baik" : avgAll >= 2.5 ? "Baik" : avgAll >= 1.5 ? "Cukup" : "Kurang",
                  bold: true,
                  size: 20,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          borders: BORDER,
          shading: { type: ShadingType.SOLID, color: "F0F0F0" },
        }),
      ],
    }),
  ];

  // Fix the colspan row - add "Rata-rata Keseluruhan" text
  kompetensiRows[kompetensiRows.length - 1] = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Rata-rata Keseluruhan", bold: true, size: 20, font: "Calibri" })],
            alignment: AlignmentType.RIGHT,
          }),
        ],
        borders: BORDER,
        shading: { type: ShadingType.SOLID, color: "F0F0F0" },
        columnSpan: 2,
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: avgAll.toFixed(2), bold: true, size: 20, font: "Calibri" })],
            alignment: AlignmentType.CENTER,
          }),
        ],
        borders: BORDER,
        shading: { type: ShadingType.SOLID, color: "F0F0F0" },
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: avgAll >= 3.5 ? "Sangat Baik" : avgAll >= 2.5 ? "Baik" : avgAll >= 1.5 ? "Cukup" : "Kurang",
                bold: true,
                size: 20,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        borders: BORDER,
        shading: { type: ShadingType.SOLID, color: "F0F0F0" },
      }),
    ],
  });

  sections.push(
    new Table({
      rows: kompetensiRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
    })
  );

  // Detail responden
  if (responses.length > 0) {
    sections.push(
      new Paragraph({
        text: "Detail Responden",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 100 },
      })
    );

    const detailRows = [
      new TableRow({
        children: [
          headerCell("No", 6),
          headerCell("Nama Pengguna", 22),
          headerCell("Nama Lulusan", 22),
          headerCell("Kepuasan", 16),
          headerCell("Avg Kompetensi", 16),
          headerCell("Tanggal", 18),
        ],
      }),
      ...responses.map((r, i) => {
        let sum = 0;
        for (const k of KOMPETENSI_KEYS) sum += SKALA_NILAI[r[k]] || 0;
        const avg = sum / KOMPETENSI_KEYS.length;
        return new TableRow({
          children: [
            dataCell(String(i + 1), AlignmentType.CENTER),
            dataCell(r.namaPengguna),
            dataCell(r.namaLulusan),
            dataCell(r.kepuasanUmum, AlignmentType.CENTER),
            dataCell(avg.toFixed(2), AlignmentType.CENTER),
            dataCell(new Date(r.createdAt).toLocaleDateString("id-ID"), AlignmentType.CENTER),
          ],
        });
      }),
    ];

    sections.push(
      new Table({
        rows: detailRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
      })
    );
  }

  // Footer
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Pusat Informasi dan Pusat Karir — Universitas Muhammadiyah Sidoarjo",
          size: 18,
          font: "Calibri",
          italics: true,
          color: "999999",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 600 },
    })
  );

  const doc = new Document({
    sections: [
      {
        children: sections,
        properties: {
          page: {
            margin: { top: 1440, right: 1080, bottom: 1440, left: 1080 },
          },
        },
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const safeProdi = prodi.replace(/[^a-zA-Z0-9]/g, "-");

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="laporan-${safeProdi}.docx"`,
    },
  });
}
