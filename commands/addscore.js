const fs = require('fs');
async function addScore(client, message, command, args) {
    //add to tally json
    // init teams
    if (args.length < 2) {
        message.reply("needs 2 args, @role and points (you can use +/- to add/subtract)");
        return;
    }
    if (message.mentions.roles.size != 1) {
        message.reply("need to mention one role");
        return;
    }
    points = parseInt(args[1]);
    role = message.mentions.roles.entries().next().value[1];
    delete require.cache[require.resolve(`../tally.json`)];
    var tally = require("../tally.json");
    var teamname = "";
    for (var key in tally.teams) {
        var value = tally.teams[key];
        if (value.name == role.name)
            teamname = role.name;
    }

    if (teamname == "") {
        message.reply("Team not found in tally")
        return;
    }
    tally.scores[teamname].score += points;
    fs.writeFile('./tally.json', JSON.stringify(tally, null, 4), 'utf8', (err) => {
        require("./init.js").initTeams(client);
        message.channel.send(`${points} to team ${role.name}'s score. New Score: ${tally.scores[teamname].score}`);
    });
}
exports.run = addScore;