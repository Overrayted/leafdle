import leafsPlayers from "../data/leafs_players.json";
import activePlayers from "../data/active_players.json";

export const MAX_GUESSES = 8;

export const MODES = {
  leafs: { label: "Leafs All-Time", shareLabel: "Leafs Mode", players: leafsPlayers },
  active: { label: "Active NHLers", shareLabel: "Active Mode", players: activePlayers },
};

// The clue tiles shown for every guess, in display order.
// `leafsOnly` tiles are hidden in Active mode (everyone there is active).
export const TRAITS = [
  { key: "position", label: "Pos" },
  { key: "draftTeam", label: "Draft Team" },
  { key: "draftYear", label: "Draft Yr" },
  { key: "currentTeam", label: "Team" },
  { key: "division", label: "Division" },
  { key: "isActive", label: "Status", leafsOnly: true },
  { key: "jerseyNumber", label: "Number" },
  { key: "nationality", label: "Nation" },
];

export function getTraits(mode) {
  return TRAITS.filter((trait) => mode === "leafs" || !trait.leafsOnly);
}

// Picks the same player for everyone on a given day. The mode is part of
// the seed so each mode gets its own daily player.
export function getDailyPlayer(mode) {
  const players = MODES[mode].players;
  const today = new Date();
  const seed = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-${mode}`;

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  return players[Math.abs(hash) % players.length];
}

// Compares a guess to the answer. Each trait comes back as one of:
// "correct" (green), "close" / "higher" / "lower" (yellow), or "wrong" (gray).
export function compareGuess(guess, answer) {
  return {
    position: compareExact(guess.position, answer.position),
    draftTeam: compareExact(guess.draftTeam, answer.draftTeam),
    draftYear: compareNumber(guess.draftYear, answer.draftYear),
    currentTeam: compareExact(guess.currentTeam, answer.currentTeam),
    division: compareDivision(guess, answer),
    isActive: compareExact(guess.isActive, answer.isActive),
    jerseyNumber: compareNumber(guess.jerseyNumber, answer.jerseyNumber),
    nationality: compareExact(guess.nationality, answer.nationality),
  };
}

function compareExact(guessValue, answerValue) {
  return guessValue === answerValue ? "correct" : "wrong";
}

function compareNumber(guessValue, answerValue) {
  if (guessValue === answerValue) return "correct";
  // Arrows don't make sense if either side is missing (e.g. undrafted)
  if (guessValue == null || answerValue == null) return "wrong";
  return guessValue < answerValue ? "higher" : "lower";
}

// Green for the same division, yellow for the same conference
function compareDivision(guess, answer) {
  if (guess.division === answer.division) return "correct";
  if (guess.conference && guess.conference === answer.conference) return "close";
  return "wrong";
}
