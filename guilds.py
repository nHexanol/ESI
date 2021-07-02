import datetime
import json
import time
import traceback

import requests

if __name__ == "__main__":
    gulist = requests.get("https://api.wynncraft.com/public_api.php?action=guildList").json()['guilds']
    prefixes = {}
    logf = open("guildslog.txt", 'a')
    i = 0
    for gu in gulist:
        starttime = time.time()
        gureq = requests.get("https://api.wynncraft.com/public_api.php?action=guildStats&command={}"
                             .format(gu.replace(' ', '+')))
        if gureq.status_code != 200:
            logf.write(gu + '  ' + str(gureq.status_code) + '\n')
            continue
        else:
            gustat = gureq.json()
        guml = [[], [], [], [], [], []]
        for mem in gustat['members']:
            if mem['rank'] == 'OWNER':
                guml[5].append(mem['name'])
            elif mem['rank'] == 'CHIEF':
                guml[4].append(mem['name'])
            elif mem['rank'] == 'STRATEGIST':
                guml[3].append(mem['name'])
            elif mem['rank'] == 'CAPTAIN':
                guml[2].append(mem['name'])
            elif mem['rank'] == 'RECRUITER':
                guml[1].append(mem['name'])
            elif mem['rank'] == 'RECRUIT':
                guml[0].append(mem['name'])
        prefixes[gu] = gustat['prefix']
        with open("./gulist/{}.txt".format(gustat['prefix']), 'w') as gumemwf:
            gumemwf.write(json.dumps(guml))
        i += 1
        time.sleep(max(2 + starttime - time.time(), 0))
    with open("prefix.txt") as prefrf:
        oldprefixes = json.loads(prefrf.read())
    oldprefixes.update(prefixes)
    with open("prefix.txt", "w") as prefwf:
        prefwf.write(json.dumps(oldprefixes))
    logf.close()