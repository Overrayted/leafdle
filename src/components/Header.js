export default function Header() {
    return (
      <header className="flex flex-col items-center justify-center my-8">
        <div className="flex items-center justify-center gap-3">
          <img
            src="https://assets.nhle.com/logos/nhl/svg/TOR_light.svg"
            alt="Toronto Maple Leafs Logo"
            className="w-20 h-20 sm:w-28 sm:h-28 filter drop-shadow-[0_0_15px_rgba(255,255,255,1)] drop-shadow-[0_0_30px_rgba(255,255,255,1)] transition-transform duration-300 hover:scale-105"
          />
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white uppercase italic drop-shadow-md">
            -DLE
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-blue-200/90 font-medium tracking-widest uppercase mt-3 text-center">
          The Daily Maple Leafs Player Guessing Game
        </p>
      </header>
    );
  }