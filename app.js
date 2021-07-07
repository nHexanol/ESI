const User = require('discord.js-self');
const Discord = require('discord.js');
const fs = require('fs');
const token = fs.readFileSync('./token.txt', 'utf8');

const userclient = new User.Client();
const client = new Discord.Client();

client.once('ready', async () => {
    console.log(`Client logged in ${client.user}`);
});

userclient.once('ready', async () => {
    console.log(`Client logged in ${userclient.user}`);
});

userclient.on('message', message => {
    switch (message.channel.id) {
        case "841423635294060574":
            client.channels.cache.get("859742188802801666").send(message.content);
            console.log(`[${message.author.username}] >> ${message.content}`);
            break;
        case "859745766758154240":
            client.channels.cache.get("859745766758154240").send(message.content);
            console.log(`[${message.author.username}] >> ${message.content}`);
            break;
    }
})

userclient.login(token);
client.login('ODU5NzQyMDA5MTExODcxNTA5.YNxHJA.YBRfDWaxj6rbOEu2gGFu7NA-Dao');