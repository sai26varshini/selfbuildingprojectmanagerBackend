import React from 'react';

export default function GlassCard({ title, children }) {
  return (
    <div className="relative bg-white/20 backdrop-blur-lg rounded-xl shadow-xl p-6 m-4 border border-white/30 transition hover:scale-105 hover:shadow-2xl overflow-hidden animate-glass-fadein">
      {/* Animated gradient border */}
      <div className="pointer-events-none absolute -inset-1 rounded-2xl z-0 animate-glass-border" style={{ background: 'conic-gradient(from 90deg at 50% 50%, #a5b4fc 0deg, #f0abfc 90deg, #7dd3fc 180deg, #a5b4fc 360deg)' , opacity: 0.18 }} />
      {/* Glow effect */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-200 via-pink-200 to-blue-200 opacity-10 blur-2xl z-0" />
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2 text-indigo-700 drop-shadow-sm animate-glass-title">{title}</h2>
        <div>{children}</div>
      </div>
      <style>{`
        @keyframes glass-fadein {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-glass-fadein {
          animation: glass-fadein 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes glass-border {
          0% { filter: blur(6px) brightness(1.1); opacity: 0.18; }
          50% { filter: blur(12px) brightness(1.3); opacity: 0.28; }
          100% { filter: blur(6px) brightness(1.1); opacity: 0.18; }
        }
        .animate-glass-border {
          animation: glass-border 4.5s ease-in-out infinite;
        }
        @keyframes glass-title {
          from { letter-spacing: 0.1em; opacity: 0.5; }
          to { letter-spacing: 0em; opacity: 1; }
        }
        .animate-glass-title {
          animation: glass-title 0.8s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </div>
  );
}
