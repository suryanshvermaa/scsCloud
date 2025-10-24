import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const sections = [
  { label: 'Overview', to: '/home' },
  { label: 'HLS Transcoder', to: '/hls-transcoder-docs' },
  { label: 'Static Web Hosting', to: '/hosting-service-docs' },
];

const DocsLayout: React.FC<{ title: string; children: React.ReactNode }>=({ title, children })=>{
  const location = useLocation();
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="h-max sticky top-[72px] rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Documentation</h2>
          <nav className="space-y-1">
            {sections.map(s => {
              const active = location.pathname === s.to;
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  className={`block rounded-md px-3 py-2 text-sm transition ${active
                    ? 'bg-cyan-500/10 text-cyan-700 ring-1 ring-cyan-500/20 dark:text-cyan-300'
                    : 'text-slate-700 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/5'}`}
                >
                  {s.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <section className="min-w-0">
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Reference docs and guides for building on SCS Cloud.</p>
          </header>
          <article className="prose prose-slate dark:prose-invert max-w-none">
            {children}
          </article>
        </section>
      </div>
    </div>
  );
}

export default DocsLayout;
