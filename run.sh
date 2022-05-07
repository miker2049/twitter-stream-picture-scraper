#!/usr/bin/env bash
secs=$1
msg=$2

outfile=$(mktemp --suffix .mp4)
rate=24
frames=$(($secs * $rate))
workdir=$(mktemp -d)
yarn run start -c $frames -o $workdir"/"

/yui-home/mik/.local/bin/pipenv run python make-song.py "$(./get-random-song.sh)" \
    $workdir/audio.wav $(( 1500 * $secs )) #extra time here bc variable frames

./mash-pics.sh $workdir

ffmpeg -y -r $rate -pattern_type glob -thread_queue_size 512 -i "$workdir/*_mashed.png" \
    -thread_queue_size 512 -i $workdir/audio.wav \
    -map 0:v:0 -map 1:a:0 -shortest \
    -pix_fmt yuv420p -vcodec libx264 -vf scale=640:-1 \
    -acodec aac -vb 1024k -minrate 1024k -maxrate 1024k -bufsize 1024k \
    -ar 44100  -ac 2  -strict experimental \
    $outfile

# from foone
# https://gist.github.com/nikhan/26ddd9c4e99bbf209dd7
#ffmpeg -i in.mkv
#-pix_fmt yuv420p -vcodec libx264 -vf scale=640:-1
#-acodec aac -vb 1024k -minrate 1024k -maxrate 1024k -bufsize 1024k
#-ar 44100  -ac 2  -strict experimental -r 30
#1000 at 24 = 42000ms
# workdir="/tmp/tmp.b7Yo1n0sw2"
/yui-home/mik/.local/bin/pipenv run python tweet-video.py $outfile $msg
rm -rf $workdir
rm $outfile
# echo $workdir
# echo $outfile
echo "done"
