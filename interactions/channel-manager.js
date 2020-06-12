const MessageObjectFactory = require('./message-objects');
var fs = require('fs');

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
}
module.exports = new ChannelManager();