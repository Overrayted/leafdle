# Leafdle

A daily guessing game to help learn Toronto Maple Leafs history. Play at [leafdle.ca](https://leafdle.ca).

There are two modes, each with its own daily player:
- **Leafs All-Time**: every player who has ever played for Toronto
- **Active NHLers**: every player on a current NHL roster

## Project layout

```
scripts/fetch_players.py    Downloads player data from the NHL API
src/data/                   The player lists the game uses (made by the script)
src/lib/game.js             Game rules: daily player, comparing guesses, modes
src/app/page.jsx            The main page and game state
src/components/             UI pieces (header, mode toggle, search, guess card, end modal)
.github/workflows/deploy.yml  Builds and deploys to GitHub Pages
```

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Updating player data

The deploy workflow refreshes the data automatically every night. To do it by hand:

```bash
pip install requests
python scripts/fetch_players.py
```
