const LOOKUPOPTION = {
    3: 'getString',
    4: 'getInteger',
    5: 'getBoolean',
    6: 'getUser',
    7: 'getChannel',
    8: 'getRole',
    9: 'getMentionable',
    10: 'getNumber'
}

class slashHandler {
    constructor(client) {
        this.client = client;

        this.commands = new Map();
    }

    async register(slash, callback) {
        // Maps name -> type
        const options = (slash.options ?? []).filter(x => x.type > 2)
                          .map(x => {return {name: x.name, type: x.type}});

        await this.client.application.commands.create(slash);

        this.commands.set(slash.name, {options, callback});
    }

    process(interaction) {
        // Pre-checks
        if (!interaction.isCommand()) return;

        const cmd = this.commands.get(interaction.commandName.toLowerCase());

        if (cmd == null) {
            return;
        }

        let options = {};
        console.log(cmd);
        for (const option of cmd.options) {
            options[option.name] = interaction.options[LOOKUPOPTION[option.type]]();
        }

        // Call the function, or notFound if not found
        try {
            cmd.callback(this.client, interaction, options);
        } catch (e) {
            console.log(`Function ${cmd.name} errored:`);
            console.log(e);
        }
    }
}

exports.slashHandler = slashHandler;
