// "use client";
// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { FaRobot } from "react-icons/fa";

// const FILENAME_RE = /^[A-Za-z0-9_\-\/]+?\.(py|js|jsx|ts|tsx|json|md)$/i;

// // Sanitize incoming code chunk
// function cleanChunk(raw) {
//   if (!raw) return "";
//   let txt = raw
//     .replace(/```[\w-]*\s?/g, "")          // remove fenced code markers + lang
//     .replace(/```/g, "")
//     .replace(/\r/g, "");

//   const lines = txt.split("\n")
//     .filter(l => {
//       const trimmed = l.trim();
//       if (!trimmed) return true;
//       if (/^\*\*Project Structure\*\*/i.test(trimmed)) return false;
//       if (/^[A-Za-z0-9_\-]+\/$/.test(trimmed)) return false;     // folder line
//       if (/^To run this code/i.test(trimmed)) return false;
//       if (/^You can run/i.test(trimmed)) return false;
//       if (/^This code /i.test(trimmed)) return false;
//       return true;
//     });

//   // Stop before long narrative sections (heuristic)
//   const stopIdx = lines.findIndex(l =>
//     /^#+\s?Usage/i.test(l.trim()) ||
//     /^#+\s?How/i.test(l.trim())
//   );
//   return (stopIdx > -1 ? lines.slice(0, stopIdx) : lines).join("\n").trimStart();
// }

// export default function CodeStream({ projectName, domain }) {
//   const [files, setFiles] = useState([]); // [{filePath, code}]
//   const [currentFile, setCurrentFile] = useState("");
//   const [typingBuffer, setTypingBuffer] = useState(""); // currently animated chunk
//   const [done, setDone] = useState(false);
//   const eventRef = useRef(null);
//   const queueRef = useRef([]);            // [{filePath, chunk}]
//   const fullCodeRef = useRef({});         // filePath -> accumulated code
//   const typingRef = useRef(false);
//   const scrollRef = useRef(null);

//   // Auto scroll
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [files, typingBuffer, currentFile]);

//   const pushFileState = () => {
//     const arr = Object.entries(fullCodeRef.current).map(([filePath, code]) => ({ filePath, code }));
//     setFiles(arr);
//   };

//   const typeNext = useCallback(async () => {
//     if (typingRef.current) return;
//     if (queueRef.current.length === 0) return;
//     const { filePath, chunk } = queueRef.current.shift();

//     typingRef.current = true;
//     setCurrentFile(filePath);
//     setTypingBuffer("");

//     for (let i = 0; i < chunk.length; i++) {
//       setTypingBuffer(prev => prev + chunk[i]);
//       // Fast typing speed; adjust as needed
//       // Slightly slower for large chunks first chars
//       await new Promise(r => setTimeout(r, chunk.length > 1500 ? 1 : 4));
//     }

//     // Append typed chunk to stored full code
//     fullCodeRef.current[filePath] = (fullCodeRef.current[filePath] || "") + chunk;
//     pushFileState();

//     // Clear typing buffer (we moved it into full code)
//     setTypingBuffer("");
//     typingRef.current = false;

//     // Continue with next queued chunk
//     typeNext();
//   }, []);

//   useEffect(() => {
//     if (!projectName || !domain) return;

//     // Reset state on new generation
//     setFiles([]);
//     setCurrentFile("");
//     setTypingBuffer("");
//     setDone(false);
//     queueRef.current = [];
//     fullCodeRef.current = {};
//     typingRef.current = false;

//     if (eventRef.current) {
//       eventRef.current.close();
//     }

//     const url = `http://localhost:8000/code_snippets/stream?project_name=${encodeURIComponent(
//       projectName
//     )}&domain=${encodeURIComponent(domain)}`;

//     const es = new EventSource(url);
//     eventRef.current = es;

//     es.onmessage = (evt) => {
//       // evt.data already excludes "data:"
//       if (!evt.data) return;
//       if (evt.data === "DONE") {
//         setDone(true);
//         es.close();
//         return;
//       }

//       // Expect: first line filename, remainder code chunk
//       const firstNL = evt.data.indexOf("\n");
//       if (firstNL === -1) return; // ignore malformed event
//       const maybeFile = evt.data.slice(0, firstNL).trim();

//       if (!FILENAME_RE.test(maybeFile)) {
//         // Not a valid source file name -> ignore (filters structure markdown)
//         return;
//       }

//       const rawCode = evt.data.slice(firstNL + 1);
//       const cleaned = cleanChunk(rawCode);
//       if (!cleaned) return;

//       queueRef.current.push({ filePath: maybeFile, chunk: cleaned });
//       // Kick typing if idle
//       typeNext();
//     };

//     es.onerror = (err) => {
//       console.warn("[SSE] error -> closing stream", err);
//       es.close();
//       if (!done) {
//         // Optional: retry logic (commented out to avoid duplicate streams)
//         // setTimeout(() => {
//         //   if (!done) window.location.reload();
//         // }, 3000);
//       }
//     };

