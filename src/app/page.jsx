"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import ModeSelector from "../components/ModeSelector";
import SearchBar from "../components/SearchBar";
import GuessCard from "../components/GuessCard";
import EndGameModal from "../components/EndGameModal";
import HowToPlayModal from "../components/HowToPlayModal";
import PlayerReveal from "../components/PlayerReveal";
import { MAX_GUESSES, MODES, getDailyPlayer, getTodayKey, fitsClues } from "../lib/game";
import { THEMES } from "../lib/theme";
import { loadPrefs, savePrefs, loadGame, saveGame } from "../lib/storage";

const MODE_KEYS = Object.keys(MODES);

// Rebuilds today's saved game for a mode from its cookie
function restoreGame(mode, today) {
  const saved = loadGame(mode, today);
  if (!saved) return { guesses: [], modalClosed: false };
  const byId = new Map(MODES[mode].players.map((p) => [p.id, p]));
  return {
    guesses: saved.guessIds.map((id) => byId.get(id)).filter(Boolean),
    modalClosed: Boolean(saved.modalClosed),
  };
}

export default function Home() {
  // Everything about the current session. Built in the browser because the
  // daily player depends on the visitor's date and saved cookies.
  const [session, setSession] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const today = getTodayKey();
    const prefs = loadPrefs();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the server build doesn't know today's date or cookies
    setSession({
      today,
      mode: MODES[prefs?.mode] ? prefs.mode : "leafs",
      filterStrict: Boolean(prefs?.filterStrict),
      answers: Object.fromEntries(MODE_KEYS.map((m) => [m, getDailyPlayer(m)])),
      games: Object.fromEntries(MODE_KEYS.map((m) => [m, restoreGame(m, today)])),
    });
  }, []);

  // Save progress whenever anything changes
  useEffect(() => {
    if (!session) return;
    savePrefs({ mode: session.mode, filterStrict: session.filterStrict });
    for (const [m, game] of Object.entries(session.games)) {
      saveGame(m, session.today, {
        guessIds: game.guesses.map((g) => g.id),
        modalClosed: game.modalClosed,
      });
    }
  }, [session]);

  const theme = THEMES[session?.mode ?? "leafs"];

  // Match the area behind the page (e.g. overscroll) to the current theme
  useEffect(() => {
    document.body.style.backgroundColor = theme.bodyBg;
  }, [theme]);

  if (!session) return null;

  const { mode, filterStrict } = session;
  const answer = session.answers[mode];
  const { guesses, modalClosed } = session.games[mode];

  const isWon = guesses.some((g) => g.id === answer.id);
  const isGameOver = isWon || guesses.length >= MAX_GUESSES;

  function updateGame(changes) {
    setSession((s) => ({
      ...s,
      games: { ...s.games, [s.mode]: { ...s.games[s.mode], ...changes } },
    }));
  }

  function changeMode(newMode) {
    setSession((s) => ({ ...s, mode: newMode }));
  }

  function setFilterStrict(value) {
    setSession((s) => ({ ...s, filterStrict: value }));
  }

  function addGuess(player) {
    if (isGameOver || guesses.some((g) => g.id === player.id)) return;
    updateGame({ guesses: [player, ...guesses] });
  }

  // Players already guessed are removed; the rest are marked if they still
  // fit every clue shown so far
  const guessedIds = new Set(guesses.map((g) => g.id));
  const players = MODES[mode].players
    .filter((player) => !guessedIds.has(player.id))
    .map((player) => ({
      ...player,
      isHighlighted: fitsClues(player, guesses, answer, mode),
    }));

  return (
    <main className={`min-h-screen ${theme.page} text-white p-4 sm:p-6 transition-colors`}>
      <div className="max-w-xl mx-auto">
        <Header mode={mode} theme={theme} onHelp={() => setShowHelp(true)} />

        <ModeSelector mode={mode} theme={theme} onChange={changeMode} />

        {isGameOver && modalClosed && (
          <div className={`mb-6 rounded-2xl p-4 border ${theme.card} shadow-xl`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs uppercase font-bold tracking-wider ${theme.accentText}`}>
                {isWon ? "You got today's player!" : "Today's player was"}
              </span>
              <button
                onClick={() => updateGame({ modalClosed: false })}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border ${theme.border} hover:bg-white/10 transition-colors`}
              >
                View Results
              </button>
            </div>
            <PlayerReveal player={answer} theme={theme} />
            <p className={`text-xs mt-3 text-center ${theme.mutedText}`}>
              Come back tomorrow for a new player!
            </p>
          </div>
        )}

        <SearchBar
          players={players}
          onSelect={addGuess}
          disabled={isGameOver}
          hasClues={guesses.length > 0}
          filterStrict={filterStrict}
          setFilterStrict={setFilterStrict}
          theme={theme}
        />

        <div className={`text-right font-semibold text-sm mt-4 mb-3 px-1 ${theme.mutedText}`}>
          Guesses: <span className="text-white font-bold">{guesses.length}/{MAX_GUESSES}</span>
        </div>

        <div className="space-y-4">
          {guesses.map((player) => (
            <GuessCard key={player.id} player={player} answer={answer} mode={mode} theme={theme} />
          ))}
        </div>

        {isGameOver && !modalClosed && (
          <EndGameModal
            isWon={isWon}
            answer={answer}
            guesses={guesses}
            mode={mode}
            theme={theme}
            onClose={() => updateGame({ modalClosed: true })}
          />
        )}

        {showHelp && <HowToPlayModal mode={mode} theme={theme} onClose={() => setShowHelp(false)} />}
      </div>
    </main>
  );
}
