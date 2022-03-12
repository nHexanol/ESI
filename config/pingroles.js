// Cooldown in milliseconds
roles = {
    '722856382025564161': {
        cooldown: 900000,
        allowedChannels: ['606713555911311370'],  // Armoury
        aliases: [
            { name: 'SV', caseSensitive: true },
            { name: 'sindrian vanguard', caseSensitive: false }
        ]
    },
    '891933320856895498': {
        cooldown: 1800000,
        allowedChannels: ['606713555911311370'],  // Armoury
        aliases: [
            { name: 'SC', caseSensitive: true },
            { name: 'sindrian crusader', caseSensitive: false }
        ]
    },
    '800547586694971443': {
        cooldown: 1800000,
        allowedChannels: ['606712832716832778', '728107786491396148'],  // TS, Wynncraft
        allowedRoles: ['554889169705500672', '554896955638153216'],  // Citizen, Envoy
        aliases: [
            { name: 'GP', caseSensitive: true },
            { name: 'guild parties', caseSensitive: false }
        ]
    },
    '800547442772148234': {
        cooldown: 3600000,
        allowedChannels: ['554887685005901825'],  // Other Games
        allowedRoles: ['800547442772148234'],  // Minigames 
        aliases: [
            { name: 'mafia', caseSensitive: false },
            { name: 'minigames', caseSensitive: false }
        ]
    }
};

module.exports = roles;
