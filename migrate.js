const { PrismaClient } = require("@prisma/client");

async function migrate() {
  const prisma = new PrismaClient();
  try {
    // Test connection and create table if needed via raw SQL
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Response" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "email" TEXT NOT NULL,
        "namaPengguna" TEXT NOT NULL,
        "jabatan" TEXT,
        "noWhatsapp" TEXT NOT NULL,
        "namaPerusahaan" TEXT NOT NULL,
        "namaLulusan" TEXT NOT NULL,
        "jabatanLulusan" TEXT NOT NULL,
        "fakultas" TEXT NOT NULL,
        "programStudi" TEXT NOT NULL,
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
        "pengembanganDiri" TEXT NOT NULL
      )
    `);
    console.log("Database migration complete");
  } catch (e) {
    // Table likely already exists
    if (e.message && e.message.includes("already exists")) {
      console.log("Table already exists, skipping");
    } else {
      console.error("Migration error:", e.message);
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
