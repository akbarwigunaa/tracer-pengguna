# Tracer Pengguna Lulusan — UMSIDA

Aplikasi web survei kepuasan pengguna (employer) terhadap lulusan Universitas Muhammadiyah Sidoarjo. Digunakan oleh Pusat Informasi dan Pengembangan Karir (PINPKU) UMSIDA untuk mengumpulkan, mengelola, dan menganalisis umpan balik dari perusahaan/instansi yang mempekerjakan alumni.

## Fitur

### Survei Publik
- Form kuesioner multi-step (4 bagian) untuk pengguna lulusan
- Identitas pengguna, identitas lulusan, informasi perusahaan, dan penilaian kompetensi alumni
- Validasi format email dan nomor WhatsApp Indonesia
- Pilihan fakultas dan program studi terstruktur
- Skala penilaian kompetensi: Sangat baik, Baik, Cukup, Kurang
- Halaman terima kasih dengan kontak PINPKU

### Dashboard Admin
- Login admin dengan cookie-based session
- Tabel data respons dengan pencarian dan filter tahun
- Statistik ringkasan (total respons, kepuasan, tingkatan perusahaan)
- Hapus data per respons
- Import data dari Excel (.xlsx)
- Export data ke Excel (.xlsx)
- Download template Excel untuk import

### Laporan Per Prodi & Universitas
- Laporan agregat per program studi dan universitas-wide
- Filter berdasarkan fakultas dan tahun
- Tabel kepuasan umum, tingkatan perusahaan, bidang perusahaan
- Tabel kompetensi dengan rata-rata dan distribusi persentase (Sangat baik/Baik/Cukup/Kurang)
- Daftar perusahaan/instansi pengguna
- Daftar harapan pengguna
- Export laporan ke Word (.docx) per prodi dan universitas

## Tech Stack

| Teknologi | Versi |
|---|---|
| Next.js (App Router) | 16.3.5 |
| React | 19.2.8 |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Prisma ORM | 6.19.3 |
| PostgreSQL | - |
| ExcelJS | 4.4.0 |
| docx | 9.7.1 |

## Struktur Direktori

```
tracer-pengguna/
├── prisma/
│   └── schema.prisma          # Model database (Response)
├── public/
│   ├── logo-umsida.png        # Logo UMSIDA (warna)
│   └── logo-umsida-putih.png  # Logo UMSIDA (putih)
├── src/
│   ├── app/
│   │   ├── page.tsx            # Halaman survei (publik)
│   │   ├── sukses/page.tsx     # Halaman terima kasih
│   │   ├── admin/
│   │   │   ├── page.tsx            # Dashboard admin (server)
│   │   │   ├── AdminDashboard.tsx  # Dashboard admin (client)
│   │   │   ├── login/              # Halaman login admin
│   │   │   └── laporan/
│   │   │       ├── page.tsx            # Laporan (server, data processing)
│   │   │       └── LaporanProdi.tsx    # Laporan (client, UI + Word export)
│   │   └── api/
│   │       ├── export/route.ts             # Export Excel (.xlsx)
│   │       ├── export-word/route.ts        # Export Word per prodi
│   │       ├── export-word-universitas/route.ts  # Export Word universitas
│   │       ├── import/route.ts             # Import dari Excel
│   │       ├── template/route.ts           # Download template Excel
│   │       └── responses/[id]/route.ts     # Hapus respons (DELETE)
│   ├── components/
│   │   └── TracerForm.tsx      # Form survei multi-step
│   └── lib/
│       ├── actions.ts          # Server action (submit respons)
│       ├── auth.ts             # Autentikasi admin (cookie-based)
│       └── prisma.ts           # Prisma client instance
├── migrate.js                  # Migrasi database (raw SQL)
├── seed-dummy.js               # Data dummy untuk development
├── start.sh                    # Entry point Railway (migrasi + start)
├── Dockerfile                  # Multi-stage Docker build
└── railway.toml                # Konfigurasi Railway deployment
```

## Memulai Development

### Prasyarat

- Node.js 20+
- PostgreSQL database

### Instalasi

1. Clone repository:
   ```bash
   git clone https://github.com/akbarwigunaa/tracer-pengguna.git
   cd tracer-pengguna
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Salin file environment:
   ```bash
   cp .env.example .env
   ```

4. Isi variabel di `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/tracer_pengguna?schema=public"
   ADMIN_PASSWORD="password_admin_anda"
   ```

5. Setup database:
   ```bash
   npx prisma db push
   ```

6. (Opsional) Isi data dummy:
   ```bash
   node seed-dummy.js
   ```

7. Jalankan development server:
   ```bash
   npm run dev
   ```

8. Buka [http://localhost:3000](http://localhost:3000)

### Akses Admin

Buka `/admin/login` dan masukkan password yang diatur di `ADMIN_PASSWORD`.

## Deployment (Railway)

Aplikasi di-deploy menggunakan Railway dengan Docker:

1. Buat project di [Railway](https://railway.app)
2. Tambahkan PostgreSQL plugin
3. Set environment variables:
   - `DATABASE_URL` — otomatis dari PostgreSQL plugin
   - `ADMIN_PASSWORD` — password admin pilihan Anda
4. Deploy dari GitHub repository

Railway akan otomatis build menggunakan `Dockerfile` dan menjalankan migrasi via `start.sh` sebelum memulai server.

## Model Data

### Response

| Field | Tipe | Deskripsi |
|---|---|---|
| id | String (CUID) | Primary key |
| createdAt | DateTime | Waktu pengisian |
| tahun | Int | Tahun pengambilan data |
| email | String | Email pengguna |
| namaPengguna | String | Nama pengguna lulusan |
| jabatan | String? | Jabatan pengguna (opsional) |
| noWhatsapp | String | Nomor WhatsApp |
| namaPerusahaan | String | Nama perusahaan/institusi |
| namaLulusan | String | Nama lulusan UMSIDA |
| jabatanLulusan | String | Jabatan lulusan di perusahaan |
| fakultas | String | Fakultas lulusan |
| programStudi | String | Program studi lulusan |
| tingkatanPerusahaan | String | Lokal / Nasional / Multinasional |
| bidangPerusahaan | String | Bidang perusahaan |
| kepuasanUmum | String | Tingkat kepuasan umum |
| harapanPengguna | String | Harapan/masukan pengguna |
| integritas | String | Penilaian integritas |
| keahlianBidang | String | Penilaian keahlian bidang |
| kemampuanBahasa | String | Penilaian kemampuan bahasa |
| penggunaanTeknologi | String | Penilaian penggunaan TI |
| komunikasi | String | Penilaian komunikasi |
| kerjasamaTim | String | Penilaian kerjasama tim |
| pengembanganDiri | String | Penilaian pengembangan diri |

## API Endpoints

| Method | Path | Deskripsi | Auth |
|---|---|---|---|
| POST | `/` (Server Action) | Submit respons survei | Tidak |
| GET | `/api/export` | Export semua data ke Excel | Ya |
| GET | `/api/export-word?fakultas=...&prodi=...` | Export laporan prodi ke Word | Ya |
| GET | `/api/export-word-universitas` | Export laporan universitas ke Word | Ya |
| POST | `/api/import` | Import data dari Excel | Ya |
| GET | `/api/template` | Download template Excel | Ya |
| DELETE | `/api/responses/[id]` | Hapus satu respons | Ya |

## Lisensi

Hak cipta Universitas Muhammadiyah Sidoarjo. Untuk penggunaan internal.
