import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCloudOutline } from 'react-icons/io5';
import { FaVideo, FaDatabase, FaServer, FaRocket, FaCode } from 'react-icons/fa';
import { IoIosCodeWorking } from 'react-icons/io';
import { HiLightningBolt } from 'react-icons/hi';
import SCSCloudImage from '../assets/SCSCloud.png';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-200/40 via-transparent to-transparent pointer-events-none dark:from-cyan-400/20" />
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full ring-1 ring-slate-900/10 bg-slate-900/5 px-4 py-2 text-sm text-slate-600 dark:ring-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 mb-6">
                <HiLightningBolt className="text-cyan-500" />
                <span>Production-ready cloud infrastructure</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                Build, Deploy & Scale with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                  SCS Cloud
                </span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                Deploy static sites, transcode videos to HLS, and scale effortlessly. 
                Enterprise-grade infrastructure with developer-friendly tools and transparent pricing.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <button 
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                </button>
                <button 
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg ring-1 ring-slate-900/10 hover:bg-slate-900/5 dark:ring-slate-400/40 dark:hover:bg-slate-600/30 dark:text-slate-100 px-8 py-3 text-base font-medium transition-all duration-200"
                  onClick={() => navigate('/hls-transcoder-docs')}
                >
                  View Documentation
                </button>
              </div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                No credit card required · Deploy in minutes
              </p>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-600 dark:bg-slate-700/60 dark:backdrop-blur overflow-hidden">
                <img src={SCSCloudImage} alt="SCS Cloud Dashboard" className="rounded-2xl w-full" />
              </div>
              {/* Floating element */}
              <div className="hidden md:block absolute -top-4 -right-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-4 shadow-xl">
                <IoCloudOutline className="text-white text-5xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">
            Everything you need to scale
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Powerful cloud services designed for modern applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* HLS Transcoding */}
          <div 
            className="group rounded-2xl border border-slate-200 bg-white p-8 hover:border-cyan-300 hover:shadow-lg transition-all cursor-pointer dark:border-slate-600 dark:bg-slate-700 dark:hover:border-cyan-500/50"
            onClick={() => navigate('/hls-transcoding-service')}
          >
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg group-hover:scale-110 transition-transform">
              <FaVideo className="text-2xl" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-50">HLS Video Transcoding</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Convert videos to adaptive streaming formats with automatic quality optimization and CDN distribution.
            </p>
          </div>

          {/* Static Hosting */}
          <div 
            className="group rounded-2xl border border-slate-200 bg-white p-8 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer dark:border-slate-600 dark:bg-slate-700 dark:hover:border-emerald-500/50"
            onClick={() => navigate('/hosting-service')}
          >
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg group-hover:scale-110 transition-transform">
              <IoIosCodeWorking className="text-2xl" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-50">Static Web Hosting</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Deploy static sites instantly with global CDN, automatic HTTPS, and instant cache invalidation.
            </p>
          </div>

          {/* Object Storage */}
          <div 
            className="rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer dark:border-slate-600 dark:bg-slate-700 dark:hover:border-purple-500"
            onClick={() => navigate('/object-storage')}
          >
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg">
              <FaDatabase className="text-2xl" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-50">Object Storage</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              S3-compatible storage with unlimited scalability, versioning, and powerful bucket management.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 dark:bg-slate-950 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                99.9%
              </div>
              <div className="mt-2 text-sm text-slate-400">Uptime SLA</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                &lt;50ms
              </div>
              <div className="mt-2 text-sm text-slate-400">Global Latency</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                24/7
              </div>
              <div className="mt-2 text-sm text-slate-400">Support Available</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                10+
              </div>
              <div className="mt-2 text-sm text-slate-400">Global Regions</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 p-12 md:p-16 shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
          <div className="relative text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-cyan-50 max-w-2xl mx-auto">
              Join thousands of developers building amazing applications on SCS Cloud.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-white hover:bg-gray-100 text-slate-900 font-semibold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => navigate('/register')}
              >
                Create Free Account
              </button>
              <button 
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-white hover:bg-white/10 text-white font-semibold px-8 py-3 text-base transition-all duration-200"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 dark:border-slate-700">
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-8">
          Trusted by developers and businesses worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
          <FaServer className="text-4xl text-slate-400 dark:text-slate-500" />
          <IoCloudOutline className="text-5xl text-slate-400 dark:text-slate-500" />
          <FaRocket className="text-4xl text-slate-400 dark:text-slate-500" />
          <FaCode className="text-4xl text-slate-400 dark:text-slate-500" />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
