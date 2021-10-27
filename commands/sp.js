const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require("fs");
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    names: ["sp"],
    func: function sp(client, message, offset, ...args) {
        var world_arr = [];
        var sorted_worlds = [];
        var offset = parseInt(offset) * 60000;
        if (isNaN(offset)) offset = -120000;

        const width = 1600;
        const height = 900
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        fetch('https://athena.wynntils.com/cache/get/serverList')
        .then(res => res.json())
        .then(json => {
            async function send_img() {
                message.channel.send({
                    files: [`./sp.png`]
                });
            }

            function save() {
                const buffer = canvas.toBuffer('image/png');
                fs.writeFileSync('./sp.png', buffer);
            }

            async function load() {
                loadImage(`./asset/sp.png`)
                .then((image) => {
                    ctx.drawImage(image, 0, 0, width, height);
                });
            }

		    // sp regen every 1200000 ms

            for (let world in json.servers) {
                world_arr.push([world, Date.now() - json.servers[world].firstSeen]);
            }
            sorted_worlds = world_arr.sort((a, b) => {return a[1] -b[1]});

            for (let fsorted in sorted_worlds) {
                sorted_worlds[fsorted][1] = 20 - ((sorted_worlds[fsorted][1] - offset) % 1200000 / 1000 / 60);
            }
            sorted_worlds = sorted_worlds.sort((a, b) => {return a[1] -b[1]});
            for (let fsorted in sorted_worlds) {
                sorted_worlds[fsorted][1] = Math.ceil(sorted_worlds[fsorted][1]);
                for (var world_name_length = sorted_worlds[fsorted][0].length; world_name_length < 4 ; world_name_length++) {
                    sorted_worlds[fsorted][0].concat(' ');
                }
            }
            console.log(sorted_worlds);

            async function add() {
                await load();

                ctx.font = 'bold 55pt Ubuntu';
                ctx.textAlign = 'left';
                ctx.fillStyle = '#fff';
                ctx.fillText(`Soul Points`, 75, 125);
                var textWidth = ctx.measureText('Soul Points  ').width;
                if (!offset == 0) {
                    ctx.font = '55pt Ubuntu';
                    ctx.fillText(`[ ${offset/60000} minute(s) offset ]`, 75 + textWidth, 125);
                }
                ctx.font = '35pt Ubuntu';
                ctx.fillText(`Time until next Soul Point regen. Stolen from Zinnig.`, 75, 185);

                // 75 150 225 300 375 425 500 575 650 725 800
                    if (sorted_worlds.length < 8) {
                        console.log(8);
                        for (var spworld in sorted_worlds) {
                            ctx.font = 'bold 45pt Ubuntu';
                            ctx.fillText(`${sorted_worlds[spworld][0]}  `, 75, 300 + (spworld * 75));
                            var textWidth = ctx.measureText(`${sorted_worlds[spworld][0]}  `).width;
                            ctx.font = '45pt Ubuntu';
                            ctx.fillText(`${sorted_worlds[spworld][1]} min`, 210 + 85, 300 + (spworld * 75));
                            if (spworld == 8) break;
                        }
                    }
                    else if (sorted_worlds.length > 8 && sorted_worlds < 17) {
                        console.log(19);
                        for (var spworld = 0; spworld < 9; spworld++) {
                            ctx.font = 'bold 45pt Ubuntu';
                            ctx.fillText(`${sorted_worlds[spworld][0]}  `, 75, 300 + (spworld * 75));
                            var textWidth = ctx.measureText(`${sorted_worlds[spworld][0]}  `).width;
                            ctx.font = '45pt Ubuntu';
                            ctx.fillText(`${sorted_worlds[spworld][1]} min`, 210 + 85, 300 + (spworld * 75));
                        }
                        for (var spworld = 9; spworld < sorted_worlds.length; spworld++) {
                            ctx.font = 'bold 45pt Ubuntu';
                            ctx.fillText(`${sorted_worlds[spworld][0]}  `, 31 + 485 + 85, 300 + ((spworld - 8) * 75));
                            var textWidth = ctx.measureText(`${sorted_worlds[spworld][0]}  `).width;
                            ctx.font = '45pt Ubuntu';
                            ctx.fillText(`${sorted_worlds[spworld][1]} min`, 31 + 210 + 85 + 485, 300 + ((spworld - 8) * 75));
                        }
                    }
                    else if (sorted_worlds.length >= 19) {
                        console.log('more than 19');
                        for (var spworld = 0; spworld < 8; spworld++) {
                            ctx.font = 'bold 45pt Ubuntu';
                            ctx.fillText(`${sorted_worlds[spworld][0]}  `, 75, 300 + (spworld * 75));
                            var textWidth = ctx.measureText(`${sorted_worlds[spworld][0]}  `).width;
                            ctx.font = '45pt Ubuntu';
                            ctx.fillText(`${sorted_worlds[spworld][1]} min`, 210 + 85, 300 + (spworld * 75));
                        }
                        for (var spworld = 8; spworld < 16; spworld++) {
                            ctx.font = 'bold 45pt Ubuntu';
                            ctx.fillText(`${sorted_worlds[spworld][0]}  `, 31 + 485 + 85, 300 + ((spworld - 8) * 75));
                            var textWidth = ctx.measureText(`${sorted_worlds[spworld][0]}  `).width;
                            ctx.font = '45pt Ubuntu';
                            ctx.fillText(`${sorted_worlds[spworld][1]} min`, 31 + 210 + 85 + 485, 300 + ((spworld - 8) * 75));
                            if (spworld == 16) break;
                        }
                        for (var spworld = 16; spworld < 24; spworld++) {
                            ctx.font = 'bold 45pt Ubuntu';
                            ctx.fillText(`${sorted_worlds[spworld][0]}  `, 62 + 970 + 85, 300 + ((spworld - 16) * 75));
                            var textWidth = ctx.measureText(`${sorted_worlds[spworld][0]}  `).width;
                            ctx.font = '45pt Ubuntu';
                            ctx.fillText(`${sorted_worlds[spworld][1]} min`, 62 + 210 + 85 + 970, 300 + ((spworld - 16) * 75));
                            if (spworld == 24) break;
                        }
                    }

            //credits
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
            message.channel.send(`An error has occured.`);
            console.log(error);
        });
    }
}
