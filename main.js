const Discord = require("discord.js");
const fs = require("fs");
const diffler = require("diffler");
const util = require("util");
const request = require("request");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const repl = require('repl');
const session = repl.start();

const {createCanvas, loadImage} = require("canvas");
const { Client: DBClient } = require("pg");

/* commandHandler */
const { commandHandler } = require("./commandHandler");
const { interactionHandler } = require("./interactionHandler");

/* ping listener */
const { onPing } = require("./listeners/ping");

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
var enabledClaimPing = false;
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
const slashes = new interactionHandler(client);

client.on("ready", async() => {
	console.log(`Connecting to ESI-DB...`);

	const connectionString = fs.readFileSync('./dburi.txt', {encoding:'utf8', flag:'r'});
	client.db = new DBClient({connectionString});
	await client.db.connect();

	await client.db.query("SELECT CONCAT('Connected to ESI-DB at ', NOW()) AS \"success\"").then(r => console.log(r.rows[0].success));

	console.log(`Registering Commands...`);

	const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const {names, func} = require(`./commands/${file}`);
		commands.register(names, func);
	}

	// Clear cached commands
	await client.application.commands.set([]);
	for (const guildId of client.guilds.cache.keys()) {
		try {
			await client.application.commands.set([], guildId);
		} catch (e) {
			console.log(`Failed to sync guild ${client.guilds.cache.get(guildId).name}.`);
		}
	}

	await slashes.registerCommands('./slashes');
	await slashes.registerApps('./apps');

	console.log(`Registered Commands: ${[...commands.commands.keys()]}`);
	console.log(`Registered Slashes: ${[...slashes.commands.keys()]}`);
	console.log(`Registered CTXs: ${[...slashes.apps.keys()]}`);
});

client.on("messageCreate", commands.process.bind(commands));
client.on("interactionCreate", slashes.process.bind(slashes));

/* End Command Handler Stuff */

/* Ping Listener */
client.on("messageCreate", onPing);

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

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isButton()) {
		return;
	}

	const clicker = await interaction.guild.members.fetch(interaction.user.id);

	if (interaction.customId == "GuP") {
		if (clicker.roles.cache.has('800547586694971443')) {
			clicker.roles.remove('800547586694971443');
			await interaction.reply({ content: 'Removed Guild Parties role.', ephemeral: true });
		}
		else if (clicker.roles.cache.has('800547586694971443') == false) {
			clicker.roles.add('800547586694971443');
			await interaction.reply({ content: 'Added Guild Parties role.', ephemeral: true });
		}
	}
	else if (interaction.customId == "MG") {
		if (clicker.roles.cache.has('800547442772148234') == true) {
			await clicker.roles.remove('800547442772148234');
			await interaction.reply({ content: 'Removed Minigames role.', ephemeral: true });
		}
		else if (clicker.roles.cache.has('800547442772148234') == false) {
			await clicker.roles.add('800547442772148234');
			await interaction.reply({ content: 'Added Minigames role.', ephemeral: true });
		}
	}
	else if (interaction.customId == "VT") {
		if (clicker.roles.cache.has('554896955638153216')) {
			return await interaction.reply({ content: 'You are not eligible for this role.', ephemeral: true });
		}
		else if (clicker.roles.cache.has('786035931647180810') == true) {
			await clicker.roles.remove('786035931647180810');
			await interaction.reply({ content: 'Removed Venting role.', ephemeral: true });
		}
		else if (clicker.roles.cache.has('786035931647180810') == false) {
			await clicker.roles.add('786035931647180810');
			await interaction.reply({ content: 'Added Venting role.', ephemeral: true });
		}
	}
	else if (interaction.customId == "RP") {
		if (clicker.roles.cache.has('591763786474455130') == true) {
			await clicker.roles.remove('591763786474455130');
			await interaction.reply({ content: 'Removed Roleplay role.', ephemeral: true });
		}
		else if (clicker.roles.cache.has('591763786474455130') == false) {
			await clicker.roles.add('591763786474455130');
			await interaction.reply({ content: 'Added Roleplay role.', ephemeral: true });
		}
	}
	else if (interaction.customId == "AN") {
		if (clicker.roles.cache.has('854233448494530571') == true) {
			await clicker.roles.remove('854233448494530571');
			await interaction.reply({ content: 'Removed Anime role.', ephemeral: true });
		}
		else if (clicker.roles.cache.has('854233448494530571') == false) {
			await clicker.roles.add('854233448494530571');
			await interaction.reply({ content: 'Added Anime role.', ephemeral: true });
		}
	}
	else if (interaction.customId == "PD") {
		if (clicker.roles.cache.has('728104157852205056') == true) {
			await clicker.roles.remove('728104157852205056');
			await interaction.reply({ content: 'Removed Politics and Debate role.', ephemeral: true });
		}
		else if (clicker.roles.cache.has('728104157852205056') == false) {
			await clicker.roles.add('728104157852205056');
			await interaction.reply({ content: 'Added Politics and Debate role.', ephemeral: true });
		}
	}
	else if (interaction.customId == "SV") {
		if (clicker.roles.cache.has('722856382025564161') == true) {
			await clicker.roles.remove('722856382025564161');
			await interaction.reply({ content: 'Removed Sindrian Vanguard role.', ephemeral: true });
		}
		else if (clicker.roles.cache.has('722856382025564161') == false) {
			await clicker.roles.add('722856382025564161');
			await interaction.reply({ content: 'Added Sindrian Vanguard role.', ephemeral: true });
		}
	}
	else if (interaction.customId == "SC") {
		if (clicker.roles.cache.has('891933320856895498') == true) {
			await clicker.roles.remove('891933320856895498');
			await interaction.reply({ content: 'Removed Sindrian Crusader role.', ephemeral: true });
		}
		else if (clicker.roles.cache.has('891933320856895498') == false) {
			await clicker.roles.add('891933320856895498');
			await interaction.reply({ content: 'Added Sindrian Crusader role.', ephemeral: true });
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

		message.channel.send({embeds: [eat_embed]});
	}
});

