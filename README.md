# stock-bot
A stock-info bot for Discord app based off <a href="https://github.com/hydrabolt/discord.js/">discord.js</a>.

# Features:
* `.poll` - starts a poll that lasts one hour tallying up who made money in the market today
* `.poll 2` - starts a poll that lasts one hour asking if the market will be red or green tomorrow
* `.poll Question 😀 Answer 1 😁 Answer 2` (etc.) - starts a poll that lasts one hour with custom reactions
* `.e`|`arn`|`ings` - get a company's upcoming earnings date
* `.news` - get news about a specific company
* `.8` - magic 8 ball! 
* `.tell` - get the bot to tell somebody off sarcastic spongebob style
* `.fin`|`ancials` - retrieves latest financial information from a company's SEC filings. There are many different possible queries, so be sure to specify what kind of information you want! The order of the commands doesn't matter so feel free to try any combination. Examples:
  * `.fin TSLA quarterly cashflow` - or - `.cf tsla q`
  * `.tsla balancesheet` - or - `.financials bs TSLA`
  * `.TSLA income` - or - `.ic TSLA`
* `@mentions` trigger custom responses using data about each user collected in a .json file

You can also try `.commands` to get a full list of available commands

## Running your own stock-bot
stock-bot has a hidden auth.json file with a Discord developer key and other API keys needed for the functions it uses. You will have to replicate this, but let me know if you run into any problems. I'm happy to help!

## Contributing
If you are interested in helping contribute to making the bot more interesting please let me know! I don't mind explaining the set up to anyone that is interested!

## TODO:
Come up with new and fun features for the bot!
