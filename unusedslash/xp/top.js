const { Util, MessageEmbed } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    name: 'top',
    description: 'Shows the XP Leaderboard',
    options: {},
    callback: async function xptop(interaction, _options) {
        await interaction.deferReply();

        const db = interaction.client.db;
        const response = await fetch("https://api.wynncraft.com/public_api.php?action=guildStats&command=Empire+of+Sindria");
        
        if (!response.ok) {
            await interaction.editReply("Could not connect to Wynncraft API.");
            return;
        }

        const data = await response.json();

        for await (const member of data.members) {
            await db.query("INSERT INTO xp (username, xpend) VALUES ($1, $2) \
                            ON CONFLICT (username) DO UPDATE SET xpend = excluded.xpend",
                           [member.name, member.contributed]);
        }

        const top = await db.query("SELECT username, xpend - xpstart AS diff \
                                    FROM xp ORDER BY diff DESC LIMIT 10");
        const names = top.rows.map(r => Util.escapeMarkdown(r.username));
        const xps = top.rows.map(r => Number.parseInt(r.diff).toLocaleString());

        const embed = new MessageEmbed({
            title: "Guild XP Leaderboard",
            color: "RANDOM"
        });

        embed.addField("Name", '\n' + names.join('\n'), true);
        embed.addField("XP", '\n' + xps.join('\n'), true);

        await interaction.editReply({ embeds: [embed] });
    }
}
