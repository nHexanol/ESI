const Discord = require("discord.js");
const fs = require("fs");
const diffler = require("diffler");
const util = require("util");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const {createCanvas, loadImage} = require("canvas");

/* commandHandler */
const {commandHandler} = require("./commandHandler");
const {slashHandler} = require("./slashHandler");

const client = new Discord.Client({intents: new Discord.Intents(0b111111000100111)});

const terr_width = 1332;
const terr_height = 759;
const canvas2 = createCanvas(terr_width, terr_height);
const ctx2 = canvas2.getContext('2d');

var prefix = ".";
var eat_prefix = ">";
var previousGuildMemberCount = 0;
// var previousGuildMemberData = {};
// var currentGuildMemberCount = 0;
// var currentGuildMemberData = {}
var pythonProcessDebug = true;
var terrClaimPingEnabled = false;
// var fetchObjInterval = 604800000;
// var claimInterval = 300000;
var thresholdTerr = 3;
// var memberObj = [];
var applying = [];
var alreadyPinged = false;
// var Role = '<@246865469963763713>';
var claim_ping_role = "<@&722856382025564161>";

var resources = [ "🐟", "🐟", "🐟","⛏️","💲 💲 ⛏️", "⛏️" ,"🌳", "🌳", "⛏️", "⛏️", "⛏️", "⛏️", "🌳", "🌳", "🌾", "⛏️", "⛏️ 🌿 🐟 🌳" ,"⛏️" ,"🌳" ,"⛏️" ,"🌳" , "⛏️", "⛏️" ,"⛏️ ⛏️" ,"⛏️" ,"🌿" ,"⛏️" ];
var allies = [
    "Avicia",
    "Emorians",
    "Guardian of Wynn",
    "HackForums",
    "IceBlue Team",
    "The Simple Ones",
    "Mystic Woods",
    "Astrum Pantheon",
    "Gopniks",
    "Lux Nova",
    "The Mage Legacy",
    "Paladins United",
    "Titans Valor",
    "The Aquarium",
    "The FishTank",
    "TheNoLifes",
    "ShadowFall",
    "The Dark Phoenix",
    "Jeus",
    "Nefarious Ravens"
];

var cordX1 = [72, 118, 180, 264, 435, 726, 820, 290, 74, 469, 596, 726, 793, 1218, 1189, 186, 74, 469, 596, 726, 785, 185, 290, 185, 186, 642, 557];
var cordX2 = [117, 179, 263, 356, 577, 619, 1051, 186, 185, 347, 481, 619, 973, 1065, 1066, 290, 185, 347, 482, 614, 973, 74, 186, 74, 289, 716, 637];
var cordY1 = [201, 201, 201, 201, 270, 175, 260, 356, 355, 421, 421, 376, 456, 197, 312, 479, 477, 533, 533, 533, 642, 585, 586, 664, 664, 698, 698];
var cordY2 = [64, 64, 64, 64, 70, 60, 78, 248, 248, 271, 271, 175, 272, 67, 219, 358, 358, 427, 426, 379, 457, 481, 481, 592, 593, 567, 568];

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
	data_caching();
})

/* Command Handler Stuff */
const commands = new commandHandler(client, ".");
const slashes = new slashHandler(client);

client.on("ready", async() => {
	console.log(`Registering Commands...`);

	const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const {names, func} = require(`./commands/${file}`);
		commands.register(names, func);
	}

	const slashFiles = fs.readdirSync("./slashes").filter(file => file.endsWith(".js"));
	for (const file of slashFiles) {
		const {callback, ...slash} = require(`./slashes/${file}`);
		await slashes.register(slash, callback);
	}

	console.log(`Registered Commands: ${[...commands.commands.keys()]}`);
	console.log(`Registered Slashes: ${[...slashes.commands.keys()]}`);
});
client.on("messageCreate", commands.process.bind(commands));
client.on("interactionCreate", slashes.process.bind(slashes));

/* End Command Handler Stuff */

