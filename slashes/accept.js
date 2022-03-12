const { roleAllow, roleDeny } = require("../interactionHandler");

const { readDescription } = require("../utils");

const CONFIG = require("../config/application");

module.exports = {
    name: 'accept',
    description: 'Accepts an application',
    guildIds: ['554418045397762048'],
    permissions: [
        roleDeny('554418045397762048'),
        roleAllow('554527079337820161'),
        roleAllow('683448131148447929'),
        roleAllow('683447475935379557'),
        roleAllow('554513014251061258'),
        roleAllow('554506531949772812'),
        roleAllow('554514811376107550')
    ],
    callback: async function accept(interaction, _options) {
        const description = interaction.channel.topic;
        const fields = readDescription(description);

        if (CONFIG[fields.type].accept == null) {
            await interaction.reply({ content: "Invalid application type to `/accept`!", ephemeral: true });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        const author = await interaction.guild.members.fetch(fields.discordId);

        await interaction.channel.send(CONFIG[fields.type].accept({ author }));

        const roleManager = author.roles;

        await roleManager.add(CONFIG[fields.type].roleAdd ?? []);

        if (CONFIG[fields.type].nickname != null) {
            await author.setNickname(CONFIG[fields.type].nickname({ username: fields.username }));
        }

        await interaction.editReply("Done!");
    }
}
