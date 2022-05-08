#!/bin/bash
magick=./magick
image_ontop(){
    base=$1
    new=$2
    out=$3

    $magick \
        $base \
        \( \
            $new \
            \( +clone -auto-threshold Triangle \) \
            -compose dst-in -composite    \
            \(                          \
                -clone 0                \
                -fill "#000000"         \
                -colorize 100           \
            \)                          \
            \(                          \
                -clone 0,1              \
                -compose difference     \
                -composite              \
                -separate               \
                +channel                \
                -evaluate-sequence max  \
                -auto-level             \
            \)                        \
            -delete 1                 \
            -alpha off                \
            -compose over             \
            -compose copy_opacity     \
            -composite                \
        \) \
        -compose src-over -composite \
        -modulate 100,100,100 \
        $out
}

image_ontop2(){
    base=$1
    new=$2
    out=$3

    $magick \
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
                # We actually skip the first picture here,
                # so we can enforce a consistent square dimension
                $magick -size 500x500 canvas:none $file -compose dst-over -composite $nname
                # old thing, just copy the first picture
                # cp $file $nname
                echo $nname
                last=$nname
            else
                image_ontop $last $file $nname
                last=$nname
                echo $file
            fi
        fi
    done
}


make_audio(){
    python ./src-audio/make-song.py $("./get-random-song.sh")
}

mash_pics $1
