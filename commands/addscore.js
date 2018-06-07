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
    //check if role.name exists in team
    //delete json cache
    //open json file
    //modify score
    //savejson file
    message.channel.send(`Added ${points} to team ${role.name}'s score.`);
}
exports.run = addScore;