client.on('guildMemberAdd', member => {
//    client.channels.cache.get('554418045397762050').send(`Welcome ${member} to the Empire of Sindria Discord server! If you're looking to apply to ESI, please use \`.apply <ign>\` here or in <#554894605217169418>; if you're just visiting, have fun!`);
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
		if (button.clicker.member.roles.cache.has('554896955638153216')) {
			button.defer();
			return client.users.cache.get(button.clicker.user.id).send('You are not eligible for this role.');
		}
		else if (button.clicker.member.roles.cache.has('786035931647180810') == true) {
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

client.on('messageCreate', mesg => {
	if (mesg.channel.id == "622668875485675532" && mesg.author.id == "418413540857085972") {
		client.channels.cache.get('622668875485675532').send({
			files: ['./buffer.png']
		})
		.catch(console.log);
	}
});

client.on('messageCreate', message => {
	if (!message.content.startsWith(eat_prefix) || message.author.bot) return;
	var args = message.content.slice(eat_prefix.length).trim().split(" ");
	var cmd = args.shift().toLowerCase();



	if (cmd == "eat" || cmd == "vore") {
		var rand = Math.ceil(Math.random() * 5);
		switch (rand) {
			case 1:
				file = "https://media.discordapp.net/attachments/855444056493391885/864417395857424404/0.gif";
				break;
			case 2:
				file = "https://media1.tenor.com/images/d3b0f6cfa4dbf8ec178efaaf130412c7/tenor.gif?itemid=18100206";
				break;
			case 3:
				file = "https://cdn.discordapp.com/attachments/855444056493391885/864417402614448135/3.gif";
				break;
			case 4:
				file = "https://cdn.discordapp.com/attachments/855444056493391885/864417405827547146/2.gif";
				break;
			case 5:
				file = "https://cdn.discordapp.com/attachments/855444056493391885/864417407186763776/4.gif";
				break;
		}

		if (message.member.nickname == null) {
			var nickname = message.member.displayName;
		}
		else if (message.member.nickname != null) {
			var nickname = message.member.nickname;
		}
		if(!args[0]){
			try {
			var ate = "nothing xdrofl";
			} catch (e) {
				message.channel.send('An error has occured.')
			}
		}
		if (!message.mentions.members.first()) {
			try {
				var ate = message.mentions.members.first().nickname;
			}
			catch (e) {
				var ate = args.join(' ');
			}

		}else if (message.mentions.members.first().nickname == null) {
			try {
				var ate = message.mentions.members.first().displayName;
			}
			catch (e) {
				message.channel.send('An error has occured.')
			}
		}

		else if (message.mentions.members.first().nickname != null) {
			try {
				var ate = message.mentions.members.first().nickname;
			}
			catch (e) {
				message.channel.send('An error has occured.')
			}
		}

		const eat_embed = new Discord.MessageEmbed()
			.setTitle(`${nickname} ate ${ate}`)
			.setImage(file)

		message.channel.send(eat_embed);
	}
});

client.on('messageCreate', message => {
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
				if (message.mentions.length > 0) {
					var mentioned = message.mentions.first();
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
					var username = data.data[0].username;
					var guild = JSON.stringify(data.data[0].guild.name).replace('"', '').replace('"', '');

					if (guild != 'null' && !args[1]) {
						// already in guild
						message.channel.send(`You're currently in another guild! In order to apply, please do .apply ${args[0]} -f in order to apply as an in-game member, or do .apply ${args[0]} -e to apply as a Duocitizen.`);
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
									message.guild.channels.cache.get(result.id).send(`Username : ${username}\nTotal Level: ${levelTotal}\nHighest Combat Level: ${classL}\n\n<@${message.author.id}> Please check that your above details are correct and fill out the application form:\n\nPreferred Pronouns (optional):\nAge (optional):\nCountry & Timezone:\nHow did you find ESI?\nHow can you contribute to ESI?\nWhat is your highest combat level class?\nHow active are you on Wynncraft?\nWhat do you enjoy about Wynncraft?\nBesides playing Wynn, what else do you enjoy doing?\nPrevious Guilds you’ve been in and why you’ve left them:\nAdditional Notes:`);
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
									let role = message.member.guild.roles.cache.find(role => role.name === "Squire");
									if (role) message.guild.members.cache.get(message.author.id).roles.add(role);
									let role2 = message.member.guild.roles.cache.find(role => role.name === "Sindrian Citizen");
									if (role2) message.guild.members.cache.get(message.author.id).roles.add(role2);
									message.member.setNickname(`Squire ${username}`);
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
									message.guild.channels.cache.get(result.id).send(`Username : ${username}\nTotal Level: ${levelTotal}\nHighest Combat Level: ${levelClassHighest}\n\n<@${message.author.id}> Please check that your above details are correct and fill out the application form:\n\nCountry/Timezone:\nPreferred Pronouns (optional):\nAge (optional):\nHow did you find ESI?\nHow can you contribute to ESI?\nWhat is your highest combat level class?\nHow active are you on Wynncraft?\nWhat do you enjoy about Wynncraft?\nBesides playing Wynn, what else do you enjoy doing?\nPrevious Guilds you’ve been in and why you’ve left them:\nAdditional Notes:`);
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

	else if (cmd == "debug" && message.author.id == "246865469963763713") {
		pythonProcessDebug = !pythonProcessDebug;
		message.channel.send(pythonProcessDebug);
	}

	else if (cmd == "requestGuild") {
		var filtered = message.content.replace('.g ', '').replace(/ /g, "+");
		var username = "";
		var rank = "";
		var server = "";

		function pushDataUsr(INPUTusername) {
			username = username.concat(`${INPUTusername}\n`);
		}

		function pushDataRank(INPUTrank) {
			rank = rank.concat(`${INPUTrank}\n`);
		}

		function pushDataServer(INPUTserver) {
			server = server.concat(`${INPUTserver}\n`);
		}

		request(`https://api.wynncraft.com/public_api.php?action=guildStats&command=${filtered}`, (err, resp, body) => {
				if (err) message.channel.send(err);
				var data = JSON.parse(body);
				for (const m in data.members) {
					request(`https://api.wynncraft.com/v2/player/${data.members[m].name}/stats`, (err, resp, body) => {
					if (err) message.channel.send(err);
					var player = JSON.parse(body);
					if (!player.guild || !player.username) return;
					else if (player.meta.location.online == true && player.meta.location.server != 'null') {

						var starRank = "";

						if (player.guild.rank == "OWNER") starRank = "*****";
						else if (player.guild.rank == "CHIEF") starRank = "****";
						else if (player.guild.rank == "STRATEGIST") starRank = "***";
						else if (player.guild.rank == "CAPTAIN") starRank = "**";
						else if (player.guild.rank == "RECRUITER") starRank = "*";
						else if (player.guild.rank == "RECRUIT") starRank = "";
						else starRank == "UNKWN";

						console.log(`${username} ${starRank} ${server}`);
						pushDataUsr(username);
						pushDataRank(starRank);
						pushDataServer(server);

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

	else if (cmd == 'terr') {
		// old territory manager
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

else if (cmd == "function" && (message.author.id == "246865469963763713" || message.member.roles.cache.has('600185623474601995'))) {
	try {
	return eval(`${args[0]}(message);`);
	}
	catch(err) {
		message.channel.send(`\`\`\`js\n${err}\n\`\`\``);
	}
}

	else if (cmd == "terrls") {
		territories_feed(message);
	}

	else if (cmd == 'ev' && (message.author.id == '246865469963763713' || message.author.id == '723715951786328080' || message.author.id == '475440146221760512' || message.author.id == 330509305663193091 || message.author.id == 722992562989695086 || message.author.id == 282964164358438922)) {
		//eval, for debugging purpose don't use if not nessessary
		var cmd = "";
		if (message.content.includes('client.token')) {
			message.channel.send("no");
			return;
		}
		for (var i = 0; i < args.length; i++) {
			var cmd = cmd.concat(` ${args[i]}`);
		}
		try {
			var out = eval(cmd);
			if (out.includes(client.token)) {
				out.replace(client.token, "Token");
			}
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

function data_caching() {
	fetch('https://api.wynncraft.com/public_api.php?action=guildStats&command=Empire+of+Sindria')
	.then(res => res.json())
	.then(function (json) {
		cache = json;
	})
}

function guildMemberUpdateListener() {
	var currentGuildMemberData = {};
	fetch('https://api.wynncraft.com/public_api.php?action=guildStats&command=Empire+of+Sindria')
	.then(res => res.json())
	.then(json => function (json) {
		previousGuildMemberCount = indexOf(json.members);
		if (indexOf(json.member) == previousGuildMemberCount) return;
		else if (indexOf(json.member) > previousGuildMemberCount) {
			currentGuildMemberData = json;
			var added = diffler(currentGuildMemberData, previousGuildMemberCount);
			var parsedAddedDiffler = added.members;
			console.log(parsedAddedDiffler);
		}
		else if (indexOf(json.member) < previousGuildMemberCount) {
			currentGuildMemberData = json;
			var removed = diffler(currentGuildMemberData, previousGuildMemberCount);
			var parsedRemovedDiffler = removed.members;
			console.log(parsedRemovedDiffler);
		}
	})
}

var lost_count_old = 0;
function claim_ping() {
	var lost_count = 0;
	fetch('https://api.wynncraft.com/public_api.php?action=territoryList')
    .then(res => res.json())
    .then(function (json) {
        function save() {
            const buffer = canvas2.toBuffer('image/png');
            fs.writeFileSync('./buffer.png', buffer);
        }

		function send_terr() {
			alreadyPinged = true;
			setTimeout(resetPingCounter, 32400000);
			client.channels.cache.get('606713555911311370').send(`${claim_ping_role}` , {
				files: ['./buffer.png']
			})
			.catch(function (error) {
				client.channels.cache.get('An error has occured.');
				client.channels.cache.get('784352935198064660').send(`\`\`\`js\n${error}\n\`\`\``);
				console.log(error);
			})
		}

        async function load_base() {
            loadImage(`./asset/ESI.png`)
                .then((image) => {
                    ctx2.drawImage(image, 0, 0, terr_width, terr_height);
                });
        }
        async function add() {
            await load_base();   //wait for the image to load
            // trade route
            await loadImage('./asset/trade_route.png')
            .then(trimg => {
            ctx2.globalAlpha = 0.5;
            ctx2.drawImage(trimg, 0, 0, terr_width, terr_height);
            ctx2.globalAlpha = 1;
            })
            .catch(function (error) {
                console.log(error)
            });
            var name_arr = [];
            for (var t in cordX1) {
                //check owner
                var terr_overlay_colour = "#ffffff";
                var lost = false;
                if (json.territories[`${ESIClaims[t]}`].guild != "Empire of Sindria" && !allies.includes(json.territories[`${ESIClaims[t]}`].guild)) {
                    lost = true;
					lost_count++
                    terr_overlay_colour = "#ff2934";
                }
                else if (allies.includes(json.territories[`${ESIClaims[t]}`].guild)) {
                    terr_overlay_colour = "#69c5ff";
                }
                else if (json.territories[`${ESIClaims[t]}`].guild == "Empire of Sindria") {
                    terr_overlay_colour = "#94ffb1";
                }
                // fill rect overlay
                ctx2.fillStyle = terr_overlay_colour;
                ctx2.globalAlpha = 0.45;
                ctx2.fillRect(cordX1[t], cordY1[t], cordX2[t] - cordX1[t], cordY2[t] - cordY1[t]);
                ctx2.globalAlpha = 0.85;
                ctx2.strokeStyle = "#fff";
                ctx2.lineWidth = 1;
                ctx2.strokeRect(cordX1[t], cordY1[t], cordX2[t] - cordX1[t], cordY2[t] - cordY1[t]);
                ctx2.globalAlpha = 1;
            }
                // guild tag
                for (var t in cordX1) {
                await fetch(`https://api.wynncraft.com/public_api.php?action=guildStats&command=${json.territories[ESIClaims[t]].guild.replace(/ /g, "+")}`)
                .then(res => res.json())
                .then(gu_data => {
                    ctx2.font = "10pt Ubuntu";
                    ctx2.fillStyle = '#fff';
                    ctx2.strokeStyle = "#000";
                    ctx2.lineWidth = 0.005;
                    ctx2.textAlign = "center";

                    name_arr[t] = ESIClaims[t].split(' ');
                    name_arr[t].push(`[ ${gu_data.prefix} ]`);
                    for (var elem in name_arr) {
                        var lines = name_arr[elem].length;
                        switch (lines) {
                            case 1:
                            ctx2.fillText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2));
                            ctx2.strokeText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2));
                                break;
                            case 2:
                                ctx2.fillText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 7.5));
                                ctx2.strokeText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 7.5));
                                ctx2.fillText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 7.5));
                                ctx2.strokeText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 7.5));
                                break;
                            case 3:
                                ctx2.fillText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 15));
                                ctx2.strokeText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 15));
                                ctx2.fillText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines));
                                ctx2.strokeText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines));
                                ctx2.fillText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 15));
                                ctx2.strokeText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 15));
                                break;
                            case 4:
                                ctx2.fillText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 22.5));
                                ctx2.strokeText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 22.5));
                                ctx2.fillText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 7.5));
                                ctx2.strokeText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 7.5));
                                ctx2.fillText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 7.5));
                                ctx2.strokeText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 7.5));
                                ctx2.fillText(`${name_arr[elem][3]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 22.5));
                                ctx2.strokeText(`${name_arr[elem][3]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 22.5));
                                break;
                            case 5:
                                ctx2.fillText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 30));
                                ctx2.strokeText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 30));
                                ctx2.fillText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 15));
                                ctx2.strokeText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 15));
                                ctx2.fillText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines));
                                ctx2.strokeText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines));
                                ctx2.fillText(`${name_arr[elem][3]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 15));
                                ctx2.strokeText(`${name_arr[elem][3]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 15));
                                ctx2.fillText(`${name_arr[elem][4]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 30));
                                ctx2.strokeText(`${name_arr[elem][4]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 30));
                                break;
                            case 6:
                                ctx2.fillText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 37.5));
                                ctx2.strokeText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 37.5));
                                ctx2.fillText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 22.5));
                                ctx2.strokeText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 22.5));
                                ctx2.fillText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 7.5));
                                ctx2.strokeText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 75));
                                ctx2.fillText(`${name_arr[elem][3]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 7.5));
                                ctx2.strokeText(`${name_arr[elem][3]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 7.5));
                                ctx2.fillText(`${name_arr[elem][4]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 22.5));
                                ctx2.strokeText(`${name_arr[elem][4]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 22.5));
                                ctx2.fillText(`${name_arr[elem][5]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 37.5));
                                ctx2.strokeText(`${name_arr[elem][5]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 37.5));
                                break;
                        }}
                })
                .catch(e => console.log(e));

                // resource indicator
                ctx2.font = "bold 12pt Ubuntu";
                ctx2.fillStyle = '#fff';
                ctx2.textAlign = "center";
                ctx2.fillText(`${resources[t]}`, (cordX1[t] + cordX2[t]) / 2, ((cordY1[t]) - 5));
            }
        }
		var strat = 0;
		async function get_warrable() {
			var guild_member_obj = {};
			var online_players = "";
			await fetch('https://api.wynncraft.com/public_api.php?action=onlinePlayers')
			.then(serv => serv.json())
			.then(data => {
				online_players = JSON.stringify(data);
			})
			await fetch("https://api.wynncraft.com/public_api.php?action=guildStats&command=Empire+of+Sindria")
			.then(response => response.json())
			.then((data) => {
				for (var m in data.members) {
					if (online_players.includes(data.members[m].name) && data.members[m].rank== "OWNER") strat++;
					else if (online_players.includes(data.members[m].name) && data.members[m].rank== "CHIEF") strat++;
					else if (online_players.includes(data.members[m].name) && data.members[m].rank== "STRATEGIST") strat++;
				}
			})
			.catch(e => console.log(e));
		}

        async function process() {
            await add();
            save();
			await get_warrable();
			if (lost_count_old != lost_count) client.channels.cache.get('622668875485675532').send({
				files: ['./buffer.png']
			})
			lost_count_old = lost_count;
			if (lost_count > 2 && alreadyPinged == false && strat == 0) {
			send_terr();
			}
        }
        process();
    })
    .catch(function (error) {
        console.log(error);
    });
}

