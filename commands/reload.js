async function reload(client, message, command, args) {
    var isMyObjectEmpty = !Object.keys(args).length;
    if (!args || args.size < 1 || isMyObjectEmpty) return message.reply("Must provide a command name to reload.");
    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`./${args[0]}.js`)];
    message.reply(`The command ${args[0]} has been reloaded`);
}
exports.run = reload;