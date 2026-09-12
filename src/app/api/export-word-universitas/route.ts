import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { NextResponse } from "next/server";
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

const SKALA_ORDER = ["Sangat baik", "Baik", "Cukup", "Kurang"] as const;

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

function boldCell(text: string, align: typeof AlignmentType[keyof typeof AlignmentType] = AlignmentType.LEFT): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, size: 20, font: "Calibri" })],
        alignment: align,
      }),
    ],
    borders: BORDER,
    shading: { type: ShadingType.SOLID, color: "F0F0F0" },
  });
}

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const responses = await prisma.response.findMany({
    orderBy: { createdAt: "desc" },
  });

  const total = responses.length;

  const kepuasan: Record<string, number> = {};
  const kompetensiSum: Record<string, number> = {};
  const kompetensiDist: Record<string, Record<string, number>> = {};
  const tingkatan: Record<string, number> = {};
  const bidang: Record<string, number> = {};
  const prodiSet = new Set<string>();
  const fakultasSet = new Set<string>();

  for (const r of responses) {
    kepuasan[r.kepuasanUmum] = (kepuasan[r.kepuasanUmum] || 0) + 1;
    tingkatan[r.tingkatanPerusahaan] = (tingkatan[r.tingkatanPerusahaan] || 0) + 1;
    bidang[r.bidangPerusahaan] = (bidang[r.bidangPerusahaan] || 0) + 1;
    prodiSet.add(r.programStudi);
    fakultasSet.add(r.fakultas);
    for (const k of KOMPETENSI_KEYS) {
      const val = r[k];
      const score = SKALA_NILAI[val] || 0;
      kompetensiSum[k] = (kompetensiSum[k] || 0) + score;
      if (!kompetensiDist[k]) kompetensiDist[k] = {};
      kompetensiDist[k][val] = (kompetensiDist[k][val] || 0) + 1;
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

  const sections: (Paragraph | Table)[] = [];

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
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "LAPORAN KESELURUHAN UNIVERSITAS",
          bold: true,
          size: 22,
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
      text: "Informasi Universitas",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    })
  );

  sections.push(
    new Table({
      rows: [
        new TableRow({
          children: [dataCell("Universitas"), dataCell("Universitas Muhammadiyah Sidoarjo")],
        }),
        new TableRow({
          children: [dataCell("Jumlah Fakultas"), dataCell(String(fakultasSet.size))],
        }),
        new TableRow({
          children: [dataCell("Jumlah Program Studi"), dataCell(String(prodiSet.size))],
        }),
        new TableRow({
          children: [dataCell("Total Responden"), dataCell(String(total))],
        }),
        new TableRow({
          children: [dataCell("Rata-rata Kompetensi"), dataCell(`${avgAll.toFixed(2)} / 4.00`)],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
    })
  );

  // Kepuasan
  sections.push(
    new Paragraph({
      text: "Tingkat Kepuasan Pengguna",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 100 },
    })
  );

  sections.push(
    new Table({
      rows: [
        new TableRow({
          children: [
            headerCell("Tingkat Kepuasan", 40),
            headerCell("Jumlah", 20),
            headerCell("Persentase", 20),
          ],
        }),
        ...KEPUASAN_ORDER.map((k) => {
          const count = kepuasan[k] || 0;
          const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
          return new TableRow({
            children: [
              dataCell(k),
              dataCell(String(count), AlignmentType.CENTER),
              dataCell(`${pct}%`, AlignmentType.CENTER),
            ],
          });
        }),
        new TableRow({
          children: [
            boldCell("Total"),
            boldCell(String(total), AlignmentType.CENTER),
            boldCell("100%", AlignmentType.CENTER),
          ],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
    })
  );

  // Tingkatan
  const TINGKATAN_ORDER = ["Lokal", "Nasional", "Multinasional/Internasional"];
  sections.push(
    new Paragraph({
      text: "Tingkatan Perusahaan/Instansi",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 100 },
    })
  );

  sections.push(
    new Table({
      rows: [
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
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
    })
  );

  // Bidang
  sections.push(
    new Paragraph({
      text: "Bidang Perusahaan/Instansi",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 100 },
    })
  );

  const bidangEntries = Object.entries(bidang).sort((a, b) => b[1] - a[1]);
  sections.push(
    new Table({
      rows: [
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
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
    })
  );

  // Kompetensi
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
        headerCell("No", 5),
        headerCell("Kompetensi", 25),
        headerCell("Rata-rata", 10),
        ...SKALA_ORDER.map((s) => headerCell(s, 15)),
      ],
    }),
    ...KOMPETENSI_KEYS.map((k, i) => {
      const avg = kompetensiAvg[k] || 0;
      const dist = kompetensiDist[k] || {};
      return new TableRow({
        children: [
          dataCell(String(i + 1), AlignmentType.CENTER),
          dataCell(KOMPETENSI_LABELS[k]),
          dataCell(avg.toFixed(2), AlignmentType.CENTER),
          ...SKALA_ORDER.map((s) => {
            const count = dist[s] || 0;
            const pct = total > 0 ? ((count / total) * 100).toFixed(0) : "0";
            return dataCell(`${count} (${pct}%)`, AlignmentType.CENTER);
          }),
        ],
      });
    }),
    new TableRow({
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
        boldCell(avgAll.toFixed(2), AlignmentType.CENTER),
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
          columnSpan: 3,
        }),
      ],
    }),
  ];

  sections.push(
    new Table({
      rows: kompetensiRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
    })
  );

  // Ringkasan per Prodi
  type ProdiSummary = {
    fakultas: string;
    programStudi: string;
    total: number;
    avgAll: number;
  };

  const prodiMap = new Map<string, ProdiSummary & { kompetensiSum: Record<string, number> }>();
  for (const r of responses) {
    const key = `${r.fakultas}||${r.programStudi}`;
    if (!prodiMap.has(key)) {
      prodiMap.set(key, {
        fakultas: r.fakultas,
        programStudi: r.programStudi,
        total: 0,
        avgAll: 0,
        kompetensiSum: {},
      });
    }
    const p = prodiMap.get(key)!;
    p.total++;
    for (const k of KOMPETENSI_KEYS) {
      const score = SKALA_NILAI[r[k]] || 0;
      p.kompetensiSum[k] = (p.kompetensiSum[k] || 0) + score;
    }
  }

  const prodiSummaries = Array.from(prodiMap.values())
    .map((p) => {
      const avgSum = KOMPETENSI_KEYS.reduce(
        (s, k) => s + (p.total > 0 ? (p.kompetensiSum[k] || 0) / p.total : 0),
        0
      );
      return {
        fakultas: p.fakultas,
        programStudi: p.programStudi,
        total: p.total,
        avgAll: avgSum / KOMPETENSI_KEYS.length,
      };
    })
    .sort((a, b) => a.fakultas.localeCompare(b.fakultas) || a.programStudi.localeCompare(b.programStudi));

  sections.push(
    new Paragraph({
      text: "Ringkasan Per Program Studi",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 100 },
    })
  );

  sections.push(
    new Table({
      rows: [
        new TableRow({
          children: [
            headerCell("No", 6),
            headerCell("Fakultas", 34),
            headerCell("Program Studi", 28),
            headerCell("Responden", 14),
            headerCell("Avg Kompetensi", 18),
          ],
        }),
        ...prodiSummaries.map((p, i) =>
          new TableRow({
            children: [
              dataCell(String(i + 1), AlignmentType.CENTER),
              dataCell(p.fakultas),
              dataCell(p.programStudi),
              dataCell(String(p.total), AlignmentType.CENTER),
              dataCell(p.avgAll.toFixed(2), AlignmentType.CENTER),
            ],
          })
        ),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
    })
  );

  // Daftar Perusahaan/Instansi
  if (responses.length > 0) {
    sections.push(
      new Paragraph({
        text: "Daftar Perusahaan/Instansi Pengguna",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 100 },
      })
    );

    const perusahaanRows = [
      new TableRow({
        children: [
          headerCell("No", 6),
          headerCell("Nama Pengguna", 22),
          headerCell("Jabatan", 18),
          headerCell("Perusahaan/Instansi", 32),
          headerCell("Jabatan Lulusan", 22),
        ],
      }),
      ...responses.map((r, i) =>
        new TableRow({
          children: [
            dataCell(String(i + 1), AlignmentType.CENTER),
            dataCell(r.namaPengguna),
            dataCell(r.jabatan || ""),
            dataCell(r.namaPerusahaan),
            dataCell(r.jabatanLulusan),
          ],
        })
      ),
    ];

    sections.push(
      new Table({
        rows: perusahaanRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
      })
    );
  }

  // Harapan Pengguna
  if (responses.length > 0) {
    sections.push(
      new Paragraph({
        text: "Harapan Pengguna",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 100 },
      })
    );

    sections.push(
      new Table({
        rows: [
          new TableRow({
            children: [
              headerCell("No", 8),
              headerCell("Nama Pengguna", 32),
              headerCell("Harapan", 60),
            ],
          }),
          ...responses.map((r, i) =>
            new TableRow({
              children: [
                dataCell(String(i + 1), AlignmentType.CENTER),
                dataCell(r.namaPengguna),
                dataCell(r.harapanPengguna),
              ],
            })
          ),
        ],
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

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="laporan-universitas-umsida.docx"`,
    },
  });
}
