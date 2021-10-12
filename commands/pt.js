const fs = require("fs");

module.exports = {
    names: ["pt"],
    func: function playtime(message, ...args) {
        function send_data(username, pt) {
			const playtime_embed = new  Discord.MessageEmbed()
			.setTitle(`Playtime (${days_back}d)`)
			.setColor('#8e059e')
			.addFields(
				{name: "Name", value: `t${username}`, inline: true},
				{name: "Playtime", value: `t${pt}`, inline: true},
			)
			console.log(`${username} ${pt}`);
			message.channel.send(playtime_embed);
		}

		if (args.length < 1) {
			days_back = 14;
		}
		else if (args[0] && args[0] != "-r") {
			days_back = parseInt(args[0]);
		}

		var pt_data_now = fs.readFileSync(`./playtime/${Math.ceil(Date.now() / 86400000)}.txt`);
		var pt_data = fs.readFileSync(`./playtime/${Math.ceil(Date.now() / 86400000) - days_back}.txt`);
		var playtime_old = JSON.parse(pt_data);
		var playtime_now = JSON.parse(pt_data_now);

		var members_name = "";
		var members_pt = "";
		// [0] username, [1] playtime
		for (var player in playtime_old) {
				var hrs_old = Math.trunc(playtime_old[player][1]/60*4.7);
				var mins_old = (hrs_old - playtime_old[player][1]/60*4.7).toFixed(2) * 60;

				var hrs_now = Math.trunc(playtime_now[player][1]/60*4.7);
				var mins_now = (hrs_now - playtime_now[player][1]/60*4.7).toFixed(2) * 60;

				console.log(hrs_old + hrs_now);

				members_name += `${playtime_old[player][0].replace(/_/g, "\\_")}\n`;
				console.log(members_name);
				members_pt += `${hrs_now - hrs_old}h ${mins_now - mins_old}m\n`;
		}
		var embed_count = Math.floor(playtime_old.length) / 10;
		var s = playtime_old.length % 10

		var playtime_embed = new  Discord.MessageEmbed()
		.setTitle(`Playtime (${days_back}d)`)
		.setColor('#8e059e')
		.addFields(
			{name: "Name", value: `t${members_name}`, inline: true},
			{name: "Playtime", value: `${members_pt}`, inline: true},
		)
		console.log(`${members_name} ${members_pt}`);
		message.channel.send(playtime_embed);
    }
}
