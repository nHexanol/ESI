const Discord = require('discord.js');
const fs = require('fs');
const os = require('os');
const diffler = require('diffler');
const request = require('request');
const util = require('util');
const splArr = require('split-array');
const d = new Date()
const najax = require('najax');
const $ = require('jquery');

//construc the new og discord client
const client = new Discord.Client();
var prefix = '.';

var applying = [];
var memberObj = [];

//default message to send when the api is unavalible.
var inact = '';

function addApplying(name) {
	applying.push(name);
}

client.on('ready', () => {
	console.log('Logged in');
})

client.on('guildMemberAdd', member => {
    client.channels.cache.get('554418045397762050').send(`Welcome ${member} to the Empire of Sindria Discord server! If you're looking to apply to ESI, please use \`.apply <ign>\`; if you're just visiting, have fun!`);
})

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	var args = message.content.slice(prefix.length).trim().split(" ");
	var cmd = args.shift().toLowerCase();

	if (cmd == 'apply' || cmd == 'a') {
		// application system

		let appclt = message.author.id;
		let lowercaseName = args[0];
		if (applying.indexOf(lowercaseName) > -1) {
			message.channel.send('You already have a pending application.');
			return;
		}
		else {

			if (args[0] == "-h" || args[0] == "--help" || typeof (args[0]) == 'undefined' || !args[0]) {
				const applyhelp = new Discord.MessageEmbed()
					.setTitle('Application')
					.setColor('#11ff44')
					.setDescription('Use .a [IGN] or .apply [IGN] to create an application, Use [-f/v/e] in order to specify which application type you are creating if nessecary.')
					.addFields(
						{ name: '-f or --force', value: 'Creates an application for a player currently in another guild.' },
						{ name: '-v or --veteran', value: 'Creates an application for returning Veterans of the guild.' },
						{ name: '-e or --envoy', value: 'Creates an application for Duocitizens.' }
					)
				client.users.cache.get(message.author.id).send(applyhelp);
				return;
			}

			request(`https://api.wynncraft.com/v2/player/${args[0]}/stats`, (err, resp, body) => {
				if (err) throw (err);
				var data = JSON.parse(body);
				if (data.data[0]) {
					if (!data.data[0].username) {
						return;
					}
					var guild = JSON.stringify(data.data[0].guild.name).replace('"', '').replace('"', '');

					if (guild != 'null' && !args[1]) {
						// already in guild
						message.channel.send(`You're currently in another guild! In order to apply, please do .apply [IGN] -f in order to apply as an in-game member, or do .apply [IGN] -e to apply as a Duocitizen.`);
					}

					else if (guild != 'null' && (args[1] == '-f' || args[1] == '--force')) {
						message.guild.channels.create(`application-${args[0]}`, {
							type: 'text',
                            permissionOverwrites: [
                                {
                                    id: message.guild.id,
                                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                                },
                                {
                                    id: "683489556875444248",
                                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                                },
                                {
                                    id: message.author.id,
                                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                                },
                            ],
							topic: `${message.author.id} ${args[0]}`
						}).then(function (result) {
                            let category = message.guild.channels.cache.find(c => c.name == "Bot Channel" && c.type == "category");
                            let stch = message.guild.channels.cache.get(result.id);
                            stch.setParent(category);
							stch.overwritePermissions([
                                {
                                    id: message.guild.id,
                                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                                },
								{
                                    id: "683489556875444248",
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                                },
                                {
                                    id: "246865469963763713",
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                                },
                                {
                                    id: message.author.id,
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                                },
							]);
							message.channel.send(`Channel <#${result.id}> has been created for you.`);
							fs.writeFileSync(`./${args[0]}.txt`, "");
							client.on('message', m => {
								if (typeof(client.channels.cache.get(result.id)) == 'undefined') {
									return;
								}
								else {
								var desc = client.channels.cache.get(result.id).topic.split(" ");
								}
                                if (m.content == '.accept' && m.channel.id == result.id) {
                                    m.channel.send("We are glad to inform you your application was accepted. After doing /gu join ESI the next time you're online, be sure to ask a fellow guild member for an invite to our discord, where we can provide you with more information there!");
                                }
                                else if (m.content == '.deny' && m.channel.id == result.id) {
                                    m.channel.send("We regret to inform you your application was denied. If you would like to reapply to the guild, you may do so after one week.");
                                }
								else if (m.content == '.close' && m.channel.id == result.id) {
									applying = applying.filter(e => e != desc[0]);
									applying = applying.filter(e => e != desc[1]);
									m.guild.channels.cache.find(e => e.name == `${m.channel.name}`).delete();
									m.guild.channels.cache.get('670622024967782422').send({
										files: [`./${args[0]}.txt`]
									});
								}
								else if (m.channel.id == result.id || !m.content == '.close') {
									messageContentFormatted = m.content.replace(/\n/g, '\n    ')
									try {
										fs.appendFileSync(`./${args[0]}.txt`, `\n\n\n[ ${m.author.username} ]\n\n${messageContentFormatted}`);
									}
									catch (e) {
										m.channel.send(`Error while writing to file\n\`\`\`js\n${e}\`\`\`\n`);
									}
								}
							});
							request(`https://api.wynncraft.com/v2/player/${args[0]}/stats`, (err, resp, body) => {
								if (err) throw (err);
								var data = JSON.parse(body);
								if (data) {
									if (!data.data[0].username) {
										return;
									}
									var prevClass = 0;
									for (const c in data.data[0].classes) {
										if (data.data[0].classes[c].level > prevClass) {
											prevClass = data.data[0].classes[c].level;
										}
									}
									let username = JSON.stringify(data.data[0].username).replace('"', '').replace('"', '');
									let classL = prevClass.toFixed(0);
									let levelTotal = data.data[0].global.totalLevel.combined;
									let ign = data.data[0].username;
									message.guild.channels.cache.get(result.id).send(`Username : ${username}\nTotal Level: ${levelTotal}\nHighest Combat Level: ${classL}\n\n<@${message.author.id}> Please check that your above details are correct and fill out the application form:\n\nGender:\nCountry & Timezone:\nAge:\nWhat do you like doing in Wynn?\nWhat do you enjoy IRL?\nTell us something interesting about yourself:\nHow active are you on Wynncraft?\nPrevious guilds you’ve been in and why you’ve left them:\nHow did you find out about ESI?\nAnything else you'd like to add?`);
									addApplying(lowercaseName);
								}
							});
						});
					}

					else if (guild != 'null' && (args[1] == '-v' || args[1] == '--veteran')) {

						if (message.member.roles.cache.has('706338091312349195')) {

							addApplying(lowercaseName);

                            message.guild.channels.create(`application-${args[0]}`, {
                                type: 'text',
								permissionOverwrites: [
									{
										id: message.guild.id,
										deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
									},
									{
										id: "683489556875444248",
										allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
									},
									{
										id: message.author.id,
										allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
									},
								],
                                topic: `${message.author.id} ${args[0]}`,
                            }).then(function (result) {
                                let category = message.guild.channels.cache.find(c => c.name == "Bot Channel" && c.type == "category");
                                let stch = message.guild.channels.cache.get(result.id);
                                stch.setParent(category);
								stch.overwritePermissions([
									{
										id: message.guild.id,
										deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
									},
									{
										id: "683489556875444248",
										allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
									},
									{
										id: "246865469963763713",
										allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
									},
									{
										id: message.author.id,
										allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
									},
								]);
                                message.channel.send(`Channel <#${result.id}> has been created for you.`);
								fs.writeFileSync(`./${args[0]}.txt`, "");
                                client.on('message', m => {
									if (typeof(client.channels.cache.get(result.id)) == 'undefined') {
										return;
									}
									else {
									var desc = client.channels.cache.get(result.id).topic.split(" ");
									}
                                    if (m.content == '.accept' && m.channel.id == result.id) {
                                        m.channel.send("We are glad to inform you your application was accepted. After doing /gu join ESI the next time you're online, be sure to ask a fellow guild member for an invite to our discord, where we can provide you with more information there!");
                                    }
                                    else if (m.content == '.deny' && m.channel.id == result.id) {
                                        m.channel.send("We regret to inform you your application was denied. If you would like to reapply to the guild, you may do so after one week.");
                                    }
									else if (m.content == '.close' && m.channel.id == result.id) {
										applying = applying.filter(e => e != desc[0]);
										applying = applying.filter(e => e != desc[1]);
										m.guild.channels.cache.find(e => e.name == `${m.channel.name}`).delete();
										m.guild.channels.cache.get('670622024967782422').send({
											files: [`./${args[0]}.txt`]
										});
									}
									else if (m.channel.id == result.id || !m.content == '.close') {
										messageContentFormatted = m.content.replace(/\n/g, '\n    ')
										try {
											fs.appendFileSync(`./${args[0]}.txt`, `\n\n\n[ ${m.author.username} ]\n\n${messageContentFormatted}`);
										}
										catch (e) {
											m.channel.send(`Error while writing to file\n\`\`\`js\n${e}\`\`\`\n`);
										}
									}
								});
								request(`https://api.wynncraft.com/v2/player/${args[0]}/stats`, (err, resp, body) => {
									if (err) throw (err);
									var data = JSON.parse(body);
									if (data) {
										if (!data.data[0].username) {
											return;
										}
										var prevClass = 0;
										for (const c in data.data[0].classes) {
											if (data.data[0].classes[c].level > prevClass) {
												prevClass = data.data[0].classes[c].level;
											}
										}
										let username = JSON.stringify(data.data[0].username).replace('"', '').replace('"', '');
										let classL = prevClass.toFixed(0);
										let levelTotal = data.data[0].global.totalLevel.combined.toFixed(0);
										message.guild.channels.cache.get(result.id).send(`Username : ${username}\nTotal Level: ${levelTotal}\nHighest Combat Level: ${classL}\n\n<@${message.author.id}> Please check that your above details are correct and fill out the application form:\n\nWhat was your IGN when you left the guild (if it has changed please list your current IGN):\nWhy did you leave the guild?\nWhy do you want to return to ESI?\nHave you been in any other guilds since?`);
									}
								});
								addApplying(lowercaseName);
							});
						}
						else {
							message.channel.send('This command is only for Veterans.');
							return;
						}
					}

					else if (guild != 'null' && (args[1] == '-e' || args[1] == '--envoy')) {
						if (!message.member.roles.cache.has('554896955638153216')) {
						message.guild.channels.create(`application-${args[0]}`, {
                            type: 'text',
                            permissionOverwrites: [
                                {
                                    id: message.guild.id,
                                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                                },
                                {
                                    id: "683489556875444248",
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                                },
								{
                                    id: "246865469963763713",
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                                },
                                {
                                    id: message.author.id,
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                                },
                            ],
							topic: `${message.author.id} ${args[0]}`,
                        }).then(function (result) {
                            let category = message.guild.channels.cache.find(c => c.name == "Bot Channel" && c.type == "category");
                            let stch = message.guild.channels.cache.get(result.id);
                            stch.setParent(category);
							stch.overwritePermissions([
                                {
                                    id: message.guild.id,
                                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                                },
                                {
                                    id: "683489556875444248",
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                                },
								{
                                    id: "246865469963763713",
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                                },
                                {
                                    id: message.author.id,
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                                },
							]);
							message.channel.send(`Channel <#${result.id}> has been created for you.`);
							fs.writeFileSync(`./${args[0]}.txt`, "");
							client.on("message", m => {
								if (typeof(client.channels.cache.get(result.id)) == 'undefined') {
									return;
								}
								else {
								var desc = client.channels.cache.get(result.id).topic.split(" ");
								}
                                if (m.content == ".accept" && m.channel.id == result.id) {
                                    m.channel.send("We are glad to inform you your application was accepted. After doing /gu join ESI the next time you're online, be sure to ask a fellow guild member for an invite to our discord, where we can provide you with more information there!");
                                }
                                else if (m.content == ".deny" && m.channel.id == result.id) {
                                    m.channel.send("We regret to inform you your application was denied. If you would like to reapply to the guild, you may do so after one week.");
                                }
								else if (m.content == ".close" && m.channel.id == result.id) {
									applying = applying.filter(e => e != desc[0]);
									applying = applying.filter(e => e != desc[1]);
									m.guild.channels.cache.find(e => e.name == `${m.channel.name}`).delete();
									m.guild.channels.cache.get("670622024967782422").send({
										files: [`./${args[0]}.txt`]
									});
								}
								else if (m.channel.id == result.id || !m.content == '.close') {
									messageContentFormatted = m.content.replace(/\n/g, "\n    ")
									try {
										fs.appendFileSync(`./${args[0]}.txt`, `\n\n\n[ ${m.author.username} ]\n\n${messageContentFormatted}`);
									}
									catch (e) {
										m.channel.send(`Error while writing to file\n\`\`\`js\n${e}\`\`\`\n`);
									}
								}
							});
							request(`https://api.wynncraft.com/v2/player/${args[0]}/stats`, (err, resp, body) => {
								if (err) throw (err);
								var data = JSON.parse(body);
								if (data) {
									if (!data.data[0].username) {
										return;
									}
									var prevClass = 0;
									for (const c in data.data[0].classes) {
										if (data.data[0].classes[c].level > prevClass) {
											prevClass = data.data[0].classes[c].level;
										}
									}
									let username = JSON.stringify(data.data[0].username).replace('"', '').replace('"', '');
									let classL = prevClass.toFixed(0);
									let levelTotal = data.data[0].global.totalLevel.combined.toFixed(0);
									let gu = data.data[0].guild.name;
									message.guild.channels.cache.get(result.id).send(`Username : ${username}\nTotal Level: ${levelTotal}\nHighest Combat Level: ${classL}\nGuild: ${gu}\n\n<@${message.author.id}> Please check that your above details are correct and fill out the application form:\n\nWhat is your preferred nickname?\nWhat are your preferred pronouns?\nWhat guild is your current main guild?\nWhat do you like doing in your spare time?\nWhy do you want to apply for Envoy?`);
								}
							});
							addApplying(lowercaseName);
						});
					}
					else return;
						}

					if (guild == 'null') {
						// no guild
						addApplying(lowercaseName);
						message.guild.channels.create(`application-${args[0]}`, {
							type: 'text',
                            permissionOverwrites: [
                                {
                                    id: message.guild.id,
                                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                                },
                                {
                                    id: "683489556875444248",
                                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                                },
                                {
                                    id: message.author.id,
                                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                                },
                            ],
							topic: `${message.author.id} ${args[0]}`,
						}).then(function (result) {
                            let category = message.guild.channels.cache.find(c => c.name == "Bot Channel" && c.type == "category");
                            let stch = message.guild.channels.cache.get(result.id);
                            stch.setParent(category);
							stch.overwritePermissions([
                                {
                                    id: message.guild.id,
                                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                                },
                                {
                                    id: "683489556875444248",
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                                },
								{
                                    id: "246865469963763713",
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                                },
                                {
                                    id: message.author.id,
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                                },
							]);
							message.channel.send(`Channel <#${result.id}> has been created for you.`);
							fs.writeFileSync(`./${args[0]}.txt`, "");
							client.on('message', m => {
								if (typeof(client.channels.cache.get(result.id)) == 'undefined') {
									return;
								}
								else {
								var desc = client.channels.cache.get(result.id).topic.split(" ");
								}
                                if (m.content == '.accept' && m.channel.id == result.id) {
                                    m.channel.send("We are glad to inform you your application was accepted. After doing /gu join ESI the next time you're online, be sure to ask a fellow guild member for an invite to our discord, where we can provide you with more information there!");
									let role = m.member.guild.roles.cache.find(role => role.name === "Squire");
									if (role) m.guild.members.cache.get(message.author.id).roles.add(role);
									let role2 = m.member.guild.roles.cache.find(role => role.name === "Sindrian Citizen");
									if (role2) m.guild.members.cache.get(message.author.id).roles.add(role2);
                                }
                                else if (m.content == '.deny' && m.channel.id == result.id) {
                                    m.channel.send("We regret to inform you your application was denied. If you would like to reapply to the guild, you may do so after one week.");
                                }
								else if (m.content == '.close' && m.channel.id == result.id) {
									applying = applying.filter(e => e != desc[0]);
									applying = applying.filter(e => e != desc[1]);
									m.guild.channels.cache.find(e => e.name == `${m.channel.name}`).delete();
									m.guild.channels.cache.get('670622024967782422').send({
										files: [`./${args[0]}.txt`]
									});
								}
								else if (m.channel.id == result.id || !m.content == '.close') {
									messageContentFormatted = m.content.replace(/\n/g, '\n    ')
									try {
										fs.appendFileSync(`./${args[0]}.txt`, `\n\n\n[ ${m.author.username} ]\n\n${messageContentFormatted}`);
									}
									catch (e) {
										m.channel.send(`Error while writing to file\n\`\`\`js\n${e}\`\`\`\n`);
									}
								}
							});
							request(`https://api.wynncraft.com/v2/player/${args[0]}/stats`, (err, resp, body) => {
								if (err) throw (err);
								var data = JSON.parse(body);
								if (data) {
									if (!data.data[0].username) {
										return;
									}
									var prevClass = 0;
									for (const c in data.data[0].classes) {
										if (data.data[0].classes[c].level > prevClass) {
											prevClass = data.data[0].classes[c].level;
										}
									}
									let username = JSON.stringify(data.data[0].username).replace('"', '').replace('"', '');
									let classL = prevClass.toFixed(0);
									let levelTotal = data.data[0].global.totalLevel.combined.toFixed(0);
									message.guild.channels.cache.get(result.id).send(`Username : ${username}\nTotal Level: ${levelTotal}\nHighest Combat Level: ${classL}\n\n<@${message.author.id}> Please check that your above details are correct and fill out the application form:\n\nPreferred Pronouns (optional):\nAge (optional):\nHow did you find ESI?\nHow can you contribute to ESI?\nWhat is your highest combat level class?\nHow active are you on Wynncraft?\nWhat do you enjoy about Wynncraft?\nBesides playing Wynn, what else do you enjoy doing?\nPrevious Guilds you’ve been in and why you’ve left them:\nAdditional Notes:`);
								}
							});
						});
					}
				}

				else {
					message.channel.send("Username not found.\nIf you changed your username recently, try using your old username or UUID.");
				}
			});
		}
	}

	else if (cmd == 'ev' && (message.author.id == 246865469963763713 || message.author.id == 723715951786328080 || message.author.id == 475440146221760512 || message.author.id == 330509305663193091)) {
		//eval, for debugging purpose don't use if not nessessary
		var cmd = "";
		for (var i = 0; i < args.length; i++) {
			var cmd = cmd.concat(` ${args[i]}`);
		}
		try {
			var out = eval(cmd);
			var out = util.inspect(out);
			const Evaluate = new Discord.MessageEmbed()
				.setColor('#ffaa33')
				.setTitle('Evaluate')
				.setDescription(`\`\`\`js\n>${cmd}\n< ${out}\n\`\`\``)
				.setFooter(message.author.username)
				.setTimestamp()
			message.channel.send(Evaluate);
		}
		catch (e) {
			const err = new Discord.MessageEmbed()
				.setColor('#ffaa33')
				.setTitle('Evaluate')
				.setDescription(`\`\`\`js\n>${cmd}\n< ${out}\n\`\`\``)
				.setFooter(message.author.username)
				.setTimestamp()
			message.channel.send(err);
		}
	}			
});

//event listener 'message' define "m" as message object when client receive message from the API
client.on('message', m => {
	console.log(`[ ${m.author.username} ] >> ${m.content}`);
});

//token thingy
client.login('ODIwMDA5Mzc3MDc1MTY3Mjkz.YEu7Pg.XfZxXMX-htzfqowY4aidE0JmJbg');