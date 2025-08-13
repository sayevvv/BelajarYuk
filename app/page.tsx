// app/page.tsx (Swiss Design Landing Page)
import Link from 'next/link';
import { ArrowRight, Grid3X3, BookOpen, BarChart3, Users, Search } from 'lucide-react';
import { Space_Mono } from 'next/font/google';
import { prisma } from '@/lib/prisma';
import LandingHeader from '@/components/LandingHeader';
import { MacbookScroll } from '@/components/ui/macbook-scroll';

// Swiss design monospace font for accents
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

// Metric display component following Swiss design principles
const MetricCard = ({ number, label, delay = 0 }: { number: string; label: string; delay?: number }) => (
  <div className={`${spaceMono.variable}`} style={{ animationDelay: `${delay}ms` }}>
    <div className="border-l-2 border-slate-900 pl-6">
      <div className="font-mono text-3xl font-bold text-slate-900 tracking-tight">{number}</div>
      <div className="text-sm uppercase tracking-wide text-slate-600 mt-1">{label}</div>
    </div>
  </div>
);

// Swiss-style feature component with minimal design
const FeatureBlock = ({ 
  icon: Icon, 
  title, 
  description, 
  number 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  number: string;
}) => (
  <div className="group">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center bg-slate-900 text-white">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="flex-1">
        <div className={`text-xs uppercase tracking-wider text-slate-500 mb-2 ${spaceMono.variable} font-mono`}>
          {number}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

export default async function LandingPage() {
  // Fetch a small set of latest published roadmaps to showcase on landing
  const latest = await (prisma as any).roadmap.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 6,
    select: { id: true, slug: true, title: true, user: { select: { name: true } }, content: true },
  });
  return (
    <div className={`min-h-screen bg-white ${spaceMono.variable}`}>
  <LandingHeader />

      <main className="pt-16">
        {/* Hero Section - Aceternity Macbook Scroll */}
        <section className="relative overflow-hidden bg-white dark:bg-[#0B0B0F]">
          <MacbookScroll
            title={
              <span>
                <span className="block">Learn smarter,</span>
                <span className="block">not harder.</span>
                <span className="block mt-2 text-xs font-normal tracking-wide text-slate-500 dark:text-slate-400">Belajar sesuai kebutuhanmu</span>
              </span>
            }
            badge={<Badge className="h-10 w-10 -rotate-12 transform" />}
            src="/assets/heroimg.jpg"
            showGradient={false}
            cta={
              <div className="flex items-center gap-3 mb-10">
                <a
                  href="/dashboard"
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-slate-800"
                >
                  Get Started
                </a>
                <a
                  href="#features"
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Learn More
                </a>
              </div>
            }
          />
        </section>

  {/* Peerlist-like Badge used in hero */}
  {/* Keep local to this page to avoid global namespace pollution */}

        {/* Metrics Section - Swiss Grid */}
        <section id="metrics" className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <MetricCard number="10K+" label="Active Learners" delay={0} />
              <MetricCard number="500+" label="Learning Paths" delay={100} />
              <MetricCard number="95%" label="Success Rate" delay={200} />
            </div>
          </div>
        </section>

        {/* Features Section - Swiss Functional Design */}
  <section id="features" className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-6">
            {/* Section Header */}
            <div className="mb-20">
              <div className={`text-xs uppercase tracking-wider text-slate-500 mb-4 font-mono`}>
                Core Features
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight max-w-3xl">
                Everything you need to accelerate your learning journey
              </h2>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-20">
              <FeatureBlock
                icon={Grid3X3}
                number="01"
                title="AI-Powered Roadmaps"
                description="Generate comprehensive learning paths tailored to your goals, skill level, and preferred learning style using advanced AI algorithms."
              />
              <FeatureBlock
                icon={BookOpen}
                number="02"
                title="Interactive Mindmaps"
                description="Visualize complex topics with dynamic, interactive mindmaps that help you understand connections and retain information better."
              />
              <FeatureBlock
                icon={BarChart3}
                number="03"
                title="Progress Tracking"
                description="Monitor your learning progress with detailed analytics and insights that help you stay motivated and on track."
              />
              <FeatureBlock
                icon={Users}
                number="04"
                title="Collaborative Learning"
                description="Share roadmaps and mindmaps with peers, get feedback, and learn together in a supportive community environment."
              />
            </div>
          </div>
        </section>

        {/* Process Section - Swiss Information Design */}
        <section className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className={`text-xs uppercase tracking-wider text-slate-400 mb-6 font-mono`}>
                  How It Works
                </div>
                <h2 className="text-4xl font-bold mb-8 leading-tight">
                  Three steps to smarter learning
                </h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-8 h-8 bg-white text-slate-900 flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Define Your Goal</h3>
                      <p className="text-slate-300 leading-relaxed">
                        Tell our AI what you want to learn and your current skill level.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-8 h-8 bg-white text-slate-900 flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Get Your Roadmap</h3>
                      <p className="text-slate-300 leading-relaxed">
                        Receive a personalized learning path with structured milestones.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-8 h-8 bg-white text-slate-900 flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Learn & Track</h3>
                      <p className="text-slate-300 leading-relaxed">
                        Follow your roadmap and track progress with interactive tools.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500"></div>
                <div className="relative p-8 bg-white text-slate-900">
                  <div className={`text-xs uppercase tracking-wider text-slate-500 mb-4 font-mono`}>
                    Sample Output
                  </div>
                  <div className="space-y-4">
                    <div className="border-l-2 border-slate-900 pl-4">
                      <div className="font-bold">Week 1-2: Fundamentals</div>
                      <div className="text-sm text-slate-600">Basic concepts and principles</div>
                    </div>
                    <div className="border-l-2 border-slate-300 pl-4">
                      <div className="font-bold">Week 3-4: Practical Application</div>
                      <div className="text-sm text-slate-600">Hands-on projects and exercises</div>
                    </div>
                    <div className="border-l-2 border-slate-300 pl-4">
                      <div className="font-bold">Week 5-6: Advanced Topics</div>
                      <div className="text-sm text-slate-600">Deep dive into complex subjects</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Swiss Minimal Approach */}
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <div className={`text-xs uppercase tracking-wider text-slate-500 mb-6 font-mono`}>
                Ready to Start?
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-8">
                Begin your learning journey today
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed mb-12">
                Join thousands of learners who have transformed their skills with our AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-3 bg-slate-900 px-8 py-4 text-white font-medium hover:bg-slate-800 transition-colors"
                >
                  Start Learning Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Swiss Grid System */}
      <footer className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <Link href="/" className="text-xl font-bold text-slate-900 tracking-tight">
                BelajarYuk
              </Link>
              <p className="mt-4 text-slate-600 leading-relaxed max-w-sm">
                AI-powered learning platform that creates personalized roadmaps and interactive mindmaps for efficient skill development.
              </p>
              <div className={`mt-6 text-xs uppercase tracking-wider text-slate-500 font-mono`}>
                Made with precision
              </div>
            </div>
            
            {/* Links Grid */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wide text-sm">Product</h4>
                  <ul className="space-y-3 text-sm">
                    <li><Link href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</Link></li>
                    <li><Link href="#metrics" className="text-slate-600 hover:text-slate-900 transition-colors">Metrics</Link></li>
                    <li><Link href="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">Dashboard</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wide text-sm">Company</h4>
                  <ul className="space-y-3 text-sm">
                    <li><Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">About</Link></li>
                    <li><Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Blog</Link></li>
                    <li><Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Careers</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wide text-sm">Support</h4>
                  <ul className="space-y-3 text-sm">
                    <li><Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Help Center</Link></li>
                    <li><Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</Link></li>
                    <li><Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Community</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wide text-sm">Legal</h4>
                  <ul className="space-y-3 text-sm">
                    <li><Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Privacy</Link></li>
                    <li><Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Terms</Link></li>
                    <li><Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Security</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className={`text-xs text-slate-500 font-mono tracking-wider`}>
                © {new Date().getFullYear()} BelajarYuk. All rights reserved.
              </div>
              <div className={`text-xs text-slate-500 font-mono tracking-wider`}>
                Swiss Design Principles Applied
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Local Badge icon used in hero
const Badge = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z" fill="#00AA45"></path>
      <path fillRule="evenodd" clipRule="evenodd" d="M28 54C42.3594 54 54 42.3594 54 28C54 13.6406 42.3594 2 28 2C13.6406 2 2 13.6406 2 28C2 42.3594 13.6406 54 28 54ZM28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#219653"></path>
      <path fillRule="evenodd" clipRule="evenodd" d="M27.0769 12H15V46H24.3846V38.8889H27.0769C34.7305 38.8889 41 32.9048 41 25.4444C41 17.984 34.7305 12 27.0769 12ZM24.3846 29.7778V21.1111H27.0769C29.6194 21.1111 31.6154 23.0864 31.6154 25.4444C31.6154 27.8024 29.6194 29.7778 27.0769 29.7778H24.3846Z" fill="#24292E"></path>
      <path fillRule="evenodd" clipRule="evenodd" d="M18 11H29.0769C36.2141 11 42 16.5716 42 23.4444C42 30.3173 36.2141 35.8889 29.0769 35.8889H25.3846V43H18V11ZM25.3846 28.7778H29.0769C32.1357 28.7778 34.6154 26.39 34.6154 23.4444C34.6154 20.4989 32.1357 18.1111 29.0769 18.1111H25.3846V28.7778Z" fill="white"></path>
      <path fillRule="evenodd" clipRule="evenodd" d="M17 10H29.0769C36.7305 10 43 15.984 43 23.4444C43 30.9048 36.7305 36.8889 29.0769 36.8889H26.3846V44H17V10ZM19 12V42H24.3846V34.8889H29.0769C35.6978 34.8889 41 29.7298 41 23.4444C41 17.1591 35.6978 12 29.0769 12H19ZM24.3846 17.1111H29.0769C32.6521 17.1111 35.6154 19.9114 35.6154 23.4444C35.6154 26.9775 32.6521 29.7778 29.0769 29.7778H24.3846V17.1111ZM26.3846 19.1111V27.7778H29.0769C31.6194 27.7778 33.6154 25.8024 33.6154 23.4444C33.6154 21.0864 31.6194 19.1111 29.0769 19.1111H26.3846Z" fill="#24292E"></path>
    </svg>
  );
};
