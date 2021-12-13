const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const { createOption, createChoice } = require("../interactionHandler");
const { toDashedUUID, getDescription } = require("../utils");

const CONFIG = require("../config/application");

module.exports = {
    name: 'apply',
    description: 'Applies to the Guild',
    options: {
		username: createOption("STRING", "Your Minecraft username"),
        type: createOption("INTEGER", "Type of application", false, 0, [
			createChoice("Member", 0),
			createChoice("Veteran", 1),
			createChoice("Envoy", 2)
		]),
		force: createOption("BOOLEAN", "Force application while in guild", false, false)
    },
	guildIds: ['554418045397762048'],
    callback: async function apply(interaction, options) {

		options.force = options.force || (options.type == 2);

        let did = interaction.user.id;

        const lowercaseName = options.username.toLowerCase();

		// if (args[0] == "-h" || args[0] == "--help" || typeof (args[0]) == 'undefined' || !args[0]) {
		// 	if (message.mentions.length > 0) {
		// 		var mentioned = message.mentions.first();
		// 	}
		// 	const applyhelp = new Discord.MessageEmbed()
		// 		.setTitle('Application')
		// 		.setColor('#11ff44')
		// 		.setDescription('Use .a [IGN] or .apply [IGN] to create an application, Use [-f/v/e] in order to specify which application type you are creating if nessecary.')
		// 		.addFields(
		// 			{ name: '-f or --force', value: 'Creates an application for a player currently in another guild.' },
		// 			{ name: '-v or --veteran', value: 'Creates an application for returning Veterans of the guild.' },
		// 			{ name: '-e or --envoy', value: 'Creates an application for Duocitizens.' }
		// 		)
		// 	client.users.cache.get(message.author.id).send(applyhelp);
		// 	return;
		// }

		// Let's request UUID from Mojang API first
		
		const mojangResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${lowercaseName}`);

		if (!mojangResponse.ok) {
			await interaction.reply({ content: "Failed to fetch from Mojang API!", ephemeral: true });
			return;
		}

		const uuid = await mojangResponse.json().then(json => json.id);

		const wynnResponse = await fetch(`https://api.wynncraft.com/v2/player/${toDashedUUID(uuid)}/stats`);

		if (!wynnResponse.ok) {
			await interaction.reply({ content: "Failed to fetch from Wynncraft API! Check that your username is correct.", ephemeral: true });
			return;
		}

		const data = await wynnResponse.json().then(res => res.data[0]);

		const username = data.username;
		const guild = data.guild?.name;

		const plus = (a, b) => a + b;

		const levelTotal = data.classes.map(c => Object.values(c.professions).map(p => p.level).reduce(plus)).reduce(plus);
		const levelCombatMax = Math.max(...data.classes.map(c => c.professions.combat.level));

		const esiGuild = interaction.guild;

		// APIGuildMembers aren't fun so we fetch
		const author = await esiGuild.members.fetch(interaction.user.id);

		if (guild != null && !options.force) {
			await interaction.reply({ content: "You are already in a guild! (use the `force` flag to override)", ephemeral: true });
			return;
		}

		// Veteran check
		if (options.type == 1 && !author.roles.cache.has('706338091312349195')) {
			await interaction.reply({ content: "You are not a veteran!", ephemeral: true });
			return;
		}

		await interaction.deferReply({ ephemeral: true });

		const d = new Date();
		const timestamp = d.toLocaleString();

		const appChannel = await interaction.guild.channels.create(`application-${username}`, {
			topic: getDescription(options.type, username, author.id, uuid, timestamp),
			type: 'GUILD_TEXT',
			parent: '673360035098918932',
			permissionOverwrites: [
				{
					id: esiGuild.roles.everyone,
					type: 'role',
					deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_MESSAGES_IN_THREADS'],
				},
				{
					id: '683489556875444248',
					type: 'role',
					allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
				},
				{
					id: '246865469963763713',
					type: 'member',
					allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
				},
				{
					id: did,
					type: 'member',
					allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
				},
			],
		});

		// Make thread and send samples
		if (CONFIG[options.type].sample != null) {
			const sampleThread = await appChannel.threads.create({
				name: "Sample Apps (Click Me!)",
				autoArchiveDuration: 4320,
				reason: "Application"
			});

			await sampleThread.send(CONFIG[options.type].sample);
		}

		// The application messages are in the config file
		await appChannel.send(CONFIG[options.type].form);
		await appChannel.send(CONFIG[options.type].details({ author, guild, username, levelTotal, levelCombatMax }));

		await interaction.editReply({ content: `Channel ${appChannel} has been created for you.`, ephemeral: true });
    }
}
