const Discord = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    names: ["tl"],
    func: function terrList(client, message, tag, ...args) {
        const playerls = new Discord.MessageEmbed()
		var output = "";
		playerls.setColor('#009eff')

		man = 0;
		if(!tag) return message.channel.send("Please provide a guild's tag (no name XD)")
		let gprefix = tag.toLowerCase()
		let terrs = []
		fetch('https://athena.wynntils.com/cache/get/territoryList')
		.then(response => response.json())
		.then(json => {
			for (var g in json.territories) {
				let guprefix = json.territories[g].guildPrefix.toLowerCase()
				if(guprefix === gprefix){
					man++
				terrs.push(`${man}. ${json.territories[g].territory}`);
				}
			}
			if(terrs.length === 0) {
				terrs.push(`${gprefix} has 0 territories.`);
				}
				for (var m in terrs) {
					output = output.concat(`${terrs[m]}\n`)
				}
				playerls.setTitle(`Territory list for ${gprefix}`)
				playerls.setDescription(`\`\`\`\n${output}\n\`\`\``)
			   playerls.setFooter(`${gprefix} has ${man} territories`)
			   message.channel.send(playerls)
		});
    }
}
