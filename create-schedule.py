#!/usr/bin/env python3
import json
import datetime

def main():
	
	today = datetime.datetime.today()
	year = today.strftime("%Y")
	month = today.strftime("%m")
	day = today.strftime("%F")
	schedule_path = "/home/flock/movies/%s/%s/%s.json" %(year, month, day)
	with open(schedule_path, 'r') as myfile:
		data=myfile.read()

	obj = json.loads(data)



	file_path = "/home/flock/saladbowl/today.html"
	json_file_path = "/home/flock/saladbowl/today.json"
	html_file = open(file_path, "w")


	shows = obj['program']
	seconds_past = -(8 * 60 * 60) # pst
	# seconds_past = -(7 * 60 * 60) # pst daylight savings
	start_time = datetime.datetime.now()
	utc_time = datetime.datetime.utcnow()
	for show in shows:
		source = show['source'].split('/')[4]
		show_time = start_time + datetime.timedelta(seconds=seconds_past)
		show['show_time']=show_time.strftime("%T")
		show['show_time_utc']=utc_time.strftime("%s")
		show['name']=source
		seconds_past += show['duration']
		utc_time += datetime.timedelta(seconds=show['duration'])
		html_file.write("""
<h3>%s</h3>
<p>%s</p>
""" %(source, show_time.strftime("%T")))
		
		

	html_file.close()

	json_file = open(json_file_path, "w")
	json.dump(shows, json_file, indent = 4)
	json_file.close()

if __name__ == '__main__':
	main()
