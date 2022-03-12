const { writeFile, unlink } = require("fs/promises");

const { roleAllow, roleDeny } = require("../interactionHandler");
const { readDescription } = require("../utils");

module.exports = {
    name: 'close',
    description: 'Closes an application',
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
    callback: async function close(interaction, _options) {
        const logChannel = await interaction.guild.channels.fetch('670622024967782422');

        const description = interaction.channel.topic;

        if (readDescription(description) == null) {
            await interaction.reply("Invalid application channel!");
            return;
        }
        
        const content = `**${interaction.channel.name}**\n${interaction.channel.topic}`;

        filename = interaction.channel.name;
        if (!filename.endsWith('.txt')) filename += '.txt';
        filename = './' + filename;

        messages = await interaction.channel.messages.fetch();
        messageString = Array.from(messages.values()).reverse()
                          .map(m => `[${m.member?.displayName ?? m.author?.tag}]\n${m.content}`)
                          .join('\n\n');

        await writeFile(filename, messageString);
        await logChannel.send({ content, files: [filename] });
        await unlink(filename);
        await interaction.reply({content: "Done!", ephemeral: true});
        await interaction.channel.delete();
    }
}
