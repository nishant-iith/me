import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Sidebar from './components/Sidebar';
import CustomCursor from './components/CustomCursor';
import ResumeFAB from './components/ResumeFAB';
import CommandPalette from './components/CommandPalette';

// Eager load: Home (critical path)
import Home from './pages/Home';

// Lazy load: Heavy/secondary pages for code splitting
const About = lazy(() => import('./pages/About'));
const Skills = lazy(() => import('./pages/Skill'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Toolbox = lazy(() => import('./pages/Toolbox'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Books = lazy(() => import('./pages/Books'));
const Snippets = lazy(() => import('./pages/Snippets'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin"></div>
      <p className="text-zinc-500 text-xs font-mono">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="relative min-h-screen text-zinc-100 font-sans selection:bg-zinc-800 selection:text-zinc-200 bg-[#18181b]">

      {/* SIDE PATTERN - LEFT */}
      <div className="bg-[#18181b] h-full w-8 border-zinc-800 border-dashed overflow-hidden fixed left-0 top-0 bottom-0 z-0 hidden border-r md:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: 'repeating-linear-gradient(315deg, rgba(82,82,91,0.3) 0px, rgba(82,82,91,0.3) 1px, transparent 1px, transparent 10px)',
            zIndex: 0
          }}
        ></div>
      </div>

      {/* SIDE PATTERN - RIGHT */}
      <div className="bg-[#18181b] h-full w-8 border-zinc-800 border-dashed overflow-hidden fixed right-0 top-0 bottom-0 z-0 hidden border-l md:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: 'repeating-linear-gradient(315deg, rgba(82,82,91,0.3) 0px, rgba(82,82,91,0.3) 1px, transparent 1px, transparent 10px)',
            zIndex: 0
          }}
        ></div>
      </div>

      {/* GLOBAL EFFECTS */}
      <CustomCursor />
      <ResumeFAB />
      <CommandPalette />
      {/* 1. Aura Overlay (Vignette) */}
      <div className="aura-overlay fixed inset-0 pointer-events-none z-50"></div>

      {/* 2. Scanlines */}
      <div className="scanlines fixed inset-0 pointer-events-none z-40"></div>

      {/* 3. Dither SVG Filter (Hidden but referenced by .dithered class) */}
      <svg className="hidden">
        <filter id="dissolve-filter" colorInterpolationFilters="sRGB" height="600%" width="600%" x="-300%" y="-300%">
          <feTurbulence baseFrequency="0.015" numOctaves="1" result="bigNoise" type="fractalNoise"></feTurbulence>
          <feComponentTransfer in="bigNoise" result="bigNoiseAdjusted">
            <feFuncR intercept="-0.2" slope="0.5" type="linear"></feFuncR>
            <feFuncG intercept="-0.6" slope="3" type="linear"></feFuncG>
          </feComponentTransfer>
          <feTurbulence baseFrequency="1" numOctaves="2" result="fineNoise" type="fractalNoise"></feTurbulence>
          <feMerge result="combinedNoise">
            <feMergeNode in="bigNoiseAdjusted"></feMergeNode>
            <feMergeNode in="fineNoise"></feMergeNode>
          </feMerge>
          <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="0" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
        </filter>
      </svg>

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area - CENTERED */}
      <div className="flex justify-center items-start min-h-screen px-4 lg:px-8 py-8 relative z-10">
        <main className="w-full max-w-2xl">
          {/* Aura Frame */}
          <div className="relative min-h-[85vh] border-x border-dashed border-zinc-800 px-4 sm:px-10 py-12">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/skill" element={<Skills />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/toolbox" element={<Toolbox />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/books" element={<Books />} />
                <Route path="/snippets" element={<Snippets />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>

          {/* Footer Copyright */}
          <div className="w-full text-center py-6 text-[10px] font-mono text-zinc-700">
            © 2026 NISHANT VERMA. Design inspired from Bilal
          </div>
        </main>
      </div>
      <Analytics />
    </div>
  );
}

export default App;
