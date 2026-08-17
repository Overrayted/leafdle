"use client";

import { useState } from "react";

export default function EndGameModal({ isWon, answer, guesses, onReset }) {
  const [copied, setCopied] = useState(false);
  const MAX_GUESSES = 6;

  const generateShareText = () => {
    const scoreText = isWon ? `${guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
    const title = `Leafdle.ca ${new Date().toLocaleDateString()} ${scoreText}\n\n`;
    
    // Generates share grid
    const grid = guesses.map(() => "🟦⬜🟦").join("\n");

    return `${title}${grid}\n\nPlay at https://leafdle.ca`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#00205B] border border-blue-400/30 w-full max-w-md rounded-3xl p-6 shadow-2xl text-center text-white relative">
        <div className="text-4xl mb-2">{isWon ? "🏒 🎉" : "❌ 💔"}</div>
        <h2 className="text-3xl font-extrabold tracking-tight mb-1">
          {isWon ? "You Got It!" : "Game Over"}
        </h2>
        <p className="text-blue-200 text-sm mb-6">
          {isWon
            ? `Guessed in ${guesses.length}/${MAX_GUESSES} tries!`
            : `You ran out of guesses (0/${MAX_GUESSES}).`}
        </p>

        {/* Revealed Player Card */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-blue-500/30 mb-6 flex items-center gap-4 text-left">
          <img
            src={answer.headshot}
            alt={answer.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 bg-slate-800"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://assets.nhle.com/mrtc/images/player/headshots/current/160x160/skater.png";
            }}
          />
          <div>
            <div className="text-xs uppercase text-blue-400 font-bold tracking-wider">
              Target Player
            </div>
            <div className="text-xl font-bold">{answer.name}</div>
            <div className="text-xs text-slate-400">
              #{answer.jerseyNumber || "N/A"} • {answer.position} • {answer.draftYear}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-white text-[#00205B] font-bold py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg active:scale-95"
          >
            {copied ? "Copied to Clipboard!" : "Share Result 📋"}
          </button>
        </div>
      </div>
    </div>
  );
}