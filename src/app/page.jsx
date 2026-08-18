"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import GuessList from "../components/GuessList";
import EndGameModal from "../components/EndGameModal";
import CompareGuess from "../lib/CompareGuess";
import { getDailyPlayer } from "../lib/getDailyPlayer";
import players from "../data/players.json";

export default function Home() {
  const MAX_GUESSES = 6;

  const [answer, setAnswer] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [filterStrict, setFilterStrict] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const [matchedTraits, setMatchedTraits] = useState({
    position: null,
    draftTeam: null,
    draftYear: null,
    currentTeam: null,
    isActive: null,
    jerseyNumber: null,
    nationality: null,
  });

  useEffect(() => {
    const selectedAnswer = getDailyPlayer();
    setAnswer(selectedAnswer);
  }, []);

  function addGuess(guessedPlayer) {
    if (isGameOver || guesses.some((g) => g.id === guessedPlayer.id)) return;

    const newGuesses = [guessedPlayer, ...guesses];
    setGuesses(newGuesses);

    // 1. Check Win condition
    if (guessedPlayer.id === answer.id) {
      setIsWon(true);
      setIsGameOver(true);
      return;
    }

    // 2. Check Loss condition (6 max guesses limit)
    if (newGuesses.length >= MAX_GUESSES) {
      setIsWon(false);
      setIsGameOver(true);
      return;
    }

    // Update trait match state
    const comparison = CompareGuess(guessedPlayer, answer);
    setMatchedTraits((prev) => ({
      position: comparison.position === "correct" ? answer.position : prev.position,
      draftTeam: comparison.draftTeam === "correct" ? answer.draftTeam : prev.draftTeam,
      draftYear: comparison.draftYear === "correct" ? answer.draftYear : prev.draftYear,
      currentTeam: comparison.currentTeam === "correct" ? answer.currentTeam : prev.currentTeam,
      isActive: comparison.isActive === "correct" ? answer.isActive : prev.isActive,
      jerseyNumber: comparison.number === "correct" ? answer.jerseyNumber : prev.jerseyNumber,
      nationality: comparison.nationality === "correct" ? answer.nationality : prev.nationality,
    }));
  }

  const processedPlayers = players.map((player) => {
    let matchesAllTraits = true;
    if (matchedTraits.position && player.position !== matchedTraits.position) matchesAllTraits = false;
    if (matchedTraits.draftTeam && player.draftTeam !== matchedTraits.draftTeam) matchesAllTraits = false;
    if (matchedTraits.draftYear && player.draftYear !== matchedTraits.draftYear) matchesAllTraits = false;
    if (matchedTraits.currentTeam && player.currentTeam !== matchedTraits.currentTeam) matchesAllTraits = false;
    if (matchedTraits.isActive !== null && matchedTraits.isActive !== undefined && player.isActive !== matchedTraits.isActive) matchesAllTraits = false;
    if (matchedTraits.jerseyNumber && player.jerseyNumber !== matchedTraits.jerseyNumber) matchesAllTraits = false;
    if (matchedTraits.nationality && player.nationality !== matchedTraits.nationality) matchesAllTraits = false;

    return { ...player, isHighlighted: matchesAllTraits };
  });

  if (!answer) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#00102e] via-[#00205B] to-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <Header />

        {/* Search Input Bar */}
        <SearchBar
          players={processedPlayers}
          onSelect={addGuess}
          disabled={isGameOver}
          filterStrict={filterStrict}
          setFilterStrict={setFilterStrict}
        />

        {/* Guess List */}
        <GuessList guesses={guesses} answer={answer} maxGuesses={MAX_GUESSES} />

        {/* End Game Modal */}
        {isGameOver && (
          <EndGameModal
            isWon={isWon}
            answer={answer}
            guesses={guesses}
          />
        )}
      </div>
    </main>
  );
}