import GuessCard from "./GuessCard";

export default function GuessList({ guesses, answer, maxGuesses = 10 }) {
    return (
        <div className="w-full max-w-lg mx-auto mt-4">
            {/* Guess Counter Indicator */}
            <div className="text-right text-slate-400 font-semibold text-sm mb-3 px-1">
                Guess {guesses.length} of {maxGuesses}
            </div>

            {/* Stack of Cards (Most recent guess on top) */}
            <div className="space-y-4">
                {guesses.map((player) => (
                    <GuessCard
                        key={player.id}
                        player={player}
                        answer={answer}
                    />
                ))}
            </div>
        </div>
    );
}