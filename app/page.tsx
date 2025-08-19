// app/page.tsx (Swiss Design Landing Page)
import Link from 'next/link';
import { ArrowRight, Grid3X3, BookOpen, BarChart3, Users } from 'lucide-react';
import { Space_Mono } from 'next/font/google';
import { prisma } from '@/lib/prisma';
import LandingHeader from '@/components/LandingHeader';
import { MacbookScroll } from '@/components/ui/macbook-scroll';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';

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
      <div className="font-mono text-3xl font-bold text-slate-900 tracking-tight dark:text-slate-100">{number}</div>
      <div className="text-sm uppercase tracking-wide text-slate-600 mt-1 dark:text-slate-400">{label}</div>
    </div>
  </div>
);

// Swiss-style feature component with minimal design
const FeatureBlock = ({ icon: Icon, title, description, number }: { icon: React.ElementType; title: string; description: string; number: string; }) => (
  <div className="group">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center bg-slate-900 text-white">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="flex-1">
        <div className={`text-xs uppercase tracking-wider text-slate-500 mb-2 ${spaceMono.variable} font-mono dark:text-slate-400`}>
          {number}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 dark:text-slate-100">{title}</h3>
        <p className="text-slate-600 leading-relaxed dark:text-slate-300">{description}</p>
      </div>
    </div>
  </div>
);