//     return () => {
//       es.close();
//     };
//   }, [projectName, domain, typeNext, done]);

//   return (
//     <div className="bg-gradient-to-br from-[#0d1117] via-[#10151f] to-[#09101a] rounded-xl p-5 text-sm text-slate-100 font-mono shadow-lg border border-slate-800/60">
//       <div className="flex items-center mb-4">
//         <FaRobot className="text-emerald-400 text-2xl mr-2 animate-pulse" />
//         <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
//           Live Code Generation
//         </h2>
//       </div>

//       <div
//         ref={scrollRef}
//         className="max-h-[60vh] overflow-y-auto pr-1 space-y-4 custom-scroll"
//       >
//         {files.map(f => (
//           <div
//             key={f.filePath}
//             className="rounded-lg border border-slate-700/70 bg-[#0f172a]/60 backdrop-blur-sm shadow-inner shadow-black/30"
//           >
//             <div className="px-3 py-2 text-xs font-semibold tracking-wide flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/60">
//               <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
//               {f.filePath}
//             </div>
//             <pre className="p-3 text-[12px] leading-[1.35rem] whitespace-pre-wrap text-emerald-200 selection:bg-emerald-500/30 selection:text-emerald-50">
//               {f.code}
//             </pre>
//           </div>
//         ))}

//         {typingBuffer && (
//           <div className="rounded-lg border border-emerald-600/40 bg-emerald-900/10 backdrop-blur-sm shadow-inner">
//             <div className="px-3 py-2 text-xs font-semibold tracking-wide flex items-center gap-2 bg-gradient-to-r from-emerald-700/40 to-teal-800/40 border-b border-emerald-700/40 text-emerald-200">
//               <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
//               {currentFile || "Generating..."}
//             </div>
//             <pre className="p-3 text-[12px] leading-[1.35rem] whitespace-pre-wrap text-emerald-300">
//               {typingBuffer}
//               <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse" />
//             </pre>
//           </div>
//         )}
//       </div>

//       <div className="mt-4 text-xs text-slate-400">
//         {!done && (
//           <span className="flex items-center gap-2">
//             <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
//             Streaming & typing code...
//           </span>
//         )}
//         {done && (
//           <span className="flex items-center gap-2 text-emerald-400 font-semibold">
//             <span className="w-2 h-2 rounded-full bg-emerald-400" />
//             Generation complete
//           </span>
//         )}
//       </div>

//       <style jsx>{`
//         .custom-scroll::-webkit-scrollbar {
//           width: 8px;
//         }
//         .custom-scroll::-webkit-scrollbar-track {
//           background: #0d1117;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb {
//           background: #1e293b;
//           border-radius: 4px;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb:hover {
//           background: #334155;
//         }
//       `}</style>
//     </div>
// }



"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaRobot } from "react-icons/fa";

const FILENAME_RE = /^[A-Za-z0-9_\-\/]+?\.(py|js|jsx|ts|tsx|json|md)$/i;

// Sanitize incoming code chunk
function cleanChunk(raw) {
  if (!raw) return "";
  let txt = raw
    .replace(/```[\w-]*\s?/g, "")          // remove fenced code markers + lang
    .replace(/```/g, "")
    .replace(/\r/g, "");

  const lines = txt.split("\n")
    .filter(l => {
      const trimmed = l.trim();
      if (!trimmed) return true;
      if (/^\*\*Project Structure\*\*/i.test(trimmed)) return false;
      if (/^[A-Za-z0-9_\-]+\/$/.test(trimmed)) return false;     // folder line
      if (/^To run this code/i.test(trimmed)) return false;
      if (/^You can run/i.test(trimmed)) return false;
      if (/^This code /i.test(trimmed)) return false;
      return true;
    });

  // Stop before long narrative sections (heuristic)
  const stopIdx = lines.findIndex(l =>
    /^#+\s?Usage/i.test(l.trim()) ||
    /^#+\s?How/i.test(l.trim())
  );
  return (stopIdx > -1 ? lines.slice(0, stopIdx) : lines).join("\n").trimStart();
}

