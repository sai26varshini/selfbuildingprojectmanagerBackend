"use client";
import React, { useState } from "react";

export default function ResearchPaperForm({ projectName, domain }) {
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPdfUrl("");
    try {
      const res = await fetch("http://localhost:8000/research_paper/download/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: projectName, domain }),
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
    <div className="flex flex-col gap-4 mb-4">
      <button
        type="button"
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow hover:bg-indigo-700 transition"
        disabled={loading || !projectName || !domain}
        onClick={handleGenerate}
      >
        {loading ? "Generating PDF..." : "Generate Research Paper PDF"}
      </button>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {pdfUrl && (
        <div className="mt-4">
          <a href={pdfUrl} download="research_paper.pdf" className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold shadow hover:bg-green-700 transition">Download PDF</a>
          <iframe src={pdfUrl} className="w-full h-96 mt-4 border rounded" title="Research Paper Preview"></iframe>
        </div>
      )}
    </div>
  );
}
