"use client";

import { useActionState, useState, useEffect } from "react";
import { submitResponse, type FormState } from "@/lib/actions";
import { useRouter } from "next/navigation";

const KOMPETENSI = [
  { name: "integritas", label: "Integritas (etika dan moral)" },
  { name: "keahlianBidang", label: "Keahlian berdasarkan bidang ilmu" },
  { name: "kemampuanBahasa", label: "Kemampuan Bahasa Asing" },
  { name: "penggunaanTeknologi", label: "Penggunaan Teknologi Informasi" },
  { name: "komunikasi", label: "Komunikasi" },
  { name: "kerjasamaTim", label: "Kerjasama Tim" },
  { name: "pengembanganDiri", label: "Pengembangan Diri" },
];

const SKALA = ["Sangat baik", "Baik", "Cukup", "Kurang"];

const FAKULTAS_PRODI: Record<string, string[]> = {
  "FPSI (Fakultas Pendidikan dan Studi Islam)": [
    "Pendidikan Agama Islam",
    "Pendidikan Bahasa Arab",
    "Pendidikan Guru PAUD",
    "Pendidikan Guru SD",
    "Pendidikan IPA",
    "Pendidikan Bahasa Inggris",
    "Pendidikan Profesi Guru",
  ],
  "FBHIS (Fakultas Bisnis Hukum dan Ilmu Sosial)": [
    "S1 Akuntansi",
    "S1 Administrasi Publik",
    "S1 Ilmu Komunikasi",
    "S1 Hukum",
    "S1 Manajemen",
    "S1 Bisnis Digital",
    "S1 Perbankan Syariah",
  ],
  "FKKG (Fakultas Kedokteran dan Kedokteran Gigi)": [
    "S1 Kedokteran",
    "S1 Kedokteran Gigi",
    "Profesi Kedokteran Gigi",
    "Profesi Dokter",
  ],
  "FST (Fakultas Sains dan Teknologi)": [
    "S1 Teknik Mesin",
    "S1 Teknik Elektro",
    "S1 Teknik Industri",
    "S1 Teknik Sipil",
    "S1 Informatika",
    "S1 Agroteknologi",
    "S1 Teknologi Pangan",
    "S1 Sains Data",
  ],
  "FIKP (Fakultas Ilmu Kesehatan dan Psikologi)": [
    "S1 Kebidanan",
    "S1 Fisioterapi",
    "D4 Teknologi Laboratorium Medis",
    "D4 Manajemen Informasi Kesehatan",
    "S1 Psikologi",
    "Profesi Bidan",
  ],
  "Pascasarjana": [
    "S2 Manajemen Pendidikan Islam",
    "S2 Pendidikan Dasar",
    "S2 Manajemen",
    "S2 Ilmu Komunikasi",
    "S2 MIST",
  ],
};

const TINGKATAN = ["Lokal", "Nasional", "Multinasional/Internasional"];

const KEPUASAN = [
  "Sangat Puas",
  "Puas",
  "Cukup",
  "Kurang Puas",
  "Sangat Tidak Puas",
];

