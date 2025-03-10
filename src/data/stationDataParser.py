import json

stations = []
with open('src/data/floridaStationData.txt', 'r') as file:
    for line in file:
        lineArr = line.split('!')
        stations.append({'id': lineArr[0], 'name': lineArr[1]})

with open('data.json', 'w', encoding='utf-8') as jsonFile:
    json.dump({'stations': stations}, jsonFile, ensure_ascii=False, indent=2)
