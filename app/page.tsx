// app/page.tsx (Landing Page Baru)
import Link from 'next/link';
import Image from 'next/image';
import { BotMessageSquare } from 'lucide-react';
import heroimg from '@/public/assets/heroimg.jpg';

// Komponen untuk logo partner
const PartnerLogo = ({ name }: { name: string }) => (
    <div className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
        <BotMessageSquare className="h-5 w-5" />
        <span className="font-semibold">{name}</span>
    </div>
);

// Komponen untuk bagian fitur dengan gambar
const FeatureSection = ({
  title,
  imageUrl,
  children,
  imageSide = 'right',
}: {
  title: string;
  imageUrl: string;
  children: React.ReactNode;
  imageSide?: 'left' | 'right';
}) => {
  // Menentukan urutan kolom untuk tata letak zig-zag di layar besar
  const imageOrderClass = imageSide === 'right' ? 'lg:order-last' : 'lg:order-first';
  
  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
      {/* Kolom Teks */}
      <div className="max-w-md text-left">
        <h3 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h3>
        <p className="mt-4 text-lg text-slate-600 leading-relaxed">{children}</p>
      </div>
      {/* Kolom Gambar */}
      <div className={`flex items-center justify-center ${imageOrderClass}`}>
        <Image
            src={imageUrl}
            alt={title}
            width={500}
            height={500}
            className="rounded-2xl object-cover w-full h-80 shadow-lg"
        />
      </div>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold text-slate-900">
            BelajarYuk
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">Login</Link>
            <Link href="/dashboard" className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 transition-colors">
              Try Now
            </Link>
          </nav>
           <Link href="/dashboard" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors md:hidden">
              Mulai
            </Link>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 sm:py-32 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Smarter learning.
            </h1>
            <h2 className="text-4xl font-bold tracking-tight text-slate-700 sm:text-6xl">
              AI-powered design education.
            </h2>
            <div className="mt-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
              >
                Get Started
              </Link>
            </div>
            {/* Gambar Utama dari Unsplash */}
            <div className="mt-16 mx-auto max-w-5xl h-[450px] rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                    src={heroimg}
                    alt="AI powered learning illustration"
                    width={1200}
                    height={600}
                    className="w-full h-full object-cover"
                    priority
                />
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <PartnerLogo name="Courses" />
                    <PartnerLogo name="Udemy" />
                    <PartnerLogo name="Skillshare" />
                    <PartnerLogo name="FutureLearn" />
                </div>
            </div>
        </section>

        {/* Features Section dengan Tata Letak Zig-Zag */}
        <section id="features" className="py-24 sm:py-32 space-y-24">
          <div className="container mx-auto px-6">
            <FeatureSection 
              title="Personalized paths."
              imageUrl="https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1374&auto=format&fit=crop"
              imageSide="right"
            >
              Every course and lesson helps you meet your design goals, tailored to your style, and skill level — powered by AI.
            </FeatureSection>
          </div>
           <div className="container mx-auto px-6">
            <FeatureSection 
              title="Dynamic updates." 
              imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop"
              imageSide="left"
            >
              Your journey grows with you. Lessons will be personalized based on the latest advances in education.
            </FeatureSection>
          </div>
           <div className="container mx-auto px-6">
            <FeatureSection 
              title="Progress tracking."
              imageUrl="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470&auto=format&fit=crop"
              imageSide="right"
            >
              Every lesson moves you forward. We celebrate achievements and calibrate as you meet goals.
            </FeatureSection>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="cta" className="py-24 sm:py-32 text-center bg-slate-50">
            <div className="container mx-auto px-6">
                 <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Stay informed.
                </h2>
                <h3 className="text-3xl font-bold tracking-tight text-slate-700 sm:text-4xl">
                    Education news.
                </h3>
                 <div className="mt-8">
                    <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                    >
                    Get Started
                    </Link>
                </div>
            </div>
        </section>
      </main>

      {/* Footer yang Diperbarui */}
      <footer className="bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                    <Link href="/" className="text-xl font-bold text-slate-900">
                        BelajarYuk
                    </Link>
                    <p className="mt-4 text-slate-500 max-w-xs">
                        AI-powered learning platform to generate structured roadmaps and mindmaps.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-8 lg:col-span-8 md:grid-cols-4">
                    <div>
                        <h4 className="font-semibold text-slate-900">Product</h4>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li><Link href="#features" className="hover:text-slate-900">Features</Link></li>
                            <li><Link href="#cta" className="hover:text-slate-900">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-slate-900">Updates</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900">Company</h4>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li><Link href="#" className="hover:text-slate-900">About</Link></li>
                            <li><Link href="#" className="hover:text-slate-900">Careers</Link></li>
                            <li><Link href="#" className="hover:text-slate-900">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900">Resources</h4>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li><Link href="#" className="hover:text-slate-900">Blog</Link></li>
                            <li><Link href="#" className="hover:text-slate-900">Help Center</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900">Legal</h4>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li><Link href="#" className="hover:text-slate-900">Privacy</Link></li>
                            <li><Link href="#" className="hover:text-slate-900">Terms</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-16 border-t border-slate-200 pt-8 text-sm text-slate-500">
                 <p>&copy; {new Date().getFullYear()} BelajarYuk. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
