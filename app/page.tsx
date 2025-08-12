// app/page.tsx (Landing Page Baru)
import Link from 'next/link';
import { ArrowRight, BrainCircuit, Milestone, BookOpen } from 'lucide-react';

// Komponen Ikon untuk bagian Fitur
const FeatureIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
    <Icon className="h-6 w-6" />
  </div>
);

// Komponen Kartu Fitur
const FeatureCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <div className="flex flex-col items-start gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
    <FeatureIcon icon={Icon} />
    <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
    <p className="text-slate-600">{children}</p>
  </div>
);

// Komponen Langkah "How It Works"
const Step = ({ number, title, children }: { number: string, title: string, children: React.ReactNode }) => (
  <div className="flex flex-col gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-600 text-lg font-bold text-blue-600">
      {number}
    </div>
    <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
    <p className="text-slate-600">{children}</p>
  </div>
);


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            BelajarYuk
          </Link>
          <Link
            href="/dashboard"
            className="hidden rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:block"
          >
            Mulai Belajar
          </Link>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 sm:py-32">
          <div className="container mx-auto grid grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:items-center">
            <div className="max-w-xl">
              <span className="mb-4 block text-sm font-semibold uppercase tracking-wider text-blue-600">
                Belajar Terstruktur dengan AI
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                Ubah Topik Apapun Menjadi Jalur Belajar yang Jelas.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Berhenti bingung harus mulai dari mana. BelajarYuk menggunakan AI untuk membuat roadmap dan mindmap interaktif, memandumu dari pemula hingga mahir.
              </p>
              <div className="mt-10">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Buat Roadmap Pertamamu <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
             <div className="flex items-center justify-center">
                {/* Placeholder untuk visualisasi, bisa diganti dengan gambar atau animasi */}
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
                    <div className="h-64 rounded-lg bg-slate-100 flex items-center justify-center">
                        <BrainCircuit className="h-24 w-24 text-blue-300" />
                    </div>
                    <p className="mt-4 text-center font-medium text-slate-700">Visualisasikan jalur belajarmu.</p>
                </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-24 sm:py-32">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Semua yang Kamu Butuhkan untuk Belajar Efektif
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Dari gambaran besar hingga detail terkecil, kami siapkan semuanya.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-none grid-cols-1 gap-8 sm:mt-20 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard icon={Milestone} title="Roadmap Terstruktur">
                Dapatkan urutan belajar langkah demi langkah yang logis, lengkap dengan estimasi waktu untuk setiap tahapan.
              </FeatureCard>
              <FeatureCard icon={BrainCircuit} title="Mindmap Interaktif">
                Pahami hubungan antar konsep dengan visualisasi mindmap yang bercabang dan mudah dijelajahi.
              </FeatureCard>
              <FeatureCard icon={BookOpen} title="Penjelasan Mendalam">
                Setiap sub-topik dalam roadmap bisa kamu jabarkan menjadi penjelasan materi yang komprehensif, seolah memiliki mentor pribadi.
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 sm:py-32">
            <div className="container mx-auto px-6">
                 <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Hanya 3 Langkah Sederhana
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Mulai perjalanan belajarmu dalam hitungan menit.
                    </p>
                </div>
                <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-3">
                    <Step number="1" title="Masukkan Topik">
                        Tuliskan apa saja yang ingin kamu pelajari, dari "Dasar-dasar Javascript" hingga "Teori Relativitas".
                    </Step>
                     <Step number="2" title="Generate Roadmap">
                        Biarkan AI menganalisis dan menyusun kurikulum belajar yang paling optimal untukmu.
                    </Step>
                     <Step number="3" title="Mulai Belajar!">
                        Ikuti roadmap yang ada, jabarkan materi yang sulit, dan lacak progres belajarmu dengan mudah.
                    </Step>
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-white">
            <div className="container mx-auto px-6 py-24 text-center">
                 <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Siap Mengubah Cara Belajarmu?
                </h2>
                <p className="mt-4 text-lg text-slate-600 mx-auto max-w-2xl">
                    Ambil kendali atas proses belajarmu. Dapatkan kejelasan dan arah dengan roadmap yang dibuat khusus untukmu.
                </p>
                 <div className="mt-10">
                    <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                    Gratis, Mulai Sekarang <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100">
        <div className="container mx-auto px-6 py-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} BelajarYuk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