export default async function LandingPage() {
  const session = await getServerSession(authOptions as any);
  const s: any = session || {};
  const latest = await (prisma as any).roadmap.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 12,
    select: { id: true, slug: true, title: true, user: { select: { name: true } }, content: true },
  });

  const hasLatest = Array.isArray(latest) && latest.length > 0;
  const placeholders = [
    { id: 'p1', slug: 'sample-web-dev', title: 'Beginner Web Development Roadmap', user: { name: 'Community' } },
    { id: 'p2', slug: 'sample-data-science', title: 'Data Science Foundations', user: { name: 'Community' } },
    { id: 'p3', slug: 'sample-mobile', title: 'Mobile App Development Basics', user: { name: 'Community' } },
    { id: 'p4', slug: 'sample-ui-ux', title: 'UI/UX Design Starter Path', user: { name: 'Community' } },
    { id: 'p5', slug: 'sample-devops', title: 'DevOps Essentials', user: { name: 'Community' } },
    { id: 'p6', slug: 'sample-ml', title: 'Machine Learning 101', user: { name: 'Community' } },
  ] as any[];
  const marqueeItems = hasLatest ? latest : placeholders;

  return (
    <div className={`min-h-screen bg-white dark:bg-slate-950 ${spaceMono.variable}`}>
      <LandingHeader />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white dark:bg-[#0B0B0F]">
          <MacbookScroll
            title={
              <span className="text-slate-900 dark:text-white">
                <span className="block text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">Learn smarter,</span>
                <span className="block text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">not harder.</span>
                <span className="block mt-3 text-sm sm:text-base font-normal tracking-wide text-slate-500 dark:text-slate-400">Belajar sesuai kebutuhanmu</span>
              </span>
            }
            badge={<HeroBadge className="h-10 w-10 -rotate-12 transform" />}
            src="/assets/heroimg.jpg"
            showGradient={false}
            cta={
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">
                <a
                  href={s?.user?.id ? "/dashboard/new" : "/login?callbackUrl=%2Fdashboard%2Fnew"}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  Start Learning
                </a>
                <a
                  href="#features"
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Learn More
                </a>
              </div>
            }
          />
        </section>

        {/* Marquee */}
        <section aria-label="Published Roadmaps" className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-0 sm:px-6">
            <div className="group pause-on-hover relative overflow-hidden py-4">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent dark:from-slate-900" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent dark:from-slate-900" />
              <div className="flex w-[200%] animate-scroll-x will-change-transform">
                <ul className="flex items-center gap-3 pr-3">
                  {marqueeItems.map((r: any) => (
                    <li key={`a-${r.id}`} className="shrink-0">
                      <Link
                        href={hasLatest ? `/r/${r.slug}` : `/dashboard/browse`}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                      >
                        <span className="font-semibold truncate max-w-[16rem]">{r.title}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">• by {r.user?.name ?? 'Community'}</span>
                        {!hasLatest && (
                          <span className="ml-1 rounded bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-700 dark:text-slate-200">Sample</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="flex items-center gap-3 pr-3" aria-hidden="true">
                  {marqueeItems.map((r: any) => (
                    <li key={`b-${r.id}`} className="shrink-0">
                      <Link
                        href={hasLatest ? `/r/${r.slug}` : `/dashboard/browse`}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                      >
                        <span className="font-semibold truncate max-w-[16rem]">{r.title}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">• by {r.user?.name ?? 'Community'}</span>
                        {!hasLatest && (
                          <span className="ml-1 rounded bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-700 dark:text-slate-200">Sample</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section id="metrics" className="py-16 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <MetricCard number="10K+" label="Active Learners" delay={0} />
              <MetricCard number="500+" label="Learning Paths" delay={100} />
              <MetricCard number="95%" label="Success Rate" delay={200} />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 sm:py-32 scroll-mt-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <p className={`text-xs uppercase tracking-wider text-slate-500 mb-3 font-mono dark:text-slate-400`}>Core Features</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight max-w-4xl dark:text-slate-100">
                Ship faster from “I want to learn X” to a clear, achievable plan
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl">
                We combine AI planning, visual thinking, and progress tracking so you can focus on learning—not logistics.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
              <FeatureBlock
                icon={Grid3X3}
                number="01"
                title="AI-Powered Roadmaps"
                description="Generate a step-by-step plan tailored to your goals, starting point, and available time. Edit it anytime with natural language."
              />
              <FeatureBlock
                icon={BookOpen}
                number="02"
                title="Interactive Mindmaps"
                description="Turn complex topics into interactive maps. Collapse sections, add notes, and attach resources to keep context in one place."
              />
              <FeatureBlock
                icon={BarChart3}
                number="03"
                title="Progress & Reflection"
                description="Mark milestones, log reflections, and get nudges when you’re stuck. Weekly summaries help you see progress over time."
              />
              <FeatureBlock
                icon={Users}
                number="04"
                title="Sharing & Review"
                description="Publish your roadmap, invite feedback, or fork others’ plans. Learn together with lightweight collaboration."
              />
            </div>

            {/* Best practice callouts */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Clarity by default</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Structured milestones, short descriptions, and scoped tasks keep you moving without overwhelm.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Evidence-based pacing</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">We encourage spaced practice and reflection so skills stick, not just pass a checklist.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Own your data</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Export roadmaps and history anytime. Your learning, your control.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-32 sm:py-40 border-t border-slate-200 dark:border-slate-800 scroll-mt-28">
          <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <p className={`text-xs uppercase tracking-wider text-slate-500 mb-3 font-mono dark:text-slate-400`}>About</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">Why we built BelajarYuk</h2>
              <p className="mt-5 text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Most learners quit not because topics are impossible, but because the path is unclear. BelajarYuk turns goals into
                concrete, visual plans—then keeps you accountable with gentle progress cues and easy editing.
              </p>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                We design for clarity, momentum, and community. Whether you’re switching careers or sharpening one skill, our tools
                keep you focused on what matters next.
              </p>
            </div>
            <div>
              <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Principles we follow</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
                  <li>Start with a clear end-state; work backward to milestones.</li>
                  <li>Reduce cognitive load with visual structure and simple controls.</li>
                  <li>Encourage reflection and iteration—plans should evolve.</li>
                  <li>Respect privacy and portability; you own your learning data.</li>
                </ul>
                <div className="mt-6 rounded-lg bg-slate-50 p-4 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Tip: Review your roadmap weekly. Adjust scope, add notes from what you learned, and celebrate progress.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
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
                <div className="relative p-8 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  <div className={`text-xs uppercase tracking-wider text-slate-500 mb-4 font-mono dark:text-slate-400`}>
                    Sample Output
                  </div>
                  <div className="space-y-4">
                    <div className="border-l-2 border-slate-900 pl-4">
                      <div className="font-bold">Week 1-2: Fundamentals</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Basic concepts and principles</div>
                    </div>
                    <div className="border-l-2 border-slate-300 pl-4">
                      <div className="font-bold">Week 3-4: Practical Application</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Hands-on projects and exercises</div>
                    </div>
                    <div className="border-l-2 border-slate-300 pl-4">
                      <div className="font-bold">Week 5-6: Advanced Topics</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Deep dive into complex subjects</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <div className={`text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6 font-mono`}>
                Ready to Start?
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-8">
                Begin your learning journey today
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-12">
                Join thousands of learners who have transformed their skills with our AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={s?.user?.id ? "/dashboard/new" : "/login?callbackUrl=%2Fdashboard%2Fnew"}
                  className="inline-flex items-center justify-center gap-3 bg-slate-900 dark:bg-blue-600 px-8 py-4 text-white font-medium hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors"
                >
                  Start Learning Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <Link href="/" className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                BelajarYuk
              </Link>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm">
                AI-powered learning platform that creates personalized roadmaps and interactive mindmaps for efficient skill development.
              </p>
              <div className={`mt-6 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono`}>
                Made with precision
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wide text-sm">Product</h4>
                  <ul className="space-y-3 text-sm">
                    <li><Link href="#features" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Features</Link></li>
                    <li><Link href="#metrics" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Metrics</Link></li>
                    <li><Link href="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Dashboard</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wide text-sm">Company</h4>
                  <ul className="space-y-3 text-sm">
                    <li><Link href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">About</Link></li>
                    <li><Link href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Blog</Link></li>
                    <li><Link href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Careers</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wide text-sm">Support</h4>
                  <ul className="space-y-3 text-sm">
                    <li><Link href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Help Center</Link></li>
                    <li><Link href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link></li>
                    <li><Link href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Community</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wide text-sm">Legal</h4>
                  <ul className="space-y-3 text-sm">
                    <li><Link href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</Link></li>
                    <li><Link href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Terms</Link></li>
                    <li><Link href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Security</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className={`text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wider`}>
                © {new Date().getFullYear()} BelajarYuk. All rights reserved.
              </div>
              <div className={`text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wider`}>
                Swiss Design Principles Applied
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Local badge icon used in hero (renamed to avoid name collisions)
const HeroBadge = ({ className }: { className?: string }) => {
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
