import axios from "axios";
import fs from "fs/promises";

const NHL_API = "https://api-web.nhle.com/v1";


async function getLeafsRoster(year) {
    const url = `${NHL_API}/roster/tor/2025`;

    const response = await axios.get(url);

    return [
        ...response.data.forwards,
        ...response.data.defensemen,
        ...response.data.goalies
    ];
}


async function getPlayerInfo(playerId) {

    const url = `${NHL_API}/player/${playerId}/landing`;

    const response = await axios.get(url);

    return response.data;
}


function calculateLeafsSeasons(player) {

    if (!player.teamRecords) {
        return null;
    }

    const leafsYears = player.teamRecords
        .filter(team => team.teamName === "Toronto Maple Leafs")
        .map(team => team.season);

    return leafsYears;
}


async function buildPlayers() {

    console.log("Fetching Leafs roster...");

    const roster = await getLeafsRoster();


    const players = [];


    for (const player of roster) {

        console.log(`Processing ${player.firstName.default} ${player.lastName.default}`);


        const info = await getPlayerInfo(player.id);


        const seasonsPlayed = calculateLeafsSeasons(info);


        players.push({

            id: player.id,

            name:
                `${player.firstName.default} ${player.lastName.default}`,

            position:
                player.position,

            draftTeam:
                info.draftDetails?.teamName ?? null,

            draftYear:
                info.draftDetails?.year ?? null,

            seasonsPlayed:
                seasonsPlayed,

            currentTeam:
                info.currentTeam?.name ?? "Retired",

            isActive:
                info.isActive,

            jerseyNumber:
                info.sweaterNumber

        });


    }


    await fs.writeFile(
        "./public/players.json",
        JSON.stringify(players, null, 2)
    );


    console.log(
        `Finished. Saved ${players.length} players`
    );

}


buildPlayers();