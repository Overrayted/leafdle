export default function GuessRow({ player }) {
    return (
        <tr>
            <td>{player.name}</td>
            <td>{player.position}</td>
            <td>{player.draftTeam}</td>
            <td>{player.draftYear}</td>
            <td>{player.currentTeam}</td>
            <td>{player.status}</td>
            <td>{player.number}</td>
        </tr>
    );
}