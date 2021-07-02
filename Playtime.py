import json
import sys
import traceback
from datetime import datetime as dt

sys.path.insert(0, 'C:\Program Files\Python37\Lib\site-packages')
import requests


def uidtodash(uuid):
    return '-'.join([uuid[:8], uuid[8:12], uuid[12:16], uuid[16:20], uuid[20:]])


if __name__ == '__main__':
    print("start")
    rgl = \
        requests.get("https://api.wynncraft.com/public_api.php?action=guildStats&command=Empire+of+Sindria").json()[
            'members']
    guildmembercount = len(rgl)
    with open('guuid.txt') as guirf:
        uidict = json.loads(guirf.read())
    guidl = set([x['uuid'] for x in rgl])
    for left in set(uidict.keys()) - guidl:
        del uidict[left]
    for member in rgl:
        if member['uuid'] in uidict:
            if member['name'] != uidict[member['uuid']]:
                uidict[member['uuid']] = member['name']
        else:
            uidict[member['uuid']] = member['name']
    with open("guuid.txt", "w") as guiwf:
        guiwf.write(json.dumps(uidict))
    inactivitypath = "./logplaytime/" + str(dt.now().date()) + ".txt"
    iwf = open(inactivitypath, "w")
    guildplaytime = {}
    for i in range(guildmembercount):
        try:
            print(str(int(round(100 * (i + 1) / guildmembercount, 0))) + "% complete")
            playerurl = "https://api.wynncraft.com/v2/player/" + rgl[i]['uuid'] + "/stats"
            pstats = requests.get(playerurl).json()['data'][0]
            playtimeraw = int(4.7 * pstats['meta']['playtime'])
            lst = dt.strptime(pstats['meta']['lastJoin'], "%Y-%m-%dT%H:%M:%S.%fZ")
            td = [(dt.utcnow() - lst).days, (dt.utcnow() - lst).seconds // 3600]
            guildplaytime[rgl[i]['name']] = [str(playtimeraw), td]
        except (KeyError, IndexError):
            traceback.print_exc()
            print(rgl[i]['name'])
            continue
    iwf.write(json.dumps(guildplaytime))
    iwf.close()
