// Load up the discord.js library
const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');
// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();
// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.
function validate(command) {
    if (config.commands[command] == null) {
        var lpath = path.join(__dirname, `./commands/${command}.js`);
        try {
            fs.accessSync(lpath, fs.constants.F_OK);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    else
        return true;
    return false;
}
async function handleMessage(message) {
    //console.log(message);
    // This event will run on every single message received, from any channel or DM.

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if (message.content.indexOf(config.prefix) !== 0) return;

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (!validate(command)) {
        message.channel.send("invalid command: " + command);
        return;
    }
    //console.log(message);
    //console.log("command: " + command + " | argsize: " + args.length);
    // Let's go with a few common example commands! Feel free to delete or change those.
    try {
        if (config.commands[command] != null) {
            let commandFile = require(`./commands/${config.commands[command]}`);
            await commandFile.run(client, message, command, args);
        }
        else {
            let commandFile = require(`./commands/${command}.js`);
            await commandFile.run(client, message, command, args);
        }
    } catch (err) {
        console.error(err);
    }
}
client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    //client.user.setActivity(`Serving ${client.guilds.size} servers`);
    client.user.setActivity('Mind Games', { type: 'PLAYING' })
        .catch(console.error);
    require("./commands/init.js").initTeams(client);
});
client.on("channelCreate", (channel) => {
    require("./commands/init.js").initTeams(client);
});
client.on("channelDelete", (channel) => {
    require("./commands/init.js").initTeams(client);
});
client.on("message", async message => {
    handleMessage(message);
});
client.on("messageUpdate", async (omsg, nmsg) => {
    handleMessage(nmsg);
});
client.login(config.token);
    // +j qm -> quiz master queue
    // +j qm push/pop -> add/remove


    // +j screenshare

    // +j as FightClub -15 -> add/remove score -- DONE
    // +j rs -- DONE
    // +j init -- DONE
    // +j finalize -- DONE
    // +j score | fs -- DONE