export default function TracerForm() {
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    submitResponse,
    { success: false }
  );

  useEffect(() => {
    if (state.success) {
      router.push("/sukses");
    }
  }, [state.success, router]);

  function updateField(name: string, value: string) {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  function validateStep(): boolean {
    const missing: string[] = [];
    if (step === 1) {
      if (!formValues.email) missing.push("Email");
      if (!formValues.namaPengguna) missing.push("Nama Pengguna");
      if (!formValues.noWhatsapp) missing.push("No WhatsApp");
    } else if (step === 2) {
      if (!formValues.namaLulusan) missing.push("Nama Lulusan");
      if (!formValues.jabatanLulusan) missing.push("Jabatan");
      if (!formValues.fakultas) missing.push("Fakultas");
      if (!formValues.programStudi) missing.push("Program Studi");
    } else if (step === 3) {
      if (!formValues.tingkatanPerusahaan)
        missing.push("Tingkatan Perusahaan/Instansi");
      if (!formValues.bidangPerusahaan)
        missing.push("Bidang Instansi/Perusahaan");
      if (!formValues.kepuasanUmum) missing.push("Kepuasan Umum");
      if (!formValues.harapanPengguna) missing.push("Harapan Pengguna");
    } else if (step === 4) {
      for (const k of KOMPETENSI) {
        if (!formValues[k.name]) missing.push(k.label);
      }
    }
    setErrors(missing);
    return missing.length === 0;
  }

  function nextStep() {
    if (validateStep()) setStep((s) => s + 1);
  }

  function prevStep() {
    setErrors([]);
    setStep((s) => s - 1);
  }

  const stepTitles = [
    "Identitas Pengguna",
    "Identitas Lulusan",
    "Informasi Perusahaan/Instansi",
    "Penilaian Kemampuan Alumni",
  ];

  return (
    <form action={formAction} className="w-full max-w-2xl mx-auto">
      {/* Hidden fields to pass all values on submit */}
      {Object.entries(formValues).map(([key, val]) => (
        <input key={key} type="hidden" name={key} value={val} />
      ))}

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          {stepTitles.map((title, i) => (
            <span
              key={i}
              className={`hidden sm:inline ${i + 1 === step ? "font-bold text-primary-dark" : ""}`}
            >
              {i + 1}. {title}
            </span>
          ))}
        </div>
        <div className="text-sm font-bold text-primary-dark mb-2 sm:hidden">
          Bagian {step} dari 4: {stepTitles[step - 1]}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold mb-1">Mohon lengkapi field berikut:</p>
          <ul className="list-disc list-inside text-sm">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {state.error}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-6">
          <SectionHeader
            title="Identitas Pengguna"
            desc="Data Bapak/Ibu sebagai pengguna lulusan UMSIDA"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            required
            value={formValues.email || ""}
            onChange={updateField}
          />
          <TextField
            label="Nama Pengguna"
            name="namaPengguna"
            required
            value={formValues.namaPengguna || ""}
            onChange={updateField}
          />
          <TextField
            label="Jabatan"
            name="jabatan"
            value={formValues.jabatan || ""}
            onChange={updateField}
          />
          <TextField
            label="No WhatsApp"
            name="noWhatsapp"
            required
            value={formValues.noWhatsapp || ""}
            onChange={updateField}
          />
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-6">
          <SectionHeader
            title="Identitas Lulusan"
            desc="Informasi lulusan UMSIDA di instansi/perusahaan yang Bapak/Ibu pimpin"
          />
          <TextField
            label="Nama Lulusan"
            name="namaLulusan"
            required
            value={formValues.namaLulusan || ""}
            onChange={updateField}
          />
          <TextField
            label="Jabatan"
            name="jabatanLulusan"
            required
            value={formValues.jabatanLulusan || ""}
            onChange={updateField}
          />
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <label className="block font-medium mb-2">
              Fakultas <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={formValues.fakultas || ""}
              onChange={(e) => {
                updateField("fakultas", e.target.value);
                updateField("programStudi", "");
              }}
              className="w-full border-b-2 border-gray-200 focus:border-primary py-2 outline-none transition-colors bg-transparent"
            >
              <option value="">Pilih fakultas</option>
              {Object.keys(FAKULTAS_PRODI).map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <label className="block font-medium mb-2">
              Program Studi <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={formValues.programStudi || ""}
              onChange={(e) => updateField("programStudi", e.target.value)}
              disabled={!formValues.fakultas}
              className="w-full border-b-2 border-gray-200 focus:border-primary py-2 outline-none transition-colors bg-transparent disabled:opacity-50"
            >
              <option value="">Pilih program studi</option>
              {formValues.fakultas &&
                FAKULTAS_PRODI[formValues.fakultas]?.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
            </select>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-6">
          <SectionHeader
            title="Informasi Perusahaan/Instansi"
            desc="Informasi instansi/perusahaan yang Bapak/Ibu pimpin"
          />
          <RadioGroup
            label="Tingkatan Perusahaan/Instansi"
            name="tingkatanPerusahaan"
            options={TINGKATAN}
            required
            value={formValues.tingkatanPerusahaan || ""}
            onChange={updateField}
          />
          <TextField
            label="Bidang Instansi/Perusahaan"
            name="bidangPerusahaan"
            required
            value={formValues.bidangPerusahaan || ""}
            onChange={updateField}
          />
          <RadioGroup
            label="Secara umum, bagaimana tingkat kepuasan Bapak/Ibu terhadap lulusan Universitas Muhammadiyah Sidoarjo?"
            name="kepuasanUmum"
            options={KEPUASAN}
            required
            value={formValues.kepuasanUmum || ""}
            onChange={updateField}
          />
          <TextArea
            label="Harapan Pengguna"
            name="harapanPengguna"
            required
            placeholder="Mohon memberikan masukan bagi kami untuk meningkatkan kualitas lulusan kami kedepannya"
            value={formValues.harapanPengguna || ""}
            onChange={updateField}
          />
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="space-y-6">
          <SectionHeader
            title="Pendapat Pengguna terhadap Kemampuan Alumni"
            desc="Pendapat pengguna terhadap kemampuan alumni Universitas Muhammadiyah Sidoarjo membantu mengevaluasi kompetensi lulusan dalam memenuhi kebutuhan dan standar dunia kerja."
          />

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary-dark text-white">
                  <th className="p-3 text-left rounded-tl-lg">Kompetensi</th>
                  {SKALA.map((s) => (
                    <th key={s} className="p-3 text-center last:rounded-tr-lg">
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KOMPETENSI.map((k, i) => (
                  <tr
                    key={k.name}
                    className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  >
                    <td className="p-3 font-medium">{k.label}</td>
                    {SKALA.map((s) => (
                      <td key={s} className="p-3 text-center">
                        <input
                          type="radio"
                          name={`grid_${k.name}`}
                          value={s}
                          checked={formValues[k.name] === s}
                          onChange={() => updateField(k.name, s)}
                          className="w-5 h-5 accent-primary"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {KOMPETENSI.map((k) => (
              <div key={k.name} className="bg-white rounded-lg p-4 shadow-sm">
                <p className="font-medium mb-3">{k.label}</p>
                <div className="grid grid-cols-2 gap-2">
                  {SKALA.map((s) => (
                    <label
                      key={s}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-colors ${
                        formValues[k.name] === s
                          ? "bg-primary/10 border-primary"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`mobile_${k.name}`}
                        value={s}
                        checked={formValues[k.name] === s}
                        onChange={() => updateField(k.name, s)}
                        className="accent-primary"
                      />
                      <span className="text-sm">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Kembali
          </button>
        ) : (
          <div />
        )}
        {step < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Berikutnya
          </button>
        ) : (
          <button
            type="submit"
            disabled={isPending}
            onClick={(e) => {
              if (!validateStep()) {
                e.preventDefault();
              }
            }}
            className="px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
          >
            {isPending ? "Mengirim..." : "Kirim"}
          </button>
        )}
      </div>
    </form>
  );
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white rounded-lg p-5 border-l-4 border-primary shadow-sm">
      <h2 className="text-xl font-bold text-primary-dark">{title}</h2>
      <p className="text-gray-600 text-sm mt-1">{desc}</p>
    </div>
  );
}

function TextField({
  label,
  name,
  type = "text",
  required,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <label className="block font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full border-b-2 border-gray-200 focus:border-primary py-2 outline-none transition-colors bg-transparent"
        placeholder={`Masukkan ${label.toLowerCase()}`}
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  required,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <label className="block font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        rows={4}
        className="w-full border-b-2 border-gray-200 focus:border-primary py-2 outline-none transition-colors bg-transparent resize-y"
        placeholder={placeholder}
      />
    </div>
  );
}

function RadioGroup({
  label,
  name,
  options,
  required,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  value: string;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <label className="block font-medium mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${
              value === opt
                ? "bg-primary/10 border-primary"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(name, opt)}
              className="w-4 h-4 accent-primary"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
