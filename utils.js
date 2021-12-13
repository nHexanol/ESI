function toDashedUUID(uuid) {
    if (uuid.match(/^[0-9a-fA-F]{32}$/)) {
        return uuid.replace(/^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})/,
                            '$1-$2-$3-$4-$5');
    } else {
        return null;
    }
}

function getDescription(type, username, discordId, uuid, timestamp) {
	const typeName = type == 0 ? 'Member' : 
	                 type == 1 ? 'Veteran' :
					 type == 2 ? 'Envoy' : 'Unknown'; 

	return `Application Type: ${typeName}\nUsername: ${username}\nDiscord ID: ${discordId}\nUUID: ${uuid}\nTimestamp: ${timestamp}`;
}

function readDescription(description) {
    const splitted = description.split('\n');

    const [typeName, username, discordId, uuid, timestamp] = splitted.map(r => r.split(': ', 2)[1]);

    const type = typeName == 'Member' ? 0 :
                 typeName == 'Veteran' ? 1 :
                 typeName == 'Envoy' ? 2 : null;

    if (type == null || username == null || discordId == null || uuid == null || timestamp == null) {
        return;
    } 

    return { type, username, discordId, uuid, timestamp };
}

module.exports = {
    toDashedUUID, 
    getDescription, 
    readDescription
};
