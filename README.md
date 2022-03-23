# Twitter Stream Picture Scraper

Uses the Twitter API 2.0 to get a real time sample of tweets being tweeted, and makes a video that it tweets back out. There is also a song made The `.env` file needs to have the appropriate info, see `dotenv-template`

This scraper will validate images as unique among a certain buffer of neighbor tweets received, so as to minimize the influence of bots and lots of duplicate pictures. This uses the [jimp](https://github.com/oliver-moran/jimp) library.
## Requirements
- node >= 14.14
- yarn
- python 3.7
- pipenv
- imagemagick 7.1.0
- ffmpeg 5.0
### imagemagick
Because the script relies, for the moment, on a bleeding edge version of magick, it expects the binary to be located in the base directory as `./magick`.  You can download a release from github, or if you have the right version:
```
ln -s $(which magick) ./magick
```
## Run it
to run the cli, (after building):
```sh
./run.sh SECONDS MSG
```
