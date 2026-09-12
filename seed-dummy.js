const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const FAKULTAS_PRODI = {
  "FPSI (Fakultas Pendidikan dan Studi Islam)": [
    "Pendidikan Agama Islam", "Pendidikan Bahasa Arab", "Pendidikan Guru PAUD",
    "Pendidikan Guru SD", "Pendidikan IPA", "Pendidikan Bahasa Inggris", "Pendidikan Profesi Guru",
  ],
  "FBHIS (Fakultas Bisnis Hukum dan Ilmu Sosial)": [
    "S1 Akuntansi", "S1 Administrasi Publik", "S1 Ilmu Komunikasi",
    "S1 Hukum", "S1 Manajemen", "S1 Bisnis Digital", "S1 Perbankan Syariah",
  ],
  "FKKG (Fakultas Kedokteran dan Kedokteran Gigi)": [
    "S1 Kedokteran", "S1 Kedokteran Gigi", "Profesi Kedokteran Gigi", "Profesi Dokter",
  ],
  "FST (Fakultas Sains dan Teknologi)": [
    "S1 Teknik Mesin", "S1 Teknik Elektro", "S1 Teknik Industri",
    "S1 Teknik Sipil", "S1 Informatika", "S1 Agroteknologi", "S1 Teknologi Pangan", "S1 Sains Data",
  ],
  "FIKP (Fakultas Ilmu Kesehatan dan Psikologi)": [
    "S1 Kebidanan", "S1 Fisioterapi", "D4 Teknologi Laboratorium Medis",
    "D4 Manajemen Informasi Kesehatan", "S1 Psikologi", "Profesi Bidan",
  ],
  "Pascasarjana": [
    "S2 Manajemen Pendidikan Islam", "S2 Pendidikan Dasar",
    "S2 Manajemen", "S2 Ilmu Komunikasi", "S2 MIST",
  ],
};

const TINGKATAN = ["Lokal", "Nasional", "Multinasional/Internasional"];
const KEPUASAN = ["Sangat Puas", "Puas", "Cukup", "Kurang Puas", "Sangat Tidak Puas"];
const SKALA = ["Sangat baik", "Baik", "Cukup", "Kurang"];
const BIDANG = [
  "Teknologi Informasi", "Pendidikan", "Kesehatan", "Perbankan", "Manufaktur",
  "Konstruksi", "Pertanian", "Perdagangan", "Jasa Keuangan", "Pemerintahan",
  "Media & Komunikasi", "Transportasi", "Energi", "Pariwisata", "Hukum",
];

