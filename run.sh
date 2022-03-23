#!/usr/bin/env bash
outfile=$1
frames=$2
workdir=$(mktemp -d)
yarn run start -s true -c $frames -o $workdir"/"

python ./src-audio/make-song.py "$(./get-random-song.sh)" \
    $workdir/audio.wav $(( 42 * $frames ))

./mash_pics.sh $workdir

ffmpeg -r 24 -pattern_type glob -i "$workdir/*_mashed.png" \
    -i $workdir/audio.wav \
    -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 \
    $outfile
#1000 at 24 = 42000ms
# workdir="/tmp/tmp.b7Yo1n0sw2"
rm -rf $workdir
echo "done"
