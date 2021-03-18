# Twitter Stream Picture Scraper

Uses the Twitter API 2.0 to get a real time [filtered stream](https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/quick-start) of tweets being tweeted, based on provided query. The `.env` file needs to have a dev token.

This scraper will validate images as unique among a certain buffer of neighbor tweets received, so as to minimize the influence of bots and lots of duplicate pictures. This uses the [jimp](https://github.com/oliver-moran/jimp) library.

to run the cli, (after building):

```sh
node build/src/main.js -q "Your query (refer to twitter docs)" -t "tag for the query (needed mostly internally, but still need to put something)" -o "an output dir" -l "output dir for json manifest" -c "how many pictures <number>"

node build/src/main.js -h //self generated doc
```
