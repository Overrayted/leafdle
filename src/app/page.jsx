"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import ModeSelector from "../components/ModeSelector";
import SearchBar from "../components/SearchBar";
import GuessCard from "../components/GuessCard";
import EndGameModal from "../components/EndGameModal";
import { MAX_GUESSES, MODES, getTraits, getDailyPlayer, compareGuess } from "../lib/game";

export default function Home() {
  const [mode, setMode] = useState("leafs");
  const [answer, setAnswer] = useState(null);
  const [guesses, setGuesses] = useState([]); // newest guess first
  const [filterStrict, setFilterStrict] = useState(false);
  const [showModal, setShowModal] = useState(true);

  // The daily player depends on the visitor's date, so pick it in the browser
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the server build doesn't know today's date
    setAnswer(getDailyPlayer("leafs"));
  }, []);

  if (!answer) return null;

  const isWon = guesses.some((g) => g.id === answer.id);
  const isGameOver = isWon || guesses.length >= MAX_GUESSES;

  function changeMode(newMode) {
    if (newMode === mode) return;
    setMode(newMode);
    setAnswer(getDailyPlayer(newMode));
    setGuesses([]);
    setShowModal(true);
  }

  function addGuess(player) {
    if (isGameOver || guesses.some((g) => g.id === player.id)) return;
    setGuesses([player, ...guesses]);
  }

  // Traits the player has already gotten right (green) on any guess
  const knownTraits = getTraits(mode).filter(({ key }) =>
    guesses.some((g) => compareGuess(g, answer)[key] === "correct")
  );

  // Highlight players in the search list who match every known trait
  const players = MODES[mode].players.map((player) => ({
    ...player,
    isHighlighted: knownTraits.every(({ key }) => player[key] === answer[key]),
  }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#00102e] via-[#00205B] to-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <Header />

        <ModeSelector mode={mode} onChange={changeMode} />

        <SearchBar
          players={players}
          onSelect={addGuess}
          disabled={isGameOver}
          filterStrict={filterStrict}
          setFilterStrict={setFilterStrict}
        />

        <div className="text-right text-blue-200/80 font-semibold text-sm mt-4 mb-3 px-1">
          Guesses: <span className="text-white font-bold">{guesses.length}/{MAX_GUESSES}</span>
        </div>

        <div className="space-y-4">
          {guesses.map((player) => (
            <GuessCard key={player.id} player={player} answer={answer} mode={mode} />
          ))}
        </div>

        {isGameOver && showModal && (
          <EndGameModal
            isWon={isWon}
            answer={answer}
            guesses={guesses}
            mode={mode}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </main>
  );
}