function territories_feed(message) {
	fetch('https://api.wynncraft.com/public_api.php?action=territoryList')
    .then(res => res.json())
    .then(function (json) {
        function save() {
            const buffer = canvas2.toBuffer('image/png');
            fs.writeFileSync('./buffer.png', buffer);
        }

		function send_terr() {
			message.channel.send({
				files: ['./buffer.png']
			})
			.catch(function (error) {
				message.channel.send('An error has occured.');
				client.channels.cache.get('784352935198064660').send(`\`\`\`js\n${error}\n\`\`\``);
				console.log(error);
			})
		}

        async function load_base() {
            loadImage(`./asset/ESI.png`)
                .then((image) => {
                    ctx2.drawImage(image, 0, 0, terr_width, terr_height);
                });
        }
        async function add() {
            await load_base();   //wait for the image to load
            // trade route
            await loadImage('./asset/trade_route.png')
            .then(trimg => {
            ctx2.globalAlpha = 0.5;
            ctx2.drawImage(trimg, 0, 0, terr_width, terr_height);
            ctx2.globalAlpha = 1;
            })
            .catch(function (error) {
                console.log(error)
            });
            var name_arr = [];
            for (var t in cordX1) {
                //check owner
                var terr_overlay_colour = "#ffffff";
                var lost = false;
                if (json.territories[`${ESIClaims[t]}`].guild != "Empire of Sindria" && !allies.includes(json.territories[`${ESIClaims[t]}`].guild)) {
                    lost = true;
                    terr_overlay_colour = "#ff2934";
                }
                else if (allies.includes(json.territories[`${ESIClaims[t]}`].guild)) {
                    terr_overlay_colour = "#69c5ff";
                }
                else if (json.territories[`${ESIClaims[t]}`].guild == "Empire of Sindria") {
                    terr_overlay_colour = "#94ffb1";
                }
                // fill rect overlay
                ctx2.fillStyle = terr_overlay_colour;
                ctx2.globalAlpha = 0.45;
                ctx2.fillRect(cordX1[t], cordY1[t], cordX2[t] - cordX1[t], cordY2[t] - cordY1[t]);
                ctx2.globalAlpha = 0.85;
                ctx2.strokeStyle = "#fff";
                ctx2.lineWidth = 1;
                ctx2.strokeRect(cordX1[t], cordY1[t], cordX2[t] - cordX1[t], cordY2[t] - cordY1[t]);
                ctx2.globalAlpha = 1;
            }
                // guild tag
                for (var t in cordX1) {
                console.log(ESIClaims[t]);
                await fetch(`https://api.wynncraft.com/public_api.php?action=guildStats&command=${json.territories[ESIClaims[t]].guild.replace(/ /g, "+")}`)
                .then(res => res.json())
                .then(gu_data => {
                    console.log(gu_data.prefix);
                    ctx2.font = "10pt Ubuntu";
                    ctx2.fillStyle = '#fff';
                    ctx2.strokeStyle = "#000";
                    ctx2.lineWidth = 0.005;
                    ctx2.textAlign = "center";

                    name_arr[t] = ESIClaims[t].split(' ');
                    name_arr[t].push(`[ ${gu_data.prefix} ]`);
                    console.log(name_arr);
                    for (var elem in name_arr) {
                        var lines = name_arr[elem].length;
                        switch (lines) {
                            case 1:
                            ctx2.fillText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2));
                            ctx2.strokeText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2));
                                break;
                            case 2:
                                ctx2.fillText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 7.5));
                                ctx2.strokeText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 7.5));
                                ctx2.fillText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 7.5));
                                ctx2.strokeText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 7.5));
                                break;
                            case 3:
                                ctx2.fillText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 15));
                                ctx2.strokeText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 15));
                                ctx2.fillText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines));
                                ctx2.strokeText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines));
                                ctx2.fillText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 15));
                                ctx2.strokeText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 15));
                                break;
                            case 4:
                                ctx2.fillText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 22.5));
                                ctx2.strokeText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 22.5));
                                ctx2.fillText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 7.5));
                                ctx2.strokeText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 7.5));
                                ctx2.fillText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 7.5));
                                ctx2.strokeText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 7.5));
                                ctx2.fillText(`${name_arr[elem][3]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 22.5));
                                ctx2.strokeText(`${name_arr[elem][3]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 22.5));
                                break;
                            case 5:
                                ctx2.fillText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 30));
                                ctx2.strokeText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 30));
                                ctx2.fillText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 15));
                                ctx2.strokeText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 15));
                                ctx2.fillText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines));
                                ctx2.strokeText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines));
                                ctx2.fillText(`${name_arr[elem][3]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 15));
                                ctx2.strokeText(`${name_arr[elem][3]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 15));
                                ctx2.fillText(`${name_arr[elem][4]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 30));
                                ctx2.strokeText(`${name_arr[elem][4]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 30));
                                break;
                            case 6:
                                ctx2.fillText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 37.5));
                                ctx2.strokeText(`${name_arr[elem][0]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 37.5));
                                ctx2.fillText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 22.5));
                                ctx2.strokeText(`${name_arr[elem][1]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 22.5));
                                ctx2.fillText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 7.5));
                                ctx2.strokeText(`${name_arr[elem][2]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines - 75));
                                ctx2.fillText(`${name_arr[elem][3]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 7.5));
                                ctx2.strokeText(`${name_arr[elem][3]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 7.5));
                                ctx2.fillText(`${name_arr[elem][4]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 22.5));
                                ctx2.strokeText(`${name_arr[elem][4]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 22.5));
                                ctx2.fillText(`${name_arr[elem][5]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 37.5));
                                ctx2.strokeText(`${name_arr[elem][5]}`, (cordX1[elem] + cordX2[elem]) / 2, ((cordY2[elem] + cordY1[elem]) / 2) + (lines + 37.5));
                                break;
                        }}
                })
                .catch(e => console.log(e));

                // resource indicator

                ctx2.font = "bold 12pt Ubuntu";
                ctx2.fillStyle = '#fff';
                ctx2.textAlign = "center";
                ctx2.fillText(`${resources[t]}`, (cordX1[t] + cordX2[t]) / 2, ((cordY1[t]) - 5));
            }
        }
        async function process() {
            await add();
            save();
			send_terr();
        }
        process();
    })
    .catch(function (error) {
        console.log(error);
    });
}

