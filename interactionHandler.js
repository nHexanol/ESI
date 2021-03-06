const { opendir } = require("fs/promises");
const path = require("path");

const REL_PREFIX = '.' + path.sep;

function createOption(type, description, required = true, defaultValue = null, choices = null) {
    return {type, description, required, defaultValue, choices};
}

function createChoice(name, value) {
    return {name, value};
}

function userAllow(id) {
    return {id, type: "USER", permission: true};
}

function userDeny(id) {
    return {id, type: "USER", permission: false};
}

function roleAllow(id) {
    return {id, type: "ROLE", permission: true};
}

function roleDeny(id) {
    return {id, type: "ROLE", permission: false};
}

function lookupOption(option) {
    enumValues = {
        3: 'STRING',
        4: 'INTEGER',
        5: 'BOOLEAN',
        6: 'USER',
        7: 'CHANNEL',
        8: 'ROLE',
        9: 'MENTIONABLE',
        10: 'NUMBER'
    }

    option = enumValues[option] || option;
    return `get${option[0].toUpperCase()}${option.slice(1).toLowerCase()}`;
}

class interactionHandler {
    constructor(client) {
        this.client = client;

        this.commands = new Map();
        this.apps = new Map();  // for non-slash interactions (message/user)
    }

    async registerApps(appDir) {
        const dir = await opendir(appDir);
        for await (const dirent of dir) {
            if (dirent.isFile() && dirent.name.endsWith('.js')) {
                await this.registerApp(path.join(dir.path, dirent.name));
            }
        }
    }

    // slashName is a list with deepest call last
    async registerCommands(slashDir) {
        const dir = await opendir(slashDir);
        for await (const dirent of dir) {
            const entPath = path.join(dir.path, dirent.name);
            if (dirent.isDirectory()) {
                await this.registerCommandGroup(entPath, [dirent.name]);
            } else if (dirent.isFile() && dirent.name.endsWith('.js')) {
                await this.registerCommand(entPath);
            }
        }
    }

    async registerApp(fileName) {
        const {callback, guildIds, ...app} = require(REL_PREFIX + fileName);

        if (guildIds == null) {
            await this.client.application.commands.create(app);
        } else {
            for (const guildId of guildIds) {
                await this.client.application.commands.create(app, guildId);
            }
        }

        this.apps.set(app.name, callback);
    }

    async registerCommand(fileName) {
        const {callback, guildIds, permissions, ...slash} = require(REL_PREFIX + fileName);

        const allOptions = Object.entries(slash.options ?? {})
                         .map(([n, os]) => {return {name: n, ...os}});
        // Only need to store name, type, default
        const slashOptions = allOptions.map(o => {
            const {name, type, defaultValue, ..._} = o;
            return {name, type, defaultValue};
        });
        // Push everything except for default
        slash.options = allOptions.map(o => {
            const {defaultValue, ...rest} = o;
            return rest;
        });

        if (guildIds == null) {
            const command = await this.client.application.commands.create(slash);
            if (permissions != null) {
                await command.permissions.set({ permissions });
            }
        } else {
            for (const guildId of guildIds) {
                const command = await this.client.application.commands.create(slash, guildId);
                if (permissions != null) {
                    await command.permissions.set({ permissions });
                }
            }
        }

        this.commands.set(slash.name, {slashOptions, callback});
    }

    async registerCommandGroup(dirName, slashName) {
        const slash = {
            name: slashName[slashName.length - 1],  // should be 0, but (-1) for standard
            description: 'No Description',
            options: []
        };

        const dir = await opendir(dirName);
        for await (const dirent of dir) {
            const entPath = path.join(dir.path, dirent.name);
            if (dirent.isDirectory()) {
                slash.options.push(await this.readSubcommandGroup(entPath, [...slashName, dirent.name]));
            } else if (dirent.isFile() && dirent.name.endsWith('.js')) {
                slash.options.push(await this.handleSubcommand(entPath, [...slashName]));
            }
        }

        await this.client.application.commands.create(slash);
    }

    async readSubcommandGroup(dirName, slashName) {
        const option = {
            type: 2,  // SubcommandGroup
            name: slashName[slashName.length - 1],
            description: 'No Description',
            options: []
        }

        const dir = await opendir(dirName);
        for await (const dirent of dir) {
            const entPath = path.join(dir.path, dirent.name);
            if (dirent.isDirectory()) {
                option.options.push(await this.readSubcommandGroup(entPath, [...slashName, dirent.name]));
            } else if (dirent.isFile() && dirent.name.endsWith('.js')) {
                option.options.push(await this.handleSubcommand(entPath, [...slashName]));
            }
        }

        return option;
    }

    async handleSubcommand(fileName, slashName) {
        const {callback, ...options} = require(REL_PREFIX + fileName);
        options.type = 1;  // Subcommand

        const allOptions = Object.entries(options.options ?? {})
        .map(([n, os]) => {return {name: n, ...os}});
        // Only need to store name, type, default
        const slashOptions = allOptions.map(o => {
        const {name, type, defaultValue, ..._} = o;
        return {name, type, defaultValue};
        });
        // Push everything except for default
        options.options = allOptions.map(o => {
        const {defaultValue, ...rest} = o;
        return rest;
        });

        slashName.push(options.name);
        this.commands.set(slashName.join(' '), {slashOptions, callback});

        return options;
    }

    async process(interaction) {
        if (interaction.isCommand()) {
            await this.processCommand(interaction);
        } else if (interaction.isContextMenu()) {
            await this.processMenu(interaction);
        }
    }

    async processMenu(menuInteraction) {
        const cmd = this.apps.get(menuInteraction.commandName);

        if (cmd == null) {
            return;
        }

        await cmd(menuInteraction);
    }

    async processCommand(commandInteraction) {
        let commandNames = [commandInteraction.commandName],
            optionData = commandInteraction.options.data;

        console.log(commandInteraction);

        while (optionData[0]?.options != null) {
            commandNames.push(optionData[0].name);
            optionData = optionData[0].options;
        }

        console.log(optionData);

        if (optionData[0]?.type == 'SUB_COMMAND') {
            commandNames.push(optionData[0].name);
        }

        const cmd = this.commands.get(commandNames.join(' ').toLowerCase());

        if (cmd == null) {
            return;
        }

        let options = {};
        if (cmd.slashOptions != null) {
            for (const option of cmd.slashOptions) {
                // lookupOption returns the getter for the corresponding type of option, and we call it
                options[option.name] = commandInteraction.options[lookupOption(option.type)](option.name);

                if (options[option.name] == null) options[option.name] = option.defaultValue;
            }
        }

        // Call the function, or notFound if not found
        try {
            cmd.callback(commandInteraction, options);
        } catch (e) {
            console.log(`Function ${cmd.name} errored:`);
            console.log(e);
        }
    }
}

exports.createOption = createOption;
exports.createChoice = createChoice;

exports.userAllow = userAllow;
exports.userDeny = userDeny;
exports.roleAllow = roleAllow;
exports.roleDeny = roleDeny;

exports.interactionHandler = interactionHandler;
