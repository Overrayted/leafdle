import players from "../data/players.json";

export function getDailyPlayer(overrideId = null) {
  if (overrideId) {
    const found = players.find((p) => p.id === Number(overrideId));
    if (found) return found;
  }

  // Generate deterministic index based on today's date
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % players.length;
  return players[index];
}