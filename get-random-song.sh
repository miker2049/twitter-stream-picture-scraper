#!/usr/bin/env bash

name=$(shuf -n 1 m.txt)
IFS=''
source .env
echo "$MUSIC_DIR${name:2}"
