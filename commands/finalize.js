const fs = require('fs');
async function finalize(client, message, command, args) {
    //add to tally json
    // init teams
    var tally = require("../tally.json");

    let allowedRole = message.guild.roles.find("name", tally.qm_role);
    if (!message.member.roles.has(allowedRole.id)) {
        message.reply("Only QuizMaster can invoke score commands");
        return;
    }
    //find highest score and increment win

    //display score using score plugin
    fs.writeFile('./tally.json', JSON.stringify(tally, null, 4), 'utf8', (err) => {
        require("./init.js").initTeams(client);
        message.channel.send(`Team ${role.name} wins! ${tally.scores[teamname].score}`);
    });
}
exports.run = finalize;