const fs = require('fs');
async function score(client, message, command, args) {
    //add to tally json
    delete require.cache[require.resolve(`../tally.json`)];
    var tally = require("../tally.json");

    var leaders = [];
    if (command == "score") {
        var totalJson = "";
        for (var key in tally.scores) {
            val = tally.scores[key];
            total = val.score;
            parts = val.history.join(" + ");
            totalJson += `${key} \n\n\t${parts} = ${total}\n\n`;
            leaders.push({ score: total, key: key });
        }
        message.channel.send({
            embed: {
                title: "Team Scores",
                description: "```" + totalJson + "```",
                color: 14955080
            }
        });
    }
    else if (command == "fullscore" || command == "fs") {
        var totalJson = "";
        for (var key in tally.scores) {
            val = tally.scores[key];
            win = val.wins;
            totalJson += `${key} - ${win}\n\n`;
        }
        message.channel.send({
            embed: {
                title: "Current Standings",
                description: "```" + totalJson + "```",
                color: 14955080
            }
        });
    }

}
exports.run = score;