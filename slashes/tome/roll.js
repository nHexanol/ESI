const { Util } = require("discord.js");
const { Collection } = require("@discordjs/collection");
const { createOption } = require("../../interactionHandler");

module.exports = {
    name: 'roll',
    description: 'Rolls for Tomes',
    options: {
        number: createOption('INTEGER', 'Numnber of tomes to roll')
    },
    callback: async function tomeroll(client, interaction, options) {
        if (options.num <= 0) {
            interaction.reply({content: "`number` must be greater than 0!", ephemeral: true});
            return;
        }

        await interaction.deferReply();

        const guild = await interaction.client.guilds.fetch('554418045397762048');
        const guildMembers = await guild.members.fetch();
        const citizens = guildMembers.filter(m => m.roles.cache.get('554889169705500672'));

        const infoChannel = await guild?.channels.fetch('852304243595411528');
        const tomeMessage = await infoChannel?.messages.fetch('906986707591786557');
        const reactionUsers = await tomeMessage?.reactions.resolve('📚').users.fetch();

        const eligible = citizens.intersect(reactionUsers);

        console.log(eligible);
        console.log(eligible.random(options.num));

        chosen = eligible.random(options.num).filter(Boolean).map(m => Util.escapeMarkdown(m.displayName));

        interaction.reply(chosen.join('\n'));
    }
}
