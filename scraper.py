import requests
import json

URL = "https://www.bartcrimes.com/api/v0/"
incidents_endpt = "incidents/"
stations_endpt = "stations/"

incidents = []
stations = []

def getAll(endpt, data, name):

	r = requests.get(URL + endpt)
	text = json.loads(r.text)
	results = text['results']
	data.extend(results)
	while text['next'] != None:
		
		r = requests.get(text['next'])
		text = json.loads(r.text)
		results = text['results']
		data.extend(results)
		print(text['next'])
	#print(stations)
	print("break out")
	if name == 'stations':
		with open('data/stations.json', 'w') as outfile:
			json.dump(data, outfile)
	else:
		with open('data/incidents.json', 'w') as outfile:
			json.dump(data, outfile)


	
#getAll(stations_endpt, stations, "stations")
getAll(incidents_endpt, incidents, "incidents")