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

ffmpeg -y -f image2 -framerate 24 -i "$workdir/%03d_img_mashed.png" -c:v qtrle -pix_fmt rgb24 $outfile.mov

ffmpeg -y -i $outfile.mov \
    -thread_queue_size 512 -i $workdir/audio.wav \
    -map 0:v:0 -map 1:a:0 -shortest \
    -pix_fmt yuv420p -vcodec libx264 -vf scale=640:-1 \
    -acodec aac -vb 1024k -minrate 1024k -maxrate 1024k -bufsize 1024k \
    -ar 44100  -ac 2  -strict experimental \
    $outfile

/yui-home/mik/.local/bin/pipenv run python tweet-video.py $outfile $msg
# rm -rf $workdir
rm $outfile $outfile.mov
echo $workdir
# echo $outfile
echo "done"
