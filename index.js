const auth = require('./auth.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const GeneralMessageHandler = require('./general-commands');
const ChannelManager = require('./channel-manager');
const BotTalk = require('./bot-talk.js');
var fs = require('fs');

// let users = require('./users.json');

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
    if (msg.channel.type !== 'dm') {
        if (msg.channel.id === '687422495342460958') {
            return ChannelManager.checkTicker(msg);
        }
    
        if (msg.mentions.has('683138332863103172') && !msg.mentions.everyone) 
            return msg.reply(`shh`);
            // BotTalk.handleMessage(msg);
    
        if (msg.content.substring(0, 1) === '.' && msg.content.substring(1, 2) !== '.') {
            return GeneralMessageHandler.handleMessage(msg);
        }
    }
    if (msg.channel.type === 'dm') {
        handleDirectMessage(msg);
    }
});

// client.on('guildMemberAdd', member => {
//     let id = member.id;
//     let username = member.user.username;
//     users.push({id, username});
//     fs.writeFile('./users.json', JSON.stringify(users), err => {
//         return console.error(err);
//     });
// });

// client.on('guildMemberRemove', member => {
//     let id = member.id;
//     users === users.filter(x => {return x.id !== id});
//     fs.writeFile('./users.json', JSON.stringify(users), err => {
//         return console.error(err);
//     });
// });

var handleDirectMessage = (msg) => {
    if (msg.author.id !== '305030099617447938') return console.dir('no');
    let words = msg.content.split(' ');
    var postInChannel = () => {
        // post channel_id - content
        let channel = client.channels.cache.get(words[1]);
        if (channel) {
            let content = msg.content.split('-');
            channel.send(content[1]);
        }
    };
    var deletePost = () => {
        // delete message_id from channel_id
        client.channels.fetch(words[3]).then(channel => {
            channel.messages.fetch().then(messages => {
                if (messages.get(words[1]))
                    messages.find(x => {return x.id === words[1]}).delete();
            });
        });
    }
    switch (words[0]) {
        case 'delete':
            deletePost();
            break;
        case 'post':
            postInChannel();
            break;
    }
}

client.login(auth.token);

