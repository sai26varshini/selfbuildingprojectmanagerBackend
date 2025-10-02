"use client";
import Link from "next/link";
import { FaRobot, FaComments, FaMagic, FaBrain, FaWindows } from "react-icons/fa";
import { SiOpenai, SiGooglechat, SiAnthropic } from "react-icons/si";
import { PiPlanetFill } from "react-icons/pi";

const tools = [
  {
    name: "ChatGPT",
    icon: <SiOpenai className="text-green-400 w-10 h-10" />,
    url: "https://chat.openai.com/",
    desc: "OpenAI's conversational AI assistant.",
  },
  {
    name: "Gemini",
    icon: <SiGooglechat className="text-blue-400 w-10 h-10" />,
    url: "https://gemini.google.com/",
    desc: "Google's Gemini AI chat and tools.",
  },
  {
    name: "Copilot",
    icon: <FaRobot className="text-violet-400 w-10 h-10" />,
    url: "https://copilot.microsoft.com/",
    desc: "Microsoft's Copilot AI assistant.",
  },
  {
    name: "Claude",
    icon: <SiAnthropic className="text-yellow-400 w-10 h-10" />,
    url: "https://claude.ai/",
    desc: "Anthropic's Claude conversational AI.",
  },
  {
    name: "Bing AI",
    icon: <FaWindows className="text-blue-600 w-10 h-10" />,
    url: "https://www.bing.com/chat",
    desc: "Microsoft Bing AI chat and search.",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b13] via-[#1a1333] to-[#2a0a2a] flex flex-col items-center py-10 px-2 relative overflow-hidden">
      {/* Animated Toys & Planets */}
      <FaMagic className="absolute left-10 top-24 text-cyan-400 opacity-60 text-6xl animate-magic pointer-events-none" />
      <FaBrain className="absolute right-10 bottom-24 text-pink-400 opacity-60 text-6xl animate-spin-slow pointer-events-none" />
      <PiPlanetFill className="absolute right-32 top-32 text-indigo-400 opacity-60 text-6xl animate-planet pointer-events-none" />
      <FaComments className="absolute left-32 bottom-24 text-fuchsia-400 opacity-40 text-5xl animate-float-slow pointer-events-none" />

      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-violet-400 drop-shadow-lg mb-8 animate-fadein flex items-center justify-center">
        <FaRobot className="w-10 h-10 mr-3 text-violet-400 animate-bounce" />
        AI Utilities & Tools
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl w-full mx-auto">
        {tools.map((tool, idx) => (
          <Link
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#18182a]/90 rounded-2xl p-8 shadow-xl border border-violet-700 hover:scale-105 transition-transform duration-300 animate-fadein flex flex-col items-center text-center"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="mb-4">{tool.icon}</div>
            <div className="font-bold text-lg text-violet-200 mb-2">{tool.name}</div>
            <div className="text-slate-300 text-sm mb-2">{tool.desc}</div>
            <span className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 text-white font-semibold shadow hover:brightness-110 transition">
              Visit
            </span>
          </Link>
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
        @keyframes spin-slow {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes magic {
          0%,100% { transform: scale(1) rotate(-10deg);}
          50% { transform: scale(1.2) rotate(10deg);}
        }
        .animate-magic {
          animation: magic 3.5s ease-in-out infinite;
        }
        @keyframes planet {
          0% { transform: rotate(0deg) translateX(0); }
          100% { transform: rotate(360deg) translateX(12px); }
        }
        .animate-planet {
          animation: planet 8s linear infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
        @keyframes bounce {
          0%,100% { transform: translateY(0);}
          50% { transform: translateY(-20px);}
        }
        .animate-bounce {
          animation: bounce 2.5s infinite;
        }
      `}</style>
    </div>
  );
}