module.exports = {
    names: ["zinnig"],
    func: function zinnig(client, message, ...args) {
        client.users.cache.find(u => u.username === "Zinnig").send('oho');
    }
}
