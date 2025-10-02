"use client";
import React, { useState, useRef } from "react";
import GlassCard from "../components/GlassCard";
import ResearchPaperForm from "./ResearchPaperForm";
import { FaDownload, FaCopy, FaChevronDown, FaChevronRight } from "react-icons/fa";

// --- SIMPLE filename check (keep) ---
const VALID_FILENAME = /^(?:[A-Za-z0-9_\-\/]+)\.(?:py|js|jsx|ts|tsx|json|md)$/;

// --- Light clean: ONLY strip outer backticks, keep EVERYTHING else ---
function lightClean(raw) {
  if (!raw) return "";
  return raw.replace(/```[\w-]*\n?/g, "").replace(/```/g, "");
}

// YouTube helpers
function extractYouTubeId(url = "") {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex(p => ["embed", "v", "shorts"].includes(p));
    if (idx > -1 && parts[idx + 1]) return parts[idx + 1];
  } catch (_) {}
  return "";
}
function formatViews(v) {
  v = parseInt(v || 0, 10);
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (v >= 1_000) return (v / 1_000).toFixed(1) + "K";
  return v.toString();
}
function sanitizeVideos(list = []) {
  const seen = new Set();
  const out = [];
  for (const v of list) {
    const id = extractYouTubeId(v.url || "");
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push({
      ...v,
      id,
      title: (v.title || "").trim().slice(0,120),
      description: (v.description || "").replace(/\s+/g," ").slice(0,160),
      channel: (v.channel || "Channel").trim().slice(0,60),
      views: formatViews(v.views),
      year: v.year || ""
    });
    if (out.length >= 12) break;
  }
  return out;
}

