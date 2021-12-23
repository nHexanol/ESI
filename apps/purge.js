module.exports = {
    name: 'Purge Until',
    type: 'MESSAGE',
    guildIds: ['554418045397762048'],
    callback: async function purge(interaction) {
        const message = interaction.options.getMessage('message');
        console.log(message);
        const channelID = message.channelId ?? message.channel_id;
        const channel = await interaction.client.channels.fetch(channelID);

        if (channel.type !== 'GUILD_TEXT') {
            interaction.reply({content: "You can only use this in a non-DM text channel.", ephemeral: true});
            return;
        }

        // member.user.id compatible for both GuildMember and APIGuildMember
        const memberID = interaction.member.user.id;
        if (!channel.permissionsFor(memberID).has("MANAGE_MESSAGES")) {
            interaction.reply({content: "You do not have permission to use this command.", ephemeral: true});
            return;
        }

        const toPurge = await channel.messages.fetch({limit: 100, after: message.id}, {cache: false});
        if (toPurge.size >= 100) {
            interaction.reply({content: "You can only purge 100 messages at once!", ephemeral: true});
            return;
        }

        toPurge.set(message.id, message);
        await channel.bulkDelete(toPurge);

        interaction.reply({content: `${toPurge.size} messages deleted!`, ephemeral: true});
    }
}