client.on('messageCreate', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	var args = message.content.slice(prefix.length).trim().split(" ");
	var cmd = args.shift().toLowerCase();

	if (cmd == "requestGuild") {
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
		// message.channel.send("FOR DEBUGGING PURPOSE DON'T USE IF NOT NECESSARY!");
		// return;
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

			out = util.inspect(out);
			const Evaluate = new Discord.MessageEmbed()
				.setColor('#ffaa33')
				.setTitle('Evaluate')
				.setDescription(`\`\`\`js\n>${cmd}\n< ${out}\n\`\`\``)
				.setFooter(message.author.username)
				.setTimestamp()
			message.channel.send({embeds: [Evaluate]});
		}
		catch (e) {
			console.log(e);
			const err = new Discord.MessageEmbed()
				.setColor('#ffaa33')
				.setTitle('Evaluate')
				.setDescription(`\`\`\`js\n>${cmd}\n< ${out}\n\`\`\``)
				.setFooter(message.author.username)
				.setTimestamp()
			message.channel.send({embeds: [err]});
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
			if (!enabledClaimPing) return;
			else if (enabledClaimPing) {
				alreadyPinged = true;
				setTimeout(resetPingCounter, 32400000);
				client.channels.cache.get('606713555911311370').send(`${claim_ping_role}` , {
					files: ['./buffer.png']
				})
				.catch(function (error) {
					client.channels.cache.get('An error has occured.');
					client.channels.cache.get('784352935198064660').send(`\`\`\`js\n${error}\n\`\`\``);
					console.log(error);
				});
			}
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
			if (lost_count > 2 && alreadyPinged == false && strat == 0 && enabledClaimPing) {
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
	    if (enabledClaimPing) send_terr();
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
		message.channel.send({embeds: [Ping]});
		client.channels.cache.get('784352935198064660').send({embeds: [Ping]});
	}
}

//setInterval(guildMemberUpdateListener, 60000);
var claim_ping_intervalID = setInterval(claim_ping, 120000);
setInterval(data_caching, 900000);
setInterval(get_guild_member_playtime, 86400000);

//event listener 'message'
client.on('messageCreate', m => {
	console.log(`[ ${m.member?.displayName ?? m.author.username} ] >> ${m.content}`);
});

var token = fs.readFileSync('./token.txt', {encoding:'utf8', flag:'r'}).replace("\n", "");
client.login(token)
.then(token = "")
.catch(function (error) {
	console.log('Login failed :' + error);
});

process.on('uncaughtException', (reason) => {
	console.log(reason);
	client.channels.cache.get('673360036650680321').send(`\`\`\`js\n${reason}\n\`\`\``);
});

process.on('exit', async () => {
	console.log("Exiting...");
	await client.db.end();
});

process.on("SIGINT", process.exit);
