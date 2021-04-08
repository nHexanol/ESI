const UserDiscord = require('discord.js-self');
const Discord = require('discord.js');
const os = require('os')
const bclient = new Discord.Client();
const user = new UserDiscord.Client();

user.on('message', m => {
if (m.channel.id == '642427859146768391') {
    bclient.channels.cache.get('829130320220651533').send(`${m.member.nickname}\n> ${m.content}`);
}

else {
    console.log(`[ ${m.guild.name} ][ ${m.channel.name} ][ ${m.author.username} || ${m.member.nickname} ]\n>> ${m.content}\n`)
}
});

user.login("MjQ2ODY1NDY5OTYzNzYzNzEz.YEJjFA.DdeVWO252sz8za8cQ49RUwBHXnc");
bclient.login('ODI0MjM2Mzg5NzIxMDQ3MDUw.YFsb9A.kzBG2Q6V7L3gVlkqswjn7hlTxQg');