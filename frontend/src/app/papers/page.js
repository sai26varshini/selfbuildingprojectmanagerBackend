"use client";
import React, { useState } from "react";
import GlassCard from "../components/GlassCard";
import { FaFileAlt, FaUser, FaCalendarAlt, FaBook } from "react-icons/fa";

export default function PapersPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [papers, setPapers] = useState([]);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPapers([]);
    try {
      const res = await fetch(`http://localhost:8000/related_papers/?project_name=${encodeURIComponent(query)}&domain=General`);
      const data = await res.json();
      setPapers(data.papers || []);
    } catch (err) {
      setError("Failed to connect to backend.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-white flex flex-col items-center py-10 px-2 relative overflow-hidden">
      {/* Animated revolving prism SVG */}
      <svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-prism-spin z-0"
        width="340" height="340" viewBox="0 0 340 340" fill="none"
        style={{ opacity: 0.20 }}
      >
        <polygon points="170,40 300,300 40,300" fill="url(#prismGradient)" />
        <defs>
          <linearGradient id="prismGradient" x1="170" y1="40" x2="170" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9d1941ff" />
            <stop offset="0.5" stopColor="#122062ff" />
            <stop offset="1" stopColor="#40a128ff" />
          </linearGradient>
        </defs>
      </svg>
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 via-blue-600 to-black drop-shadow-lg mb-8 animate-fadein flex items-center justify-center z-10">
        <FaBook className="w-10 h-10 mr-3 text-cyan-700 animate-bounce" />
        Related Research Papers
      </h1>
      <GlassCard>
        <form className="flex gap-4 mb-4 items-center animate-fadein" onSubmit={handleSubmit}>
          <span className="text-pink-600 text-2xl"><FaFileAlt /></span>
          <input
            type="text"
            placeholder="Search topic or keywords"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="px-4 py-2 rounded border-2 border-pink-400 bg-white/80 text-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-pink-400 flex-1 transition text-gray-900"
            required
            style={{ minWidth: 0 }}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-pink-600 via-purple-500 to-pink-400 text-white rounded-lg font-bold shadow hover:scale-105 hover:from-pink-700 transition flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center"><FaBook className="animate-spin mr-2" />Searching...</span>
            ) : (
              <span className="flex items-center"><FaBook className="mr-2" />Find Papers</span>
            )}
          </button>
        </form>
        {error && <p className="text-red-600 mb-2 animate-fadein">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {papers.map((paper, idx) => (
            <div
              key={paper.url}
              className={`rounded-xl p-0 shadow-lg border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-purple-50 hover:scale-105 transition-transform duration-300 animate-fadein max-w-xs mx-auto`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <a href={paper.url} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <FaFileAlt className="text-pink-600 mr-2" />
                    <span className="font-bold text-base text-pink-700 group-hover:underline transition-all duration-200 line-clamp-2">{paper.title}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 gap-2 mb-1">
                    <span className="flex items-center"><FaUser className="mr-1" />{paper.authors}</span>
                    <span className="flex items-center"><FaCalendarAlt className="mr-1" />{paper.year}</span>
                  </div>
                  <div className="text-xs text-purple-600 mb-1">{paper.journal}</div>
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
        @keyframes prism-spin {
          0% { transform: rotate(0deg) translate(-50%, -50%); }
          100% { transform: rotate(360deg) translate(-50%, -50%); }
        }
        .animate-prism-spin {
          animation: prism-spin 18s linear infinite;
        }
      `}</style>
    </div>
  );
}

