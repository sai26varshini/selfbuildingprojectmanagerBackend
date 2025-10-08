"use client";

import Link from "next/link";
import HeroSection from "../components/HeroSection";
import GlassCard from "../components/GlassCard";
import { FaRobot, FaRocket, FaBrain, FaMagic, FaGithub, FaYoutube, FaFilePdf, FaBook, FaProjectDiagram } from "react-icons/fa";
import { PiPlanetFill } from "react-icons/pi";

export default function Home() {
  const YEAR = new Date().getFullYear();
  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-slate-100 bg-[#05060a] selection:bg-fuchsia-600 selection:text-white flex flex-col items-center justify-center">
      {/* Animated gradient backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(120,0,255,0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(0,180,255,0.25),transparent_65%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(255,0,150,0.18),transparent_70%)]" />
        <div className="absolute inset-0 opacity-30 mix-blend-screen bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.05)_0_2px,transparent_2px_6px)]" />
      </div>

      {/* AI Toys & Animations */}
      {/* Rocket flying across */}
      <FaRocket className="absolute left-0 top-1/2 text-fuchsia-400 opacity-70 text-7xl animate-rocket pointer-events-none" />
      {/* Planets revolving */}
      <div className="absolute right-20 top-32 pointer-events-none">
        <PiPlanetFill className="text-indigo-400 opacity-60 text-6xl animate-planet" />
        <PiPlanetFill className="text-cyan-400 opacity-40 text-4xl absolute left-12 top-8 animate-planet2" />
      </div>
      {/* AI robot walking */}
      <FaRobot className="absolute bottom-16 left-1/4 text-violet-400 opacity-70 text-6xl animate-aiwalk pointer-events-none" />
      {/* Brain spinning */}
      <FaBrain className="absolute right-10 bottom-24 text-pink-400 opacity-60 text-6xl animate-spin-slow pointer-events-none" />
      {/* Magic AI power */}
      <FaMagic className="absolute left-10 top-24 text-cyan-400 opacity-60 text-6xl animate-magic pointer-events-none" />

      {/* Big animated search bar in center */}
      {/* <div className="relative z-20 flex flex-col items-center justify-center w-full mt-10 mb-16">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="relative w-full max-w-2xl mx-auto">
           
            Animated sparkles
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 pointer-events-none">
              <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-fuchsia-400 opacity-30 blur-2xl animate-sparkle" />
              <div className="absolute right-0 bottom-0 w-8 h-8 rounded-full bg-indigo-400 opacity-30 blur-2xl animate-sparkle2" />
              <div className="absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-cyan-400 opacity-30 blur-2xl animate-sparkle3" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Hero section */}
      <div className="relative z-10 w-full">
        <HeroSection />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-24">
        <section className="grid gap-8 md:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10">
          <Card
            title={
              <span className="flex items-center gap-2">
                <span className="inline-block animate-rocket">
                  <FaProjectDiagram className="text-fuchsia-400 w-6 h-6" />
                </span>
                Create Project Structure
              </span>
            }
            accent="from-fuchsia-500 to-indigo-500"
            href="/project"
            desc="Generate a full stack project blueprint tailored to your domain using multi-agent orchestration."
          />
          <Card
            title={
              <span className="flex items-center gap-2">
                <span className="inline-block animate-planet">
                  <FaGithub className="text-indigo-400 w-6 h-6" />
                </span>
                GitHub Repo Suggestions
              </span>
            }
            accent="from-indigo-500 to-cyan-500"
            href="/github"
            desc="High-signal repositories ranked by relevance and learning value."
          />
             
          <Card
            title={
              <span className="flex items-center gap-2">
                <span className="inline-block animate-aiwalk">
                  <FaYoutube className="text-cyan-400 w-6 h-6" />
                </span>
                YouTube Video Suggestions
              </span>
            }
            accent="from-cyan-500 to-purple-500"
            href="/youtube"
            desc="Curated video intelligence: distilled, deduped, and domain-aligned."
          />
          <Card
            title={
              <span className="flex items-center gap-2">
                <span className="inline-block animate-spin-slow">
                  <FaFilePdf className="text-purple-400 w-6 h-6" />
                </span>
                Research PDF Generator
              </span>
            }
            accent="from-purple-500 to-pink-500"
            href="/research"
            desc="Auto-draft structured technical papers with citation scaffolding."
          />
          <Card
            title={
              <span className="flex items-center gap-2">
                <span className="inline-block animate-magic">
                  <FaBook className="text-pink-400 w-6 h-6" />
                </span>
                Related Research Papers
              </span>
            }
            accent="from-pink-500 to-fuchsia-500"
            href="/papers"
            desc="Discover foundational and emerging works for deeper mastery."
          />
          <Card
            title={
              <span className="flex items-center gap-2">
                <span className="inline-block animate-spin-slow">
                  {/* ChatGPT */}
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#10A37F"/><text x="16" y="21" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">GPT</text></svg>
                </span>
                <span className="inline-block animate-bounce">
                  {/* Gemini */}
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#4285F4"/><text x="16" y="21" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">G</text></svg>
                </span>
                <span className="inline-block animate-float-slow">
                  {/* Copilot */}
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#8B5CF6"/><text x="16" y="21" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">C</text></svg>
                </span>
                <span className="inline-block animate-magic">
                  {/* Claude */}
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#FFD600"/><text x="16" y="21" textAnchor="middle" fontSize="13" fill="#333" fontWeight="bold">A</text></svg>
                </span>
                AI Utilities & Tools
              </span>
            }
            accent="from-fuchsia-500 to-cyan-500"
            href="/tools"
            desc="ChatGPT, Gemini, Copilot, Claude and more. Explore top AI tools with direct links and vibrant animations."
          />
        </section>
      </main>

      <footer className="relative z-10 text-center py-10 text-xs md:text-sm text-slate-500">
        <div className="mb-2 tracking-wide">
          &copy; {YEAR} Generative AI Agent Assistant
        </div>
        <div className="text-slate-600">
          Built with FastAPI + Next.js + Multi‑Agent Code Generation
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes rocket {
          0% { left: -80px; top: 60%; transform: rotate(-20deg) scale(1); }
          50% { left: 90vw; top: 40%; transform: rotate(10deg) scale(1.2); }
          100% { left: -80px; top: 60%; transform: rotate(-20deg) scale(1); }
        }
        .animate-rocket {
          animation: rocket 12s linear infinite;
        }
        @keyframes planet {
          0% { transform: rotate(0deg) translateX(0); }
          100% { transform: rotate(360deg) translateX(12px); }
        }
        .animate-planet {
          animation: planet 8s linear infinite;
        }
        @keyframes planet2 {
          0% { transform: rotate(0deg) translateY(0); }
          100% { transform: rotate(-360deg) translateY(-8px); }
        }
        .animate-planet2 {
          animation: planet2 6s linear infinite;
        }
        @keyframes aiwalk {
          0% { left: 10vw; }
          50% { left: 70vw; }
          100% { left: 10vw; }
        }
        .animate-aiwalk {
          animation: aiwalk 14s ease-in-out infinite;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes magic {
          0%,100% { transform: scale(1) rotate(-10deg);}
          50% { transform: scale(1.2) rotate(10deg);}
        }
        .animate-magic {
          animation: magic 3.5s ease-in-out infinite;
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        .animate-sparkle {
          animation: sparkle 2.5s infinite;
        }
        .animate-sparkle2 {
          animation: sparkle 3.2s infinite;
        }
        .animate-sparkle3 {
          animation: sparkle 2.8s infinite;
        }
      `}</style>
    </div>
  );
}

function Card({ title, desc, href, accent }) {
  return (
    <div className="group relative rounded-2xl p-[1px] transition-transform duration-300 hover:-translate-y-1">
      {/* Border gradient */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accent} opacity-60 blur-sm group-hover:opacity-90 group-hover:blur brightness-125 transition`} />
      <div className="relative h-full flex flex-col rounded-2xl bg-[#0d111a]/80 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden">
        {/* Subtle top bar */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/40 to-transparent" />
        <div className="p-5 flex flex-col grow">
          <h3 className="text-base font-semibold mb-3 bg-gradient-to-r from-fuchsia-300 via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-xs text-slate-300/90 leading-relaxed grow">
            {desc}
          </p>
          <Link
            href={href}
            className="mt-5 inline-flex items-center w-max gap-1.5 text-[11px] font-semibold tracking-wide uppercase rounded-md px-3 py-2 bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-600 text-white shadow hover:shadow-fuchsia-500/30 hover:brightness-110 transition-all"
          >
            Open
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </Link>
        </div>
        {/* Glow on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
      </div>
    </div>
  );
}

