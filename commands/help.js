module.exports = {
    names: ["help", "?"],
    func: function apply(message, ...args) {
        message.channel.send({
			files: ['./help.png']
		});
    }
}
