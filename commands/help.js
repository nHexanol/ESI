module.exports = {
    names: ["help", "?"],
    func: function apply(client, message, ...args) {
        message.channel.send({
			files: ['./help.png']
		});
    }
}
