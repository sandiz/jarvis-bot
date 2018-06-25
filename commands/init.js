const Discord = require("discord.js");

function initTeams(client) {
    delete require.cache[require.resolve(`../tally.json`)];
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
                channel.setName(teamName + ` - Score: ${score} Wins: ${wins} `, "score-update")
                    .catch(console.error);
                console.log(`Team ${channel.name} with ID: ${id} Wins: ${wins} and Score: ${score}`);
            }
        }
        else if (channel instanceof Discord.GuildChannel) {
            if (channel.name == "general") {
                qm = tally.quizmasters.join(", ");
                channel.setTopic(`Next QuizMasters: [${qm}]`);
            }
        }
    });
    console.log("Total Teams: " + Object.keys(tally.teams).length);
}
async function init(client, message, command, args) {
    if (command == "init") {
        initTeams(client);
        require("./score.js").run(client, message, "fs", []);
    }
}
exports.run = init;
exports.initTeams = initTeams;