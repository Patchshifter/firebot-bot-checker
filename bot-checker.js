exports.getDefaultParameters = function() {
    return new Promise((resolve, reject) => {
        resolve({
            botname: {
                type: "string",
                description: "Insert Bot Name here",
                secondaryDescription: "This is the name of the bot you want to look up",
                default: "$target"
            },
            chatter: {
                type: "enum",
                options: ["Streamer", "Bot"],
                default: "Streamer",
                description: "Send From",
                secondaryDescription: "Which account to send the messages from."
            }
        });
    });
};

exports.getScriptManifest = function() {
    return {
        name: "Bot Checker",
        description: "Queries twitchinsights.net's bot list",
        author: "Patchshifter",
        firebotVersion:"5",
        version: "0.1"
    };
};

exports.run = function(runRequest) {
    let botname = runRequest.parameters.botname;

    // Return a Promise object
    return new Promise((resolve, reject) => {
        let url = "https://api.twitchinsights.net/v1/bots/online";
        const request = runRequest.modules.request;
        request(url, function (error, response1, data) {
            let response = {};

            if (!error) {
                // Got response from Twitch Insights.
                let content = data;

                let message;
                if (content.statusCode === 404) {
                    message = 'Something wrong happened while talking to IFTTT!';
                } else {
                    // Do the fancy work here
                    var l=JSON.parse(content);
                    var botlist = l.bots;
                    for (var i = 0; i < botlist.length; i++) {
                        if (botlist[i][0] === botname) {
                            message ="MrDestructoid  MrDestructoid "+ botname + ' was found in the list of online bots. They are currently viewing ' +botlist[i][1]+' channels right now. It might be OK to ban. MrDestructoid  MrDestructoid ';
                            break;
                        }
                    }
                    if (message == null) {
                        message = 'SeemsGood SeemsGood '+botname + ' was not found in the list of known bots, it be a real person. SeemsGood SeemsGood';
                    }
                }

                response = {
                    success: true,
                    effects: [
                        {
                            type: EffectType.CHAT,
                            message: message,
                            chatter: runRequest.parameters.chatter
                        }
                        ]
                    };
            } else {
                // We had an error with the request. So, create an error popup in Firebot.
                // Create a failed response
                response = {
                    success: false,
                    errorMessage: 'There was an error retrieving data from twitch insights'
                };
            }
            // Resolve Promise with the response object
            resolve(response);
        });
    });
};