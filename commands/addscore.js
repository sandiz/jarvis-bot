const fs = require('fs');
async function handleMultiScore(client, message, command, args) {
    delete require.cache[require.resolve(`../tally.json`)];
    var tally = require("../tally.json");
    splitargs = args[0].split(",");
    scorestoupdate = [];
    for (var i = 0; i < Object.keys(tally.teams).length; i++) {
        if (splitargs[i] != null)
            scorestoupdate.push(parseInt(splitargs[i]));
        else
            scorestoupdate.push(0);
    }
    console.log("Bulk score update: " + scorestoupdate);
    var count = 0;
    for (var key in tally.teams) {
        var value = tally.teams[key];
        tally.scores[value.name].score += scorestoupdate[count];
        tally.scores[value.name].history.push(scorestoupdate[count]);
        message.channel.send(`${scorestoupdate[count]} to team ${value.name}'s score.`);
        count++;
    }
    fs.writeFile('./tally.json', JSON.stringify(tally, null, 4), 'utf8', (err) => {
        require("./init.js").initTeams(client);
    });
}
async function addScore(client, message, command, args) {
    if (args.length == 1) {
        handleMultiScore(client, message, command, args);
        return;
    }
    if (args.length < 2) {
        message.reply("needs 2 args, @role and points (you can use +/- to add/subtract)");
        return;
    }
    if (message.mentions.roles.size < 1) {
        message.reply("need to mention one role");
        return;
    }
    var points = parseInt(args[args.length - 1]);
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

    for (var key in tally.teams) {
        var value = tally.teams[key];
        if (roles.indexOf(value.name) != -1) {
            tally.scores[value.name].score += points;
            tally.scores[value.name].history.push(points);
        }
        else {
            tally.scores[value.name].history.push(0);
        }
    }
    fs.writeFile('./tally.json', JSON.stringify(tally, null, 4), 'utf8', (err) => {
        require("./init.js").initTeams(client);
        message.channel.send(`${points} to team ${roles.join(', ')}'s score.`);
    });
}
exports.run = addScore;