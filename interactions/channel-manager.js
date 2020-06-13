const Discord = require('discord.js')
const MessageObjectFactory = require('./message-objects');

class ChannelManager {
    constructor() {}

    checkTicker(msg) {
        let content = msg.content;
        let regex = /\$[A-Z]+/g;
        if (!regex.test(content)) {
            MessageObjectFactory.createWarningMessage(
                'Please only talk about plays in this channel. Messages without $TICKER will be removed.',
                msg
            );
            msg.delete();
        }
    }

    postToFlow(params, client) {
        if (client) {
            client.users.fetch('205461703348060161')
            .then(user => {
                if (user && params) {
                    let msg = new Discord.MessageEmbed();
                    for (let key in params) {
                        msg.addField(key, params[key], false);
                    }
                    user.send(msg);
                }
            })
        }
    }
}
module.exports = new ChannelManager();