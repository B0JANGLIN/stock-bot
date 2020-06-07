const auth = require('./auth.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const GeneralMessageHandler = require('./general-commands');
const ChannelManager = require('./channel-manager');
const BotTalk = require('./bot-talk.js');
var fs = require('fs');

let users = require('./users.json');

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
        return ChannelManager.checkTicker(msg);
    }

    if (msg.mentions.has('683138332863103172') && !msg.mentions.everyone) 
        BotTalk.handleMessage(msg);

    if (msg.content.substring(0, 1) === '.' && msg.content.substring(1, 2) !== '.') {
        return GeneralMessageHandler.handleMessage(msg);
    }
});

client.on('guildMemberAdd', member => {
    let id = member.id;
    let username = member.user.username;
    users.push({id, username});
    fs.writeFile('./users.json', JSON.stringify(users), err => {
        return console.error(err);
    });
});


client.on('guildMemberRemove', member => {
    let id = member.id;
    users === users.filter(x => {return x.id !== id});
    fs.writeFile('./users.json', JSON.stringify(users), err => {
        return console.error(err);
    });
});

client.login(auth.token);

