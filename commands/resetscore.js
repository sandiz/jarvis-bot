const fs = require('fs');
async function resetScore(client, message, command, args) {
    //add to tally json
    // init teams
    if (args.length < 1) {
        message.reply("needs 1 arg, the @role to reset");
        return;
    }
    if (message.mentions.roles.size < 1) {
        message.reply("need to mention one role");
        return;
    }
    entries = message.mentions.roles.entries();
    roles = [];
    for (let [k, v] of entries) {
        roles.push(v.name);
    }
    delete require.cache[require.resolve(`../tally.json`)];
    var tally = require("../tally.json");

    let allowedRole = message.guild.roles.find("name", tally.qm_role);
    if (!message.member.roles.has(allowedRole.id)) {
        message.reply("Only QuizMaster can invoke score commands");
        return;
    }
    var teamname = "";
    for (var key in tally.teams) {
        var value = tally.teams[key];
        if (roles.indexOf(value.name) != -1) {
            tally.scores[value.name].score = 0;
            tally.scores[value.name].history = [];
        }
    }


    fs.writeFile('./tally.json', JSON.stringify(tally, null, 4), 'utf8', (err) => {
        require("./init.js").initTeams(client);
        message.channel.send(`Reset team ${roles.join(" ")}'s score to 0.`);
    });
}
exports.run = resetScore;