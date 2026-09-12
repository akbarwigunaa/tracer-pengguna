import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import LaporanProdi from "./LaporanProdi";

export const dynamic = "force-dynamic";

const KOMPETENSI_KEYS = [
  "integritas",
  "keahlianBidang",
  "kemampuanBahasa",
  "penggunaanTeknologi",
  "komunikasi",
  "kerjasamaTim",
  "pengembanganDiri",
] as const;

const SKALA_NILAI: Record<string, number> = {
  "Sangat baik": 4,
  Baik: 3,
  Cukup: 2,
  Kurang: 1,
};

export type ProdiReport = {
  fakultas: string;
  programStudi: string;
  total: number;
  kepuasan: Record<string, number>;
  kompetensi: Record<string, number>;
};

export default async function LaporanPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const responses = await prisma.response.findMany({
    orderBy: { createdAt: "desc" },
  });

  const prodiMap = new Map<string, ProdiReport>();

  for (const r of responses) {
    const key = `${r.fakultas}||${r.programStudi}`;
    if (!prodiMap.has(key)) {
      prodiMap.set(key, {
        fakultas: r.fakultas,
        programStudi: r.programStudi,
        total: 0,
        kepuasan: {},
        kompetensi: {},
      });
    }
    const p = prodiMap.get(key)!;
    p.total++;
    p.kepuasan[r.kepuasanUmum] = (p.kepuasan[r.kepuasanUmum] || 0) + 1;

    for (const k of KOMPETENSI_KEYS) {
      const val = r[k];
      const score = SKALA_NILAI[val] || 0;
      p.kompetensi[k] = (p.kompetensi[k] || 0) + score;
    }
  }

  const reports: ProdiReport[] = Array.from(prodiMap.values())
    .map((p) => {
      const avg: Record<string, number> = {};
      for (const k of KOMPETENSI_KEYS) {
        avg[k] = p.total > 0 ? Number(((p.kompetensi[k] || 0) / p.total).toFixed(2)) : 0;
      }
      return { ...p, kompetensi: avg };
    })
    .sort((a, b) => a.fakultas.localeCompare(b.fakultas) || a.programStudi.localeCompare(b.programStudi));

  return <LaporanProdi reports={reports} totalResponses={responses.length} />;
}
