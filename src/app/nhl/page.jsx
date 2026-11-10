import Game from "../../components/Game";

export const metadata = {
  title: "NHLdle | The Daily NHL Player Guessing Game",
  description: "Guess today's mystery active NHL player on Leafdle.ca!",
};

export default function NhlPage() {
  return <Game initialMode="active" />;
}
