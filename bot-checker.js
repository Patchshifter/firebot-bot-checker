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
            channelcount: {
                type: "enum",
                options: ["Yes", "No"],
                default: "Yes",
                description: "Show channels",
                secondaryDescription: "Append the number of channels the bot is currently viewing in to the Found Message"
            },
            onMessage: {
                type: "string",
                description: "Found message.",
                secondaryDescription:"Message to be sent if the target IS found on the list.",
                default: "MrDestructoid  MrDestructoid $target was found in the list of online bots. It might be OK to ban. MrDestructoid  MrDestructoid"
            },
            autoban: {
                type: "enum",
                options: ["Yes", "No"],
                default: "No",
                description: "Ban bot",
                secondaryDescription: "Have Firebot ban the bot if the name is found on the known-bot list and not in exceptions list."
            },
            exceptions: {
                type: "string",
                default: "nightbot,moobot,streamelements,streamlabs,rainmaker,dixperbro,commanderroot",
                description: "Exceptions for the bot list.",
                secondaryDescription: "Comma separated list of exceptions for the bot list, for user bots or known good bots (commanderroot, streamelements, nightbot, etc)"
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
        version: "0.3.1"
    };
};

exports.run = function(runRequest) {
    let botname = runRequest.parameters.botname;
    let offMessage = runRequest.parameters.offMessage;
    let onMessage = runRequest.parameters.onMessage;
    let channelcount = runRequest.parameters.channelcount;
    let autoban = runRequest.parameters.autoban;
    let exceptions = runRequest.parameters.exceptions.replace(/\s+/g, "").split(",");

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
                let exceptionOut;
                let found;
                if (content.statusCode === 404) {
                    message = 'Cannot connect to Twitch Insights /shrug';
                } else {
                    for (var z = 0; z < exceptions.length; z++) {
                        if (botname === exceptions[z]) {
                            exceptionOut=1;
                        }
                    }
                    if (exceptionOut === 1) {
                        message = botname+" is on the exception list!"  
                    }
                    else {
                        // Do the fancy work here
                        var l=JSON.parse(content);
                        var botlist = l.bots;

                        for (var i = 0; i < botlist.length; i++) {
                            if (botlist[i][0] === botname) {
                                found = 1;
                                if (exceptionOut === 0) {
                                    break;
                                }
                                if (channelcount === "Yes") {
                                    message = onMessage + " They are currently in "+botlist[i][1]+" channels.";
                                }
                                else {
                                    message = onMessage;
                                }
                                break;
                            }
                        }
                        if (message == null) {
                            message = offMessage;
                    }
                }
            }
        if (autoban == "Yes" && exceptionOut != 1 && found===1) {
                response = {
                    success: true,
                    effects: [
                        {
                            type: "firebot:chat",
                            message: message,
                            chatter: runRequest.parameters.chatter
                        },
                        {
                            type: "firebot:modban",
                            action: "Ban",
                            username: botname
                        },
                        {
                            type: "firebot:chat",
                            message: "Ban bot is set to ON, "+botname+" has been banned.",
                            chatter: runRequest.parameters.chatter
                        }
                        ]
                    };
                }
            else {
                response = {
                    success: true,
                    effects: [
                        {
                            type: "firebot:chat",
                            message: message,
                            chatter: runRequest.parameters.chatter
                        }
                        ]
                    };
            }
        
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
