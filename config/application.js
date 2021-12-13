const { Util } = require("discord.js");

// Copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
// and modified to discord escape
function template(strings, ...keys) {
    return (function(...values) {
        let dict = values[values.length - 1] || {};
        let result = [strings[0]];
        keys.forEach(function(key, i) {
            let value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return Util.escapeMarkdown(result.join(''));
    });
}

module.exports = {
    0: {  // Member
        form: `Country/Timezone:\nPreferred Pronouns (optional):\nAge (optional):\nHow did you find ESI?\nHow can you contribute to ESI?\nHow active are you on Wynncraft?\nWhat do you enjoy about Wynncraft?\nBesides playing Wynn, what else do you enjoy doing?\nPrevious Guilds you’ve been in and why you’ve left them:\nAdditional Notes:`,
        details: template`${"author"} Please check that your details below are correct and fill out the application form above:\n\nUsername : ${"username"}\nTotal Level: ${"levelTotal"}\nHighest Combat Level: ${"levelCombatMax"}`,
        sample: `__Good App:__\n**Country & Timezone:** United States, EST\n**Preferred Pronouns (optional):** He/Him\n**Age (optional):** 17\n**How did you find ESI?:** Forums/Shouts\n**How can you contribute to ESI?:** I am a community person, so I can help brighten the guild and be friendly. I can also contribute XP and help fellow members out with raids :)\n**How active are you on Wynncraft: **I am decently active. I'm online roughly 1-2 hours on the weekdays, but more active on the weekends.\n**What do you enjoy about Wynncraft?** I enjoy the fact that Wynncraft has its own communities within a larger community. There's the class-building community, the lootrunning community, the professions community, etc. It's enjoyable to see everyone enjoying different aspects on the game, not to mention the friendly atmosphere.\n**Besides playing Wynn, what else do you enjoy doing?** I enjoy running, but I occasionally play other games as well. I am also into coding and nature photography!\n**Previous Guilds you’ve been in and why you’ve left them:** I have never been in a guild, and this is the first guild I'm applying for.\n**Additional Notes:** Nothing much else to say. I hope you have a great day!\n\n__Bad App:__\n**Country & Timezone:** EST\n**Preferred Pronouns (optional):** He/Him\n**Age (optional):** 17\n**How did you find ESI?** Forums/Shouts\n**How can you contribute to ESI?** Playing and giving emeralds\n**How active are you on Wynncraft?** Very active\n**What do you enjoy about Wynncraft? **Quests and Lore\n**Besides playing Wynn, what else do you enjoy doing?** Play videogames\n**Previous Guilds you’ve been in and why you’ve left them:** Never been in a guild\n**Additional Notes:**`,
        accept: template`${"author"} We are glad to inform you your application was accepted. Do \`/gu join ESI\` the next time you're online, and be on the lookout for a ping in <#606712832716832778> with more info!`,
        roleAdd: ['554889169705500672', '681030746651230351'],
        nickname: template`Squire ${"username"}`
    },
    1: {  // Veteran
        form: `What was your IGN when you left the guild (if it has changed please list your current IGN):\nWhy did you leave the guild?\nWhy do you want to return to ESI?\nHave you been in any other guilds since?`,
        details: template`${"author"} Please check that your details below are correct and fill out the application form:\n\nUsername : ${"username"}\nTotal Level: ${"levelTotal"}\nHighest Combat Level: ${"levelCombatMax"}`
    },
    2: {  // Envoy
        form: `What is your preferred nickname?\nWhat are your preferred pronouns?\nWhat guild is your current main guild?\nWhat do you like doing in your spare time?\nWhy do you want to apply for Envoy?`,
        details: template`${"author"} Please check that your details below are correct and fill out the application form:\n\nUsername : ${"username"}\nGuild: ${"guild"}`,
        accept: template`${"author"} Welcome new envoy!  You now have access to <#606712832716832778>, <#673365826094759963>, and will be pinged for our events in <#555195480271880212>!`,
        roleAdd: ['554896955638153216']
    }
}
