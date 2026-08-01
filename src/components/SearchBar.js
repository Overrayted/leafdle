"use client";

import { useState } from "react";

export default function SearchBar({ players, onSelect }) {
    const [search, setSearch] = useState("");

    const filteredPlayers = players.filter((player) =>
        player.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Search NHL player..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
                <div>
                    {filteredPlayers.map((player) => (
                        <button
                            key={player.name}
                            onClick={() => {
                                onSelect(player);
                                setSearch("");
                            }}
                        >
                            {player.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}