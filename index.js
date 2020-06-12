const auth = require('./auth.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const MessageRouter = require('./message-router.js');
var fs = require('fs');

client.on('ready', () => {
    console.log('client::ready');
    client.user.setStatus('online');
    client.user.setPresence({
        activity: {
            name: '.commands',
            type: "WATCHING"
        }
    });
});

client.on('message', msg => { 
    MessageRouter.handleMessage(msg);
});

client.login(auth.token);

