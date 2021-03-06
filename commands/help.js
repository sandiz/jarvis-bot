async function help(client, message, command, args) {
    message.channel.send({
        embed: {
            title: "Help",
            color: 16571785,
            description: "\n------------------------------------------------------------------------------------------------",
            fields: [
                {
                    name: "Add Score",
                    value: "/j add `@role` `points`: add points to role "
                },
                {
                    name: "Add Score",
                    value: "/j add +30,+20,-5: bulk add scores for all teams "
                },
                {
                    name: "Reset Score",
                    value: "/j reset `@role` : reset points to 0 "
                },
                {
                    name: "Current Score",
                    value: "/j score : displays total score and breakdown"
                },
                {

                    name: "\u200B",
                    value: "\u200B"
                },
                {
                    name: "Current Standings",
                    value: "/j fullscore `or` /j fs "
                },

                {
                    name: "Init scores from tally.json",
                    value: "/j init "
                },
                {
                    name: "Declare Winners",
                    value: "/j finalize "
                }
            ]
        }
    });
}
exports.run = help;