#!/usr/bin/env bash

workdir=$(mktemp -d)
yarn run start -s true -c 500 -o $workdir"/"
./mash_pics.sh $workdir $workdir/video.mp4
#1000 at 24 = 42000ms
python ./src-audio/make-song.py $(./get-random-song.sh) $workdir/audio.wav 21000 $workdir/video.mp4

ffmpeg -i $workdir/audio.wav -i $workdir/video.mp4 -c:v copy -c:a aac -map 1:v:0 -map 0:a:0 $1
rm -rf $workdir
echo "done"