export default function CodeStream({ projectName, domain }) {
  const [files, setFiles] = useState([]); // [{filePath, code}]
  const [currentFile, setCurrentFile] = useState("");
  const [typingBuffer, setTypingBuffer] = useState(""); // currently animated chunk
  const [done, setDone] = useState(false);
  const eventRef = useRef(null);
  const queueRef = useRef([]);            // [{filePath, chunk}]
  const fullCodeRef = useRef({});         // filePath -> accumulated code
  const typingRef = useRef(false);
  const scrollRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [files, typingBuffer, currentFile]);

  const pushFileState = () => {
    const arr = Object.entries(fullCodeRef.current).map(([filePath, code]) => ({ filePath, code }));
    setFiles(arr);
  };

  const typeNext = useCallback(async () => {
    if (typingRef.current) return;
    if (queueRef.current.length === 0) return;
    const { filePath, chunk, mode } = queueRef.current.shift();

    typingRef.current = true;
    setCurrentFile(filePath);
    setTypingBuffer("");

    // If mode === 'replace' we type the full new code (chunk is full code)
    // If mode === 'append' we only type the diff chunk
    for (let i = 0; i < chunk.length; i++) {
      setTypingBuffer(prev => prev + chunk[i]);
      await new Promise(r => setTimeout(r, chunk.length > 1500 ? 1 : 3));
    }

    if (mode === "replace") {
      fullCodeRef.current[filePath] = chunk;
    } else {
      fullCodeRef.current[filePath] = (fullCodeRef.current[filePath] || "") + chunk;
    }

    pushFileState();
    setTypingBuffer("");
    typingRef.current = false;
    typeNext();
  }, []);

  useEffect(() => {
    if (!projectName || !domain) return;

    // Reset
    setFiles([]);
    setCurrentFile("");
    setTypingBuffer("");
    setDone(false);
    queueRef.current = [];
    fullCodeRef.current = {};
    typingRef.current = false;

    if (eventRef.current) eventRef.current.close();

    const url = `http://localhost:8000/code_snippets/stream?project_name=${encodeURIComponent(projectName)}&domain=${encodeURIComponent(domain)}`;
    const es = new EventSource(url);
    eventRef.current = es;

    es.onmessage = (evt) => {
      if (!evt.data) return;
      if (evt.data === "DONE") {
        setDone(true);
        es.close();
        return;
      }

      const firstNL = evt.data.indexOf("\n");
      if (firstNL === -1) return;
      const maybeFile = evt.data.slice(0, firstNL).trim();
      if (!FILENAME_RE.test(maybeFile)) return;

      const rawCode = evt.data.slice(firstNL + 1);
      const cleanedFull = cleanChunk(rawCode);
      if (!cleanedFull) return;

      const existing = fullCodeRef.current[maybeFile] || "";

      // De-dup / diff logic
      if (cleanedFull === existing) {
        // Exact repeat: ignore
        return;
      }

      let mode = "append";
      let diffChunk = cleanedFull;

      if (cleanedFull.startsWith(existing) && existing.length > 0) {
        // Proper extension: type only the new part
        diffChunk = cleanedFull.slice(existing.length);
        mode = "append";
      } else if (existing.startsWith(cleanedFull)) {
        // Received an older partial again: ignore
        return;
      } else {
        // Overlap / replacement case: replace entire file (avoid double content)
        mode = "replace";
        diffChunk = cleanedFull; // type full new body
      }

      if (!diffChunk) return;

      queueRef.current.push({ filePath: maybeFile, chunk: diffChunk, mode });
      typeNext();
    };

    es.onerror = (err) => {
      console.warn("[SSE] error", err);
      es.close();
    };

    return () => {
      es.close();
    };
  // IMPORTANT: removed 'done' from deps to avoid auto re-run duplication
  }, [projectName, domain, typeNext]);

  function typeFile(filename, fullCode) {
    fullCodeRef.current[filename] = fullCode;
    setCurrentFile(filename);
    setTypingBuffer(fullCode);
    setFiles(Object.entries(fullCodeRef.current).map(([fn, code]) => ({ filePath: fn, code })));
    return Promise.resolve();
  }

  return (
    <div className="bg-gradient-to-br from-[#0d1117] via-[#10151f] to-[#09101a] rounded-xl p-5 text-sm text-slate-100 font-mono shadow-lg border border-slate-800/60">
      <div className="flex items-center mb-4">
        <FaRobot className="text-emerald-400 text-2xl mr-2 animate-pulse" />
        <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
          Live Code Generation
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="max-h-[60vh] overflow-y-auto pr-1 space-y-4 custom-scroll"
      >
        {files.map(f => (
          <div
            key={f.filePath}
            className="rounded-lg border border-slate-700/70 bg-[#0f172a]/60 backdrop-blur-sm shadow-inner shadow-black/30"
          >
            <div className="px-3 py-2 text-xs font-semibold tracking-wide flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/60">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {f.filePath}
            </div>
            <pre className="p-3 text-[12px] leading-[1.35rem] whitespace-pre-wrap text-emerald-200 selection:bg-emerald-500/30 selection:text-emerald-50">
              {f.code}
            </pre>
          </div>
        ))}

        {typingBuffer && (
          <div className="rounded-lg border border-emerald-600/40 bg-emerald-900/10 backdrop-blur-sm shadow-inner">
            <div className="px-3 py-2 text-xs font-semibold tracking-wide flex items-center gap-2 bg-gradient-to-r from-emerald-700/40 to-teal-800/40 border-b border-emerald-700/40 text-emerald-200">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {currentFile || "Generating..."}
            </div>
            <pre className="p-3 text-[12px] leading-[1.35rem] whitespace-pre-wrap text-emerald-300">
              {typingBuffer}
              <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse" />
            </pre>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-slate-400">
        {!done && (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Streaming & typing code...
          </span>
        )}
        {done && (
          <span className="flex items-center gap-2 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Generation complete
          </span>
        )}
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #0d1117;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
