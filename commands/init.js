const Discord = require("discord.js");

var teams = new Discord.Collection();
function initTeams(client) {
    delete require.cache[require.resolve(`../config.json`)];
    delete require.cache[require.resolve(`../tally.json`)];
    const config = require("../config.json");
    const tally = require("../tally.json");
    client.channels.forEach((channel, id) => {
        if (channel instanceof Discord.CategoryChannel) {
            if (!channel.name.toLowerCase().includes("channels")) {

                if (tally.teams[id] == null) {
                    console.log(`channel id: ${id} has no teams assigned`);
                    return;
                }
                var score = 0;
                var wins = 0;
                var teamName = tally.teams[id].name;
                if (tally.scores[teamName] == null) {
                    console.log("No scores/wins for " + teamName);
                }
                else {
                    score = tally.scores[teamName].score;
                    wins = tally.scores[teamName].wins;
                }
                teams.set(teamName, { id: id, score: score, wins: wins });
                channel.setName(teamName + ` - Score: ${score} Wins: ${wins} `, "score-update")
                    .catch(console.error);
                console.log(`Team ${channel.name} with ID: ${id} Wins: ${score} and Score: ${wins}`);
            }
        }
    });
    console.log("Total Teams: " + teams.size);
}
async function init(client, message, command, args) {
    if (command == "init") {
        initTeams();
        var teamInfo = "";

        teams.forEach((val, key, map) => {
            teamInfo += `Team ${key} \n\tCurrent Score: ${val.score}\n\tTotal Wins:${val.wins}\n\n`;
        });
        message.channel.send({
            embed: {
                title: "Team Scores",
                description: "```" + `${teamInfo}` + "```",
                color: 14955080,
                timestamp: new Date()
            }
        });
    }
}
exports.run = init;
exports.initTeams = initTeams;
exports.teams = teams;