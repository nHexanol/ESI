const fetch = require('node-fetch');
exports.player = function player(username) {
    fetch(`https://api.wynncraft.com/v2/player/${username}/stats`)
				.then(res => res.json())
				.then(function (json) {
                    return json;
})
                .catch(console.error)
}