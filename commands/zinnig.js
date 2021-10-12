module.exports = {
    names: ["zinnig"],
    func: function zinnig(message, ...args) {
        client.users.cache.find(u => u.username === "Zinnig").send('oho');
    }
}
