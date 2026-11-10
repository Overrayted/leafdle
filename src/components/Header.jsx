const LOGOS = {
  leafs: {
    src: "https://assets.nhle.com/logos/nhl/svg/TOR_light.svg",
    alt: "Toronto Maple Leafs Logo",
    size: "w-20 h-20 sm:w-28 sm:h-28",
    subtitle: "The Daily Maple Leafs Player Guessing Game",
  },
  active: {
    src: "/nhl-seeklogo-4.svg",
    alt: "NHL Logo",
    size: "h-14 sm:h-20 w-auto",
    subtitle: "The Daily NHL Player Guessing Game",
  },
};

export default function Header({ mode, theme, onHelp }) {
  const logo = LOGOS[mode];

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={onHelp}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${theme.border} ${theme.panel} hover:bg-white/10 transition-colors`}
        >
          <span className="w-4 h-4 rounded-full bg-white text-slate-900 text-[10px] leading-4 text-center font-black">?</span>
          How to Play
        </button>
      </div>

      <header className="flex flex-col items-center justify-center mt-4 mb-8">
        <div className="flex items-center justify-center gap-3">
          <img
            key={mode}
            src={logo.src}
            alt={logo.alt}
            className={`${logo.size} filter drop-shadow-[0_0_15px_rgba(255,255,255,1)] drop-shadow-[0_0_30px_rgba(255,255,255,1)] transition-transform duration-300 hover:scale-105`}
          />
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white uppercase italic drop-shadow-md">
            -DLE
          </h1>
        </div>
        <p className={`text-xs sm:text-sm font-medium tracking-widest uppercase mt-3 text-center ${theme.mutedText}`}>
          {logo.subtitle}
        </p>
      </header>
    </>
  );
}
