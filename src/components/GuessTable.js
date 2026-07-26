import GuessRow from "./GuessRow";

export default function GuessTable({ guesses }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Player</th>
                    <th>Position</th>
                    <th>Draft Team</th>
                    <th>Draft Year</th>
                    <th>Current Team</th>
                    <th>Status</th>
                    <th>#</th>
                </tr>
            </thead>

            <tbody>
                {guesses.map((player) => (
                    <GuessRow
                        key={player.name}
                        player={player}
                    />
                ))}
            </tbody>
        </table>
    );
}