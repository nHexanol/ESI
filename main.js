const Discord = require('discord.js');
const client = new Discord.Client()
const fs = require('fs');
const os = require('os');
const diffler = require('diffler');
const request = require('request');
const util = require('util');
const splArr = require('split-array');
const d = new Date()
const najax = require('najax');
const $ = require('jquery');
const Canvas = require('canvas');
const http = require('http');
const disbut = require('discord.js-buttons')(client);
var prefix = ".";

//init variablec

var terrClaimPingEnabled = false;
var fetchObjInterval = 604800000;
var claimInterval = 300000;
var thresholdTerr = 3;
var memberObj = [];
var applying = [];
var alreadyPinged = false;
var Role = '<@246865469963763713>'

// volatile variable

//web server
const server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('./index.html', function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Error: File not found.');
        }
        else {
            res.write(data);
        }
        res.end();
    })
})


//manually add claims list here
var ESIClaims = [
	'Swamp Mountain Transition Lower',
	'Swamp Mountain Transition Mid',
	'Swamp Mountain Transition Mid-Upper',
	'Swamp Mountain Transition Upper',
	'Olux',
	'Swamp Dark Forest Transition Upper',
	'Taproot Descent',
	'Swamp East Upper',
	'Swamp West Upper',
	'Swamp Plains Basin',
	'Entrance to Olux',
	'Swamp Dark Forest Transition Mid',
	'Fortress North',
	'Gelibord Castle',
	'Gelibord Corrupted Farm',
	'Swamp East Mid-Upper',
	'Swamp West Mid-Upper',
	'Swamp Mountain Base',
	'Swamp Lower',
	'Swamp Dark Forest Transition Lower',
	'Fortress South',
	'Swamp West Mid',
	'Swamp East Mid',
	'Swamp West Lower',
	'Swamp East Lower',
	'Forgotten Path',
	'Iron Road'
  ]

function addApplying(name) {
	applying.push(name);
}

client.on('ready', () => {
	console.log('Logged in');
})

client.on('guildMemberAdd', member => {

	//const canvas = Canvas.createCanvas(1213, 276);
	//const context = canvas.getContext('2d');
	//const background = await Canvas.loadImage('./welcome-base.png');
	//context.drawImage(background, 0, 0, canvas.width, canvas.height);
	//const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `welcome-${member.username}.png`);
	//context.strokeStyle = '#ffffff';
	//context.strokeRect(0, 0, canvas.width, canvas.height);
	//const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	//context.drawImage(avatar, 25, 25, 200, 200);
	//context.beginPath();
	//context.arc(125, 125, 100, 0, Math.PI * 2, true);
	//context.closePath();
	//context.clip();
	//context.font = '40px Ubuntu';
	//context.fillStyle = '#ffffff';
	//context.fillText(`Welcome to the Empire of Sindria Discord server,`, canvas.width / 2.5, canvas.height / 1.8);
	//context.fillText(member.displayName, canvas.width / 2.5, canvas.height / 3.5);
	//client.channels.cache.get('784352935198064660').send(attachment);

    // old one 
	client.channels.cache.get('554418045397762050').send(`Welcome ${member} to the Empire of Sindria Discord server! If you're looking to apply to ESI, please use \`.apply <ign>\` here or in <#554894605217169418>; if you're just visiting, have fun!`);
})

