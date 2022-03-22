#!/bin/bash
image_ontop(){
    base=$1
    new=$2
    out=$3

    magick \
        $base \
        \( \
        $new \
        \( +clone -auto-threshold Triangle \) \
        -compose dst-in -composite \
        \) \
        -compose src-over -composite \
        -modulate 100,130,100 \
        $out
}

image_ontop2(){
    base=$1
    new=$2
    out=$3

    magick \
        $base \
        \( \
        $new \
        \( +clone \
        -alpha off -fuzz 10% -fill none -draw "matte 0,0 floodfill"  \
        \( +clone -alpha extract -blur 0x2 -level 50x100% \) \
        -alpha off -compose copy_opacity -composite \
        \) \
        -compose dst-in -composite \
        \) \
        -compose src-over -composite \
        -modulate 100,100,100 \
        $out
}


get_mash_name(){
    filename=$(basename "$1")
    na=${filename%.*}
    ext=${filename##*.}
    dir=$(dirname "$1")
    echo "$dir/$na$2.$ext"
}

mash_pics(){
    files=$(find $1 -iname "*.png" | sort -V)
    first=${files[1]}
    suff="_mashed"
    i=0
    for file in $files; do
        if [ -f "$file" ]; then
            nname=$(get_mash_name $file $suff)
            if [ $i -lt 1 ]; then
                i=1
                # echo $file
                cp $file $nname
                echo $file
                last=$nname
            else
                image_ontop $last $file $nname
                last=$nname
                echo $file
            fi
        fi
    done
}

make_movie(){
    ffmpeg -r 24 -pattern_type glob -i "$1/*_mashed.png" $2
}

make_audio(){
    python ./src-audio/make-song.py $("./get-random-song.sh")
}

mash_pics $1
make_movie $1 $2
