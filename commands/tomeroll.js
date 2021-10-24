const { Util } = require("discord.js");

module.exports = {
    names: ["tomeroll"],
    func: function tomeroll(client, message, num, ...args) {
        num = parseInt(num);

        if (isNaN(num)) return;

        members = client.guilds.cache.get('554418045397762048').roles.cache.get('897320706973499452').members;

        chosen = members.random(num).filter(Boolean).map(m => Util.escapeMarkdown(m.displayName));

        message.channel.send(chosen.join('\n'));
    }
}
