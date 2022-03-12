const roles = require("../config/pingroles");

const lastping = {};

async function onPing(message) {
    if (message.webhookId != null) {
        return;
    }

    // (Rough) Check if message contains an attempted ping
    if (!message.content?.match(/@ ?[a-zA-Z]/)) {
        return;
    }

    // Try to resolve this ping
    var content = message.content;
    var now = Date.now();
    var replaced = [];
    const author = await message.guild.members.fetch(message.author.id);

    for (const [k, v] of Object.entries(roles)) {
        for (const alias of v.aliases) {
            const flag = alias.caseSensitive ? 'g' : 'gi'; 
            const re = RegExp(`@ ?${alias.name.replace(' ', ' ?')}`, flag);
            if (content.match(re)) {
                // Check for channel override
                if (v.allowedChannels != null) {
                    if (!v.allowedChannels.includes(message.channel.id)) {
                        continue;
                    }
                }
                if (v.disallowedChannels?.includes(message.channel.id)) {
                    continue;
                }

                // Check for role override
                if (v.allowedRoles != null) {
                    if (!author.roles.cache.hasAny(v.allowedRoles)) {
                        return;
                    }
                }
                if (author.roles.cache.hasAny(v.disallowedRoles)) {
                    return;
                }

                // If it's not on cooldown, replace the fake ping with a real ping
                if (now - (lastping[k] ?? 0) > v.cooldown) {
                    content = content.replace(re, `<@&${k}>`);
                    replaced.push(k);
                }
            }
        }
    }

    // If we replaced any, delete the message and send a fake webhook message
    if (replaced.length == 0) {
        return;
    }
    
    await message.delete();
    const webhooks = await message.channel.fetchWebhooks();
    const webhook = webhooks.first() ?? await message.channel.createWebhook('RolePinger');

    await webhook.send({
        username: author.displayName,
        avatarURL: author.displayAvatarURL(),
        content: content
    });

    for (const k of replaced) {
        lastping[k] = now;
    }
}

module.exports = { onPing };