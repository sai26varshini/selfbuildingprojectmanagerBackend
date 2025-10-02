"use client";
import React, { useState } from "react";
import GlassCard from "../components/GlassCard";
import { FaGithub, FaStar, FaCode, FaRobot, FaRocket, FaMagic } from "react-icons/fa";
import { PiPlanetFill } from "react-icons/pi";

export default function GithubPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRepos([]);
    try {
      const res = await fetch(`http://localhost:8000/github_repos/?project_name=${encodeURIComponent(query)}&domain=General`);
      const data = await res.json();
      setRepos(data.repositories || []);
    } catch (err) {
      setError("Failed to connect to backend.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b13] via-[#1a1333] to-[#2a0a2a] flex flex-col items-center py-10 px-2 relative overflow-hidden">
      {/* Animated Toys & Planets */}
      <FaRocket className="absolute left-0 top-1/2 text-fuchsia-400 opacity-60 text-7xl animate-rocket pointer-events-none" />
      <FaRobot className="absolute right-10 bottom-24 text-violet-400 opacity-60 text-6xl animate-aiwalk pointer-events-none" />
      <FaMagic className="absolute left-10 top-24 text-cyan-400 opacity-60 text-6xl animate-magic pointer-events-none" />
      <PiPlanetFill className="absolute right-32 top-32 text-indigo-400 opacity-60 text-6xl animate-planet pointer-events-none" />
      <PiPlanetFill className="absolute left-32 bottom-24 text-fuchsia-400 opacity-40 text-5xl animate-planet2 pointer-events-none" />

      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-violet-400 to-indigo-400 drop-shadow-lg mb-8 animate-fadein flex items-center justify-center">
        <FaGithub className="w-10 h-10 mr-3 text-gray-100 animate-bounce" />
        GitHub Repo Suggestions
      </h1>
      <GlassCard>
        <form className="flex gap-4 mb-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search topic or keywords"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="px-4 py-2 rounded border flex-1"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white rounded-lg font-bold shadow hover:bg-fuchsia-700 transition"
            disabled={loading}
          >
            {loading ? "Searching..." : "Suggest Repos"}
          </button>
        </form>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div className="grid gap-6">
          {(Array.isArray(repos) ? repos : []).map((repo, idx) => (
            <div key={repo.url} className="bg-[#18182a]/90 rounded-2xl p-6 shadow-xl border border-violet-700 hover:scale-105 transition-transform duration-300 animate-fadein" style={{ animationDelay: `${idx * 80}ms` }}>
              <a href={repo.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex items-center mb-2">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-700 via-fuchsia-700 to-black flex items-center justify-center mr-4 shadow animate-bounce">
                    <FaGithub className="w-7 h-7 text-gray-100" />
                  </span>
                  <span className="font-bold text-gray-100 text-xl group-hover:underline transition-all duration-200">{repo.name}</span>
                </div>
                <div className="text-gray-300 mb-2">{repo.description}</div>
                <div className="flex items-center gap-6 text-xs text-gray-400">
                  <span className="flex items-center gap-1 animate-fadein"><FaStar className="w-4 h-4 text-yellow-400" />{repo.stars} stars</span>
                  <span className="flex items-center gap-1 animate-fadein"><FaCode className="w-4 h-4 text-green-400" />{repo.language}</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </GlassCard>
      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein {
          animation: fadein 0.7s cubic-bezier(.4,0,.2,1) both;
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
        @keyframes aiwalk {
          0% { right: 10vw; }
          50% { right: 70vw; }
          100% { right: 10vw; }
        }
        .animate-aiwalk {
          animation: aiwalk 14s ease-in-out infinite;
        }
        @keyframes magic {
          0%,100% { transform: scale(1) rotate(-10deg);}
          50% { transform: scale(1.2) rotate(10deg);}
        }
        .animate-magic {
          animation: magic 3.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

