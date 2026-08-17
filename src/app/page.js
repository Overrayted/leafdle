"use client";

import { useState } from "react";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import GuessList from "../components/GuessList"; // Swapped from GuessTable
import CompareGuess from "../lib/CompareGuess";

import players from "../data/players";

export default function Home() {
    // Default testing ID: Auston Matthews (8478402)
    const [targetId, setTargetId] = useState(8478402);
    const [guesses, setGuesses] = useState([]);

    // Track accumulated correct clues to highlight matching search results
    const [matchedTraits, setMatchedTraits] = useState({
        position: null,
        draftTeam: null,
        draftYear: null,
        currentTeam: null,
        isActive: null,
        jerseyNumber: null,
        nationality: null,
    });

    // Find the secret target player from players data based on targetId
    const answer = players.find((p) => p.id === Number(targetId)) || {
        id: 8478402,
        name: "Auston Matthews",
        position: "C",
        draftTeam: "TOR",
        draftYear: 2016,
        currentTeam: "TOR",
        isActive: true,
        jerseyNumber: 34,
        nationality: "USA",
    };

    function addGuess(guessedPlayer) {
        // Prevent duplicate guesses or guessing beyond limit
        if (
            guesses.some((g) => g.id === guessedPlayer.id) ||
            guesses.length >= 10
        ) {
            return;
        }

        // Compare new guess against target answer
        const comparison = CompareGuess(guessedPlayer, answer);

        // Update matched traits whenever a trait returns exact "correct"
        setMatchedTraits((prev) => ({
            position:
                comparison.position === "correct"
                    ? answer.position
                    : prev.position,
            draftTeam:
                comparison.draftTeam === "correct"
                    ? answer.draftTeam
                    : prev.draftTeam,
            draftYear:
                comparison.draftYear === "correct"
                    ? answer.draftYear
                    : prev.draftYear,
            currentTeam:
                comparison.currentTeam === "correct"
                    ? answer.currentTeam
                    : prev.currentTeam,
            isActive:
                comparison.isActive === "correct"
                    ? answer.isActive
                    : prev.isActive,
            jerseyNumber:
                comparison.number === "correct"
                    ? answer.jerseyNumber
                    : prev.jerseyNumber,
            nationality:
                comparison.nationality === "correct"
                    ? answer.nationality
                    : prev.nationality,
        }));

        setGuesses((prev) => [guessedPlayer, ...prev]);
    }

    // Evaluate all players to mark who matches all current clues
    const processedPlayers = players.map((player) => {
        let matchesAllTraits = true;

        if (
            matchedTraits.position &&
            player.position !== matchedTraits.position
        )
            matchesAllTraits = false;
        if (
            matchedTraits.draftTeam &&
            player.draftTeam !== matchedTraits.draftTeam
        )
            matchesAllTraits = false;
        if (
            matchedTraits.draftYear &&
            player.draftYear !== matchedTraits.draftYear
        )
            matchesAllTraits = false;
        if (
            matchedTraits.currentTeam &&
            player.currentTeam !== matchedTraits.currentTeam
        )
            matchesAllTraits = false;
        if (
            matchedTraits.isActive !== null &&
            matchedTraits.isActive !== undefined &&
            player.isActive !== matchedTraits.isActive
        )
            matchesAllTraits = false;
        if (
            matchedTraits.jerseyNumber &&
            player.jerseyNumber !== matchedTraits.jerseyNumber
        )
            matchesAllTraits = false;
        if (
            matchedTraits.nationality &&
            player.nationality !== matchedTraits.nationality
        )
            matchesAllTraits = false;

        return {
            ...player,
            isHighlighted: matchesAllTraits,
        };
    });

    const resetGame = () => {
        setGuesses([]);
        setMatchedTraits({
            position: null,
            draftTeam: null,
            draftYear: null,
            currentTeam: null,
            isActive: null,
            jerseyNumber: null,
            nationality: null,
        });
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 max-w-3xl mx-auto">
            <Header />

            {/* --- Testing Control Panel --- */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm">
                    <span className="text-slate-400">Current Target: </span>
                    <strong className="text-emerald-400 font-semibold">{answer.name}</strong>{" "}
                    <span className="text-xs text-slate-500">(ID: {answer.id})</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label
                        htmlFor="test-id"
                        className="text-xs text-slate-400 whitespace-nowrap"
                    >
                        Test Player ID:
                    </label>
                    <input
                        id="test-id"
                        type="number"
                        value={targetId}
                        onChange={(e) => {
                            setTargetId(e.target.value);
                            resetGame();
                        }}
                        className="bg-slate-800 border border-slate-700 text-white text-sm px-3 py-1.5 rounded-xl w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g. 8478402"
                    />
                </div>
            </div>

            {/* Search Input Bar */}
            <SearchBar
                players={processedPlayers}
                onSelect={addGuess}
            />

            {/* Card-based Guess Stack */}
            <GuessList
                guesses={guesses}
                answer={answer}
                maxGuesses={10}
            />
        </main>
    );
}