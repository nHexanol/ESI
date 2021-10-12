const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    names: ["ls"],
    func: function ls(client, message, world, ...args) {
        const playerls = new Discord.MessageEmbed()

		playerls.setColor('#009eff')

        // Need to fix this!
	    if (!world) return message.channel.send(`Usage : \`${prefix}ls (world)\``);

	    // if (isNaN(args[0])) return message.channel.send("Argument must contain number.");

        var output = "";
        var playerCounter = 0;
	    var input = "WC" + world;

        fetch('https://api.wynncraft.com/public_api.php?action=onlinePlayers')
        .then(res => res.json())
        .then(function (json) {
            if(!json[input]) return message.channel.send("That world doesn't exist. (According to wynncraft api)")
            inputFormatted = json[input];
            for (const m in inputFormatted) {
                inputFormatted = json[input];	output = output.concat(`${inputFormatted[m]}\n`);
                playerCounter++
            }

            playerls.setTitle(`Player list for ${input}`)
            playerls.setDescription(`\`\`\`\n${output}\n\`\`\``)
            playerls.setFooter(`${playerCounter} players online`)
            message.channel.send(playerls)
        });
    }
}