var liveFeed_intervalID = {}
function setupLiveFeed(message) {
	liveFeed_intervalID = setInterval(territories_feed(message), 60000);
}

function haltFeed(message) {
	clearInterval(liveFeed_intervalID);
}

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
	.setDescription('Are you interested in anime? Or are you into politics, philosophy or debate?\nClick below to get your roles!')

	message.channel.send('', {
		buttons : [ RP, PD ],
		embed: buttonEmbed
	});
}

// get playtime
async function get_guild_member_playtime() {
	var guild_members = [];
	var guild_playtime = [];
	await fetch('https://api.wynncraft.com/public_api.php?action=guildStats&command=Empire+of+Sindria')
	.then(response => response.json())
	.then(gu_obj => {
		for (var n in gu_obj.members) {
			guild_members.push(gu_obj.members[n].uuid);
			console.log(guild_members);
		}
	})
	.catch(console.log);
	for (var owo in guild_members) {
		await fetch(`https://api.wynncraft.com/v2/player/${guild_members[owo]}/stats`)
		.then(res => res.json())
		.then(function (json) {
			guild_playtime.push([json.data[0].username, json.data[0].meta.playtime/60*4.7]);
		})
		.catch(console.log);
		guild_playtime.sort(function (a, b) {
			return b[1] - a[1];
		});
	}
	fs.writeFileSync(`./playtime/${Math.ceil(Date.now() / 86400000)}.txt`, JSON.stringify(guild_playtime));

}

