const fetch = require("node-fetch");

module.exports = {
    names: ["find"],
    func: function find(client, message, username, ...args) {
        if(!username) return message.channel.send("Please provide a minecraft username to find...");

        fetch(`https://api.wynncraft.com/v2/player/${username}/stats`)
        .then(res => res.json())
        .then((json => {
            if(json.code === 400) return message.channel.send("Minecraft username is not valid.")

            if (!json.data[0].meta.location.online) var online = `${username} is not currently online any Wynncraft server....`;
            else if (json.data[0].meta.location.online) var online = `${username} is currently on server ${json.data[0].meta.location.server}`;
            message.channel.send(online);
        }));
    }
}