client.on('clickButton', async (button) => {
	if (button.id == "GuP") {
		if (button.clicker.member.roles.cache.has('800547586694971443') == true) {
			button.clicker.member.roles.remove('800547586694971443');
			client.users.cache.get(button.clicker.user.id).send('Removed Guild Parties role.');
			button.defer();
		}
		else if (button.clicker.member.roles.cache.has('800547586694971443') == false) {
			button.clicker.member.roles.add('800547586694971443');
			client.users.cache.get(button.clicker.user.id).send('Added Guild Parties role.');
			button.defer();
		}
	}
	else if (button.id == "CH") {
		if (button.clicker.member.roles.cache.has('800547442772148234') == true) {
			button.clicker.member.roles.remove('800547442772148234');
			client.users.cache.get(button.clicker.user.id).send('Removed Challenges role.');
			button.defer();
		}
		else if (button.clicker.member.roles.cache.has('800547442772148234') == false) {
			button.clicker.member.roles.add('800547442772148234');
			client.users.cache.get(button.clicker.user.id).send('Added Challenges role.');
			button.defer();
		}
	}
	else if (button.id == "VT") {
		if (button.clicker.member.roles.cache.has('786035931647180810') == true) {
			button.clicker.member.roles.remove('786035931647180810');
			client.users.cache.get(button.clicker.user.id).send('Removed Venting role.');
			button.defer();
		}
		else if (button.clicker.member.roles.cache.has('786035931647180810') == false) {
			button.clicker.member.roles.add('786035931647180810');
			client.users.cache.get(button.clicker.user.id).send('Added Venting role.');
			button.defer();
		}
	}
	else if (button.id == "RP") {
		if (button.clicker.member.roles.cache.has('591763786474455130') == true) {
			button.clicker.member.roles.remove('591763786474455130');
			client.users.cache.get(button.clicker.user.id).send('Removed Roleplay role.');
			button.defer();
		}
		else if (button.clicker.member.roles.cache.has('591763786474455130') == false) {
			button.clicker.member.roles.add('591763786474455130');
			client.users.cache.get(button.clicker.user.id).send('Added Roleplay role.');
			button.defer();
		}
	}
	else if (button.id == "AN") {
		if (button.clicker.member.roles.cache.has('854233448494530571') == true) {
			button.clicker.member.roles.remove('854233448494530571');
			client.users.cache.get(button.clicker.user.id).send('Removed Anime role.');
			button.defer();
		}
		else if (button.clicker.member.roles.cache.has('854233448494530571') == false) {
			button.clicker.member.roles.add('854233448494530571');
			client.users.cache.get(button.clicker.user.id).send('Added Anime role.');
			button.defer();
		}
	}
	else if (button.id == "PD") {
		if (button.clicker.member.roles.cache.has('728104157852205056') == true) {
			button.clicker.member.roles.remove('728104157852205056');
			client.users.cache.get(button.clicker.user.id).send('Removed Politics and Debate role.');
			button.defer();
		}
		else if (button.clicker.member.roles.cache.has('728104157852205056') == false) {
			button.clicker.member.roles.add('728104157852205056');
			client.users.cache.get(button.clicker.user.id).send('Added Politics and Debate role.');
			button.defer();
		}
	}
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	var args = message.content.slice(prefix.length).trim().split(" ");
	var cmd = args.shift().toLowerCase();

	if (cmd == 'help' || cmd == '?') {
		message.channel.send({
			files: ['./help.png']
		});
	}

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
				if (message.mentions.length > 0) {
					var mentioned = message.mentions.first;
				}
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
					var username = data.data[0].username;
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
							var accepted = false;
							client.on('message', m => {
								if (typeof(client.channels.cache.get(result.id)) == 'undefined') {
									return;
								}
								else {
								var desc = client.channels.cache.get(result.id).topic.split(" ");
								}
                                if (m.content == '.accept' && m.channel.id == result.id) {
									m.channel.bulkDelete(1);
                                    m.channel.send("We are glad to inform you your application was accepted. After doing /gu join ESI the next time you're online, be sure to ask a fellow guild member for an invite to our discord, where we can provide you with more information there!");
									let role = m.member.guild.roles.cache.find(role => role.name === "Squire");
									if (role) m.guild.members.cache.get(message.author.id).roles.add(role);
									let role2 = m.member.guild.roles.cache.find(role => role.name === "Sindrian Citizen");
									if (role2) m.guild.members.cache.get(message.author.id).roles.add(role2);
									m.member.setNickname(`Squire ${username}`);
									accepted = true;
                                }
                                else if (m.content == '.deny' && m.channel.id == result.id) {
									m.channel.bulkDelete(1);
                                    m.channel.send("We regret to inform you your application was denied. If you would like to reapply to the guild, you may do so after one week.");
                                }
								else if (m.content == '.close' && m.channel.id == result.id) {
									applying = applying.filter(e => e != desc[0]);
									applying = applying.filter(e => e != desc[1]);
									m.guild.channels.cache.find(e => e.name == `${m.channel.name}`).delete();
									if (accepted = true) {
									m.guild.channels.cache.get('670622024967782422').send({
										files: [`./${args[0]}.txt`]
									});
									}
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
										if (data.data[0].classes[c].professions.combat.level > prevClass) {
                                            prevClass = data.data[0].classes[c].professions.combat.level;
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
								var accepted = false;
                                client.on('message', m => {
									if (typeof(client.channels.cache.get(result.id)) == 'undefined') {
										return;
									}
									else {
									var desc = client.channels.cache.get(result.id).topic.split(" ");
									}
                                    if (m.content == '.accept' && m.channel.id == result.id) {
										m.channel.bulkDelete(1);
										m.channel.send("We are glad to inform you your application was accepted. After doing /gu join ESI the next time you're online, be sure to ask a fellow guild member for an invite to our discord, where we can provide you with more information there!");
										accepted = true;
                                    }
                                    else if (m.content == '.deny' && m.channel.id == result.id) {
										m.channel.bulkDelete(1);
										m.channel.send("We regret to inform you your application was denied. If you would like to reapply to the guild, you may do so after one week.");
                                    }
									else if (m.content == '.close' && m.channel.id == result.id) {
										applying = applying.filter(e => e != desc[0]);
										applying = applying.filter(e => e != desc[1]);
										m.guild.channels.cache.find(e => e.name == `${m.channel.name}`).delete();
										if (accepted == true) {
										m.guild.channels.cache.get('670622024967782422').send({
											files: [`./${args[0]}.txt`]
										});
										}
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
							var accepted = false;
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
									m.channel.bulkDelete(1);
                                    m.channel.send("We are glad to inform you your application was accepted. After doing /gu join ESI the next time you're online, be sure to ask a fellow guild member for an invite to our discord, where we can provide you with more information there!");
									accepted = true;
                                }
                                else if (m.content == ".deny" && m.channel.id == result.id) {
									m.channel.bulkDelete(1);
                                    m.channel.send("We regret to inform you your application was denied. If you would like to reapply to the guild, you may do so after one week.");
                                }
								else if (m.content == ".close" && m.channel.id == result.id) {
									applying = applying.filter(e => e != desc[0]);
									applying = applying.filter(e => e != desc[1]);
									m.guild.channels.cache.find(e => e.name == `${m.channel.name}`).delete();
									if (accepted == true) {
									m.guild.channels.cache.get("670622024967782422").send({
										files: [`./${args[0]}.txt`]
									});
									}
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
										if (data.data[0].classes[c].professions.combat.level > prevClass) {
                                            prevClass = data.data[0].classes[c].professions.combat.level;
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
							var accepted = false;
							client.on('message', m => {
								if (typeof(client.channels.cache.get(result.id)) == 'undefined') {
									return;
								}
								else {
								var desc = client.channels.cache.get(result.id).topic.split(" ");
								}
                                if (m.content == '.accept' && m.channel.id == result.id) {
									m.channel.bulkDelete(1);
                                    m.channel.send("We are glad to inform you your application was accepted. After doing /gu join ESI the next time you're online, be sure to ask a fellow guild member for an invite to our discord, where we can provide you with more information there!");
									let role = m.member.guild.roles.cache.find(role => role.name === "Squire");
									if (role) m.guild.members.cache.get(message.author.id).roles.add(role);
									let role2 = m.member.guild.roles.cache.find(role => role.name === "Sindrian Citizen");
									if (role2) m.guild.members.cache.get(message.author.id).roles.add(role2);
									m.member.setNickname(`Squire ${username}`);
									accepted = true;
                                }
                                else if (m.content == '.deny' && m.channel.id == result.id) {
									m.channel.bulkDelete(1);
                                    m.channel.send("We regret to inform you your application was denied. If you would like to reapply to the guild, you may do so after one week.");
                                }
								else if (m.content == '.close' && m.channel.id == result.id) {
									applying = applying.filter(e => e != desc[0]);
									applying = applying.filter(e => e != desc[1]);
									m.guild.channels.cache.find(e => e.name == `${m.channel.name}`).delete();
									if (accepted == true) {
									m.guild.channels.cache.get('670622024967782422').send({
										files: [`./${args[0]}.txt`]
									});
									}
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
										if (data.data[0].classes[c].professions.combat.level > prevClass) {
                                            prevClass = data.data[0].classes[c].professions.combat.level;
										}
									}
									let username = JSON.stringify(data.data[0].username).replace('"', '').replace('"', '');
									let levelClassHighest = prevClass.toFixed(0);
									let levelTotal = data.data[0].global.totalLevel.combined.toFixed(0);
									message.guild.channels.cache.get(result.id).send(`Username : ${username}\nTotal Level: ${levelTotal}\nHighest Combat Level: ${levelClassHighest}\n\n<@${message.author.id}> Please check that your above details are correct and fill out the application form:\n\nPreferred Pronouns (optional):\nAge (optional):\nHow did you find ESI?\nHow can you contribute to ESI?\nWhat is your highest combat level class?\nHow active are you on Wynncraft?\nWhat do you enjoy about Wynncraft?\nBesides playing Wynn, what else do you enjoy doing?\nPrevious Guilds you’ve been in and why you’ve left them:\nAdditional Notes:`);
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

	else if (cmd == "sp") {
		message.channel.send('Not implemented yet :c');
	}

	else if (cmd == "g") {
		var filtered = message.content.replace('.g ', '');
		var username = "";
		var rank = "";
		var server = "";
		request(`https://api.wynncraft.com/public_api.php?action=guildStats&command=${filtered}`, (err, resp, body) => {
				if (err) message.channel.send(err);
				var data = JSON.parse(body);
				for (const m in data.members) {
					request(`https://api.wynncraft.com/v2/player/${data.members[m].name}/stats`, (err, resp, body) => {
					if (err) message.channel.send(err);
					var player = JSON.parse(body);
					if (!player.guild || !player.username) return;
					else if (player.meta.location.online == true && player.meta.location.server != 'null') {
						username = username.concat(`${player.username}\n`);

						var starRank = "";

						if (player.guild.rank == "OWNER") starRank = "*****";
						else if (player.guild.rank == "CHIEF") starRank = "****";
						else if (player.guild.rank == "STRATEGIST") starRank = "***";
						else if (player.guild.rank == "CAPTAIN") starRank = "**";
						else if (player.guild.rank == "RECRUITER") starRank = "*";
						else if (player.guild.rank == "RECRUIT") starRank = "";
						else starRank == "UNKWN";

						rank = rank.concat(`${starRank}\n`);
						server = server.concat(`${player.meta.location.server}\n`);

					}
					});
				}
				const gustat = new Discord.MessageEmbed()
				.setTitle(`${filtered} (${data.prefix})`)
				.setColor('#f0ff00')
				.addFields(
					{ name: 'Name', value: `a${username}`, inline: true },
					{ name: 'Rank', value: `s${rank}`, inline: true },
					{ name: 'Server', value: `d${server}`, inline: true },
				)
				message.channel.send(gustat);
			});
	}

	//wizard
	else if (cmd == 'terr') {

		if (!args[0] || args[0] == 'help') {
			message.channel.send({
				files: ['./terrmanagerhelpunfinished.png']
			});
		}

		if (args[0] == 'alert') {
			if (!args[1]) {
		const filter = (reaction, user) => {
			return ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
		};
		
		var option = new Discord.MessageEmbed()
		.setTitle('Territory manager')
		.setColor('#66ffbb')
		.setDescription('**Claim ping**\nNotify role when ESI lost claim')
		.addFields(
		  { name: 'To enable', value: 'React with ✅' },
		  { name: 'To disable', value: 'React with ❎' },
		)
		.setFooter(`Current value : ${terrClaimPingEnabled} | Default : false`)
		message.channel.send(option).then(sentEmbed => {
		sentEmbed.react('\✅');
		sentEmbed.react('\❎');
		sentEmbed.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
			.then(collected => {
				const reaction = collected.first();
		
				if (reaction.emoji.name === '✅') {
					terrClaimPingEnabled = true;
					//enabled embed
					message.channel.send('Claim ping enabled.');
				} 
				else if (reaction.emoji.name === '❎') {
					terrClaimPingEnabled = false;
					//disabled embed
					message.channel.send('Claim ping disabled.');
				}
				else {
					message.channel.send("You did not reacted with neither option.")
				}
			})
		});
		}
		else if (args[1] == 'on') {
			terrClaimPingEnabled = true;
		}
		else if (args[1] == 'off') {
			terrClaimPingEnabled = false;
		}
	}

		else if (args[0] == 'setThresholdTerr' || args[0] == 'stt') {
			if (!args[1] || typeof(parseInt(args[1]) != 'number')) return message.channel.send('Please specify lost territory threshold in number');
			thresholdTerr = parseInt(args[0]);
		}

		else if (args[0] == 'setThresholdCaptain' || args[0] == 'stc') {
			if (!args[1] || typeof(parseInt(args[1]) != 'number')) return message.channel.send('Please specify captain threshold in number');
			thresholdTerr = parseInt(args[0]);
		}

		else if (args[0] == 'add') {
			if (!args[1]) return;
			for (var i = 1; i < args.length; i++) {
				var terrname = "";
				terrname = terrname.concat(`${args[i]} `);
				terrname = terrname.trim();
			}
			ESIClaims.push(terrname);
			request(`https://api.wynncraft.com/public_api.php?action=territoryList`, (err, resp, body) => {
				if (err) throw (err);
				var data = JSON.parse(body);
				if (!data.territories[`${terrname}`]) {
				const terraddfail = new Discord.MessageEmbed()
					.setTitle('Territory manager - Territory added fail')
					.setColor('#ff3333')
					.setDescription(`Territory \`${terrname}\` doesn't existed !`)
				return message.channel.send(terraddfail);
				}
				else ESIClaims.push(terrname);
				const terradd = new Discord.MessageEmbed()
					.setTitle('Territory manager - Territory added')
					.setColor('#33ff33')
					.setDescription(`Added ${terrname}`)
				message.channel.send(terradd);
			});
		}

		else if (args[0] == 'remove' || args[0] == 'rm' || args[0] == 'filter') {
			if (!args[1]) return;
			for (var i = 1; i < args.length; i++) {
				var terrname = "";
				terrname = terrname.concat(`${args[i]} `);
			}
			terrname = terrname.trim();
			ESIClaims = ESIClaims.filter(tn => tn == !terrname);
			const terrfiltered = new Discord.MessageEmbed()
			.setTitle('Territory manager')
			.setColor('#33ff33')
			.setDescription(`Filtered ${terrname}`)
		message.channel.send(terrfiltered);
		}

		else if (args[0] == 'list' || args[0] == 'ls') {
			ClaimList = "";
			for (const i in ESIClaims) {
				ClaimList = ClaimList.concat(`- ${ESIClaims[i]}\n`);
			}
			if (typeof(ClaimList) == 'undefined') ClaimList = "<none>";
			const ClaimLsEmbed = new Discord.MessageEmbed()
				.setTitle('Territory manager')
				.setColor('#44ff55')
				.setDescription(ClaimList)
			
			message.channel.send(ClaimLsEmbed);
		}
	}

	else if (cmd == "webserver") {
		if (args[0] == 'start') {
			let port = args[0];
			server.start(port)
		}
		if (args[0] == 'stop') {

		}
	}

else if (cmd == "function") {
	return eval(`${args[0]}(message);`);
}

	else if (cmd == 'lev' && (message.author.id == 246865469963763713 || message.author.id == 723715951786328080 || message.author.id == 475440146221760512 || message.author.id == 330509305663193091 || message.author.id == 722992562989695086)) {
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

function button(message) {
	let button = new disbut.MessageButton()
	.setStyle('blurple')
	.setLabel('Meow !')
	.setID('meow')

	let destruction = new disbut.MessageButton()
	.setStyle('red')
	.setLabel('DESTRUCTIONNN')
	.setID('des')

	let green = new disbut.MessageButton()
	.setStyle('green')
	.setLabel('*bite*')
	.setID('nom')

	message.channel.send(":eyes:", {
		buttons : [ button, destruction, green ]
	});

	client.on('clickButton', async (button) => {
		if (button.id === 'meow') {
			button.channel.send({
				files: ['./tenor.gif'],
			});
		}
		else if (button.id === "des") {
			button.channel.send("EAT ZINNIG \nAAAAAAAAAAAAAAAAAAAA ***nom***");
		}
		else if (button.id === "nom") {
			button.channel.send({
				files: ['./cat2.gif'],
			});
		}
	  });
}

function test(message) {
	return message.reply('pong uwu');
}

function awaitInteractionGuildRole(message) {
	let gp = new disbut.MessageButton()
	.setStyle('green')
	.setID("GuP")
	.setLabel('Guild Parties')

	let ch = new disbut.MessageButton()
	.setStyle('green')
	.setID("CH")
	.setLabel("Challenges")

	let vt = new disbut.MessageButton()
	.setStyle('green')
	.setID('VT')
	.setLabel('Venting')

	let buttonEmbed = new Discord.MessageEmbed()
	.setTitle('Guild Roles')
	.setColor('#00e1a3')
	.setDescription('Interested in small, fun events varying in length that happen on a weekly or bi-weekly basis (Like speedrunning The Eye, Harvesting Uth Runes, etc)? <@&800547442772148234> is the role for you!\n\nInterested in being pinged whenever we hold Prof Parties, Dungeon Parties, or Guild XP Grind Parties? Sign up for <@&800547586694971443>!\n\nNeed a place to vent, or want to seek advice from others? Press the button to join <@&786035931647180810>! Be sure to read the pin when you join.')

	message.channel.send('', {
		buttons : [ gp, ch, vt ],
		embed: buttonEmbed
	});
}

function awaitInteractionRole(message) {
	let grindParties = new disbut.MessageButton()
	.setStyle('blurple')
	.setID("GP")
	.setLabel('Grind Parties')

	let RP = new disbut.MessageButton()
	.setStyle('blurple')
	.setID("AN")
	.setLabel("Anime")

	let PD = new disbut.MessageButton()
	.setStyle('blurple')
	.setID('PD')
	.setLabel('Politics and Debate')

	let buttonEmbed = new Discord.MessageEmbed()
	.setTitle('Roles')
	.setColor('#00e1a3')
	.setDescription('Are you interested in Anime? Or are you into politics, philosophy or debate?\nClick below to get your roles!')

	message.channel.send('', {
		buttons : [ RP, PD ],
		embed: buttonEmbed
	});
}

// claim ping
function fetchTerr() {
	if (ESIClaims.length < 1 || terrClaimPingEnabled == false) {
		return;
	}
	else {
	var lostTerrCount = 0;
	var lostTerrList = ""
	request(`https://api.wynncraft.com/public_api.php?action=territoryList`, (err, resp, body) => {
		if (err) throw (err);
		var data = JSON.parse(body);
		if (data.territories) {
			for (var i in ESIClaims) {
				if (ESIClaims[i].guild != 'Empire of Sindria') {
					lostTerrList = lostTerrList.concat(`**${ESIClaims[i]}**\n[ ${ESIClaims[i].guild} ] [ ${ESIClaims[i].acquired} ]\n\n`);
					lostTerrCount + 1;
				}
			}
			if (lostTerrCount >= thresholdTerr && alreadyPinged == false) {
				ping(lostTerrList, lostTerrCount);
				addPingCounter();
			}
			else return;
		}
	});
	}
}

// set alreadyPinged to true so the code wont ping again until resetPingCouter() is called every 24 hours
function addPingCounter() {
	alreadyPinged = true;
}

// reset already pinged counter every 24 hours
function resetPingCounter() {
	alreadyPinged = false;
}

// ping the role
function ping(terrData, count) {
	if (terrClaimPingEnabled == false) return;
	else {
	const Ping = new Discord.MessageEmbed()
		.setTitle('Territory manager - Detected missing claims (Temporary)')
		.setColor('#ff7777')
		.setDescription(terrData)
		.setFooter(`Total lost claims : ${count}`)
	message.channel.send(Ping);
	client.channels.cache.get('606713555911311370').send(Ping);
	}
}

// timers
setInterval(fetchTerr, 300000);
setInterval(resetPingCounter, 86400000);

//event listener 'message' 
client.on('message', m => {
	console.log(`[ ${m.author.username} ] >> ${m.content}`);
});

// DSC client [ NOT discord.js client ]

client.login('ODIwMDA5Mzc3MDc1MTY3Mjkz.YEu7Pg.wp9MiGRT0IDzmzPojx5oxoym9wY');