import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import GuessTable from "../components/GuessTable";

import guesses from "../data/players";

export default function Home() {
    return (
        <main>
            <Header />

            <SearchBar />

            <GuessTable guesses={guesses} />
        </main>
    );
}