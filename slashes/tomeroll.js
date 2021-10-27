
const { Util } = require("discord.js");

module.exports = {
    name: 'tomeroll',
    description: 'Rolls for Tomes',
    type: 'CHAT_INPUT',
    callback: function tomeroll(client, interaction, options) {
        num = 5; // update!

        if (isNaN(num)) return;

        members = client.guilds.cache.get('554418045397762048').roles.cache.get('897320706973499452').members;

        chosen = members.random(num).filter(Boolean).map(m => Util.escapeMarkdown(m.displayName));

        interaction.reply("Warning: As of now the command does not produce truly random selections because of caching.\n\n" + chosen.join('\n'));
    }
}
