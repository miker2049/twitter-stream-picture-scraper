# Twitter Stream Picture Scraper

Uses the Twitter API 2.0 to get a real time sample of tweets being tweeted, and makes a video that it tweets back out. There is also a song made The `.env` file needs to have the appropriate info, see `dotenv-template`

This scraper will validate images as unique among a certain buffer of neighbor tweets received, so as to minimize the influence of bots and lots of duplicate pictures. This uses the [jimp](https://github.com/oliver-moran/jimp) library.
## Requirements
- node >= 14.14
- yarn
- python3
- pipenv
- imagemagick 7.1.0
- ffmpeg 5.0
## Run
to run the cli, (after building):

```sh
./run.sh SECONDS MSG
```
