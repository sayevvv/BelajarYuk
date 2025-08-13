// app/page.tsx (Swiss Design Landing Page)
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Grid3X3, BookOpen, BarChart3, Users } from 'lucide-react';
import heroimg from '@/public/assets/heroimg.jpg';
import { Space_Mono } from 'next/font/google';

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

export default function LandingPage() {
  return (
    <div className={`min-h-screen bg-white ${spaceMono.variable}`}>
      {/* Swiss-style Header with minimal design */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between px-6">
            <Link href="/" className="text-xl font-bold text-slate-900 tracking-tight">
              BelajarYuk
            </Link>
            <nav className="hidden items-center gap-8 md:flex">
              <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Features
              </Link>
              <Link href="#metrics" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                About
              </Link>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Login
              </Link>
              <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
              >
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors md:hidden"
            >
              Start
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section - Swiss Typography Focus */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Text Content - 7 columns */}
              <div className="lg:col-span-7">
                <div className={`text-xs uppercase tracking-wider text-slate-500 mb-6 font-mono`}>
                  AI-Powered Learning Platform
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-none tracking-tight mb-8">
                  Learn<br />
                  <span className="text-slate-600">Smarter</span><br />
                  Not Harder
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-lg">
                  Generate personalized learning roadmaps and interactive mindmaps powered by artificial intelligence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-3 bg-slate-900 px-8 py-4 text-white font-medium hover:bg-slate-800 transition-colors"
                  >
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="#features"
                    className="inline-flex items-center justify-center px-8 py-4 border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              
              {/* Image Content - 5 columns */}
              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 transform rotate-3"></div>
                  <Image 
                    src={heroimg}
                    alt="AI-powered learning visualization"
                    width={600}
                    height={400}
                    className="relative w-full h-96 object-cover transform -rotate-3"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

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
