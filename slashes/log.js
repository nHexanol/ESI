const {writeFile, unlink} = require("fs/promises");
const {createOption} = require("../interactionHandler");

module.exports = {
    name: 'log',
    description: 'Logs the contents of another channel to this channel in a file. (max. 100 messages)',
    options: {
        channel: createOption('CHANNEL', 'channel to log'),
        filename: createOption('STRING', 'name of the file', false)
    },
    callback: async function log(_client, interaction, options) {
        filename = options.filename || options.channel.name;
        if (!filename.endsWith('.txt')) filename += '.txt';
        filename = './' + filename;

        messages = await options.channel.messages.fetch();
        messageString = Array.from(messages.values()).reverse()
                          .map(m => `[${m.member?.displayName ?? m.author?.tag}]\n${m.content}`)
                          .join('\n\n');

        await writeFile(filename, messageString);
        await interaction.channel.send({files: [filename]});
        await unlink(filename);
        await interaction.reply({content: "Done!", ephemeral: true});
    }
}
