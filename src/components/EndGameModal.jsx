"use client";

import { useState } from "react";
import { MAX_GUESSES, MODES, getTraits, compareGuess } from "../lib/game";
import PlayerReveal from "./PlayerReveal";

const SHARE_SQUARES = { correct: "🟩", close: "🟨", higher: "🟨", lower: "🟨", wrong: "⬛" };

export default function EndGameModal({ isWon, answer, guesses, mode, theme, onClose }) {
  const [copied, setCopied] = useState(false);

  function getShareText() {
    const score = isWon ? `${guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
    const title = `${MODES[mode].shareTitle} ${new Date().toLocaleDateString()} ${score}`;

    // One row of squares per guess, oldest first
    const grid = [...guesses]
      .reverse()
      .map((guess) => {
        const result = compareGuess(guess, answer);
        return getTraits(mode).map(({ key }) => SHARE_SQUARES[result[key]]).join("");
      })
      .join("\n");

    return `${title}\n\n${grid}\n\nPlay at ${MODES[mode].shareUrl}`;
  }

  function handleCopy() {
    navigator.clipboard.writeText(getShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className={`${theme.modal} border w-full max-w-md rounded-3xl p-6 shadow-2xl text-center text-white relative`}>
        <div className="text-4xl mb-2">{isWon ? "🏒 🎉" : "❌ 💔"}</div>
        <h2 className="text-3xl font-extrabold tracking-tight mb-1">
          {isWon ? "You Got It!" : "Game Over"}
        </h2>
        <p className={`${theme.modalText} text-sm mb-6`}>
          {isWon
            ? `Guessed in ${guesses.length}/${MAX_GUESSES} tries!`
            : `You ran out of guesses (0/${MAX_GUESSES}).`}
        </p>

        {/* Revealed Player Card with Full Stats */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-white/10 mb-6 text-left">
          <div className={`text-xs uppercase font-bold tracking-wider mb-2 ${theme.accentText}`}>Target Player</div>
          <PlayerReveal player={answer} theme={theme} />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className={`flex-1 bg-white ${theme.primaryButtonText} font-bold py-3 rounded-xl hover:bg-slate-100 transition-all shadow-lg active:scale-95`}
          >
            {copied ? "Copied to Clipboard!" : "Share Result 📋"}
          </button>
          <button
            onClick={onClose}
            className="px-5 border border-white/30 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