export default function ProjectPage() {
  const [projectName, setProjectName] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);

  const [typingCode, setTypingCode] = useState("");
  const [currentFile, setCurrentFile] = useState("");
  const [allFiles, setAllFiles] = useState([]); // [{filename, code}]
  const [expanded, setExpanded] = useState(new Set()); // filenames expanded
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [repos, setRepos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [papers, setPapers] = useState([]);
  const [visibleType, setVisibleType] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [activeTab, setActiveTab] = useState("code"); // "code" or "resources"
  const fileStoreRef = useRef({});

  // (Optional) simple hash util (if not already defined in your code)
  const hashCode = (txt) => `${txt.length}:${txt.slice(0,40)}:${txt.slice(-40)}`;

  function toggleExpand(fname) {
    setExpanded(prev => {
      const n = new Set(prev);
      if (n.has(fname)) n.delete(fname); else n.add(fname);
      return n;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // clear previous stream store
    fileStoreRef.current = {};
    setLoading(true);
    setError("");
    setTypingCode("");
    setResult(null);
    setRepos([]);
    setVideos([]);
    setPapers([]);
    setAllFiles([]);
    setIsGenerating(true);
    setCurrentFile("");
    setExpanded(new Set());
    setActiveTab("code");

    try {
      // STEP 1: structure & recommendations
      const res = await fetch("http://localhost:8000/create_project_structure/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: projectName, domain })
      });
      const data = await res.json();
   
      if (data.error) {
        throw new Error(data.error);
      }
      setResult(data);
      setRepos(data.repos || []);
      setVideos(sanitizeVideos(data.videos || []));
      setPapers(data.papers || []);

      // STEP 2: stream code
      const codeRes = await fetch(
        `http://localhost:8000/code_snippets/stream?project_name=${encodeURIComponent(projectName)}&domain=${encodeURIComponent(domain)}`
      );
      if (!codeRes.body) throw new Error("No stream body");

      const reader = codeRes.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      const fileCodeMap = {};

      // Optional: typing speed (ms per char)
      const TYPE_DELAY = 1;

      async function typeFile(filename, fullCode) {
        // If you want instant display, just assign and skip loop.
        let existing = fileCodeMap[filename] || "";
        const newPortion = fullCode.slice(existing.length);
        for (let i = 0; i < newPortion.length; i++) {
          existing += newPortion[i];
          fileCodeMap[filename] = existing;
          // Update current typing preview
          setCurrentFile(filename);
          setTypingCode(existing);
          if (i % 5 === 0) {
            // Commit to allFiles every few chars for performance
            setAllFiles(Object.entries(fileCodeMap).map(([fn, code]) => ({ filename: fn, code })));
          }
          if (TYPE_DELAY) await new Promise(r => setTimeout(r, TYPE_DELAY));
        }
        // Final commit
        setAllFiles(Object.entries(fileCodeMap).map(([fn, code]) => ({ filename: fn, code })));
        setTypingCode(existing);
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop(); // keep incomplete chunk

        for (const evt of events) {
            if (!evt.startsWith("data:")) continue;
            const raw = evt.slice(5).trim();
            if (!raw) continue;
            if (raw === "DONE") {
              continue;
            }
            let parsed;
            try {
              parsed = JSON.parse(raw);
            } catch {
              continue;
            }
            const { file, code } = parsed;
            if (!file || !code || !VALID_FILENAME.test(file)) continue;

            // Auto expand first time
            setExpanded(prev => {
              if (prev.has(file)) return prev;
              const n = new Set(prev);
              n.add(file);
              return n;
            });

            const h = hashCode(code);
            const existing = fileStoreRef.current[file];
            if (!existing || existing.hash !== h) {
              fileStoreRef.current[file] = { code, hash: h };
              setAllFiles(
                Object.entries(fileStoreRef.current).map(([fn, v]) => ({ filename: fn, code: v.code }))
              );
            }

            await typeFile(file, code);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Generation failed");
    } finally {
      setLoading(false);
      setIsGenerating(false);
      setCurrentFile("");
      setTypingCode("");
    }
  }

  function copyFile(code) {
    navigator.clipboard.writeText(code).catch(()=>{});
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0b13] via-[#1a1333] to-[#2a0a2a] flex flex-col items-center justify-center py-10 px-2 relative font-sans">
      {/* Animated generative AI background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(120,0,255,0.22),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(0,180,255,0.12),transparent_65%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(255,0,150,0.10),transparent_70%)]" />
        <div className="absolute inset-0 opacity-30 mix-blend-screen bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.04)_0_2px,transparent_2px_6px)]" />
      </div>

      <div className="max-w-5xl w-full mx-auto flex flex-col items-center justify-center">
        <div className="mb-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-violet-400 to-indigo-400 drop-shadow-lg">
            Generative AI Project Assistant
          </h1>
          <p className="mt-4 text-xl text-slate-200 font-medium max-w-2xl mx-auto">
            Build, learn, and innovate with AI-powered project tools and recommendations.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-center justify-center w-full">
          {/* Left: Tabs container */}
          <div className="w-full md:w-[60%] flex flex-col items-center justify-center">
            <div className="flex gap-2 mb-4 justify-center">
              <button
                type="button"
                className={`px-6 py-3 rounded-t-xl font-semibold text-base transition-all ${
                  activeTab === "code"
                    ? "bg-gradient-to-r from-fuchsia-700 via-violet-700 to-indigo-700 text-white shadow-lg scale-105"
                    : "bg-[#18182a] text-slate-300 hover:bg-violet-900"
                }`}
                onClick={() => setActiveTab("code")}
              >
                Code Generation
              </button>
              <button
                type="button"
                className={`px-6 py-3 rounded-t-xl font-semibold text-base transition-all ${
                  activeTab === "resources"
                    ? "bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-700 text-white shadow-lg scale-105"
                    : "bg-[#18182a] text-slate-300 hover:bg-fuchsia-900"
                }`}
                onClick={() => setActiveTab("resources")}
              >
                Resources & Download
              </button>
            </div>
            <div className="rounded-b-2xl bg-[#18182a]/90 border border-violet-900 shadow-2xl p-8 min-h-[420px] w-full flex flex-col items-center justify-center">
              {activeTab === "code" && (
                <GlassCard title="Start Your Project" className="mb-8 flex flex-col items-center justify-center">
                  <form className="flex flex-col gap-4 items-center w-full" onSubmit={handleSubmit}>
                    {/* Centered input section with gradient background */}
                    <div className="flex flex-col gap-4 items-center justify-center w-full py-8 px-6 rounded-2xl shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, rgba(120,0,255,0.18) 0%, rgba(0,180,255,0.13) 50%, rgba(255,0,150,0.12) 100%)",
                        boxShadow: "0 8px 32px 0 rgba(120,0,255,0.12)"
                      }}
                    >
                      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-400 text-center">
                        Start Your Project
                      </h2>
                      <div className="flex gap-4 w-full justify-center">
                        <input
                          type="text"
                          placeholder="Project Name"
                          value={projectName}
                          onChange={e => setProjectName(e.target.value)}
                          className="px-4 py-3 rounded-lg border-none shadow focus:outline-none focus:ring-2 focus:ring-violet-500 w-1/2 bg-gradient-to-r from-[#18182a] via-[#2a0a2a] to-[#18182a] text-slate-100 placeholder-violet-300 font-semibold text-lg"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Domain (e.g. AI, Web, ML)"
                          value={domain}
                          onChange={e => setDomain(e.target.value)}
                          className="px-4 py-3 rounded-lg border-none shadow focus:outline-none focus:ring-2 focus:ring-fuchsia-500 w-1/2 bg-gradient-to-r from-[#18182a] via-[#2a0a2a] to-[#18182a] text-slate-100 placeholder-fuchsia-300 font-semibold text-lg"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-6 px-8 py-3 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 disabled:opacity-60 text-lg"
                        disabled={loading || isGenerating}
                      >
                        {loading || isGenerating ? "Generating..." : "Generate Structure & Get Recommendations"}
                      </button>
                    </div>
                    {loading && allFiles.length === 0 && (
                      <div className="mt-6 w-full flex flex-col items-center">
                        <svg className="w-8 h-8 text-violet-400 animate-spin mb-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        <span className="text-violet-400 font-mono animate-pulse">Preparing...</span>
                      </div>
                    )}

                    {isGenerating && currentFile && (
                      <div className="mt-6 w-full">
                        <h3 className="font-bold text-sm mb-2 text-violet-400">
                          Typing: <span className="font-mono">{currentFile}</span>
                        </h3>
                        <pre className="bg-[#0f172a] text-emerald-300 rounded-lg p-4 text-xs overflow-x-auto shadow-inner border border-violet-300/30">
                          <code>{typingCode || ""}</code>
                        </pre>
                      </div>
                    )}

                    {allFiles.length > 0 && (
                      <div className="mt-10 w-full">
                        <h3 className="font-bold text-xl mb-4 text-violet-400 flex items-center">
                          <svg className="w-6 h-6 mr-2 text-violet-400" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="2" d="M4 7v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7"/>
                            <path stroke="currentColor" strokeWidth="2" d="M4 7V5c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2"/>
                          </svg>
                          Generated Files
                        </h3>
                        <div className="flex flex-col gap-6">
                          {allFiles.map(file => {
                            const isOpen = expanded.has(file.filename);
                            return (
                              <div key={file.filename} className="rounded-xl border border-violet-300 bg-[#18182a]/80 shadow-lg overflow-hidden transition">
                                <div
                                  className="flex items-center justify-between px-4 py-3 cursor-pointer bg-gradient-to-r from-violet-900 to-fuchsia-900 hover:from-violet-800 hover:to-fuchsia-800"
                                  onClick={() => toggleExpand(file.filename)}
                                >
                                  <div className="flex items-center gap-3">
                                    {isOpen ? <FaChevronDown className="text-violet-400 text-sm" /> : <FaChevronRight className="text-violet-400 text-sm" />}
                                    <span className="font-semibold text-violet-200">{file.filename}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); copyFile(file.code); }}
                                    className="text-xs px-3 py-1 rounded-md bg-violet-700 text-white hover:bg-violet-800 flex items-center gap-1"
                                  >
                                    <FaCopy /> Copy
                                  </button>
                                </div>
                                {isOpen && (
                                  <pre className="m-0 bg-[#0f172a] text-[13px] leading-5 text-emerald-200 p-4 overflow-x-auto border-t border-violet-300/40">
                                    <code>{file.code}</code>
                                  </pre>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {result && !error && (
                      <div className="mt-6 bg-[#18182a]/80 rounded-lg p-4 shadow border border-violet-400 w-full">
                        <p className="font-bold text-violet-300">{result.message}</p>
                        <p className="text-xs text-slate-400 mt-1">Base Path: {result.base_path}</p>
                      </div>
                    )}

                    {error && <p className="text-fuchsia-400 mt-4">{error}</p>}
                  </form>
                </GlassCard>
              )}
              {activeTab === "resources" && (
                <div>
                  {/* --- Resources & Download Section --- */}
                  {((Array.isArray(repos) && repos.length > 0) || (Array.isArray(videos) && videos.length > 0) || (Array.isArray(papers) && papers.length > 0)) && (
                    <div className="mb-8">
                      <div className="flex gap-8 justify-center mb-8">
                        <button
                          type="button"
                          className={`p-4 rounded-full shadow-lg bg-[#18182a]/80 hover:bg-violet-900 transition-all ${visibleType === 'repos' ? 'ring-4 ring-violet-400' : ''}`}
                          onClick={() => setVisibleType(visibleType === 'repos' ? null : 'repos')}
                          title="Show GitHub Repos"
                        >
                          <svg className="w-10 h-10 text-violet-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.37 6.84 9.73.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.17-1.1-1.48-1.1-1.48-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0112 7.6c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0022 12.26C22 6.58 17.52 2 12 2z"/></svg>
                        </button>
                        <button
                          type="button"
                          className={`p-4 rounded-full shadow-lg bg-[#18182a]/80 hover:bg-fuchsia-900 transition-all ${visibleType === 'videos' ? 'ring-4 ring-fuchsia-400' : ''}`}
                          onClick={() => setVisibleType(visibleType === 'videos' ? null : 'videos')}
                          title="Show YouTube Videos"
                        >
                          <svg className="w-10 h-10 text-fuchsia-400" fill="currentColor" viewBox="0 0 24 24"><path d="M21.8 8.001a2.753 2.753 0 00-1.94-1.94C18.07 5.5 12 5.5 12 5.5s-6.07 0-7.86.561A2.753 2.753 0 002.2 8.001C1.64 9.78 1.64 12 1.64 12s0 2.22.56 3.999a2.753 2.753 0 001.94 1.94C5.93 18.5 12 18.5 12 18.5s6.07 0 7.86-.561a2.753 2.753 0 001.94-1.94c.56-1.779.56-3.999.56-3.999s0-2.22-.56-3.999zM10 15.5v-7l6 3.5-6 3.5z"/></svg>
                        </button>
                        <button
                          type="button"
                          className={`p-4 rounded-full shadow-lg bg-[#18182a]/80 hover:bg-pink-900 transition-all ${visibleType === 'papers' ? 'ring-4 ring-pink-400' : ''}`}
                          onClick={() => setVisibleType(visibleType === 'papers' ? null : 'papers')}
                          title="Show Research Papers"
                        >
                          <svg className="w-10 h-10 text-pink-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H8V4h11v16zm-7-2h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V8h-2v2z"/></svg>
                        </button>
                      </div>
                      <div className="w-full">
                        {visibleType === 'repos' && (
                          <div className="mb-8">
                            <h3 className="font-bold text-lg mb-2 text-violet-400 flex items-center"><svg className="w-5 h-5 mr-2 text-violet-400" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 2v20m10-10H2"/></svg>GitHub Repo Suggestions</h3>
                            <div className="grid gap-4">
                              {(Array.isArray(repos) ? repos : []).map(repo => (
                                <div key={repo.url} className="bg-[#18182a]/80 rounded-xl p-4 shadow border border-violet-300 hover:scale-105 transition-all">
                                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="font-bold text-violet-300 hover:underline text-lg">{repo.name}</a>
                                  <p className="text-sm text-slate-300">{repo.description}</p>
                                  <p className="text-xs text-slate-400">⭐ {repo.stars} | {repo.language}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {visibleType === 'videos' && (
                          <div className="mb-8">
                            <h3 className="font-bold text-lg mb-2 text-fuchsia-400 flex items-center">
                              <svg className="w-5 h-5 mr-2 text-fuchsia-400" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M10 16l6-6m0 0l-6-6"/></svg>
                              YouTube Video Suggestions
                            </h3>
                            <div className="grid gap-6">
                              {(Array.isArray(videos) ? videos : []).map((video, idx) => (
                                <div
                                  key={video.url}
                                  className="relative group bg-gradient-to-br from-fuchsia-900 via-violet-900 to-[#18182a] rounded-2xl p-0 shadow-xl border border-fuchsia-400 overflow-hidden hover:scale-105 transition-transform duration-300 animate-fadein"
                                  style={{ animationDelay: `${idx * 80}ms` }}
                                >
                                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="block">
                                    <div className="relative">
                                      <img
                                        src={`https://img.youtube.com/vi/${video.id || extractYouTubeId(video.url)}/hqdefault.jpg`}
                                        alt={video.title}
                                        width={480}
                                        height={270}
                                        className="w-full h-48 object-cover rounded-t-2xl group-hover:brightness-90 transition-all duration-200"
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="bg-white/80 rounded-full p-3 shadow-lg animate-bounce">
                                          <svg className="w-8 h-8 text-fuchsia-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </span>
                                      </div>
                                    </div>
                                    <div className="p-4">
                                      <div className="flex items-center mb-2">
                                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-300 to-white flex items-center justify-center mr-3 shadow">
                                          <svg className="w-6 h-6 text-fuchsia-400" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
                                        </span>
                                        <span className="font-bold text-fuchsia-400 text-base group-hover:underline transition-all duration-200">{video.channel}</span>
                                      </div>
                                      <div className="font-bold text-lg text-fuchsia-200 mb-1 group-hover:text-violet-400 transition-all duration-200">{video.title}</div>
                                      <div className="text-sm text-slate-300 mb-2">{video.description}</div>
                                      <div className="flex items-center gap-4 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>{video.views} views</span>
                                        <span className="flex items-center gap-1"><svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c2.54 0 4.04 1.61 4.5 2.09C12.46 4.61 13.96 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>{video.year || ''}</span>
                                      </div>
                                    </div>
                                  </a>
                                </div>
                              ))}
                            </div>
                            <style>{`
                              @keyframes fadein {
                                from { opacity: 0; transform: translateY(30px); }
                                to { opacity: 1; transform: translateY(0); }
                              }
                              .animate-fadein {
                                animation: fadein 0.7s cubic-bezier(.4,0,.2,1) both;
                              }
                            `}</style>
                          </div>
                        )}
                        {visibleType === 'papers' && (
                          <div className="mb-8">
                            <h3 className="font-bold text-lg mb-2 text-pink-400 flex items-center"><svg className="w-5 h-5 mr-2 text-pink-400" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4 4h16v16H4z"/></svg>Related Research Papers</h3>
                            <div className="grid gap-4">
                              {(Array.isArray(papers) ? papers : []).map(paper => (
                                <div key={paper.url} className="bg-[#18182a]/80 rounded-xl p-4 shadow border border-pink-400 hover:scale-105 transition-all">
                                  <a href={paper.url} target="_blank" rel="noopener noreferrer" className="font-bold text-pink-400 hover:underline text-lg">{paper.title}</a>
                                  <p className="text-sm text-slate-300">{paper.authors}</p>
                                  <p className="text-xs text-slate-400">{paper.year} | {paper.journal}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="mt-10 w-full">
                    <h3 className="font-bold text-lg mb-2 text-violet-400 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeWidth="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      Generate Research Paper PDF
                    </h3>
                    <ResearchPaperForm projectName={projectName} domain={domain} />
                  </div>
                  {allFiles.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const url = `http://localhost:8000/download_project?project_name=${encodeURIComponent(projectName)}`;
                        window.open(url, "_blank");
                      }}
                      className="mt-6 bg-violet-700 hover:bg-violet-800 text-white px-5 py-2 rounded-lg flex items-center shadow transition-colors"
                    >
                      <FaDownload className="mr-2" /> Download Project
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Right: AI illustration or theme accent */}
          <div className="hidden md:flex w-[40%] items-center justify-center">
            <div className="w-full flex flex-col items-center justify-center">
              <div className="w-72 h-72 rounded-full bg-gradient-to-br from-fuchsia-700 via-violet-700 to-indigo-700 blur-2xl opacity-80 mb-8 shadow-2xl" />
              <div className="text-center text-violet-300 font-bold text-2xl tracking-wide drop-shadow-lg">
                <span className="block mb-2">Generative AI</span>
                <span className="block text-base font-normal text-slate-400">Multi-Agent Environment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
