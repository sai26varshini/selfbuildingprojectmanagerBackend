import React from 'react';
import { useRouter } from 'next/navigation';
import { FaRobot, FaBrain, FaRocket, FaGithub, FaYoutube, FaProjectDiagram, FaMagic, FaStar, FaFolderOpen } from 'react-icons/fa';
import { PiPlanetFill } from "react-icons/pi";

export default function HeroSection() {
  const router = useRouter();

  function handleGenerate(e) {
    e.preventDefault();
    router.push("/project");
  }

  return (
    <section className="relative flex flex-col items-center justify-center h-[70vh] bg-gradient-to-br from-[#0a0b13] via-[#1a1333] to-[#2a0a2a] text-white overflow-hidden">
      {/* Top right project list icon */}
      <button
        onClick={() => router.push("/projectlist")}
        className="absolute top-6 right-8 z-20 bg-[#18182a]/80 hover:bg-violet-700 text-fuchsia-300 rounded-full p-3 shadow-lg transition-all duration-200 flex items-center justify-center"
        title="View Project List"
        style={{ boxShadow: "0 2px 12px 0 rgba(120,0,255,0.18)" }}
      >
        <FaFolderOpen className="text-3xl" />
      </button>
  {/* Animated floating AI/agent icons and planets */}
      <FaRobot className="absolute left-10 top-10 text-fuchsia-400 opacity-40 text-7xl animate-bounce-slow pointer-events-none" />
      <FaBrain className="absolute right-16 top-20 text-indigo-400 opacity-40 text-6xl animate-spin-slow pointer-events-none" />
      <FaRocket className="absolute left-0 top-1/2 text-pink-400 opacity-40 text-8xl animate-rocket pointer-events-none" />
      <FaMagic className="absolute right-10 bottom-24 text-cyan-400 opacity-40 text-6xl animate-magic pointer-events-none" />
      <PiPlanetFill className="absolute right-32 top-32 text-indigo-400 opacity-60 text-6xl animate-planet pointer-events-none" />
      <PiPlanetFill className="absolute left-32 bottom-24 text-fuchsia-400 opacity-40 text-5xl animate-planet2 pointer-events-none" />
      {/* Animated stars */}
      <FaStar className="absolute left-1/2 top-8 text-yellow-300 opacity-60 text-2xl animate-star pointer-events-none" />
      <FaStar className="absolute right-1/3 top-16 text-fuchsia-300 opacity-50 text-xl animate-star2 pointer-events-none" />
      <FaStar className="absolute left-1/4 bottom-10 text-indigo-300 opacity-50 text-xl animate-star3 pointer-events-none" />

      {/* Animated prism-like gradient blob */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-pink-400 via-indigo-400 to-purple-400 opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="absolute inset-0 opacity-30 animate-pulse bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2)_0%,transparent_70%)]"></div>

      {/* Main Heading with animated icons */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl animate-fade-in flex items-center gap-4 z-10 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-violet-400 to-indigo-400">
        <FaRobot className="text-fuchsia-300 animate-bounce" />
        Generative AI Agent Assistant
        <FaBrain className="text-indigo-300 animate-spin-slow" />
      </h1>
      <p className="text-xl font-light mb-8 max-w-xl text-center animate-fade-in delay-200 z-10 text-slate-200">
        <span className="inline-flex items-center gap-2">
          <FaMagic className="text-cyan-300 animate-magic" />
          Build, research, and discover with powerful AI agents.
        </span>
        <br />
        <span className="inline-flex items-center gap-2">
          <FaRocket className="text-pink-300 animate-rocket" />
          Experience the future of project management and research.
        </span>
      </p>
      {/* Animated search bar */}
      <div className="relative w-full max-w-xl mx-auto mb-8 z-10">
        <form
          className="flex items-center justify-center gap-4 bg-gradient-to-r from-[#18182a] via-[#2a0a2a] to-[#18182a] rounded-2xl shadow-2xl px-8 py-6 border border-violet-500"
          onSubmit={handleGenerate}
        >
          <FaMagic className="text-fuchsia-400 text-3xl mr-2 animate-pulse" />
          <input
            type="text"
            placeholder="Ask anything, generate code, search AI tools..."
            className="flex-1 px-6 py-4 rounded-xl border-none bg-transparent text-slate-100 placeholder-violet-300 font-semibold text-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
          />
          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 text-xl"
          >
            Generate
          </button>
        </form>
        {/* Animated sparkles */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 pointer-events-none">
          <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-fuchsia-400 opacity-30 blur-2xl animate-sparkle" />
          <div className="absolute right-0 bottom-0 w-8 h-8 rounded-full bg-indigo-400 opacity-30 blur-2xl animate-sparkle2" />
          <div className="absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-cyan-400 opacity-30 blur-2xl animate-sparkle3" />
        </div>
      </div>
      {/* Buttons */}
      <div className="flex gap-4 z-10">
        <a href="#project" className="px-6 py-3 rounded-lg bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition flex items-center gap-2 animate-fade-in delay-300">
          <FaProjectDiagram className="text-indigo-200" /> Create Project
        </a>
        <a href="#github" className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition flex items-center gap-2 animate-fade-in delay-400">
          <FaGithub className="text-pink-200" /> GitHub Repos
        </a>
        <a href="#youtube" className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-600 via-violet-600 to-indigo-600 text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition flex items-center gap-2 animate-fade-in delay-500">
          <FaYoutube className="text-violet-200" /> YouTube Videos
        </a>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3.5s infinite;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
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
        @keyframes star {
          0%,100% { opacity: 0.6; transform: scale(1);}
          50% { opacity: 1; transform: scale(1.3);}
        }
        .animate-star {
          animation: star 2.5s infinite;
        }
        .animate-star2 {
          animation: star 3.2s infinite;
        }
        .animate-star3 {
          animation: star 2.8s infinite;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>
    </section>
  );
}
