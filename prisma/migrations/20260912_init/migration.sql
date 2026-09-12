-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "namaPengguna" TEXT NOT NULL,
    "jabatan" TEXT,
    "noWhatsapp" TEXT NOT NULL,
    "namaLulusan" TEXT NOT NULL,
    "jabatanLulusan" TEXT NOT NULL,
    "programStudi" TEXT,
    "tingkatanPerusahaan" TEXT NOT NULL,
    "bidangPerusahaan" TEXT NOT NULL,
    "kepuasanUmum" TEXT NOT NULL,
    "harapanPengguna" TEXT NOT NULL,
    "integritas" TEXT NOT NULL,
    "keahlianBidang" TEXT NOT NULL,
    "kemampuanBahasa" TEXT NOT NULL,
    "penggunaanTeknologi" TEXT NOT NULL,
    "komunikasi" TEXT NOT NULL,
    "kerjasamaTim" TEXT NOT NULL,
    "pengembanganDiri" TEXT NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);
