"use client";

import { useState } from "react";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import GuessTable from "../components/GuessTable";

import players from "../data/players";

export default function Home() {

    const [guesses, setGuesses] = useState([]);

    function addGuess(player) {
        setGuesses([...guesses, player]);
    }

    return (
        <main>
            <Header />

            <SearchBar
                players={players}
                onSelect={addGuess}
            />

            <GuessTable guesses={guesses} />
        </main>
    );
}