const NAMA_DEPAN = [
  "Budi", "Siti", "Ahmad", "Dewi", "Rizky", "Putri", "Agus", "Sri", "Dian", "Eko",
  "Fajar", "Gita", "Hendra", "Indah", "Joko", "Kartika", "Lukman", "Maya", "Nur", "Oscar",
  "Prasetyo", "Qori", "Ratna", "Surya", "Tika", "Umar", "Vina", "Wahyu", "Xena", "Yusuf",
  "Zahra", "Andi", "Bella", "Candra", "Diana", "Erwin", "Fitri", "Galih", "Hani", "Irfan",
];
const NAMA_BELAKANG = [
  "Santoso", "Rahayu", "Fauzi", "Lestari", "Maulana", "Wibowo", "Purnama", "Hidayat",
  "Saputra", "Wijaya", "Pratama", "Kusuma", "Nugroho", "Handayani", "Setiawan", "Anggraini",
  "Permana", "Susanti", "Hartono", "Fitriani",
];
const JABATAN = [
  "Manager", "Direktur", "HRD", "Supervisor", "Kepala Divisi", "Owner",
  "Kepala Sekolah", "Koordinator", "Team Lead", "Kepala Bagian",
];
const NAMA_PERUSAHAAN = [
  "PT Telkom Indonesia", "PT Astra International", "PT Bank Mandiri", "PT Pertamina",
  "PT Unilever Indonesia", "RS Sidoarjo", "SDN Sidoarjo 1", "SMAN 1 Sidoarjo",
  "PT Semen Indonesia", "CV Jaya Abadi", "PT Gudang Garam", "Universitas Airlangga",
  "PT Indofood", "PT Mayora", "Klinik Sehat Sentosa", "PT Wijaya Karya",
  "PT Kalbe Farma", "Dinas Pendidikan Sidoarjo", "PT Bukalapak", "PT Tokopedia",
  "PT Gojek Indonesia", "RS Muhammadiyah Sidoarjo", "Bank Jatim", "PT Sinar Mas",
  "PT HM Sampoerna", "Pemkab Sidoarjo", "PT Adhi Karya", "CV Maju Bersama",
  "PT Pegadaian", "UD Sejahtera",
];
const JABATAN_LULUSAN = [
  "Staff", "Guru", "Programmer", "Analyst", "Dokter", "Perawat", "Akuntan",
  "Admin", "Teknisi", "Marketing", "Dosen", "Konsultan", "Peneliti",
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randPhone() { return "08" + String(Math.floor(Math.random() * 10000000000)).padStart(10, "0"); }

async function seed() {
  const data = [];
  const fakultasList = Object.keys(FAKULTAS_PRODI);

  for (let i = 0; i < 100; i++) {
    const fak = pick(fakultasList);
    const prodi = pick(FAKULTAS_PRODI[fak]);
    const namaP = pick(NAMA_DEPAN) + " " + pick(NAMA_BELAKANG);
    const namaL = pick(NAMA_DEPAN) + " " + pick(NAMA_BELAKANG);

    // Weighted random for kepuasan (more positive)
    const kepRand = Math.random();
    let kep;
    if (kepRand < 0.3) kep = "Sangat Puas";
    else if (kepRand < 0.65) kep = "Puas";
    else if (kepRand < 0.85) kep = "Cukup";
    else if (kepRand < 0.95) kep = "Kurang Puas";
    else kep = "Sangat Tidak Puas";

    // Weighted random for skala (more positive)
    function randSkala() {
      const r = Math.random();
      if (r < 0.35) return "Sangat baik";
      if (r < 0.7) return "Baik";
      if (r < 0.9) return "Cukup";
      return "Kurang";
    }

    // Random date in last 6 months
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    data.push({
      email: `user${i + 1}@example.com`,
      namaPengguna: namaP,
      jabatan: pick(JABATAN),
      noWhatsapp: randPhone(),
      namaPerusahaan: pick(NAMA_PERUSAHAAN),
      namaLulusan: namaL,
      jabatanLulusan: pick(JABATAN_LULUSAN),
      fakultas: fak,
      programStudi: prodi,
      tingkatanPerusahaan: pick(TINGKATAN),
      bidangPerusahaan: pick(BIDANG),
      kepuasanUmum: kep,
      harapanPengguna: pick([
        "Tingkatkan kemampuan praktis mahasiswa",
        "Perbanyak program magang dan kerja praktek",
        "Kurikulum lebih disesuaikan dengan kebutuhan industri",
        "Tingkatkan kemampuan bahasa asing lulusan",
        "Perbanyak pelatihan soft skill dan komunikasi",
        "Lulusan sudah cukup kompeten, pertahankan kualitas",
        "Tingkatkan penguasaan teknologi terkini",
        "Perlu lebih banyak pengalaman lapangan",
        "Kemampuan problem solving perlu ditingkatkan",
        "Semoga lebih banyak lulusan yang siap kerja",
        "Kerjasama dengan industri perlu diperkuat",
        "Lulusan perlu lebih adaptif terhadap perubahan",
      ]),
      integritas: randSkala(),
      keahlianBidang: randSkala(),
      kemampuanBahasa: randSkala(),
      penggunaanTeknologi: randSkala(),
      komunikasi: randSkala(),
      kerjasamaTim: randSkala(),
      pengembanganDiri: randSkala(),
      createdAt: date,
    });
  }

  await prisma.response.createMany({ data });
  console.log("Seeded 100 dummy responses");
  await prisma.$disconnect();
}

seed();
