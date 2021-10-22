class commandHandler {
    constructor(client, prefix, bot = false) {
        this.client = client;
        this.prefix = prefix;
        this.bot = bot;

        this.commands = new Map();
    }

    register(names, func) {
        for (let name of names) {
            if (this.commands.has(name)) {
                console.log(`Command ${name} already registered!`);
                return false;
            }

            this.commands.set(name, func);
        }
    }

    process(message) {
        // Pre-checks
        if (message.author.bot && (!this.bot)) return;
        if (!message.content.startsWith(this.prefix)) return;

        const content = message.content.slice(this.prefix.length);

        let cmd, args;
        [cmd, ...args] = content.split(' ');
        cmd = this.commands.get(cmd.toLowerCase());

        // Call the function, or notFound if not found
        try {
            (cmd ?? this.notFound)(this.client, message, ...args);
        } catch (e) {
            console.log(`Function ${cmd.name} errored:`);
            console.log(e);
        }
    }

    notFound(message, ...args) {
        return;
    }
}

exports.commandHandler = commandHandler;
