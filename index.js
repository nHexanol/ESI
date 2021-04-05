const Discord = require('discord.js');
const fs = require('fs');
const os = require('os');
const diffler = require('diffler');
const request = require('request');
const util = require('util');
const splArr = require('split-array');
const d = new Date()

const client = new Discord.Client()
const prefix = "!";

var ext = "";

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	var args = message.content.slice(prefix.length).trim().split(" ");
	var cmd = args.shift().toLowerCase();

    if (cmd == 'ext') {
        var username = args[0];
        request(`https://api.wynncraft.com/v2/player/${args[0]}/stats`, (err, response, body) => {
            var data = JSON.parse(body);
            if (data.data[0].username) {
                fs.appendFileSync('./elm.txt', `${args[0]} ${Date.now()} `);
                message.channel.send(`\`${args[0]}\` Added`);
            }
        });
    }

    if (cmd == 'extf') {
        fs.appendFileSync('elm.txt', `${args[0]} ${Date.now()} `);
        message.channel.send(`\`${args[0]}\` Added`);
    }

    if (cmd == 'lsext') {
        var data = data = fs.readFileSync('./elm.txt', {encoding:'utf8', flag:'r'});
        if (!data.length) return;
        var members = data.trim().split(" ");
        console.log(members)
        for (const i in members) {
            if (typeof(members[i * 2] == 'undefined') || isNaN(members[i * 2 + 1])) {
                console.log(members[i * 2]);
                console.log(members[i * 2 + 1]);
                return;
            }
            ext = ext.concat(`\`\`\`\n${members[(i * 2)]} ${Date.now() - (members[i * 2 + 1] - 86400000).toFixed(0)} days\`\`\``)
        }
        message.channel.send(ext);
    }
});

client.login('ODIwMzM0OTM3OTk5NTQwMjI0.YEzqcg.XdA0ATqc1oEWqAsdimyZCY1skk0');
