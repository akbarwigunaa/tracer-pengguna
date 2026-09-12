import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const responses = await prisma.response.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: responses.length,
    kepuasan: {
      "Sangat Puas": 0,
      Puas: 0,
      Cukup: 0,
      "Kurang Puas": 0,
      "Sangat Tidak Puas": 0,
    } as Record<string, number>,
    tingkatan: {
      Lokal: 0,
      Nasional: 0,
      "Multinasional/Internasional": 0,
    } as Record<string, number>,
  };

  for (const r of responses) {
    if (r.kepuasanUmum in stats.kepuasan) stats.kepuasan[r.kepuasanUmum]++;
    if (r.tingkatanPerusahaan in stats.tingkatan)
      stats.tingkatan[r.tingkatanPerusahaan]++;
  }

  return <AdminDashboard responses={responses} stats={stats} />;
}
