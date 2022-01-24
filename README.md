# firebot-bot-checker

This is a simple custom script for [Firebot](https://firebot.app) to check whether a provided username is on the list of [Twitch Insight's](https://twitchinsights.net/bots) list of known view bots.

This script used the [Custom Script IFTTT](https://github.com/crowbartools/Firebot/wiki/Custom-Script---IFTTT) as a base, since I do not know JavaScript that well.

Also, I do not know JavaScript that well so there are probably better and more efficient ways to do this, but hey it's a start, right?

## Installation

Download the bot-checker.js file and store it in the custom script folder for Firebot (default location is %APPDATA%\Firebot\v5\profiles\Main Profile\scripts)

## Usage

Once the script is added to the folder it can be attached to an event through the 'Run Custom Script' effect.

There are options you can fill in:

* "Insert Bot Name Here" - leave this as $target because I'm stupid
* "Send From" - Reply as bot or streamer.
* " Not Found Message" - The message that displays when the user is NOT found (e.g. not a bot)
* "Found Message" - The message that displays when the user IS found (e.g., IS a bot)
* "Show Channels" - This appends the Found Message with the number of channels a found user is currently viewing.
* "Ban bot" - Selecting "Yes" will ban the bot if it is not on the exception list.  *Note:* it will not return anything if you already have them banned.  This is a bug with Firebot not handling the "already banned" exception.
* "Exceptions list" - This is a list of comma separated usernames that are exempt--e.g. "good bots."  Things like StreamLabs, StreamElements, Nightbot, commanderroot, etc.  

This was intended to be used with a command, so something akin to `!command username` would query the username and return whether or not it was on the list.

## Contributing
Pull requests are welcome, but I'm really just kind of dumping this here as a back up for me.  I plan on changing some things, but if you want major functionality I think it would be best to fork it

