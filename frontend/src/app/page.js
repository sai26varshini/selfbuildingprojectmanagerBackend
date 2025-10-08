"use client";
import React, { useState } from "react";
import { FaRocket, FaRobot, FaBrain, FaMagic, FaUserShield, FaLock, FaKey } from "react-icons/fa";
import { PiPlanetFill } from "react-icons/pi";

export default function AuthPage() {
  const [showUnlock, setShowUnlock] = useState(false);
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    if (mode === "register" && password !== confirmPassword) {
      setMsg("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const backendUrl = "http://localhost:8000/api/" + mode;
      const payload = mode === "register"
        ? { username, password }
        : { username, password };
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Error");
      setMsg(data.message);
      setShowUnlock(true);
      setTimeout(() => {
        setShowUnlock(false);
        if (mode === "login") {
          localStorage.setItem("username", username);
          window.location.href = "/dashboard";
        }
      }, 1800);
    } catch (err) {
      setMsg(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0b13] via-[#1a1333] to-[#2a0a2a] relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Stronger glowing animated blobs */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(120,0,255,0.35),transparent_60%)] animate-glow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(0,180,255,0.22),transparent_65%)] animate-glow2" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(255,0,150,0.18),transparent_70%)] animate-glow3" />
        <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.08)_0_2px,transparent_2px_6px)]" />
        {/* Floating security icons */}
        <FaUserShield className="absolute left-10 top-10 text-violet-400 opacity-40 text-7xl animate-float-slow" />
        <FaLock className="absolute right-16 top-32 text-fuchsia-400 opacity-40 text-6xl animate-bounce-slow" />
        <FaKey className="absolute left-1/2 top-1/4 text-indigo-400 opacity-40 text-5xl animate-spin-slow" />
        <FaLock className="absolute right-32 bottom-24 text-cyan-400 opacity-40 text-5xl animate-magic" />
        <FaUserShield className="absolute left-32 bottom-32 text-fuchsia-400 opacity-40 text-6xl animate-float-slow" />
        {/* Animated glowing blob with color transitions */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-pink-400 via-indigo-400 to-purple-400 opacity-40 rounded-full blur-[120px] animate-glowblob" />
      </div>
      {/* Animated lock opening effect after login/register */}
      {showUnlock && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="flex flex-col items-center justify-center">
            <FaLock className="text-7xl text-fuchsia-400 animate-lock-open mb-4" />
            <div className="text-xl text-white font-bold animate-fade-in">Access Granted</div>
          </div>
        </div>
      )}
      {/* Security-themed animated icons in background */}
      <FaUserShield className="absolute left-10 top-10 text-violet-400 opacity-30 text-7xl animate-float-slow pointer-events-none" />
      <FaLock className="absolute right-16 top-32 text-fuchsia-400 opacity-30 text-6xl animate-bounce-slow pointer-events-none" />
      <FaKey className="absolute left-1/2 top-1/4 text-indigo-400 opacity-30 text-5xl animate-spin-slow pointer-events-none" />
      <FaLock className="absolute right-32 bottom-24 text-cyan-400 opacity-30 text-5xl animate-magic pointer-events-none" />
      <FaUserShield className="absolute left-32 bottom-32 text-fuchsia-400 opacity-30 text-6xl animate-float-slow pointer-events-none" />
      {/* Animated icons */}
      <FaRocket className="absolute left-10 top-10 text-pink-400 opacity-40 text-6xl animate-rocket pointer-events-none" />
      <FaRobot className="absolute right-16 top-20 text-fuchsia-400 opacity-40 text-5xl animate-bounce-slow pointer-events-none" />
      <FaBrain className="absolute left-0 top-1/2 text-indigo-400 opacity-40 text-7xl animate-spin-slow pointer-events-none" />
      <FaMagic className="absolute right-10 bottom-24 text-cyan-400 opacity-40 text-5xl animate-magic pointer-events-none" />
      <PiPlanetFill className="absolute right-32 top-32 text-indigo-400 opacity-60 text-6xl animate-planet pointer-events-none" />
      <FaUserShield className="absolute left-32 bottom-24 text-fuchsia-400 opacity-40 text-5xl animate-float-slow pointer-events-none" />

      <div className="w-full max-w-md bg-[#18182a]/90 rounded-2xl shadow-2xl p-8 border border-violet-700 z-10 relative">
        <div className="flex mb-8">
          <button
            className={`flex-1 py-2 font-bold rounded-l-xl transition-all duration-300 ${mode === "login" ? "bg-violet-600 text-white scale-105 shadow-lg" : "bg-[#18182a] text-violet-300 hover:scale-105 hover:shadow-lg"}`}
            onClick={() => setMode("login")}
            style={{ position: "relative" }}
          >
            <span className="inline-flex items-center gap-2">
              <FaUserShield className="text-violet-300 animate-float-slow" /> Login
            </span>
          </button>
          <button
            className={`flex-1 py-2 font-bold rounded-r-xl transition-all duration-300 ${mode === "register" ? "bg-fuchsia-600 text-white scale-105 shadow-lg" : "bg-[#18182a] text-fuchsia-300 hover:scale-105 hover:shadow-lg"}`}
            onClick={() => setMode("register")}
            style={{ position: "relative" }}
          >
            <span className="inline-flex items-center gap-2">
              <FaRobot className="text-fuchsia-300 animate-bounce-slow" /> Register
            </span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="px-4 py-3 rounded-lg bg-[#18182a] text-slate-100 border border-violet-400"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-lg bg-[#18182a] text-slate-100 border border-violet-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {mode === "register" && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="px-4 py-3 rounded-lg bg-[#18182a] text-slate-100 border border-fuchsia-400"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <button
            type="submit"
            className="mt-4 px-8 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <FaMagic className="animate-magic text-cyan-300" /> Please wait...
              </span>
            ) : mode === "login" ? (
              <span className="inline-flex items-center gap-2">
                <FaUserShield className="text-violet-300 animate-float-slow" /> Login
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <FaRobot className="text-fuchsia-300 animate-bounce-slow" /> Register
              </span>
            )}
          </button>
        </form>
        {msg && <div className="mt-4 text-center text-fuchsia-400 font-semibold">{msg}</div>}
        <div className="mt-6 text-center text-xs text-slate-400">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="underline text-violet-400 transition-all duration-300 hover:scale-110"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes glow {
          0%,100% { opacity: 0.7; filter: blur(40px); }
          50% { opacity: 1; filter: blur(80px); }
        }
        .animate-glow {
          animation: glow 4s ease-in-out infinite;
        }
        @keyframes glow2 {
          0%,100% { opacity: 0.5; filter: blur(30px); }
          50% { opacity: 0.8; filter: blur(60px); }
        }
        .animate-glow2 {
          animation: glow2 5s ease-in-out infinite;
        }
        @keyframes glow3 {
          0%,100% { opacity: 0.6; filter: blur(50px); }
          50% { opacity: 0.9; filter: blur(100px); }
        }
        .animate-glow3 {
          animation: glow3 6s ease-in-out infinite;
        }
        @keyframes glowblob {
          0% { filter: blur(120px); opacity: 0.3; }
          50% { filter: blur(180px); opacity: 0.7; }
          100% { filter: blur(120px); opacity: 0.3; }
        }
        .animate-glowblob {
          animation: glowblob 7s ease-in-out infinite;
        }
        @keyframes lock-open {
          0% { transform: scale(1) rotate(0deg); opacity: 1; }
          40% { transform: scale(1.2) rotate(-10deg); opacity: 1; }
          60% { transform: scale(1.2) rotate(10deg); opacity: 1; }
          80% { transform: scale(1.1) rotate(0deg); opacity: 1; }
          100% { transform: scale(1.1) rotate(0deg); opacity: 0.2; }
        }
        .animate-lock-open {
          animation: lock-open 1.5s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
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
          50% { transform: translateY(-12px); }
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