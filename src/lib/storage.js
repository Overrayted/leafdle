// Saves progress in cookies so a game can be picked up after leaving the page.
// Each mode's game is stored separately and only restored on the same day.

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function readCookie(name) {
  const entry = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  if (!entry) return null;
  try {
    return JSON.parse(decodeURIComponent(entry.slice(name.length + 1)));
  } catch {
    return null;
  }
}

function writeCookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; max-age=${MAX_AGE}; path=/; SameSite=Lax`;
}

export function loadPrefs() {
  return readCookie("leafdle_prefs");
}

export function savePrefs(prefs) {
  writeCookie("leafdle_prefs", prefs);
}

// Returns { guessIds, modalClosed } for today's game, or null if there isn't one
export function loadGame(mode, today) {
  const saved = readCookie(`leafdle_${mode}`);
  if (!saved || saved.date !== today || !Array.isArray(saved.guessIds)) return null;
  return saved;
}

export function saveGame(mode, today, { guessIds, modalClosed }) {
  writeCookie(`leafdle_${mode}`, { date: today, guessIds, modalClosed });
}
