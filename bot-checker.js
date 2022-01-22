exports.getDefaultParameters = function() {
    return new Promise((resolve, reject) => {
        resolve({
            chatter: {
                type: "enum",
                options: ["Streamer", "Bot"],
                default: "Streamer",
                description: "Send From",
                secondaryDescription: "Which account to send the messages from."
            },
            botname: {
                type: "string",
                description: "Insert Bot Name here",
                secondaryDescription: "This is the name of the bot you want to look up",
                default: "$target"
            },
            offMessage: {
                type: "string",
                description: "Not found message.",
                secondaryDescription:"Message to be sent if the target is NOT found on the list.",
                default: "SeemsGood SeemsGood $target was not found in the list of known bots, they are just lurking and we love them. SeemsGood SeemsGood"
            },
            omMessage: {
                type: "string",
                description: "Found message.",
                secondaryDescription:"Message to be sent if the target IS found on the list.",
                default: "MrDestructoid  MrDestructoid $target was found in the list of online bots. It might be OK to ban. MrDestructoid  MrDestructoid"
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
        version: "0.2"
    };
};

exports.run = function(runRequest) {
    let botname = runRequest.parameters.botname;
    let offMessage = runRequest.parameters.offMessage;
    let onMessage = runRequest.parameters.offMessage;

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
                    message = 'Cannot connect to Twitch Insights /shrug';
                } else {
                    // Do the fancy work here
                    var l=JSON.parse(content);
                    var botlist = l.bots;
                    for (var i = 0; i < botlist.length; i++) {
                        if (botlist[i][0] === botname) {
                            message = onMessage;
                            break;
                        }
                    }
                    if (message == null) {
                        message = offMessage;
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