function get_territory() {
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
				if (data.territories[`${ESIClaims[i]}`].guild != "Empire of Sindria") {
				lostTerrList = lostTerrList.concat(`**${ESIClaims[i]}**\n[ ${ESIClaims[i].guild} ] [ ${ESIClaims[i].acquired} ]\n\n`);
				lostTerrCount++;
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

function resetPingCounter() {
	alreadyPinged = false;
}

function ping(terrData, count) {
	if (!terrClaimPingEnabled) return;
	else {
	const Ping = new Discord.MessageEmbed()
		.setTitle('Territory manager - Detected missing claims (Temporary)')
		.setColor('#ff7777')
		.setDescription(terrData)
		.setFooter(`Total lost claims : ${count}`)
	message.channel.send(Ping);
	client.channels.cache.get('784352935198064660').send(Ping);
	}
}

//setInterval(guildMemberUpdateListener, 60000);
var claim_ping_intervalID = setInterval(claim_ping, 120000);
setInterval(data_caching, 900000);
setInterval(get_guild_member_playtime, 86400000);

//event listener 'message'
client.on('message', m => {
	console.log(`[ ${m.member.displayName} ] >> ${m.content}`);
});

var token = fs.readFileSync('./token.txt', {encoding:'utf8', flag:'r'}).replace("\n", "");
client.login(token)
.then(token = "")
.catch(function (error) {
	console.log('Login failed :' + error);
});

process.on('uncaughtException', (exc) => {
	client.channels.cache.get('673360036650680321').send(`\`\`\`Uncaught Exception :\n${exc}\n\`\`\``);
})
