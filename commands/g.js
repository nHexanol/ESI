const Discord = require("discord.js");
const request = require("request");
const fetch = require("node-fetch");

module.exports = {
    names: ["g"],
    func: function guild(message, ...args) {
        async function sendData(gName, gPrefix, dUsername, dRank, dServer, online, maxMember, level) {
			const guildEmbed = new Discord.MessageEmbed()
			.setTitle(`${gName} (${gPrefix}) | ${level}`)
			.setColor('#ddff00')
			.addFields(
				{ name: 'Name', value: `${dUsername}`, inline: true },
				{ name: 'Rank', value: `${dRank}`, inline: true },
				{ name: 'Server', value: `${dServer}`, inline: true },
			)
			.setFooter(`${online} / ${maxMember} online`)

			message.channel.send(guildEmbed);
		}

		var arr_counter = 0;
		var storage = [];
		var sUsername = "";
		var sRank = "";
		var sServer = "";
		var guName = "";
		var guPrefix = "";
		if (args.length == 0) var filtered = "Empire+of+Sindria";
		else if (args.length != 0) var filtered = args.filter(Boolean).join('+');
		console.log(filtered);

    	request(`https://api.wynncraft.com/public_api.php?action=guildStats&command=${filtered}`, (error, res, body) => {
			if (error) return message.channel.send(error);

			var gu = JSON.parse(body);
			guName = gu.name;
			guPrefix = gu.prefix;
			var counter = [];
			var onlineList = 0;
            var final_sorttemplate = ["\\*\\*\\*\\*\\*", "\\*\\*\\*\\*", "\\*\\*\\*", "\\*\\*", "\\*", "", "UNKWN"];
			var rankOrder = ["OWNER", "CHIEF", "STRATEGIST", "CAPTAIN", "RECRUITER", "RECRUIT"];
			sortedMembers = gu.members.sort((a,b) => {return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank)});
			for (const m in sortedMembers) {
				fetch(`https://api.wynncraft.com/v2/player/${sortedMembers[m].uuid}/stats`)
				.then(res => res.json())
				.then(function (json) {
					console.log(m);
					counter.push(m);
					if (json.data[0].meta.location.online == false || json.data[0].meta.location.server == "null") return;
					else if (json.data[0].meta.location.online && json.data[0].meta.location.server != "null") {
                        var fRank = "";
                        switch (json.data[0].guild.rank) {
                            case "RECRUIT":
                                fRank = "";
                                break;
                            case "RECRUITER":
                                fRank = "\\*"
                                break;
                            case "CAPTAIN":
                                fRank = "\\*\\*"
                                break;
                            case "STRATEGIST":
                                fRank = "\\*\\*\\*"
                                break;
                            case "CHIEF":
                                fRank = "\\*\\*\\*\\*";
                                break;
                            case "OWNER":
                                fRank = "\\*\\*\\*\\*\\*";
                                break;
                            default:
                                fRank = "UNKWN";
                        }
                        onlineList++;
                        storage[arr_counter] = {};
                        storage[arr_counter].name = json.data[0].username;
                        storage[arr_counter].rank = fRank;
                        storage[arr_counter].server = json.data[0].meta.location.server;
                        arr_counter++;
                        sUsername = sUsername.concat(`${json.data[0].username}\n`);
                        sRank = sRank.concat(`${fRank}\n`);
                        sServer = sServer.concat(`${json.data[0].meta.location.server}\n`);
                        console.log(`Counter length : ${counter.length}\nOnline : ${onlineList}`);
                    }
				}).then(function () {
					if (counter.length == gu.members.length - 1) {
						var sorted = storage.sort((a, b) => {return final_sorttemplate.indexOf(a.rank) - final_sorttemplate.indexOf(b.rank)});
						console.log(storage);
						console.log(sorted);
						if (sUsername.length == 0) {
							sUsername = "*<none>*";
							sRank = "-";
							sServer = "-";
						}
                        var sorted_username = "";
                        var sorted_rank = "";
                        var sorted_server = "";
                        for (var usr in storage) {
                            sorted_username = sorted_username.concat(`${storage[usr]["name"]}\n`);
                            sorted_rank = sorted_rank.concat(`${storage[usr]["rank"]}\n`);
                            sorted_server = sorted_server.concat(`${storage[usr]["server"]}\n`);
                        }
						sUsername = sUsername.replace(/_/g, "\\_");
                        sendData(gu.name, gu.prefix, sorted_username, sorted_rank, sorted_server, onlineList, gu.members.length, gu.level);
						console.log(`${gu.name} (${gu.prefix})\n${sUsername} ${sRank} ${sServer}`);
						console.log(`${m} ${gu.members.length}`);
					}
				})
				.catch(console.log);
			}
		});
    }
}
