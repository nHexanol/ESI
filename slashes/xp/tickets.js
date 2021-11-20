const { Util, MessageEmbed } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { createOption } = require("../../interactionHandler");

module.exports = {
    name: 'tickets',
    description: 'Shows your Tickets (may be outdated, use /xp top to update)',
    options: {
        username: createOption("STRING", "minecraft username", true)
    },
    callback: async function xptickets(interaction, options) {
        await interaction.deferReply();

        const db = interaction.client.db;

        const res = await db.query(`SELECT xpend - xpstart AS diff 
                                    FROM xp WHERE username = $1`, 
                                   [options.username]);

        const xp = Number.parseInt(res.rows[0].diff);

        // Slight scaling factor..
        const scaledxp = xp / 20e9 * 1.0000520865887477;
        const tickets = Math.floor(80 * Math.atan(scaledxp));

        const xpCur = Math.tan(tickets / 80) * 20e9 / 1.0000520865887477;
        const xpNext = Math.tan((tickets + 1) / 80) * 20e9 / 1.0000520865887477;
        const xpReq = Math.ceil(xpNext - xpCur);
        const xpNeeded = Math.ceil(xp - xpCur);
                            
        await interaction.editReply(`**__${options.username}__**\n` +
                                    `**XP**: ${xp.toLocaleString()}\n` +
                                    `**Tickets**: ${tickets.toLocaleString()}\n` +
                                    `**Next Ticket**: ${xpNeeded.toLocaleString()}/${xpReq.toLocaleString()}`);
    }
}
