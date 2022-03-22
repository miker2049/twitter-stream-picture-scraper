#!/usr/bin/env python3
from pydub import AudioSegment, effects
import os
import sys
import math

input_raw = sys.argv[1]


input_file=os.path.expanduser(input_raw.replace('\n',''))
print(input_file)
ext = os.path.splitext(input_file)[1][1:]

song = AudioSegment.from_file(input_file, format=ext)
assert isinstance(song, AudioSegment)

input_duration = song.duration_seconds

clip_duration = 240 # how long is the clip

change_times = clip_duration * 16  # how often it changes over time
change_amount = 1000 # how much it changes over time

start = 30 * 1000 # where to do a random soon
song_duration = 40000 # output dur


n = 0
i = 0
out = AudioSegment.empty()

def applySin(seg):
    count = int(seg.frame_count())
    samples = seg.get_array_of_samples()
    for ind in range(len(samples)):
        samples[ind] = int(samples[ind] * math.sin((ind/count)*math.pi))
    return seg._spawn(samples)

# def applySin(frame,index):
#     return float(frame * math.sin((index/float(clip_duration))*math.pi))

while(n<song_duration):
    # out.append(clip, crossfade=0)
    this_start = start + (int(n/5000)*1000)
    clip = song[this_start:this_start+clip_duration]
    # clip = list(map(applySin, clip, list(range(0,clip_duration))))
    clip = applySin(clip)
    out += clip
    n += clip_duration
    i += 1
out = effects.normalize(out)
out.export("mashup.mp3", format="mp3")
