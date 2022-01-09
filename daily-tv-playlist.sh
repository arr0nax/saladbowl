#! /bin/bash

if [ -f /home/flock/saladbowl/admin/schedules/`date "+%F"`.json ];
then
cp /home/flock/saladbowl/admin/schedules/`date "+%F"`.json /home/flock/movies/`date "+%Y"`/`date "+%m"`/
else
/home/flock/saladbowl/tv/playlist-generator/generate-playlist.py -c /home/flock/saladbowl/tv/ffplayout-engine/ffplayout.yml -i /home/flock/movies -o /home/flock/movies
fi

/usr/bin/python3 /home/flock/saladbowl/create-schedule.py
scp /home/flock/saladbowl/today.html flock@saladbowl.zone:/var/www/saladbowl/
scp /home/flock/saladbowl/today.json flock@saladbowl.zone:/var/www/saladbowl/
sleep 1
#/home/flock/saladbowl/tv/ffplayout-engine/ffplayout.py -c /home/flock/saladbowl/tv/ffplayout-engine/ffplayout.yml -l none -p /home/flock/saladbowl/test.json -s now -t none
/home/flock/saladbowl/tv/ffplayout-engine/ffplayout.py -c /home/flock/saladbowl/tv/ffplayout-engine/ffplayout.yml -l none -p /home/flock/movies/`date "+%Y"`/`date "+%m"`/`date "+%F"`.json -s now -t none

