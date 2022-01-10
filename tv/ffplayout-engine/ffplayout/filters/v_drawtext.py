import os
import re

import json
import random
from argparse import ArgumentParser
from datetime import date, datetime, timedelta
from glob import glob
from subprocess import CalledProcessError, check_output
from ffplayout.utils import _text


def filter(probe):
    """
    extract title from file name and overlay it
    font = ''
    source = os.path.basename(probe.src)
    match = re.match(_text.regex, source)
    title = match[1] if match else source

    if _text.fontfile and os.path.isfile(_text.fontfile):
        font = f":fontfile='{_text.fontfile}'"

    #if title:
    if False:
        print(font)
        return f"drawtext=text='{title}':{_text.style}{font}"
    """

#    for stream in probe.streams:
#        if stream['codec_type'] == 'subtitle':
#            subs.append(stream)

    clip = os.path.basename(probe.src)
    title_with_ext = clip.split("/")[-1]
    title = '.'.join(title_with_ext.split(".")[:-1]);
    print(title)
    
    subs_string = 'subtitles=' 

    subs_store = glob(os.path.join('/home/flock/movies/subs/', '**', '*srt'), recursive=True)

    for full_sub_path in subs_store:
        sub_with_ext = full_sub_path.split("/")[-1]
        sub = '.'.join(sub_with_ext.split(".")[:-1]);
        #print(sub)
    
        if sub == title:
            print(sub + ' match!!!!! adding subs')
            return f"subtitles={full_sub_path}"
    
        else:
        
            
            for idx, sub in enumerate(probe.subs):
                if sub:
                    if 'tags' in sub:
                        if 'language' in sub['tags']:
            	            #print(sub['tags']['language'])
                            if sub['tags']['language'] == "eng":
                                #print('english on track:')
                                #print(sub["index"])
                                return "subtitles=/home/flock/movies/" + clip + ":si=" + str(idx)
                                #print(node['subs'])
            
            
    
    font = ''
    source = os.path.basename(probe.src)
    match = re.match(_text.regex, source)
    title = match[1] if match else source

    if _text.fontfile and os.path.isfile(_text.fontfile):
        font = f":fontfile='{_text.fontfile}'"

    #if title:
    if True:
        print(font)
        return f"drawtext=text='{title}':{_text.style}{font}"

