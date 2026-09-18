import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import PanduanPage from "./PanduanPage";

export default async function Panduan() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  return <PanduanPage />;
}
