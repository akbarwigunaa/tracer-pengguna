"use server";

import { prisma } from "./prisma";

export type FormState = {
  success: boolean;
  error?: string;
};

export async function submitResponse(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const data = {
      email: formData.get("email") as string,
      namaPengguna: formData.get("namaPengguna") as string,
      jabatan: (formData.get("jabatan") as string) || null,
      noWhatsapp: formData.get("noWhatsapp") as string,
      namaPerusahaan: formData.get("namaPerusahaan") as string,
      namaLulusan: formData.get("namaLulusan") as string,
      jabatanLulusan: formData.get("jabatanLulusan") as string,
      fakultas: formData.get("fakultas") as string,
      programStudi: formData.get("programStudi") as string,
      tingkatanPerusahaan: formData.get("tingkatanPerusahaan") as string,
      bidangPerusahaan: formData.get("bidangPerusahaan") as string,
      kepuasanUmum: formData.get("kepuasanUmum") as string,
      harapanPengguna: formData.get("harapanPengguna") as string,
      integritas: formData.get("integritas") as string,
      keahlianBidang: formData.get("keahlianBidang") as string,
      kemampuanBahasa: formData.get("kemampuanBahasa") as string,
      penggunaanTeknologi: formData.get("penggunaanTeknologi") as string,
      komunikasi: formData.get("komunikasi") as string,
      kerjasamaTim: formData.get("kerjasamaTim") as string,
      pengembanganDiri: formData.get("pengembanganDiri") as string,
    };

    const required = [
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
    ] as const;

    for (const field of required) {
      if (!data[field]) {
        return { success: false, error: `Field ${field} wajib diisi.` };
      }
    }

    await prisma.response.create({ data });

    return { success: true };
  } catch (e) {
    console.error("submitResponse error:", e);
    return { success: false, error: "Terjadi kesalahan. Silakan coba lagi." };
  }
}
