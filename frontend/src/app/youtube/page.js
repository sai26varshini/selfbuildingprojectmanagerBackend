"use client";
import React, { useState } from "react";
import GlassCard from "../components/GlassCard";
import { FaYoutube, FaPlay, FaUserCircle, FaEye, FaFilm, FaStar, FaTicketAlt, FaTheaterMasks, FaVideo } from "react-icons/fa";
import { PiPlanetFill } from "react-icons/pi";

export default function YoutubePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVideos([]);
    try {
      const res = await fetch(`http://localhost:8000/youtube_videos/?project_name=${encodeURIComponent(query)}&domain=General`);
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      setError("Failed to connect to backend.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-yellow-50 to-white flex flex-col items-center py-10 px-2 relative overflow-hidden">
      {/* Movie-related animated icons */}
      <FaFilm className="absolute left-10 top-16 text-red-400 opacity-40 text-7xl animate-bounce-slow pointer-events-none" />
      <FaStar className="absolute right-16 top-24 text-yellow-400 opacity-40 text-6xl animate-spin-slow pointer-events-none" />
      <FaTicketAlt className="absolute left-1/2 top-8 -translate-x-1/2 text-pink-400 opacity-30 text-6xl animate-ticket pointer-events-none" />
      <FaTheaterMasks className="absolute right-32 bottom-24 text-indigo-400 opacity-40 text-6xl animate-masks pointer-events-none" />
      <FaVideo className="absolute left-32 bottom-16 text-red-500 opacity-30 text-5xl animate-video pointer-events-none" />
      <PiPlanetFill className="absolute right-32 top-32 text-indigo-400 opacity-40 text-6xl animate-planet pointer-events-none" />

      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-black drop-shadow-lg mb-8 animate-fadein flex items-center justify-center">
        <FaYoutube className="w-10 h-10 mr-3 text-red-600 animate-bounce" />
        YouTube Video Suggestions
      </h1>
      <GlassCard>
        <form className="flex gap-4 mb-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search topic or keywords"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="px-6 py-3 rounded-lg border-2 border-red-400 bg-white/80 text-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-red-400 flex-1 transition text-red-500"
            required
            style={{ minWidth: 0 }}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold shadow hover:bg-red-700 transition"
            disabled={loading}
          >
            {loading ? "Searching..." : <span className="flex items-center"><FaYoutube className="mr-2" />Suggest Videos</span>}
          </button>
        </form>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {(Array.isArray(videos) ? videos : []).map((video, idx) => (
            <div
              key={video.url}
              className={`rounded-xl p-0 shadow-lg border border-red-100 bg-gradient-to-br from-white via-yellow-50 to-red-50 hover:scale-105 transition-transform duration-300 animate-fadein max-w-xs mx-auto`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="relative aspect-video rounded-t-xl overflow-hidden bg-black flex items-center justify-center" style={{ height: "140px" }}>
                  <FaPlay className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl opacity-80 group-hover:scale-110 transition-transform duration-200" />
                  <img
                    src={video.thumbnail || `https://img.youtube.com/vi/${video.url?.split("v=")[1]}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-center mb-1">
                    <FaYoutube className="text-red-600 mr-2" />
                    <span className="font-bold text-base text-red-700 group-hover:underline transition-all duration-200 line-clamp-2">{video.title}</span>
                  </div>
                  <p className="text-xs text-gray-700 mb-1 line-clamp-2">{video.description}</p>
                  <div className="flex items-center text-xs text-gray-500 gap-2">
                    <span className="flex items-center"><FaUserCircle className="mr-1" />{video.channel}</span>
                    <span className="flex items-center"><FaEye className="mr-1" />{video.views}</span>
                  </div>
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
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3.5s infinite;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes ticket {
          0% { top: 8px; }
          50% { top: 32px; }
          100% { top: 8px; }
        }
        .animate-ticket {
          animation: ticket 6s ease-in-out infinite;
        }
        @keyframes masks {
          0% { right: 32px; }
          50% { right: 64px; }
          100% { right: 32px; }
        }
        .animate-masks {
          animation: masks 8s ease-in-out infinite;
        }
        @keyframes video {
          0% { left: 32px; }
          50% { left: 64px; }
          100% { left: 32px; }
        }
        .animate-video {
          animation: video 7s ease-in-out infinite;
        }
        @keyframes planet {
          0% { transform: rotate(0deg) translateX(0); }
          100% { transform: rotate(360deg) translateX(12px); }
        }
        .animate-planet {
          animation: planet 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
