const fs = require('fs');
async function finalize(client, message, command, args) {
    delete require.cache[require.resolve(`../tally.json`)];
    var tally = require("../tally.json");
    //print score
    let allowedRole = message.guild.roles.find("name", tally.qm_role);
    if (!message.member.roles.has(allowedRole.id)) {
        message.reply("Only QuizMaster can invoke score commands");
        return;
    }
    require("./score.js").run(client, message, "score", []);

    var max = 1;
    for (var key in tally.scores) {
        val = tally.scores[key];
        if (val.score > max)
            max = val.score;
    }
    winners = [];
    for (var key in tally.scores) {
        val = tally.scores[key];
        if (val.score == max) {
            winners.push(key);
            tally.scores[key].wins += 1;
        }
        tally.scores[key].score = 0;
        tally.scores[key].history = [];
    }
    //print winner
    //find highest score and increment win
    if (winners.length > 0) {
        maxscore = max;
        message.channel.send({
            embed: {
                title: "WINNERS!!!",
                color: 14790951,
                image: {
                    url: "https://media.giphy.com/media/l3q2Z6S6n38zjPswo/giphy.gif"
                },
                fields: [
                    {
                        name: ":star::star::star::star::star::star::star::star::star::star::star::star::star:\n",
                        value: `\n\n\n\t**${winners.join(" | ")} - ${maxscore}**\n:star::star::star::star::star::star::star::star::star::star::star::star::star:`
                    }
                ]
            }
        });
    }
    fs.writeFile('./tally.json', JSON.stringify(tally, null, 4), 'utf8', (err) => {
        require("./init.js").initTeams(client);
        require("./score.js").run(client, message, "fs", []);
    });
}
exports.run = finalize;