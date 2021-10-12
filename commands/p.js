const fetch = require("node-fetch");
const fs = require("fs");
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    names: ["p"],
    func: function player(message, query, ...args) {
        var rand = Math.round(Math.random());
        if (rand == 0) {
            var colour = '#fff';
        }
        else if (rand == 1) {
            var colour = '#000';
        }

        const width = 1600;
        const height = 900
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        fetch(`https://api.wynncraft.com/v2/player/${query}/stats`)
        .then(res => res.json())
        .then(function (json) {
            if (!json.data[0]) {
                message.channel.send('Username not found.');
                return;
            }

            var highest_class = json.data[0].classes[0].name.replace(/([0-9])/g, "");
            switch (highest_class) {
                case "mage":
                    highest_class = "Mage";
                    break;
                case "shaman":
                    highest_class = "Shaman";
                    break;
                case "assassin":
                    highest_class = "Assassin";
                    break;
                case "warrior":
                    highest_class = "Warrior";
                    break;
                case "archer":
                    highest_class = "Archer";
                    break;
                case "darkwizard":
                    highest_class = "Dark Wizard";
                    break;
                case "skyseer":
                    highest_class = "Skyseer";
                    break;
                case "knight":
                    highest_class = "Knight";
                    break;
                case "ninja":
                    highest_class = "Ninja";
                    break;
                case "hunter":
                    highest_class = "Hunter";
                    break;
                default:
                    highest_class = "Unknown";
                    break;
            }

            if (!json.data[0].username) {
                message.channel.send('Username not found !');
                return;
            }

            async function send_img() {
                message.channel.send({
                    files: [`./player.png`]
                });
            }

            function save() {
                const buffer = canvas.toBuffer('image/png');
                fs.writeFileSync('./player.png', buffer);
            }

            async function load(rand) {
                loadImage(`./${rand}.png`)
                .then((image) => {
                    ctx.drawImage(image, 0, 0, width, height);
                });
            }

            if (!json.data[0].meta.location.online) {
            var lastSeen = Date.now() - Date.parse(json.data[0].meta.lastJoin)
                years = Math.floor(lastSeen / (365 * 24 * 60 * 60 * 1000));
                days = Math.floor((lastSeen - years * (365 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
                hours = Math.floor((lastSeen - years * (365 * 24 * 60 * 60 * 1000) - days * (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                minutes = Math.floor((lastSeen - years * (365 * 24 * 60 * 60 * 1000) - days * (24 * 60 * 60 * 1000) - hours * (60 * 60 * 1000)) / (60 * 1000));
                output = `${years > 0 ? years + " yr " : ""}${days > 0 ? days + " d " : ""}${hours > 0 ? hours + " hr " : ""}${minutes > 0 ? minutes + " min " : ""}`;
                output = (output[output.length - 1] == ":" ? output.slice(0, -1) : output).concat('ago');
            }
            else if (json.data[0].meta.location.online) output = "Online";

            async function add() {
                await load(rand);   //wait for the image to load
                //username, tag and online
                ctx.font = 'bold 55pt Ubuntu';
                ctx.textAlign = 'left';
                ctx.fillStyle = colour;
                ctx.fillText(`${json.data[0].username}`, 75, 125);
                var textWidth = ctx.measureText(json.data[0].username).width;
                ctx.font = '55pt Ubuntu';
                if (json.data[0].meta.tag.value != null) {
                    if (json.data[0].meta.location.online) {
                    ctx.fillText(`[${json.data[0].meta.tag.value}]  [${json.data[0].meta.location.server}]`, textWidth + 100, 125)
                    }
                    else if (!json.data[0].meta.location.online) {
                    ctx.fillText(`[${json.data[0].meta.tag.value}]`, textWidth + 100, 125)
                    }
                }
                //guild and their rank
                if (json.data[0].guild.name == null) {
                    var guild = "No guild"
                }
                else if (json.data[0].guild.name != null) {
                    var guild = `${json.data[0].guild.rank}  of  ${json.data[0].guild.name}`
                }
                ctx.font = '35pt Ubuntu';
                ctx.fillText(`${guild}`, 75, 195);

                // informations
                ctx.font = 'bold 45pt Ubuntu';
                ctx.fillText('Total level  :', 75, 300);
                var textWidth = ctx.measureText("Total level  :").width;
                ctx.font = '45pt Ubuntu';
                ctx.fillText(`C ${json.data[0].global.totalLevel.combat.toLocaleString('en-US')} + P ${json.data[0].global.totalLevel.profession.toLocaleString('en-US')} = ${json.data[0].global.totalLevel.combined.toLocaleString('en-US')}`, 100 + textWidth, 300);

                ctx.font = 'bold 45pt Ubuntu';
                ctx.fillText('Total playtime  :', 75, 375);
                var textWidth = ctx.measureText("Total playtime  :").width;
                ctx.font = '45pt Ubuntu';
                ctx.fillText(`${Math.round(Math.floor(json.data[0].meta.playtime)/60*4.7).toLocaleString('en-US')} hours`, 100 + textWidth, 375);

                ctx.font = 'bold 45pt Ubuntu';
                ctx.fillText('Total mobs killed  :', 75, 450);
                var textWidth = ctx.measureText("Total mobs killed  :").width;
                ctx.font = '45pt Ubuntu';
                ctx.fillText(`${json.data[0].global.mobsKilled.toLocaleString('en-US')} mobs`, 100 + textWidth, 450);

                ctx.font = 'bold 45pt Ubuntu';
                ctx.fillText('Total chests opened  :', 75, 525);
                var textWidth = ctx.measureText("Total chests opened  :").width;
                ctx.font = '45pt Ubuntu';
                ctx.fillText(`${json.data[0].global.chestsFound.toLocaleString('en-US')} chests`, 100 + textWidth, 525);

                ctx.font = 'bold 45pt Ubuntu';
                ctx.fillText('Logins/Deaths  :', 75, 600);
                var textWidth = ctx.measureText("Logins/Deaths  :").width;
                ctx.font = '45pt Ubuntu';
                ctx.fillText(`${json.data[0].global.logins.toLocaleString('en-US')}/${json.data[0].global.deaths.toLocaleString('en-US')} times`, 100 + textWidth, 600);

                // last seen
                ctx.font = 'bold 45pt Ubuntu';
                ctx.fillText('Last seen  :', 75, 675);
                var textWidth = ctx.measureText("Last seen  :").width;
                ctx.font = '45pt Ubuntu';
                ctx.fillText(`${output}`, 100 + textWidth, 675);

                var firstJoin = Date.now() - Date.parse(json.data[0].meta.firstJoin)
                years = Math.floor(firstJoin / (365 * 24 * 60 * 60 * 1000));
                days = Math.floor((firstJoin - years * (365 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
                hours = Math.floor((firstJoin - years * (365 * 24 * 60 * 60 * 1000) - days * (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                minutes = Math.floor((firstJoin - years * (365 * 24 * 60 * 60 * 1000) - days * (24 * 60 * 60 * 1000) - hours * (60 * 60 * 1000)) / (60 * 1000));
                output = `${years > 0 ? years + " yr " : ""}${days > 0 ? days + " d " : ""}${hours > 0 ? hours + " hr " : ""}${minutes > 0 ? minutes + " min " : ""}`;
                output = output[output.length - 1] == ":" ? output.slice(0, -1) : output;

                ctx.font = 'bold 45pt Ubuntu';
                ctx.fillText('Joined  :', 75, 750);
                var textWidth = ctx.measureText("Joined  :").width;
                ctx.font = '45pt Ubuntu';
                ctx.fillText(`${output}ago`, 100 + textWidth, 750);

                ctx.font = 'bold 45pt Ubuntu';
                ctx.fillText('Highest leveled class  :', 75, 825);
                var textWidth = ctx.measureText("Highest leveled class  :").width;
                ctx.font = '45pt Ubuntu';
                ctx.fillText(`${highest_class} [${json.data[0].classes[0].professions.combat.level}/${json.data[0].classes[0].level.toLocaleString('en-US')}]`, 100 + textWidth, 825);

                ctx.font = '25pt Ubuntu';
                ctx.textAlign = 'right'
                ctx.fillStyle = "#fff";
                ctx.globalAlpha = 0.1;
                ctx.fillText(`Coded by nHexanol || Empire of Sindria`, width, 25);
                ctx.globalAlpha = 1;
            }
                add();
                setTimeout(save, 1);
                send_img();
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}
