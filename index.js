const auth = require('./auth.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const GeneralMessageHandler = require('./general-commands');
const PlaylistChannelHandler = require('./playlist-handler');
const BotTalk = require('./bot-talk.js');

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
    if (msg.author.bot) return;
    
    if (msg.channel.id === '687422495342460958') {
        return PlaylistChannelHandler.checkTicker(msg);
    }

    if (msg.mentions.has('683138332863103172') && !msg.mentions.everyone) 
        BotTalk.handleMessage(msg);

    if (msg.content.substring(0, 1) === '.' && msg.content.substring(1, 2) !== '.') {
        return GeneralMessageHandler.handleMessage(msg);
    }
});

client.login(auth.token);

