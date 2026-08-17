import GuessCard from "./GuessCard";

export default function GuessList({ guesses, answer }) {
  return (
    <div className="w-full max-w-lg mx-auto mt-4">
      {/* Dynamic Guess Counter without limit cap */}
      <div className="text-right text-blue-200/80 font-semibold text-sm mb-3 px-1">
        Guesses: <span className="text-white font-bold">{guesses.length}</span>
      </div>

      {/* Stack of Cards */}
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