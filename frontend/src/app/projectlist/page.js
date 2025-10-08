"use client";
import React, { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ProjectListPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [zips, setZips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("username") || "";
    setUsername(user);
    if (!user) {
      setError("Please login to view your projects.");
      setLoading(false);
      return;
    }
    fetch(`http://localhost:8000/api/list_project_zips?username=${user}`)
      .then(res => res.json())
      .then(zipsData => {
        if (zipsData.success) setZips(zipsData.zips || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0b13] via-[#1a1333] to-[#2a0a2a] relative">
      {/* Logout icon at top right */}
      <button
        onClick={async () => {
          // Call logout URL (if exists)
          try {
            await fetch("http://localhost:8000/api/logout", { method: "POST" });
          } catch {}
          // Clear localStorage
          localStorage.clear();
          // Redirect to login page
          router.push("/");
        }}
        className="absolute top-6 right-8 z-20 bg-[#18182a]/80 hover:bg-fuchsia-700 text-fuchsia-300 rounded-full p-3 shadow-lg transition-all duration-200 flex items-center justify-center"
        title="Logout"
        style={{ boxShadow: "0 2px 12px 0 rgba(120,0,255,0.18)" }}
      >
        <FaSignOutAlt className="text-2xl" />
      </button>
      <div className="w-full max-w-2xl bg-[#18182a]/90 rounded-2xl shadow-2xl p-8 border border-violet-700 mt-12">
        <h1 className="text-3xl font-bold text-violet-400 mb-6 text-center">Your Projects</h1>
        {loading ? (
          <div className="text-violet-300 text-center">Loading...</div>
        ) : error ? (
          <div className="text-fuchsia-400 text-center">{error}</div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-fuchsia-400 mb-4 text-center">Saved ZIP Files</h2>
            <ul className="space-y-4">
              {zips.length === 0 ? (
                <div className="text-slate-400 text-center">No zip files found.</div>
              ) : zips.map((zip, idx) => (
                <li key={idx} className="bg-[#23234a] rounded-xl p-4 flex flex-col gap-2 border border-fuchsia-600">
                  <div className="text-lg font-semibold text-fuchsia-300">{zip.project_name}</div>
                  <div className="text-xs text-slate-400">Filename: {zip.filename}</div>
                  <div className="text-xs text-slate-400">Uploaded: {zip.uploadDate}</div>
                  <button
                    className="mt-2 px-4 py-2 bg-fuchsia-700 text-white rounded hover:bg-fuchsia-800"
                    onClick={() => {
                      window.open(
                        `http://localhost:8000/api/download_project_zip?username=${username}&project_name=${zip.project_name}`,
                        "_blank"
                      );
                    }}
                  >
                    Download ZIP
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
