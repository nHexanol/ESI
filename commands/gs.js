const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require("fs");
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    names: ["gs"],
    func: function gs(client, message, ...args) {
        if (args.length == 0) var guild = "Empire+of+Sindria";
	    else if (args.length != 0) var guild = message.content.replace(`${prefix}${cmd} `, '').replace(/ /g, "+");

        fetch(`https://api.wynncraft.com/public_api.php?action=guildStats&command=${guild}`)
	    .then(res => res.json())
	    .then(function (json) {
            const width = 1600;
            const height = 900
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');

		    var owner = json.members.find(m => m.rank == "OWNER")

            async function send_img() {
                message.channel.send({
                    files: [`./gstat.png`]
                });
            }

            function save() {
                const buffer = canvas.toBuffer('image/png');
                fs.writeFileSync('./gstat.png', buffer);
            }

            async function load() {
                loadImage(`./asset/gs.png`)
                .then((image) => {
                    ctx.drawImage(image, 0, 0, width, height);
                });
            }

            async function add() {
                await load();
                //put all the canvas here
                ctx.font = 'bold 55pt Ubuntu';
                ctx.textAlign = 'left';
                ctx.fillStyle = '#fff';
                ctx.fillText(`${json.name}`, 75, 125);
                var textWidth = ctx.measureText(json.name).width;
                ctx.font = '55pt Ubuntu';
                ctx.fillText(`[${json.prefix}]`, 125 + textWidth, 125);
                ctx.font = '35pt Ubuntu';
                ctx.fillText(`Owned by `, 75, 185);
                var textWidth = ctx.measureText('Owned by ').width;
                ctx.font = 'bold 35pt Ubuntu';
                ctx.fillText(`${owner.name}`, 75 + textWidth, 185);

                ctx.font = 'bold 45pt Ubuntu';
                var textWidth = ctx.measureText("Level  :").width;
                ctx.fillText('Level  :', 75, 300);
                ctx.font = '45pt Ubuntu';
                ctx.fillText(`${json.level}  |  ${json.xp*10}%`, 125 + textWidth, 300);

                ctx.font = 'bold 45pt Ubuntu';
                var textWidth = ctx.measureText("Created  :").width;
                ctx.fillText('Created  :', 75, 375);
                ctx.font = '45pt Ubuntu';
                ctx.fillText(`${json.createdFriendly}`, 125 + textWidth, 375);

                ctx.font = 'bold 45pt Ubuntu';
                var textWidth = ctx.measureText("Total members  :").width;
                ctx.fillText('Total members  :', 75, 450);
                ctx.font = '45pt Ubuntu';
                ctx.fillText(`${json.members.length}`, 125 + textWidth, 450);

                ctx.font = 'bold 45pt Ubuntu';
                var textWidth = ctx.measureText("Total territories  :").width;
                ctx.fillText('Total territories  :', 75, 525);
                ctx.font = '45pt Ubuntu';
                ctx.fillText(`${json.territories}`, 125 + textWidth, 525);


                //credits
                ctx.font = '25pt Ubuntu';
                ctx.textAlign = 'right'
                ctx.fillStyle = "#fff";
                ctx.globalAlpha = 0.25;
                ctx.fillText(`Coded by nHexanol || Empire of Sindria`, width, 25);
                ctx.globalAlpha = 1;
            }

            add();
            setTimeout(save, 1);
            send_img();
        })
        .catch(function (error) {
            message.channel.send('An error has occured.');
        });
    }
}
