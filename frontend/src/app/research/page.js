"use client";
import React, { useState } from "react";
import GlassCard from "../components/GlassCard";
import { FaRobot, FaBrain } from "react-icons/fa";

export default function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPdfUrl("");
    try {
      const res = await fetch("http://localhost:8000/research_paper/download/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: topic, domain: "General" }),
      });
      if (res.ok) {
        const blob = await res.blob();
        setPdfUrl(URL.createObjectURL(blob));
      } else {
        setError("Failed to generate PDF.");
      }
    } catch (err) {
      setError("Failed to connect to backend.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-white flex flex-col items-center py-10 px-2 relative overflow-hidden">
      {/* Animated science/AI background icons */}
      <FaBrain className="absolute top-10 left-10 text-green-200 opacity-30 text-[7rem] animate-spin-slow pointer-events-none" />
      <FaRobot className="absolute bottom-10 right-10 text-blue-200 opacity-20 text-[8rem] animate-bounce-slow pointer-events-none" />

      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-pink-600 drop-shadow-lg mb-8 animate-fadein flex items-center justify-center z-10">
        <FaRobot className="w-10 h-10 mr-3 text-green-600 animate-bounce" />
        Research Paper PDF Generator
      </h1>
      <GlassCard>
        <form className="flex gap-4 mb-4 items-center animate-fadein" onSubmit={handleSubmit}>
          <span className="text-green-600 text-2xl"><FaBrain /></span>
          <input
            type="text"
            placeholder="Research Topic"
            value={topic}
            onChange={e => setTopic(e.target.value)}
className="px-4 py-2 rounded border-2 border-green-400 bg-white/80 text-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-400 flex-1 transition text-gray-900"
            required
            style={{ minWidth: 0 }}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-green-600 via-blue-500 to-pink-500 text-white rounded-lg font-bold shadow hover:scale-105 hover:from-green-700 transition flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center"><FaRobot className="animate-spin mr-2" />Generating...</span>
            ) : (
              <span className="flex items-center"><FaRobot className="mr-2" />Generate PDF</span>
            )}
          </button>
        </form>
        {error && <p className="text-red-600 mb-2 animate-fadein">{error}</p>}
        {pdfUrl && (
          <div className="mt-4 animate-fadein">
            <a href={pdfUrl} download="research_paper.pdf" className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold shadow hover:bg-green-700 transition">Download PDF</a>
            <iframe src={pdfUrl} className="w-full h-96 mt-4 border rounded" title="Research Paper Preview"></iframe>
          </div>
        )}
      </GlassCard>
      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein {
          animation: fadein 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </div>
  );
}

